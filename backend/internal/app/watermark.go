package app

import (
	"bytes"
	"context"
	"embed"
	"fmt"
	"image"
	"image/png"
	"log/slog"
	"strings"
	"sync"

	"golang.org/x/image/draw"
)

//go:embed logo-utero.png
var deckLogoFS embed.FS

const (
	deckLogoWidthRatio = 0.12 // ~12% of slide width (spec: 10-15%)
	deckLogoOpacity    = 0.20
	deckMinLogoWidth   = 16

	deckWatermarkNone    = 0 // stored object is pristine (no watermark applied)
	deckWatermarkStamped = 1 // stored object has the watermark; source_key holds pristine bytes
)

var (
	deckLogoOnce sync.Once
	deckLogoImg  image.Image
	deckLogoErr  error
)

func loadDeckLogo() (image.Image, error) {
	deckLogoOnce.Do(func() {
		data, err := deckLogoFS.ReadFile("logo-utero.png")
		if err != nil {
			deckLogoErr = err
			return
		}
		deckLogoImg, deckLogoErr = png.Decode(bytes.NewReader(data))
	})
	return deckLogoImg, deckLogoErr
}

// isDeckInterior reports whether the page at index (0-based) of a deck with
// count pages should carry the watermark: never the first or last page, and
// never any page of a deck with 2 or fewer slides.
func isDeckInterior(index, count int) bool {
	return count > 2 && index > 0 && index < count-1
}

// applyDeckWatermark composites the Utero logo centered on src at ~12% of the
// slide width and 20% opacity, preserving the logo's transparency.
func applyDeckWatermark(src image.Image) (*image.NRGBA, error) {
	logo, err := loadDeckLogo()
	if err != nil {
		return nil, fmt.Errorf("deck logo unavailable: %w", err)
	}
	bounds := src.Bounds()
	w, h := bounds.Dx(), bounds.Dy()
	logoW := int(float64(w)*deckLogoWidthRatio + 0.5)
	if logoW < deckMinLogoWidth {
		logoW = deckMinLogoWidth
	}
	if logoW > w/2 {
		logoW = w / 2
	}
	logoScale := float64(logoW) / float64(logo.Bounds().Dx())
	logoH := int(float64(logo.Bounds().Dy())*logoScale + 0.5)
	if logoH < 1 {
		logoH = 1
	}

	scaled := image.NewNRGBA(image.Rect(0, 0, logoW, logoH))
	draw.CatmullRom.Scale(scaled, scaled.Bounds(), logo, logo.Bounds(), draw.Over, nil)
	// NRGBA stores non-premultiplied alpha: scale it down to the target opacity.
	for i := 3; i < len(scaled.Pix); i += 4 {
		scaled.Pix[i] = uint8(float64(scaled.Pix[i]) * deckLogoOpacity)
	}

	dst := image.NewNRGBA(image.Rect(0, 0, w, h))
	draw.Draw(dst, dst.Bounds(), src, bounds.Min, draw.Src)
	x := (w - logoW) / 2
	y := (h - logoH) / 2
	draw.Draw(dst, image.Rect(x, y, x+logoW, y+logoH), scaled, image.Point{}, draw.Over)
	return dst, nil
}

type deckPageRef struct {
	id     int64
	key    string
	state  int
	srcKey string
}

// reconcileDeckWatermarks makes stored deck pages match the watermark rule for
// the project's complete, ordered deck: interior pages carry the watermark,
// first/last pages are pristine. Stamping always starts from the pristine
// source (source_key backup or the current object), so re-running is
// idempotent and pages that move to first/last are restored exactly.
func (s *Server) reconcileDeckWatermarks(ctx context.Context, projectID int64) {
	if s.storage == nil {
		return
	}
	rows, err := s.store.DB.QueryContext(ctx, `SELECT id,storage_key,watermark_state,source_key FROM project_media WHERE project_id=? AND media_type='deck' ORDER BY sort_order,id`, projectID)
	if err != nil {
		slog.Warn("deck watermark reconcile query failed", "project", projectID, "error", err)
		return
	}
	var pages []deckPageRef
	for rows.Next() {
		var p deckPageRef
		if err = rows.Scan(&p.id, &p.key, &p.state, &p.srcKey); err != nil {
			rows.Close()
			return
		}
		pages = append(pages, p)
	}
	rows.Close()
	total := len(pages)
	for i, page := range pages {
		want := isDeckInterior(i, total)
		var opErr error
		switch {
		case want && page.state != deckWatermarkStamped:
			opErr = s.stampDeckPage(ctx, projectID, page)
		case !want && page.state == deckWatermarkStamped:
			opErr = s.restoreDeckPage(ctx, projectID, page)
		}
		if opErr != nil {
			slog.Warn("deck watermark reconcile failed", "project", projectID, "media", page.id, "error", opErr)
		}
	}
}

// stampDeckPage replaces a pristine deck page's stored object with a
// watermarked one, keeping the pristine bytes under an orig/ key that the
// public media endpoint refuses to serve.
func (s *Server) stampDeckPage(ctx context.Context, projectID int64, page deckPageRef) error {
	fetchKey := page.srcKey
	if fetchKey == "" {
		fetchKey = page.key
	}
	data, _, err := s.storage.GetBytes(ctx, fetchKey)
	if err != nil {
		return err
	}
	media, err := readAndValidateImage(bytes.NewReader(data), maxMediaBytes)
	if err != nil {
		return err
	}
	processed, pristine, err := processDeckPage(media, true)
	if err != nil {
		return err
	}
	token, _ := randomToken(18)
	ext := strings.ToLower(processed.ext)
	newKey := fmt.Sprintf("projects/%d/deck/%s-wm%s", projectID, token, ext)
	if err = s.storage.Put(ctx, newKey, processed.contentType, bytes.NewReader(processed.data), int64(len(processed.data))); err != nil {
		return err
	}
	backupKey := page.srcKey
	if backupKey == "" {
		backupKey = fmt.Sprintf("orig/deck/%d/%s-src%s", projectID, token, strings.ToLower(pristine.ext))
		if err = s.storage.Put(ctx, backupKey, pristine.contentType, bytes.NewReader(pristine.data), int64(len(pristine.data))); err != nil {
			_ = s.storage.Delete(ctx, newKey)
			return err
		}
	}
	if _, err = s.store.DB.ExecContext(ctx, `UPDATE project_media SET storage_key=?,mime_type=?,file_size=?,width=?,height=?,watermark_state=?,source_key=? WHERE id=?`, newKey, processed.contentType, len(processed.data), processed.width, processed.height, deckWatermarkStamped, backupKey, page.id); err != nil {
		return err
	}
	if page.key != newKey && page.key != backupKey {
		if err = s.storage.Delete(ctx, page.key); err != nil {
			slog.Warn("old deck object cleanup failed", "key", page.key, "error", err)
		}
	}
	return nil
}

// restoreDeckPage swaps a stamped deck page back to its pristine backup when
// the page is (or becomes) the deck's first or last slide.
func (s *Server) restoreDeckPage(ctx context.Context, projectID int64, page deckPageRef) error {
	if page.srcKey == "" {
		return fmt.Errorf("stamped deck page %d has no pristine backup", page.id)
	}
	data, _, err := s.storage.GetBytes(ctx, page.srcKey)
	if err != nil {
		return err
	}
	media, err := readAndValidateImage(bytes.NewReader(data), maxMediaBytes)
	if err != nil {
		return err
	}
	token, _ := randomToken(18)
	newKey := fmt.Sprintf("projects/%d/deck/%s%s", projectID, token, strings.ToLower(media.ext))
	if err = s.storage.Put(ctx, newKey, media.contentType, bytes.NewReader(data), int64(len(data))); err != nil {
		return err
	}
	if _, err = s.store.DB.ExecContext(ctx, `UPDATE project_media SET storage_key=?,mime_type=?,file_size=?,width=?,height=?,watermark_state=? WHERE id=?`, newKey, media.contentType, len(data), media.width, media.height, deckWatermarkNone, page.id); err != nil {
		return err
	}
	if page.key != newKey && page.key != page.srcKey {
		if err = s.storage.Delete(ctx, page.key); err != nil {
			slog.Warn("old deck object cleanup failed", "key", page.key, "error", err)
		}
	}
	return nil
}
