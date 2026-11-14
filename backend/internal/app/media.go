package app

import (
	"bytes"
	"context"
	"embed"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"log/slog"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	xdraw "golang.org/x/image/draw"
	"golang.org/x/image/webp"
)

// watermark.png is the real Utero logo used to stamp deck slides.
//go:embed watermark.png
var watermarkAsset embed.FS

var watermarkLogo image.Image

func init() {
	raw, err := watermarkAsset.ReadFile("watermark.png")
	if err != nil {
		return
	}
	logo, _, err := image.Decode(bytes.NewReader(raw))
	if err != nil {
		slog.Warn("watermark logo decode failed", "error", err)
		return
	}
	watermarkLogo = logo
}

const maxMediaBytes = 20 << 20

var allowedImageTypes = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
	"image/webp": true,
}

type decodedMedia struct {
	data        []byte
	contentType string
	width       int
	height      int
	ext         string
}

// readAndValidateImage reads an uploaded image part, enforces size/type/dimension
// limits and returns the raw bytes plus detected metadata.
func readAndValidateImage(reader io.Reader, maxBytes int64) (*decodedMedia, error) {
	data, err := io.ReadAll(io.LimitReader(reader, maxBytes+1))
	if err != nil || len(data) == 0 || int64(len(data)) > maxBytes {
		return nil, fmt.Errorf("invalid file")
	}
	contentType := http.DetectContentType(data)
	if !allowedImageTypes[contentType] {
		return nil, fmt.Errorf("only JPEG, PNG, and WebP are allowed")
	}
	config, format, err := image.DecodeConfig(bytes.NewReader(data))
	if err != nil || config.Width < 1 || config.Height < 1 || config.Width > 12000 || config.Height > 12000 {
		return nil, fmt.Errorf("invalid image dimensions")
	}
	ext := map[string]string{"jpeg": ".jpg", "png": ".png", "webp": ".webp"}[format]
	if ext == "" {
		ext = ".bin"
	}
	return &decodedMedia{data: data, contentType: contentType, width: config.Width, height: config.Height, ext: ext}, nil
}

// stampLogo composites the Utero logo into the bottom-right corner of src.
func stampLogo(src image.Image) *image.RGBA {
	if watermarkLogo == nil {
		return nil
	}
	bounds := src.Bounds()
	dst := image.NewRGBA(image.Rect(0, 0, bounds.Dx(), bounds.Dy()))
	xdraw.Draw(dst, dst.Bounds(), src, bounds.Min, xdraw.Src)

	logoBounds := watermarkLogo.Bounds()
	logoW := bounds.Dx() / 6
	if logoW < 32 {
		logoW = 32
	}
	scale := float64(logoW) / float64(logoBounds.Dx())
	logoH := int(float64(logoBounds.Dy()) * scale)
	if logoH < 1 {
		return dst
	}
	scaled := image.NewRGBA(image.Rect(0, 0, logoW, logoH))
	xdraw.ApproxBiLinear.Scale(scaled, scaled.Bounds(), watermarkLogo, logoBounds, xdraw.Over, nil)

	margin := bounds.Dx() / 40
	if margin < 12 {
		margin = 12
	}
	xdraw.Draw(dst, image.Rect(bounds.Dx()-logoW-margin, bounds.Dy()-logoH-margin, bounds.Dx()-margin, bounds.Dy()-margin), scaled, image.Point{}, xdraw.Over)
	return dst
}

// processDeckPage decodes an uploaded deck page, optionally stamps the logo and
// re-encodes it. WebP input is re-encoded as PNG because there is no WebP encoder.
func processDeckPage(media *decodedMedia, watermark bool) (*decodedMedia, error) {
	var src image.Image
	var err error
	if media.contentType == "image/webp" {
		src, err = webp.Decode(bytes.NewReader(media.data))
	} else {
		src, _, err = image.Decode(bytes.NewReader(media.data))
	}
	if err != nil {
		return nil, fmt.Errorf("invalid image")
	}
	out := src
	if watermark {
		if stamped := stampLogo(src); stamped != nil {
			out = stamped
		}
	}
	var buf bytes.Buffer
	contentType := media.contentType
	if media.contentType == "image/png" || media.contentType == "image/webp" {
		contentType = "image/png"
		media.ext = ".png"
		err = png.Encode(&buf, out)
	} else {
		contentType = "image/jpeg"
		media.ext = ".jpg"
		err = jpeg.Encode(&buf, out, &jpeg.Options{Quality: 90})
	}
	if err != nil {
		return nil, fmt.Errorf("unable to encode image")
	}
	return &decodedMedia{data: buf.Bytes(), contentType: contentType, width: out.Bounds().Dx(), height: out.Bounds().Dy(), ext: media.ext}, nil
}

func deckWatermarkEnabled(p Project) bool {
	return p.Details.DeckWatermark == nil || *p.Details.DeckWatermark
}

func (s *Server) countDeckMedia(ctx context.Context, projectID int64) int {
	var count int
	_ = s.store.DB.QueryRowContext(ctx, `SELECT COUNT(*) FROM project_media WHERE project_id=? AND media_type='deck'`, projectID).Scan(&count)
	return count
}

// ─────────────────────────── Site media ───────────────────────────

// POST /api/v1/admin/site-media — authenticated upload for site imagery
// (banners, studio photos, service images). Objects land under site/ or
// banners/ keys in SeaweedFS and are served via /portfolio-api/media/...
func (s *Server) uploadSiteMedia(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, maxMediaBytes+1<<20)
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		apiError(w, 400, "file exceeds 20 MB")
		return
	}
	file, header, err := r.FormFile("file")
	if err != nil {
		apiError(w, 400, "file is required")
		return
	}
	defer file.Close()
	media, err := readAndValidateImage(file, maxMediaBytes)
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	folder := r.FormValue("folder")
	if folder != "banners" {
		folder = "site"
	}
	token, _ := randomToken(18)
	ext := media.ext
	if ext == "" {
		ext = ".jpg"
	}
	key := fmt.Sprintf("%s/%s%s", folder, token, strings.ToLower(ext))
	if err = s.storage.Put(r.Context(), key, media.contentType, bytes.NewReader(media.data), int64(len(media.data))); err != nil {
		slog.Error("site media upload failed", "error", err)
		apiError(w, 502, "storage unavailable")
		return
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "site-media.upload", "site-media", key, clientIP(r))
	writeJSON(w, 201, map[string]any{
		"url":      "/portfolio-api/media/" + key,
		"filename": filepath.Base(header.Filename),
		"width":    media.width,
		"height":   media.height,
	})
}

// ─────────────────────────── Work media replace / alt ───────────────────────────

// PUT /api/v1/admin/projects/{id}/media/{mediaId} — replace the file behind an
// existing media item. The old object is deleted only after the DB row and the
// project's media references have been updated.
func (s *Server) replaceMedia(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r.PathValue("id"))
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	mediaID, err := parseID(r.PathValue("mediaId"))
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	var oldKey, mediaType, oldAlt string
	if err = s.store.DB.QueryRowContext(r.Context(), `SELECT storage_key,media_type,alt_text FROM project_media WHERE id=? AND project_id=?`, mediaID, id).Scan(&oldKey, &mediaType, &oldAlt); err != nil {
		apiError(w, 404, "media not found")
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, maxMediaBytes+1<<20)
	if err = r.ParseMultipartForm(32 << 20); err != nil {
		apiError(w, 400, "file exceeds 20 MB")
		return
	}
	file, header, err := r.FormFile("file")
	if err != nil {
		apiError(w, 400, "file is required")
		return
	}
	defer file.Close()
	media, err := readAndValidateImage(file, maxMediaBytes)
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	altText := r.FormValue("altText")
	if altText == "" {
		altText = oldAlt
	}
	token, _ := randomToken(18)
	newKey := fmt.Sprintf("projects/%d/%s/%s%s", id, mediaType, token, strings.ToLower(media.ext))
	if err = s.storage.Put(r.Context(), newKey, media.contentType, bytes.NewReader(media.data), int64(len(media.data))); err != nil {
		slog.Error("media replace upload failed", "error", err)
		apiError(w, 502, "storage unavailable")
		return
	}
	if _, err = s.store.DB.ExecContext(r.Context(), `UPDATE project_media SET storage_key=?,original_filename=?,mime_type=?,file_size=?,width=?,height=?,alt_text=? WHERE id=? AND project_id=?`, newKey, filepath.Base(header.Filename), media.contentType, len(media.data), media.width, media.height, altText, mediaID, id); err != nil {
		apiError(w, 500, "unable to update media")
		return
	}
	oldURL := "/portfolio-api/media/" + oldKey
	newURL := "/portfolio-api/media/" + newKey
	project, err := s.store.GetProject(r.Context(), id, false, true)
	if err == nil {
		switch mediaType {
		case "cover":
			if project.CoverImage == oldURL {
				project.CoverImage = newURL
			}
			if project.HeroImage == oldURL {
				project.HeroImage = newURL
			}
		case "hover":
			if project.HoverImage == oldURL {
				project.HoverImage = newURL
			}
		case "gallery":
			for i, image := range project.GalleryImages {
				if image == oldURL {
					project.GalleryImages[i] = newURL
				}
			}
		}
		if mediaType != "deck" {
			_ = s.store.SaveProject(r.Context(), &project)
		}
	}
	if err = s.storage.Delete(r.Context(), oldKey); err != nil {
		slog.Warn("old media object cleanup failed", "key", oldKey, "error", err)
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "media.replace", "project", strconv.FormatInt(id, 10), clientIP(r))
	writeJSON(w, 200, map[string]any{"id": mediaID, "url": newURL, "width": media.width, "height": media.height})
}

// PATCH /api/v1/admin/projects/{id}/media/{mediaId} — update alt text only.
func (s *Server) updateMediaAlt(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r.PathValue("id"))
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	mediaID, err := parseID(r.PathValue("mediaId"))
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	var input struct {
		AltText string `json:"altText"`
	}
	if !decodeJSON(w, r, &input) {
		return
	}
	if len(input.AltText) > 500 {
		apiError(w, 400, "alt text too long")
		return
	}
	result, err := s.store.DB.ExecContext(r.Context(), `UPDATE project_media SET alt_text=? WHERE id=? AND project_id=?`, input.AltText, mediaID, id)
	if err != nil {
		apiError(w, 500, "unable to update media")
		return
	}
	affected, _ := result.RowsAffected()
	if affected == 0 {
		apiError(w, 404, "media not found")
		return
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "media.alt", "project", strconv.FormatInt(id, 10), clientIP(r))
	writeJSON(w, 200, map[string]bool{"ok": true})
}

// ─────────────────────────── Whole-deck replace ───────────────────────────

// POST /api/v1/admin/projects/{id}/deck — replace the entire deck in one call.
// Accepts multipart field "files" (ordered) or repeated "file" parts. Each page
// is validated, optionally stamped with the logo watermark (never page 1) and
// stored; old deck objects are removed only after the DB swap commits.
func (s *Server) replaceDeck(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r.PathValue("id"))
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	project, err := s.store.GetProject(r.Context(), id, false, true)
	if err != nil {
		apiError(w, 404, "project not found")
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, 160<<20)
	if err = r.ParseMultipartForm(32 << 20); err != nil {
		apiError(w, 400, "upload too large")
		return
	}
	var headers []*multipart.FileHeader
	if files := r.MultipartForm.File["files"]; len(files) > 0 {
		headers = files
	} else {
		headers = r.MultipartForm.File["file"]
	}
	if len(headers) == 0 {
		apiError(w, 400, "no files provided")
		return
	}
	if len(headers) > 100 {
		apiError(w, 400, "too many pages (max 100)")
		return
	}
	watermark := deckWatermarkEnabled(project)
	type staged struct {
		key         string
		filename    string
		contentType string
		size        int
		width       int
		height      int
	}
	stagedPages := make([]staged, 0, len(headers))
	for i, header := range headers {
		file, openErr := header.Open()
		if openErr != nil {
			apiError(w, 400, "unable to read file")
			return
		}
		media, readErr := readAndValidateImage(file, maxMediaBytes)
		file.Close()
		if readErr != nil {
			apiError(w, 400, fmt.Sprintf("page %d: %s", i+1, readErr.Error()))
			return
		}
		// Page 1 never carries the watermark.
		processed, procErr := processDeckPage(media, watermark && i > 0)
		if procErr != nil {
			apiError(w, 400, fmt.Sprintf("page %d: %s", i+1, procErr.Error()))
			return
		}
		token, _ := randomToken(18)
		key := fmt.Sprintf("projects/%d/deck/%s-%03d%s", id, token, i+1, strings.ToLower(processed.ext))
		if err = s.storage.Put(r.Context(), key, processed.contentType, bytes.NewReader(processed.data), int64(len(processed.data))); err != nil {
			slog.Error("deck page upload failed", "error", err)
			apiError(w, 502, "storage unavailable")
			return
		}
		stagedPages = append(stagedPages, staged{
			key: key, filename: filepath.Base(header.Filename), contentType: processed.contentType,
			size: len(processed.data), width: processed.width, height: processed.height,
		})
	}
	// Swap deck rows atomically, then remove the old objects.
	oldKeys := []string{}
	rows, qerr := s.store.DB.QueryContext(r.Context(), `SELECT storage_key FROM project_media WHERE project_id=? AND media_type='deck'`, id)
	if qerr == nil {
		for rows.Next() {
			var key string
			if rows.Scan(&key) == nil {
				oldKeys = append(oldKeys, key)
			}
		}
		rows.Close()
	}
	tx, err := s.store.DB.BeginTx(r.Context(), nil)
	if err != nil {
		apiError(w, 500, "unable to replace deck")
		return
	}
	defer tx.Rollback()
	if _, err = tx.ExecContext(r.Context(), `DELETE FROM project_media WHERE project_id=? AND media_type='deck'`, id); err != nil {
		apiError(w, 500, "unable to replace deck")
		return
	}
	for i, page := range stagedPages {
		if _, err = tx.ExecContext(r.Context(), `INSERT INTO project_media(project_id,media_type,storage_key,original_filename,mime_type,file_size,width,height,sort_order) VALUES(?,?,?,?,?,?,?,?,?)`, id, "deck", page.key, page.filename, page.contentType, page.size, page.width, page.height, i); err != nil {
			apiError(w, 500, "unable to replace deck")
			return
		}
	}
	if err = tx.Commit(); err != nil {
		apiError(w, 500, "unable to replace deck")
		return
	}
	for _, key := range oldKeys {
		if err = s.storage.Delete(r.Context(), key); err != nil {
			slog.Warn("old deck object cleanup failed", "key", key, "error", err)
		}
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "deck.replace", "project", strconv.FormatInt(id, 10), clientIP(r))
	urls := make([]string, 0, len(stagedPages))
	for _, page := range stagedPages {
		urls = append(urls, "/portfolio-api/media/"+page.key)
	}
	writeJSON(w, 200, map[string]any{"count": len(stagedPages), "urls": urls})
}
