package app

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"io"
	"path/filepath"
	"sync"
	"testing"

	"github.com/minio/minio-go/v7"
)

// ─────────────────────────── fake object store ───────────────────────────

type fakeObjectStore struct {
	mu      sync.Mutex
	objects map[string][]byte
	types   map[string]string
}

func newFakeObjectStore() *fakeObjectStore {
	return &fakeObjectStore{objects: map[string][]byte{}, types: map[string]string{}}
}

func (f *fakeObjectStore) Put(_ context.Context, key, contentType string, reader io.Reader, _ int64) error {
	data, err := io.ReadAll(reader)
	if err != nil {
		return err
	}
	f.mu.Lock()
	defer f.mu.Unlock()
	f.objects[key] = data
	f.types[key] = contentType
	return nil
}

func (f *fakeObjectStore) Get(_ context.Context, _ string) (*minio.Object, error) {
	return nil, errors.New("Get not implemented in fake store")
}

func (f *fakeObjectStore) GetBytes(_ context.Context, key string) ([]byte, ObjectInfo, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	data, ok := f.objects[key]
	if !ok {
		return nil, ObjectInfo{}, fmt.Errorf("object not found: %s", key)
	}
	return data, ObjectInfo{ContentType: f.types[key], Size: int64(len(data))}, nil
}

func (f *fakeObjectStore) Delete(_ context.Context, key string) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	delete(f.objects, key)
	delete(f.types, key)
	return nil
}

func (f *fakeObjectStore) count() int {
	f.mu.Lock()
	defer f.mu.Unlock()
	return len(f.objects)
}

// ─────────────────────────── helpers ───────────────────────────

func solidPNG(t *testing.T, w, h int, c color.Color) []byte {
	t.Helper()
	img := image.NewNRGBA(image.Rect(0, 0, w, h))
	for y := 0; y < h; y++ {
		for x := 0; x < w; x++ {
			img.Set(x, y, c)
		}
	}
	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		t.Fatal(err)
	}
	return buf.Bytes()
}

func decodePNG(t *testing.T, data []byte) *image.NRGBA {
	t.Helper()
	img, err := png.Decode(bytes.NewReader(data))
	if err != nil {
		t.Fatal(err)
	}
	out := image.NewNRGBA(img.Bounds())
	for y := out.Bounds().Min.Y; y < out.Bounds().Max.Y; y++ {
		for x := out.Bounds().Min.X; x < out.Bounds().Max.X; x++ {
			out.Set(x, y, img.At(x, y))
		}
	}
	return out
}

// centerDiff reports the number of pixels in the central region that differ
// from the given background color — a proxy for "logo pixels are present".
func centerDiff(t *testing.T, data []byte, bg color.NRGBA, box image.Rectangle) int {
	t.Helper()
	img := decodePNG(t, data)
	diff := 0
	for y := box.Min.Y; y < box.Max.Y; y++ {
		for x := box.Min.X; x < box.Max.X; x++ {
			r, g, b, _ := img.At(x, y).RGBA()
			if r>>8 != uint32(bg.R) || g>>8 != uint32(bg.G) || b>>8 != uint32(bg.B) {
				diff++
			}
		}
	}
	return diff
}

func watermarkTestDB(t *testing.T) (*Store, *Server, *fakeObjectStore) {
	t.Helper()
	store, err := OpenStore(filepath.Join(t.TempDir(), "portfolio.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = store.DB.Close() })
	storage := newFakeObjectStore()
	server := NewServer(Config{FrontendOrigin: "http://localhost:3020"}, store, storage)
	return store, server, storage
}

func insertTestProject(t *testing.T, store *Store) int64 {
	t.Helper()
	_, err := store.DB.Exec(`INSERT INTO projects(slug,route_slug,title,client,year,category,industry,disciplines_json,short_description,description,status) VALUES('p','p','P','C','2026','cat','services','[]','','','published')`)
	if err != nil {
		t.Fatal(err)
	}
	var id int64
	if err = store.DB.QueryRow(`SELECT id FROM projects WHERE slug='p'`).Scan(&id); err != nil {
		t.Fatal(err)
	}
	return id
}

// seedDeck inserts n pristine deck pages and returns their media ids in order.
func seedDeck(t *testing.T, store *Store, storage *fakeObjectStore, projectID int64, n int) []int64 {
	t.Helper()
	ids := make([]int64, 0, n)
	for i := 0; i < n; i++ {
		key := fmt.Sprintf("projects/%d/deck/seed-%03d.png", projectID, i+1)
		data := solidPNG(t, 800, 500, color.NRGBA{R: 240, G: 240, B: 240, A: 255})
		if err := storage.Put(context.Background(), key, "image/png", bytes.NewReader(data), int64(len(data))); err != nil {
			t.Fatal(err)
		}
		res, err := store.DB.Exec(`INSERT INTO project_media(project_id,media_type,storage_key,original_filename,mime_type,file_size,width,height,sort_order,watermark_state,source_key) VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
			projectID, "deck", key, fmt.Sprintf("p%03d.png", i+1), "image/png", len(data), 800, 500, i, 0, "")
		if err != nil {
			t.Fatal(err)
		}
		id, _ := res.LastInsertId()
		ids = append(ids, id)
	}
	return ids
}

type deckRow struct {
	key    string
	state  int
	srcKey string
}

func deckRows(t *testing.T, store *Store, projectID int64) []deckRow {
	t.Helper()
	rows, err := store.DB.Query(`SELECT storage_key,watermark_state,source_key FROM project_media WHERE project_id=? AND media_type='deck' ORDER BY sort_order,id`, projectID)
	if err != nil {
		t.Fatal(err)
	}
	defer rows.Close()
	var out []deckRow
	for rows.Next() {
		var r deckRow
		if err = rows.Scan(&r.key, &r.state, &r.srcKey); err != nil {
			t.Fatal(err)
		}
		out = append(out, r)
	}
	return out
}

// centerBox is the region where the centered logo must appear for an 800×500
// slide (logo ≈ 96px wide → ~48px half-width around center).
var centerBox = image.Rect(350, 200, 450, 300)

// ─────────────────────────── tests ───────────────────────────

func TestIsDeckInterior(t *testing.T) {
	for _, tc := range []struct {
		count int
		want  []bool
	}{
		{1, []bool{false}},
		{2, []bool{false, false}},
		{3, []bool{false, true, false}},
		{10, []bool{false, true, true, true, true, true, true, true, true, false}},
	} {
		for i := 0; i < tc.count; i++ {
			if got := isDeckInterior(i, tc.count); got != tc.want[i] {
				t.Fatalf("isDeckInterior(%d,%d)=%v want %v", i, tc.count, got, tc.want[i])
			}
		}
	}
}

func TestApplyDeckWatermarkCenteredSubtle(t *testing.T) {
	src := image.NewNRGBA(image.Rect(0, 0, 1000, 600))
	for i := range src.Pix {
		src.Pix[i] = 255
	}
	out, err := applyDeckWatermark(src)
	if err != nil {
		t.Fatal(err)
	}
	if out.Bounds().Dx() != 1000 || out.Bounds().Dy() != 600 {
		t.Fatalf("dimensions changed: %v", out.Bounds())
	}
	// Logo should be ~120px wide centered → diff pixels confined to a central band.
	img := decodePNG(t, mustPNG(t, out))
	minX, maxX, minY, maxY := 1000, -1, 600, -1
	for y := 0; y < 600; y++ {
		for x := 0; x < 1000; x++ {
			r, g, b, _ := img.At(x, y).RGBA()
			if r>>8 != 255 || g>>8 != 255 || b>>8 != 255 {
				if x < minX {
					minX = x
				}
				if x > maxX {
					maxX = x
				}
				if y < minY {
					minY = y
				}
				if y > maxY {
					maxY = y
				}
			}
		}
	}
	if maxX < 0 {
		t.Fatal("no watermark pixels found")
	}
	w := maxX - minX + 1
	h := maxY - minY + 1
	if w < 100 || w > 140 {
		t.Fatalf("watermark width %d out of expected ~120", w)
	}
	if cx := (minX + maxX) / 2; cx < 495 || cx > 505 {
		t.Fatalf("watermark not horizontally centered: %d", cx)
	}
	if cy := (minY + maxY) / 2; cy < 295 || cy > 305 {
		t.Fatalf("watermark not vertically centered: %d", cy)
	}
	_ = h

	// Opacity check: the darkest stamped pixel should stay well above black,
	// consistent with ~20% opacity over a white slide.
	minChannel := 255
	for y := minY; y <= maxY; y++ {
		for x := minX; x <= maxX; x++ {
			r, g, b, _ := img.At(x, y).RGBA()
			for _, v := range []uint32{r >> 8, g >> 8, b >> 8} {
				if int(v) < minChannel {
					minChannel = int(v)
				}
			}
		}
	}
	if minChannel < 100 {
		t.Fatalf("watermark too opaque: darkest pixel channel %d", minChannel)
	}
}

func mustPNG(t *testing.T, img image.Image) []byte {
	t.Helper()
	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		t.Fatal(err)
	}
	return buf.Bytes()
}

func TestReconcileStampsInteriorOnly(t *testing.T) {
	store, server, storage := watermarkTestDB(t)
	projectID := insertTestProject(t, store)
	seedDeck(t, store, storage, projectID, 5)

	server.reconcileDeckWatermarks(context.Background(), projectID)
	rows := deckRows(t, store, projectID)
	if len(rows) != 5 {
		t.Fatalf("expected 5 deck rows, got %d", len(rows))
	}
	for i, row := range rows {
		interior := isDeckInterior(i, 5)
		if interior {
			if row.state != deckWatermarkStamped {
				t.Fatalf("page %d should be stamped, state=%d", i+1, row.state)
			}
			if row.srcKey == "" || row.srcKey[:5] != "orig/" {
				t.Fatalf("page %d missing pristine backup: %q", i+1, row.srcKey)
			}
			data, _, err := storage.GetBytes(context.Background(), row.key)
			if err != nil {
				t.Fatal(err)
			}
			if d := centerDiff(t, data, color.NRGBA{R: 240, G: 240, B: 240, A: 255}, centerBox); d == 0 {
				t.Fatalf("page %d stamped object shows no watermark", i+1)
			}
		} else {
			if row.state != deckWatermarkNone {
				t.Fatalf("page %d should stay pristine, state=%d", i+1, row.state)
			}
			data, _, err := storage.GetBytes(context.Background(), row.key)
			if err != nil {
				t.Fatal(err)
			}
			if d := centerDiff(t, data, color.NRGBA{R: 240, G: 240, B: 240, A: 255}, centerBox); d != 0 {
				t.Fatalf("page %d first/last should have no watermark", i+1)
			}
		}
	}
}

func TestReconcileIdempotent(t *testing.T) {
	store, server, storage := watermarkTestDB(t)
	projectID := insertTestProject(t, store)
	seedDeck(t, store, storage, projectID, 4)

	server.reconcileDeckWatermarks(context.Background(), projectID)
	before := deckRows(t, store, projectID)
	countBefore := storage.count()

	server.reconcileDeckWatermarks(context.Background(), projectID)
	after := deckRows(t, store, projectID)
	if storage.count() != countBefore {
		t.Fatalf("second reconcile changed object count: %d -> %d", countBefore, storage.count())
	}
	for i := range before {
		if before[i].key != after[i].key || before[i].state != after[i].state {
			t.Fatalf("page %d changed on re-reconcile: %+v -> %+v", i+1, before[i], after[i])
		}
	}
}

func TestReconcileSmallDecksNeverStamp(t *testing.T) {
	for _, n := range []int{1, 2} {
		t.Run(fmt.Sprintf("deck-%d", n), func(t *testing.T) {
			store, server, storage := watermarkTestDB(t)
			projectID := insertTestProject(t, store)
			seedDeck(t, store, storage, projectID, n)
			server.reconcileDeckWatermarks(context.Background(), projectID)
			for i, row := range deckRows(t, store, projectID) {
				if row.state != deckWatermarkNone {
					t.Fatalf("deck of %d: page %d unexpectedly stamped", n, i+1)
				}
			}
		})
	}
}

func TestReconcileAppendPromotesPreviousLast(t *testing.T) {
	store, server, storage := watermarkTestDB(t)
	projectID := insertTestProject(t, store)
	seedDeck(t, store, storage, projectID, 3)
	server.reconcileDeckWatermarks(context.Background(), projectID)

	// Append a 4th page (simulates a separate upload batch).
	key := fmt.Sprintf("projects/%d/deck/seed-004.png", projectID)
	data := solidPNG(t, 800, 500, color.NRGBA{R: 240, G: 240, B: 240, A: 255})
	if err := storage.Put(context.Background(), key, "image/png", bytes.NewReader(data), int64(len(data))); err != nil {
		t.Fatal(err)
	}
	if _, err := store.DB.Exec(`INSERT INTO project_media(project_id,media_type,storage_key,original_filename,mime_type,file_size,width,height,sort_order,watermark_state,source_key) VALUES(?,?,?,?,?,?,?,?,?,0,'')`, projectID, "deck", key, "p004.png", "image/png", len(data), 800, 500, 3, ""); err != nil {
		t.Fatal(err)
	}
	server.reconcileDeckWatermarks(context.Background(), projectID)

	rows := deckRows(t, store, projectID)
	if len(rows) != 4 {
		t.Fatalf("expected 4 rows, got %d", len(rows))
	}
	if rows[3].state != deckWatermarkNone {
		t.Fatal("new last page must stay pristine")
	}
	if rows[1].state != deckWatermarkStamped || rows[2].state != deckWatermarkStamped {
		t.Fatal("interior pages 2-3 must be stamped in a 4-page deck")
	}
}

func TestReconcileDeleteFirstRestoresPristine(t *testing.T) {
	store, server, storage := watermarkTestDB(t)
	projectID := insertTestProject(t, store)
	ids := seedDeck(t, store, storage, projectID, 4)
	server.reconcileDeckWatermarks(context.Background(), projectID)

	// Capture pristine backup bytes of page 2 before deletion.
	rows := deckRows(t, store, projectID)
	pristineBackup, _, err := storage.GetBytes(context.Background(), rows[1].srcKey)
	if err != nil {
		t.Fatal(err)
	}

	// Delete page 1 → old page 2 becomes the new first slide.
	if _, err = store.DB.Exec(`DELETE FROM project_media WHERE id=?`, ids[0]); err != nil {
		t.Fatal(err)
	}
	if err = storage.Delete(context.Background(), rows[0].key); err != nil {
		t.Fatal(err)
	}
	server.reconcileDeckWatermarks(context.Background(), projectID)

	rows = deckRows(t, store, projectID)
	if len(rows) != 3 {
		t.Fatalf("expected 3 rows, got %d", len(rows))
	}
	if rows[0].state != deckWatermarkNone {
		t.Fatal("new first page must be restored to pristine")
	}
	restored, _, err := storage.GetBytes(context.Background(), rows[0].key)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(restored, pristineBackup) {
		t.Fatal("restored first page does not match pristine backup bytes")
	}
	if d := centerDiff(t, restored, color.NRGBA{R: 240, G: 240, B: 240, A: 255}, centerBox); d != 0 {
		t.Fatal("restored first page still shows watermark pixels")
	}
	// Middle page stays stamped.
	if rows[1].state != deckWatermarkStamped {
		t.Fatal("middle page should remain stamped")
	}
}

func TestReconcileReorderRestampsCorrectly(t *testing.T) {
	store, server, storage := watermarkTestDB(t)
	projectID := insertTestProject(t, store)
	ids := seedDeck(t, store, storage, projectID, 4)
	server.reconcileDeckWatermarks(context.Background(), projectID)

	// Swap pages 1 and 4 → old last becomes first, old first becomes last.
	if _, err := store.DB.Exec(`UPDATE project_media SET sort_order=10 WHERE id=?`, ids[0]); err != nil {
		t.Fatal(err)
	}
	if _, err := store.DB.Exec(`UPDATE project_media SET sort_order=-1 WHERE id=?`, ids[3]); err != nil {
		t.Fatal(err)
	}
	server.reconcileDeckWatermarks(context.Background(), projectID)

	rows := deckRows(t, store, projectID)
	// New order: id4 (was last, pristine), id2, id3, id1 (was first, pristine).
	if rows[0].state != deckWatermarkNone || rows[3].state != deckWatermarkNone {
		t.Fatal("first and last after reorder must be pristine")
	}
	if rows[1].state != deckWatermarkStamped || rows[2].state != deckWatermarkStamped {
		t.Fatal("interior after reorder must be stamped")
	}
}

func TestProcessDeckPageStampReturnsBothVariants(t *testing.T) {
	pngBytes := solidPNG(t, 800, 500, color.NRGBA{R: 200, G: 200, B: 200, A: 255})
	media, err := readAndValidateImage(bytes.NewReader(pngBytes), maxMediaBytes)
	if err != nil {
		t.Fatal(err)
	}
	stamped, pristine, err := processDeckPage(media, true)
	if err != nil {
		t.Fatal(err)
	}
	if pristine == nil || stamped == nil {
		t.Fatal("expected both stamped and pristine results")
	}
	if bytes.Equal(stamped.data, pristine.data) {
		t.Fatal("stamped and pristine outputs are identical")
	}
	if d := centerDiff(t, stamped.data, color.NRGBA{R: 200, G: 200, B: 200, A: 255}, centerBox); d == 0 {
		t.Fatal("stamped page shows no watermark")
	}
	if d := centerDiff(t, pristine.data, color.NRGBA{R: 200, G: 200, B: 200, A: 255}, centerBox); d != 0 {
		t.Fatal("pristine page should have no watermark")
	}
}
