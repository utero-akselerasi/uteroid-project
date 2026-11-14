package app

import (
	"net/http"
	"time"
)

// GET /api/v1/admin/export — full JSON backup of editable content.
func (s *Server) exportData(w http.ResponseWriter, r *http.Request) {
	projects, err := s.store.ListProjects(r.Context(), true)
	if err != nil {
		apiError(w, 500, "unable to export projects")
		return
	}
	settings, err := s.store.GetAllSettings(r.Context())
	if err != nil {
		apiError(w, 500, "unable to export settings")
		return
	}
	overrides, err := s.store.ListContentOverrides()
	if err != nil {
		apiError(w, 500, "unable to export overrides")
		return
	}
	session := currentSession(r)
	s.store.Audit(r.Context(), session.AdminID, "admin.export", "backup", time.Now().UTC().Format(time.RFC3339), clientIP(r))
	writeJSON(w, 200, map[string]any{
		"exportedAt": time.Now().UTC().Format(time.RFC3339),
		"projects":   projects,
		"settings":   settings,
		"overrides":  overrides,
	})
}

// GET /api/v1/admin/audit — recent audit log entries.
func (s *Server) listAudit(w http.ResponseWriter, r *http.Request) {
	rows, err := s.store.DB.Query(`SELECT id,admin_id,action,entity_type,entity_id,ip_address,created_at FROM audit_logs ORDER BY id DESC LIMIT 200`)
	if err != nil {
		apiError(w, 500, "unable to load audit log")
		return
	}
	defer rows.Close()
	type entry struct {
		ID         int64  `json:"id"`
		AdminID    *int64 `json:"adminId"`
		Action     string `json:"action"`
		EntityType string `json:"entityType"`
		EntityID   string `json:"entityId"`
		IP         string `json:"ip"`
		CreatedAt  string `json:"createdAt"`
	}
	out := []entry{}
	for rows.Next() {
		var e entry
		var entityID, ip *string
		if err := rows.Scan(&e.ID, &e.AdminID, &e.Action, &e.EntityType, &entityID, &ip, &e.CreatedAt); err != nil {
			apiError(w, 500, "unable to read audit log")
			return
		}
		if entityID != nil {
			e.EntityID = *entityID
		}
		if ip != nil {
			e.IP = *ip
		}
		out = append(out, e)
	}
	writeJSON(w, 200, map[string]any{"entries": out})
}
