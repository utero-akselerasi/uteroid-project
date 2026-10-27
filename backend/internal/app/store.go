package app

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"strings"
	"time"

	_ "modernc.org/sqlite"
)

type Store struct{ DB *sql.DB }

func OpenStore(path string) (*Store, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(1)
	if _, err = db.Exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;`); err != nil {
		db.Close()
		return nil, err
	}
	s := &Store{DB: db}
	if err = s.migrate(); err != nil {
		db.Close()
		return nil, err
	}
	return s, nil
}

func (s *Store) migrate() error {
	_, err := s.DB.Exec(`
CREATE TABLE IF NOT EXISTS admins (
 id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
 failed_login_count INTEGER NOT NULL DEFAULT 0, locked_until DATETIME, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS admin_sessions (
 id INTEGER PRIMARY KEY, admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
 token_hash TEXT NOT NULL UNIQUE, csrf_hash TEXT NOT NULL, ip_address TEXT, user_agent TEXT,
 expires_at DATETIME NOT NULL, last_seen_at DATETIME NOT NULL, revoked_at DATETIME
);
CREATE TABLE IF NOT EXISTS projects (
 id INTEGER PRIMARY KEY, slug TEXT NOT NULL UNIQUE, route_slug TEXT NOT NULL UNIQUE,
 title TEXT NOT NULL, client TEXT NOT NULL, year TEXT NOT NULL, category TEXT NOT NULL,
 industry TEXT NOT NULL, disciplines_json TEXT NOT NULL, short_description TEXT NOT NULL,
 description TEXT NOT NULL, excerpt TEXT NOT NULL DEFAULT '', cover_image TEXT NOT NULL DEFAULT '',
 hero_image TEXT NOT NULL DEFAULT '', grid_cover_position TEXT NOT NULL DEFAULT '', hover_image TEXT NOT NULL DEFAULT '',
 gallery_images_json TEXT NOT NULL DEFAULT '[]', video_json TEXT, featured INTEGER NOT NULL DEFAULT 0,
 priority INTEGER NOT NULL DEFAULT 0, tags_json TEXT NOT NULL DEFAULT '[]', details_json TEXT NOT NULL DEFAULT '{}',
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
 published_at DATETIME, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, deleted_at DATETIME
);
CREATE INDEX IF NOT EXISTS idx_projects_public ON projects(status, priority DESC);
CREATE TABLE IF NOT EXISTS project_media (
 id INTEGER PRIMARY KEY, project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
 media_type TEXT NOT NULL, storage_key TEXT NOT NULL UNIQUE, original_filename TEXT NOT NULL,
 mime_type TEXT NOT NULL, file_size INTEGER NOT NULL, width INTEGER NOT NULL DEFAULT 0,
 height INTEGER NOT NULL DEFAULT 0, alt_text TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS project_slug_redirects (
 id INTEGER PRIMARY KEY, project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
 old_route_slug TEXT NOT NULL UNIQUE, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS audit_logs (
 id INTEGER PRIMARY KEY, admin_id INTEGER, action TEXT NOT NULL, entity_type TEXT NOT NULL,
 entity_id TEXT, ip_address TEXT, metadata_json TEXT NOT NULL DEFAULT '{}', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS site_settings (
 key TEXT PRIMARY KEY, value_json TEXT NOT NULL, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);`)
	if err != nil {
		return err
	}
	_, err = s.DB.Exec(`WITH ranked AS MATERIALIZED (
 SELECT id, (SELECT COALESCE(MAX(priority),0) FROM projects) + ROW_NUMBER() OVER (ORDER BY id) AS next_priority
 FROM projects WHERE priority=0 AND deleted_at IS NULL
 ) UPDATE projects SET priority=(SELECT next_priority FROM ranked WHERE ranked.id=projects.id)
 WHERE id IN (SELECT id FROM ranked)`)
	return err
}

func (s *Store) EnsureAdmin(ctx context.Context, username, passwordHash string) error {
	var count int
	if err := s.DB.QueryRowContext(ctx, `SELECT COUNT(*) FROM admins`).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return nil
	}
	_, err := s.DB.ExecContext(ctx, `INSERT INTO admins(username,password_hash) VALUES(?,?)`, username, passwordHash)
	return err
}

func encode(v any) string { data, _ := json.Marshal(v); return string(data) }

const projectColumns = `id,slug,route_slug,title,client,year,category,industry,disciplines_json,short_description,
 description,excerpt,cover_image,hero_image,grid_cover_position,hover_image,gallery_images_json,video_json,
 featured,priority,tags_json,details_json,status,published_at,created_at,updated_at`

type scanner interface{ Scan(...any) error }

func scanProject(row scanner) (Project, error) {
	var p Project
	var disciplines, gallery, tags, details string
	var video sql.NullString
	var published sql.NullTime
	err := row.Scan(&p.ID, &p.Slug, &p.RouteSlug, &p.Title, &p.Client, &p.Year, &p.Category, &p.Industry, &disciplines,
		&p.ShortDescription, &p.Description, &p.Excerpt, &p.CoverImage, &p.HeroImage, &p.GridCoverPosition, &p.HoverImage,
		&gallery, &video, &p.Featured, &p.Priority, &tags, &details, &p.Status, &published, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		return p, err
	}
	_ = json.Unmarshal([]byte(disciplines), &p.Disciplines)
	_ = json.Unmarshal([]byte(gallery), &p.GalleryImages)
	_ = json.Unmarshal([]byte(tags), &p.Tags)
	_ = json.Unmarshal([]byte(details), &p.Details)
	if video.Valid && video.String != "" {
		p.Video = &ProjectVideo{}
		_ = json.Unmarshal([]byte(video.String), p.Video)
	}
	if published.Valid {
		p.PublishedAt = &published.Time
	}
	return p, nil
}

func (s *Store) ListProjects(ctx context.Context, admin bool) ([]Project, error) {
	query := `SELECT ` + projectColumns + ` FROM projects WHERE deleted_at IS NULL`
	if !admin {
		query += ` AND status='published'`
	}
	query += ` ORDER BY priority DESC,id ASC`
	rows, err := s.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	projects := []Project{}
	for rows.Next() {
		project, err := scanProject(rows)
		if err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}
	return projects, rows.Err()
}

func (s *Store) GetProject(ctx context.Context, value any, byRoute, admin bool) (Project, error) {
	field := "id"
	if byRoute {
		field = "route_slug"
	}
	query := `SELECT ` + projectColumns + ` FROM projects WHERE deleted_at IS NULL AND ` + field + `=?`
	if !admin {
		query += ` AND status='published'`
	}
	return scanProject(s.DB.QueryRowContext(ctx, query, value))
}

func validateProject(p *Project) error {
	if p.Slug == "" || p.RouteSlug == "" || p.Title == "" || p.Client == "" {
		return errors.New("slug, routeSlug, title, and client are required")
	}
	if len(p.Slug) > 100 || len(p.RouteSlug) > 160 || len(p.Title) > 240 {
		return errors.New("project field exceeds maximum length")
	}
	for _, slug := range []string{p.Slug, p.RouteSlug} {
		if len(slug) == 0 || strings.Trim(slug, "abcdefghijklmnopqrstuvwxyz0123456789-") != "" || slug[0] == '-' {
			return errors.New("slug must use lowercase letters, digits and hyphens")
		}
	}
	if p.Status == "" {
		p.Status = "draft"
	}
	if p.Status != "draft" && p.Status != "published" && p.Status != "archived" {
		return errors.New("invalid status")
	}
	return nil
}

func (s *Store) SaveProject(ctx context.Context, p *Project) error {
	if err := validateProject(p); err != nil {
		return err
	}
	p.GridCoverPosition = "center"
	if p.ID == 0 {
		if err := s.DB.QueryRowContext(ctx, `SELECT COALESCE(MAX(priority),0)+1 FROM projects WHERE deleted_at IS NULL`).Scan(&p.Priority); err != nil {
			return err
		}
	} else {
		if err := s.DB.QueryRowContext(ctx, `SELECT priority FROM projects WHERE id=? AND deleted_at IS NULL`, p.ID).Scan(&p.Priority); err != nil {
			return err
		}
	}
	var video any
	if p.Video != nil {
		video = encode(p.Video)
	}
	if p.Status == "published" && p.PublishedAt == nil {
		now := time.Now().UTC()
		p.PublishedAt = &now
	}
	values := []any{p.Slug, p.RouteSlug, p.Title, p.Client, p.Year, p.Category, p.Industry, encode(p.Disciplines), p.ShortDescription, p.Description,
		p.Excerpt, p.CoverImage, p.HeroImage, p.GridCoverPosition, p.HoverImage, encode(p.GalleryImages), video, p.Featured, p.Priority,
		encode(p.Tags), encode(p.Details), p.Status, p.PublishedAt}
	if p.ID == 0 {
		result, err := s.DB.ExecContext(ctx, `INSERT INTO projects(slug,route_slug,title,client,year,category,industry,disciplines_json,
short_description,description,excerpt,cover_image,hero_image,grid_cover_position,hover_image,gallery_images_json,video_json,
featured,priority,tags_json,details_json,status,published_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, values...)
		if err != nil {
			return err
		}
		p.ID, _ = result.LastInsertId()
		return nil
	}
	current, err := s.GetProject(ctx, p.ID, false, true)
	if err != nil {
		return err
	}
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	if current.RouteSlug != p.RouteSlug {
		if _, err = tx.ExecContext(ctx, `INSERT INTO project_slug_redirects(project_id,old_route_slug) VALUES(?,?)`, p.ID, current.RouteSlug); err != nil {
			return err
		}
	}
	values = append(values, p.ID)
	_, err = tx.ExecContext(ctx, `UPDATE projects SET slug=?,route_slug=?,title=?,client=?,year=?,category=?,industry=?,disciplines_json=?,
short_description=?,description=?,excerpt=?,cover_image=?,hero_image=?,grid_cover_position=?,hover_image=?,gallery_images_json=?,video_json=?,
featured=?,priority=?,tags_json=?,details_json=?,status=?,published_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`, values...)
	if err != nil {
		return err
	}
	return tx.Commit()
}

func (s *Store) SoftDeleteProject(ctx context.Context, id int64) error {
	result, err := s.DB.ExecContext(ctx, `UPDATE projects SET deleted_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=?`, id)
	if err != nil {
		return err
	}
	count, _ := result.RowsAffected()
	if count == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (s *Store) Audit(ctx context.Context, adminID int64, action, entityType, entityID, ip string) {
	_, _ = s.DB.ExecContext(ctx, `INSERT INTO audit_logs(admin_id,action,entity_type,entity_id,ip_address) VALUES(?,?,?,?,?)`, adminID, action, entityType, entityID, ip)
}

func (s *Store) SaveSetting(ctx context.Context, key, valueJSON string) error {
	_, err := s.DB.ExecContext(ctx, `INSERT INTO site_settings(key,value_json,updated_at) VALUES(?,?,CURRENT_TIMESTAMP)
ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json, updated_at=CURRENT_TIMESTAMP`, key, valueJSON)
	return err
}

func (s *Store) GetSetting(ctx context.Context, key string) (string, error) {
	var value string
	err := s.DB.QueryRowContext(ctx, `SELECT value_json FROM site_settings WHERE key=?`, key).Scan(&value)
	return value, err
}

func (s *Store) GetAllSettings(ctx context.Context) (map[string]any, error) {
	rows, err := s.DB.QueryContext(ctx, `SELECT key, value_json FROM site_settings`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	result := make(map[string]any)
	for rows.Next() {
		var key, val string
		if err := rows.Scan(&key, &val); err != nil {
			return nil, err
		}
		var parsed any
		if err := json.Unmarshal([]byte(val), &parsed); err == nil {
			result[key] = parsed
		} else {
			result[key] = val
		}
	}
	return result, nil
}

