package app

import (
	"bytes"
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"log/slog"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	_ "golang.org/x/image/webp"
)

type Server struct {
	cfg      Config
	store    *Store
	storage  *ObjectStorage
	mux      *http.ServeMux
	limiter  sync.Mutex
	attempts map[string][]time.Time
}
type contextKey string

const sessionKey contextKey = "session"

type sessionContext struct {
	ID       int64
	AdminID  int64
	CSRFHash string
}

func NewServer(cfg Config, store *Store, storage *ObjectStorage) *Server {
	s := &Server{cfg: cfg, store: store, storage: storage, mux: http.NewServeMux(), attempts: map[string][]time.Time{}}
	s.routes()
	return s
}
func (s *Server) Handler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "no-referrer")
		w.Header().Set("Cache-Control", "no-store")
		s.mux.ServeHTTP(w, r)
	})
}

func (s *Server) routes() {
	s.mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) { writeJSON(w, 200, map[string]string{"status": "ok"}) })
	s.mux.HandleFunc("GET /api/v1/projects", s.listPublic)
	s.mux.HandleFunc("GET /api/v1/projects/{slug}/deck", s.getPublicDeck)
	s.mux.HandleFunc("GET /api/v1/projects/{slug}", s.getPublic)
	s.mux.HandleFunc("GET /api/v1/media/{key...}", s.getMedia)
	s.mux.HandleFunc("POST /api/v1/admin/auth/login", s.login)
	s.mux.Handle("POST /api/v1/admin/auth/logout", s.requireSession(http.HandlerFunc(s.logout), true))
	s.mux.Handle("POST /api/v1/admin/auth/change-password", s.requireSession(http.HandlerFunc(s.changePassword), true))
	s.mux.Handle("GET /api/v1/admin/auth/session", s.requireSession(http.HandlerFunc(s.session), false))
	s.mux.Handle("GET /api/v1/admin/projects", s.requireSession(http.HandlerFunc(s.listAdmin), false))
	s.mux.Handle("POST /api/v1/admin/projects", s.requireSession(http.HandlerFunc(s.createProject), true))
	s.mux.Handle("GET /api/v1/admin/projects/{id}", s.requireSession(http.HandlerFunc(s.getAdmin), false))
	s.mux.Handle("PUT /api/v1/admin/projects/{id}", s.requireSession(http.HandlerFunc(s.updateProject), true))
	s.mux.Handle("DELETE /api/v1/admin/projects/{id}", s.requireSession(http.HandlerFunc(s.deleteProject), true))
	s.mux.Handle("POST /api/v1/admin/projects/import", s.requireSession(http.HandlerFunc(s.importProjects), true))
	s.mux.Handle("POST /api/v1/admin/projects/{id}/media", s.requireSession(http.HandlerFunc(s.uploadMedia), true))
	s.mux.Handle("POST /api/v1/admin/projects/{id}/migrate-media", s.requireSession(http.HandlerFunc(s.migrateLegacyMedia), true))
	s.mux.Handle("GET /api/v1/admin/projects/{id}/media", s.requireSession(http.HandlerFunc(s.listMedia), false))
	s.mux.Handle("DELETE /api/v1/admin/projects/{id}/media/{mediaId}", s.requireSession(http.HandlerFunc(s.deleteMedia), true))
	s.mux.Handle("PUT /api/v1/admin/projects/{id}/media/order", s.requireSession(http.HandlerFunc(s.orderMedia), true))
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
func apiError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
func decodeJSON(w http.ResponseWriter, r *http.Request, dst any) bool {
	r.Body = http.MaxBytesReader(w, r.Body, 2<<20)
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(dst); err != nil {
		apiError(w, 400, "invalid request body")
		return false
	}
	return true
}
func clientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

func (s *Server) rateAllowed(key string) bool {
	s.limiter.Lock()
	defer s.limiter.Unlock()
	now := time.Now()
	cutoff := now.Add(-15 * time.Minute)
	items := s.attempts[key][:0]
	for _, at := range s.attempts[key] {
		if at.After(cutoff) {
			items = append(items, at)
		}
	}
	if len(items) >= 8 {
		s.attempts[key] = items
		return false
	}
	s.attempts[key] = append(items, now)
	return true
}

func (s *Server) login(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("Origin") != "" && r.Header.Get("Origin") != s.cfg.FrontendOrigin {
		apiError(w, 403, "origin rejected")
		return
	}
	if !s.rateAllowed(clientIP(r)) {
		apiError(w, 429, "too many login attempts")
		return
	}
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
		TOTP     string `json:"totpCode"`
	}
	if !decodeJSON(w, r, &input) {
		return
	}
	var id int64
	var hash string
	err := s.store.DB.QueryRowContext(r.Context(), `SELECT id,password_hash FROM admins WHERE username=?`, input.Username).Scan(&id, &hash)
	if err != nil || !verifyPassword(hash, input.Password) || !verifyTOTP(s.cfg.AdminTOTPSecret, input.TOTP, time.Now()) {
		time.Sleep(250 * time.Millisecond)
		apiError(w, 401, "invalid credentials")
		return
	}
	token, _ := randomToken(32)
	csrf := csrfToken(token)
	expires := time.Now().Add(12 * time.Hour)
	_, err = s.store.DB.ExecContext(r.Context(), `INSERT INTO admin_sessions(admin_id,token_hash,csrf_hash,ip_address,user_agent,expires_at,last_seen_at) VALUES(?,?,?,?,?,?,?)`, id, tokenHash(token), tokenHash(csrf), clientIP(r), r.UserAgent(), expires, time.Now())
	if err != nil {
		apiError(w, 500, "unable to create session")
		return
	}
	http.SetCookie(w, &http.Cookie{Name: "utero_admin_session", Value: token, Path: "/", HttpOnly: true, Secure: s.cfg.CookieSecure, SameSite: http.SameSiteStrictMode, Expires: expires, MaxAge: 43200})
	s.store.Audit(r.Context(), id, "admin.login", "admin", strconv.FormatInt(id, 10), clientIP(r))
	writeJSON(w, 200, map[string]any{"authenticated": true, "csrfToken": csrf, "username": input.Username})
}

func (s *Server) requireSession(next http.Handler, csrf bool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("utero_admin_session")
		if err != nil {
			apiError(w, 401, "authentication required")
			return
		}
		var session sessionContext
		var expires time.Time
		err = s.store.DB.QueryRowContext(r.Context(), `SELECT id,admin_id,csrf_hash,expires_at FROM admin_sessions WHERE token_hash=? AND revoked_at IS NULL`, tokenHash(cookie.Value)).Scan(&session.ID, &session.AdminID, &session.CSRFHash, &expires)
		if err != nil || expires.Before(time.Now()) {
			apiError(w, 401, "session expired")
			return
		}
		if csrf {
			if r.Header.Get("Origin") != "" && r.Header.Get("Origin") != s.cfg.FrontendOrigin {
				apiError(w, 403, "origin rejected")
				return
			}
			if tokenHash(r.Header.Get("X-CSRF-Token")) != session.CSRFHash {
				apiError(w, 403, "csrf validation failed")
				return
			}
		}
		_, _ = s.store.DB.ExecContext(r.Context(), `UPDATE admin_sessions SET last_seen_at=? WHERE id=?`, time.Now(), session.ID)
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), sessionKey, session)))
	})
}
func currentSession(r *http.Request) sessionContext {
	return r.Context().Value(sessionKey).(sessionContext)
}
func (s *Server) session(w http.ResponseWriter, r *http.Request) {
	cookie, _ := r.Cookie("utero_admin_session")
	csrf := csrfToken(cookie.Value)
	session := currentSession(r)
	if session.CSRFHash != tokenHash(csrf) {
		if _, err := s.store.DB.ExecContext(r.Context(), `UPDATE admin_sessions SET csrf_hash=? WHERE id=?`, tokenHash(csrf), session.ID); err != nil {
			apiError(w, 500, "unable to refresh session")
			return
		}
	}
	writeJSON(w, 200, map[string]any{"authenticated": true, "csrfToken": csrf})
}
func (s *Server) logout(w http.ResponseWriter, r *http.Request) {
	session := currentSession(r)
	_, _ = s.store.DB.ExecContext(r.Context(), `UPDATE admin_sessions SET revoked_at=? WHERE id=?`, time.Now(), session.ID)
	http.SetCookie(w, &http.Cookie{Name: "utero_admin_session", Path: "/", MaxAge: -1, HttpOnly: true, Secure: s.cfg.CookieSecure, SameSite: http.SameSiteStrictMode})
	writeJSON(w, 200, map[string]bool{"ok": true})
}

func (s *Server) changePassword(w http.ResponseWriter, r *http.Request) {
	var input struct {
		CurrentPassword string `json:"currentPassword"`
		NewPassword     string `json:"newPassword"`
	}
	if !decodeJSON(w, r, &input) {
		return
	}
	if len(input.NewPassword) < 16 || len(input.NewPassword) > 256 {
		apiError(w, 400, "new password must contain 16-256 characters")
		return
	}
	session := currentSession(r)
	var existing string
	if err := s.store.DB.QueryRowContext(r.Context(), `SELECT password_hash FROM admins WHERE id=?`, session.AdminID).Scan(&existing); err != nil || !verifyPassword(existing, input.CurrentPassword) {
		apiError(w, 401, "invalid current password")
		return
	}
	newHash, err := hashPassword(input.NewPassword)
	if err != nil {
		apiError(w, 500, "password update failed")
		return
	}
	tx, err := s.store.DB.BeginTx(r.Context(), nil)
	if err != nil {
		apiError(w, 500, "password update failed")
		return
	}
	defer tx.Rollback()
	if _, err = tx.ExecContext(r.Context(), `UPDATE admins SET password_hash=? WHERE id=?`, newHash, session.AdminID); err != nil {
		apiError(w, 500, "password update failed")
		return
	}
	if _, err = tx.ExecContext(r.Context(), `UPDATE admin_sessions SET revoked_at=? WHERE admin_id=?`, time.Now(), session.AdminID); err != nil {
		apiError(w, 500, "password update failed")
		return
	}
	if err = tx.Commit(); err != nil {
		apiError(w, 500, "password update failed")
		return
	}
	s.store.Audit(r.Context(), session.AdminID, "admin.password.change", "admin", strconv.FormatInt(session.AdminID, 10), clientIP(r))
	http.SetCookie(w, &http.Cookie{Name: "utero_admin_session", Path: "/", MaxAge: -1, HttpOnly: true, Secure: s.cfg.CookieSecure, SameSite: http.SameSiteStrictMode})
	writeJSON(w, 200, map[string]bool{"ok": true})
}

func (s *Server) listPublic(w http.ResponseWriter, r *http.Request) {
	projects, err := s.store.ListProjects(r.Context(), false)
	if err != nil {
		apiError(w, 500, "unable to load projects")
		return
	}
	writeJSON(w, 200, projects)
}
func (s *Server) getPublic(w http.ResponseWriter, r *http.Request) {
	p, err := s.store.GetProject(r.Context(), r.PathValue("slug"), true, false)
	if errors.Is(err, sql.ErrNoRows) {
		var updatedSlug string
		lookupErr := s.store.DB.QueryRowContext(r.Context(), `SELECT p.route_slug FROM project_slug_redirects redirects JOIN projects p ON p.id=redirects.project_id WHERE redirects.old_route_slug=? AND p.status='published' AND p.deleted_at IS NULL`, r.PathValue("slug")).Scan(&updatedSlug)
		if lookupErr == nil {
			p, err = s.store.GetProject(r.Context(), updatedSlug, true, false)
		}
	}
	if errors.Is(err, sql.ErrNoRows) {
		apiError(w, 404, "project not found")
		return
	}
	if err != nil {
		apiError(w, 500, "unable to load project")
		return
	}
	writeJSON(w, 200, p)
}
func (s *Server) getPublicDeck(w http.ResponseWriter, r *http.Request) {
	project, err := s.store.GetProject(r.Context(), r.PathValue("slug"), true, false)
	if errors.Is(err, sql.ErrNoRows) {
		apiError(w, 404, "project not found")
		return
	}
	if err != nil {
		apiError(w, 500, "unable to load deck")
		return
	}
	rows, err := s.store.DB.QueryContext(r.Context(), `SELECT storage_key,width,height FROM project_media WHERE project_id=? AND media_type='deck' ORDER BY sort_order,id`, project.ID)
	if err != nil {
		apiError(w, 500, "unable to load deck")
		return
	}
	defer rows.Close()
	images := []string{}
	ratios := []float64{}
	for rows.Next() {
		var key string
		var width, height int
		if err = rows.Scan(&key, &width, &height); err != nil {
			apiError(w, 500, "unable to load deck")
			return
		}
		images = append(images, "/portfolio-api/media/"+key)
		ratio := 1.0
		if height > 0 {
			ratio = float64(width) / float64(height)
		}
		ratios = append(ratios, ratio)
	}
	if len(images) == 0 {
		apiError(w, 404, "deck not found")
		return
	}
	writeJSON(w, 200, map[string]any{"slug": project.Slug, "total_pages": len(images), "deck_images": images, "aspect_ratios": ratios, "thumbnails": images})
}
func (s *Server) listAdmin(w http.ResponseWriter, r *http.Request) {
	projects, err := s.store.ListProjects(r.Context(), true)
	if err != nil {
		apiError(w, 500, "unable to load projects")
		return
	}
	writeJSON(w, 200, projects)
}
func (s *Server) getAdmin(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r.PathValue("id"))
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	p, err := s.store.GetProject(r.Context(), id, false, true)
	if errors.Is(err, sql.ErrNoRows) {
		apiError(w, 404, "project not found")
		return
	}
	if err != nil {
		apiError(w, 500, "unable to load project")
		return
	}
	writeJSON(w, 200, p)
}
func (s *Server) createProject(w http.ResponseWriter, r *http.Request) {
	var p Project
	if !decodeJSON(w, r, &p) {
		return
	}
	p.ID = 0
	if err := s.store.SaveProject(r.Context(), &p); err != nil {
		apiError(w, 400, err.Error())
		return
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "project.create", "project", strconv.FormatInt(p.ID, 10), clientIP(r))
	writeJSON(w, 201, p)
}
func (s *Server) updateProject(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r.PathValue("id"))
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	var p Project
	if !decodeJSON(w, r, &p) {
		return
	}
	p.ID = id
	if err = s.store.SaveProject(r.Context(), &p); err != nil {
		apiError(w, 400, err.Error())
		return
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "project.update", "project", strconv.FormatInt(id, 10), clientIP(r))
	writeJSON(w, 200, p)
}
func (s *Server) deleteProject(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r.PathValue("id"))
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	if err = s.store.SoftDeleteProject(r.Context(), id); err != nil {
		apiError(w, 404, "project not found")
		return
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "project.delete", "project", strconv.FormatInt(id, 10), clientIP(r))
	w.WriteHeader(204)
}
func (s *Server) importProjects(w http.ResponseWriter, r *http.Request) {
	var projects []Project
	if !decodeJSON(w, r, &projects) {
		return
	}
	if len(projects) > 100 {
		apiError(w, 400, "import limit exceeded")
		return
	}
	count := 0
	for index := range projects {
		projects[index].ID = 0
		if projects[index].Status == "" {
			projects[index].Status = "published"
		}
		if err := s.store.SaveProject(r.Context(), &projects[index]); err != nil {
			if strings.Contains(err.Error(), "UNIQUE") {
				continue
			}
			apiError(w, 400, fmt.Sprintf("project %d: %v", index+1, err))
			return
		}
		count++
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "project.import", "project", "", clientIP(r))
	writeJSON(w, 200, map[string]int{"imported": count})
}

func (s *Server) uploadMedia(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r.PathValue("id"))
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	if _, err = s.store.GetProject(r.Context(), id, false, true); err != nil {
		apiError(w, 404, "project not found")
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, 21<<20)
	if err = r.ParseMultipartForm(21 << 20); err != nil {
		apiError(w, 400, "file exceeds 20 MB")
		return
	}
	file, header, err := r.FormFile("file")
	if err != nil {
		apiError(w, 400, "file is required")
		return
	}
	defer file.Close()
	data, err := io.ReadAll(io.LimitReader(file, 20<<20))
	if err != nil || len(data) == 0 {
		apiError(w, 400, "invalid file")
		return
	}
	contentType := http.DetectContentType(data)
	allowed := map[string]bool{"image/jpeg": true, "image/png": true, "image/webp": true}
	if !allowed[contentType] {
		apiError(w, 400, "only JPEG, PNG, and WebP are allowed")
		return
	}
	config, _, err := image.DecodeConfig(bytes.NewReader(data))
	if err != nil || config.Width < 1 || config.Height < 1 || config.Width > 12000 || config.Height > 12000 {
		apiError(w, 400, "invalid image dimensions")
		return
	}
	mediaType := r.FormValue("mediaType")
	if mediaType != "cover" && mediaType != "hover" && mediaType != "gallery" && mediaType != "deck" {
		apiError(w, 400, "invalid media type")
		return
	}
	ext := strings.ToLower(filepath.Ext(header.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp" {
		ext = ".bin"
	}
	token, _ := randomToken(18)
	key := fmt.Sprintf("projects/%d/%s/%s%s", id, mediaType, token, ext)
	if err = s.storage.Put(r.Context(), key, contentType, bytes.NewReader(data), int64(len(data))); err != nil {
		slog.Error("s3 upload failed", "error", err)
		apiError(w, 502, "storage unavailable")
		return
	}
	result, err := s.store.DB.ExecContext(r.Context(), `INSERT INTO project_media(project_id,media_type,storage_key,original_filename,mime_type,file_size,width,height,alt_text) VALUES(?,?,?,?,?,?,?,?,?)`, id, mediaType, key, filepath.Base(header.Filename), contentType, len(data), config.Width, config.Height, r.FormValue("altText"))
	if err != nil {
		apiError(w, 500, "unable to save media")
		return
	}
	mediaID, _ := result.LastInsertId()
	url := "/portfolio-api/media/" + key
	project, _ := s.store.GetProject(r.Context(), id, false, true)
	switch mediaType {
	case "cover":
		project.CoverImage = url
		project.HeroImage = url
	case "hover":
		project.HoverImage = url
	case "gallery":
		project.GalleryImages = append(project.GalleryImages, url)
	}
	if mediaType != "deck" {
		_ = s.store.SaveProject(r.Context(), &project)
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "media.upload", "project", strconv.FormatInt(id, 10), clientIP(r))
	writeJSON(w, 201, map[string]any{"id": mediaID, "url": url, "width": config.Width, "height": config.Height})
}

func (s *Server) migrateLegacyMedia(w http.ResponseWriter, r *http.Request) {
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
	migrated := 0
	migrate := func(mediaType, source string) (string, bool) {
		if !strings.HasPrefix(source, "/projects/") {
			return source, false
		}
		url, migrateErr := s.migrateLegacyFile(r.Context(), project.ID, mediaType, source, project.Title)
		if migrateErr != nil {
			slog.Warn("legacy media migration skipped", "path", source, "error", migrateErr)
			return source, false
		}
		return url, true
	}
	if value, ok := migrate("cover", project.CoverImage); ok {
		project.CoverImage = value
		project.HeroImage = value
		migrated++
	}
	if value, ok := migrate("hover", project.HoverImage); ok {
		project.HoverImage = value
		migrated++
	}
	gallery := make([]string, 0, len(project.GalleryImages))
	for _, source := range project.GalleryImages {
		value, ok := migrate("gallery", source)
		gallery = append(gallery, value)
		if ok {
			migrated++
		}
	}
	project.GalleryImages = gallery
	manifestPath := filepath.Join(s.cfg.LegacyMediaRoot, "projects", project.Slug, "deck", "manifest.json")
	if raw, readErr := os.ReadFile(manifestPath); readErr == nil {
		var manifest struct {
			DeckImages []string `json:"deck_images"`
		}
		if json.Unmarshal(raw, &manifest) == nil {
			for _, source := range manifest.DeckImages {
				if _, ok := migrate("deck", source); ok {
					migrated++
				}
			}
		}
	}
	if err = s.store.SaveProject(r.Context(), &project); err != nil {
		apiError(w, 500, "unable to save migrated paths")
		return
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "media.migrate", "project", strconv.FormatInt(id, 10), clientIP(r))
	writeJSON(w, 200, map[string]int{"migrated": migrated})
}

func (s *Server) migrateLegacyFile(ctx context.Context, projectID int64, mediaType, source, alt string) (string, error) {
	root, err := filepath.Abs(s.cfg.LegacyMediaRoot)
	if err != nil {
		return "", err
	}
	relative := strings.TrimPrefix(filepath.Clean(filepath.FromSlash(source)), string(filepath.Separator))
	filename, err := filepath.Abs(filepath.Join(root, relative))
	if err != nil || !strings.HasPrefix(filename, root+string(filepath.Separator)) {
		return "", errors.New("invalid legacy path")
	}
	data, err := os.ReadFile(filename)
	if err != nil {
		return "", err
	}
	if len(data) == 0 || len(data) > 20<<20 {
		return "", errors.New("legacy file size rejected")
	}
	contentType := http.DetectContentType(data)
	if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/webp" {
		return "", errors.New("legacy file type rejected")
	}
	config, _, err := image.DecodeConfig(bytes.NewReader(data))
	if err != nil {
		return "", err
	}
	hash := sha256.Sum256([]byte(source))
	key := fmt.Sprintf("projects/%d/%s/%x%s", projectID, mediaType, hash[:10], strings.ToLower(filepath.Ext(filename)))
	if err = s.storage.Put(ctx, key, contentType, bytes.NewReader(data), int64(len(data))); err != nil {
		return "", err
	}
	_, err = s.store.DB.ExecContext(ctx, `INSERT OR IGNORE INTO project_media(project_id,media_type,storage_key,original_filename,mime_type,file_size,width,height,alt_text) VALUES(?,?,?,?,?,?,?,?,?)`, projectID, mediaType, key, filepath.Base(filename), contentType, len(data), config.Width, config.Height, alt)
	if err != nil {
		return "", err
	}
	return "/portfolio-api/media/" + key, nil
}

type mediaItem struct {
	ID        int64  `json:"id"`
	MediaType string `json:"mediaType"`
	URL       string `json:"url"`
	Filename  string `json:"filename"`
	SortOrder int    `json:"sortOrder"`
}

func (s *Server) listMedia(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r.PathValue("id"))
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	rows, err := s.store.DB.QueryContext(r.Context(), `SELECT id,media_type,storage_key,original_filename,sort_order FROM project_media WHERE project_id=? ORDER BY media_type,sort_order,id`, id)
	if err != nil {
		apiError(w, 500, "unable to list media")
		return
	}
	defer rows.Close()
	items := []mediaItem{}
	for rows.Next() {
		var item mediaItem
		var key string
		if err = rows.Scan(&item.ID, &item.MediaType, &key, &item.Filename, &item.SortOrder); err != nil {
			apiError(w, 500, "unable to list media")
			return
		}
		item.URL = "/portfolio-api/media/" + key
		items = append(items, item)
	}
	writeJSON(w, 200, items)
}
func (s *Server) deleteMedia(w http.ResponseWriter, r *http.Request) {
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
	var key, mediaType string
	if err = s.store.DB.QueryRowContext(r.Context(), `SELECT storage_key,media_type FROM project_media WHERE id=? AND project_id=?`, mediaID, id).Scan(&key, &mediaType); err != nil {
		apiError(w, 404, "media not found")
		return
	}
	if err = s.storage.Delete(r.Context(), key); err != nil {
		apiError(w, 502, "unable to remove object")
		return
	}
	if _, err = s.store.DB.ExecContext(r.Context(), `DELETE FROM project_media WHERE id=? AND project_id=?`, mediaID, id); err != nil {
		apiError(w, 500, "unable to remove media metadata")
		return
	}
	project, err := s.store.GetProject(r.Context(), id, false, true)
	if err == nil {
		url := "/portfolio-api/media/" + key
		switch mediaType {
		case "cover":
			if project.CoverImage == url {
				project.CoverImage = ""
				project.HeroImage = ""
			}
		case "hover":
			if project.HoverImage == url {
				project.HoverImage = ""
			}
		case "gallery":
			gallery := []string{}
			for _, image := range project.GalleryImages {
				if image != url {
					gallery = append(gallery, image)
				}
			}
			project.GalleryImages = gallery
		}
		if mediaType != "deck" {
			_ = s.store.SaveProject(r.Context(), &project)
		}
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "media.delete", "project", strconv.FormatInt(id, 10), clientIP(r))
	w.WriteHeader(204)
}
func (s *Server) orderMedia(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r.PathValue("id"))
	if err != nil {
		apiError(w, 400, err.Error())
		return
	}
	var input struct {
		IDs []int64 `json:"ids"`
	}
	if !decodeJSON(w, r, &input) {
		return
	}
	if len(input.IDs) > 1000 {
		apiError(w, 400, "too many items")
		return
	}
	tx, err := s.store.DB.BeginTx(r.Context(), nil)
	if err != nil {
		apiError(w, 500, "unable to reorder")
		return
	}
	defer tx.Rollback()
	for index, mediaID := range input.IDs {
		result, execErr := tx.ExecContext(r.Context(), `UPDATE project_media SET sort_order=? WHERE id=? AND project_id=?`, index, mediaID, id)
		if execErr != nil {
			apiError(w, 500, "unable to reorder")
			return
		}
		affected, _ := result.RowsAffected()
		if affected == 0 {
			apiError(w, 400, "invalid media id")
			return
		}
	}
	if err = tx.Commit(); err != nil {
		apiError(w, 500, "unable to reorder")
		return
	}
	writeJSON(w, 200, map[string]bool{"ok": true})
}
func (s *Server) getMedia(w http.ResponseWriter, r *http.Request) {
	key, err := safeObjectKey(r.PathValue("key"))
	if err != nil {
		apiError(w, 400, "invalid media path")
		return
	}
	parts := strings.Split(key, "/")
	if len(parts) < 4 || parts[0] != "projects" {
		apiError(w, 404, "media not found")
		return
	}
	projectID, parseErr := strconv.ParseInt(parts[1], 10, 64)
	if parseErr != nil {
		apiError(w, 404, "media not found")
		return
	}
	var status string
	if err = s.store.DB.QueryRowContext(r.Context(), `SELECT status FROM projects WHERE id=? AND deleted_at IS NULL`, projectID).Scan(&status); err != nil {
		apiError(w, 404, "media not found")
		return
	}
	if status != "published" && !s.hasValidSession(r) {
		apiError(w, 404, "media not found")
		return
	}
	object, err := s.storage.Get(r.Context(), key)
	if err != nil {
		apiError(w, 404, "media not found")
		return
	}
	defer object.Close()
	stat, err := object.Stat()
	if err != nil {
		apiError(w, 404, "media not found")
		return
	}
	w.Header().Set("Content-Type", stat.ContentType)
	w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
	w.Header().Set("Content-Length", strconv.FormatInt(stat.Size, 10))
	_, _ = io.Copy(w, object)
}

func (s *Server) hasValidSession(r *http.Request) bool {
	cookie, err := r.Cookie("utero_admin_session")
	if err != nil {
		return false
	}
	var expires time.Time
	err = s.store.DB.QueryRowContext(r.Context(), `SELECT expires_at FROM admin_sessions WHERE token_hash=? AND revoked_at IS NULL`, tokenHash(cookie.Value)).Scan(&expires)
	return err == nil && expires.After(time.Now())
}
