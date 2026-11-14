package app

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"
)

type ContentOverride struct {
	Scope     string          `json:"scope"`
	Key       string          `json:"key"`
	Locale    string          `json:"locale"`
	Value     json.RawMessage `json:"value"`
	UpdatedAt string          `json:"updatedAt"`
}

var validOverrideScopes = map[string]bool{
	"translations": true,
	"services":     true,
	"seo":          true,
	"page-copy":    true,
}

func (s *Store) ListContentOverrides() ([]ContentOverride, error) {
	rows, err := s.DB.Query(`SELECT scope,key,locale,value_json,updated_at FROM content_overrides ORDER BY scope,key,locale`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []ContentOverride{}
	for rows.Next() {
		var o ContentOverride
		var value, updated string
		if err := rows.Scan(&o.Scope, &o.Key, &o.Locale, &value, &updated); err != nil {
			return nil, err
		}
		o.Value = json.RawMessage(value)
		o.UpdatedAt = updated
		out = append(out, o)
	}
	return out, rows.Err()
}

func (s *Store) UpsertContentOverride(o ContentOverride) error {
	_, err := s.DB.Exec(`INSERT INTO content_overrides(scope,key,locale,value_json,updated_at) VALUES(?,?,?,?,?)
		ON CONFLICT(scope,key,locale) DO UPDATE SET value_json=excluded.value_json, updated_at=excluded.updated_at`,
		o.Scope, o.Key, o.Locale, string(o.Value), time.Now().UTC().Format(time.RFC3339))
	return err
}

func (s *Store) DeleteContentOverride(scope, key, locale string) (bool, error) {
	res, err := s.DB.Exec(`DELETE FROM content_overrides WHERE scope=? AND key=? AND locale=?`, scope, key, locale)
	if err != nil {
		return false, err
	}
	n, _ := res.RowsAffected()
	return n > 0, nil
}

func (s *Server) listContentOverrides(w http.ResponseWriter, r *http.Request) {
	overrides, err := s.store.ListContentOverrides()
	if err != nil {
		apiError(w, 500, "failed to load content overrides")
		return
	}
	writeJSON(w, 200, map[string]any{"overrides": overrides})
}

func (s *Server) upsertContentOverride(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Scope  string          `json:"scope"`
		Key    string          `json:"key"`
		Locale string          `json:"locale"`
		Value  json.RawMessage `json:"value"`
	}
	if !decodeJSON(w, r, &input) {
		return
	}
	input.Scope = strings.TrimSpace(input.Scope)
	input.Key = strings.TrimSpace(input.Key)
	input.Locale = strings.TrimSpace(input.Locale)
	if !validOverrideScopes[input.Scope] || input.Key == "" || len(input.Key) > 300 || len(input.Value) == 0 {
		apiError(w, 400, "scope, key and value are required")
		return
	}
	if len(input.Locale) > 10 {
		apiError(w, 400, "invalid locale")
		return
	}
	if !json.Valid(input.Value) {
		apiError(w, 400, "value must be valid JSON")
		return
	}
	o := ContentOverride{Scope: input.Scope, Key: input.Key, Locale: input.Locale, Value: input.Value}
	if err := s.store.UpsertContentOverride(o); err != nil {
		apiError(w, 500, "failed to save override")
		return
	}
	s.store.Audit(r.Context(), currentSession(r).AdminID, "content.override.upsert", "content_override", input.Scope+":"+input.Key+":"+input.Locale, clientIP(r))
	writeJSON(w, 200, map[string]any{"ok": true})
}

func (s *Server) deleteContentOverride(w http.ResponseWriter, r *http.Request) {
	scope := strings.TrimSpace(r.URL.Query().Get("scope"))
	key := strings.TrimSpace(r.URL.Query().Get("key"))
	locale := strings.TrimSpace(r.URL.Query().Get("locale"))
	if !validOverrideScopes[scope] || key == "" {
		apiError(w, 400, "scope and key are required")
		return
	}
	deleted, err := s.store.DeleteContentOverride(scope, key, locale)
	if err != nil {
		apiError(w, 500, "failed to delete override")
		return
	}
	if deleted {
		s.store.Audit(r.Context(), currentSession(r).AdminID, "content.override.delete", "content_override", scope+":"+key+":"+locale, clientIP(r))
	}
	writeJSON(w, 200, map[string]any{"ok": true, "deleted": deleted})
}

