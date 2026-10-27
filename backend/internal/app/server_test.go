package app

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strconv"
	"testing"
	"time"
)

func testServer(t *testing.T) (*Store, *Server) {
	t.Helper()
	store, err := OpenStore(filepath.Join(t.TempDir(), "portfolio.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = store.DB.Close() })
	hash, err := hashPassword("secure-password-for-tests")
	if err != nil {
		t.Fatal(err)
	}
	if err := store.EnsureAdmin(t.Context(), "admin", hash); err != nil {
		t.Fatal(err)
	}
	return store, NewServer(Config{FrontendOrigin: "http://localhost:3020"}, store, nil)
}

func TestPasswordAndTOTP(t *testing.T) {
	hash, err := hashPassword("correct-password")
	if err != nil || !verifyPassword(hash, "correct-password") || verifyPassword(hash, "incorrect-password") {
		t.Fatal("password verification failed")
	}
	if verifyTOTP("JBSWY3DPEHPK3PXP", "000000", time.Unix(1700000000, 0)) {
		t.Fatal("unexpected TOTP match")
	}
}

func TestLoginRateLimitUsesAddressNotPort(t *testing.T) {
	_, server := testServer(t)
	for attempt := 0; attempt < 8; attempt++ {
		request := httptest.NewRequest(http.MethodPost, "/api/v1/admin/auth/login", bytes.NewReader([]byte(`{"username":"admin","password":"wrong-password"}`)))
		request.RemoteAddr = "192.0.2.1:" + strconv.Itoa(5100+attempt)
		response := httptest.NewRecorder()
		server.Handler().ServeHTTP(response, request)
		if response.Code != http.StatusUnauthorized {
			t.Fatalf("attempt %d: %d", attempt, response.Code)
		}
	}
	request := httptest.NewRequest(http.MethodPost, "/api/v1/admin/auth/login", bytes.NewReader([]byte(`{"username":"admin","password":"wrong-password"}`)))
	request.RemoteAddr = "192.0.2.1:6000"
	response := httptest.NewRecorder()
	server.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusTooManyRequests {
		t.Fatalf("rate limit bypassed: %d", response.Code)
	}
}

func TestAdminSessionAndPublication(t *testing.T) {
	_, server := testServer(t)
	handler := server.Handler()
	loginBody := []byte(`{"username":"admin","password":"secure-password-for-tests"}`)
	login := httptest.NewRecorder()
	handler.ServeHTTP(login, httptest.NewRequest(http.MethodPost, "/api/v1/admin/auth/login", bytes.NewReader(loginBody)))
	if login.Code != http.StatusOK {
		t.Fatalf("login status: %d %s", login.Code, login.Body.String())
	}
	var session struct {
		CSRFToken string `json:"csrfToken"`
	}
	if err := json.Unmarshal(login.Body.Bytes(), &session); err != nil {
		t.Fatal(err)
	}
	cookies := login.Result().Cookies()
	if len(cookies) != 1 || !cookies[0].HttpOnly {
		t.Fatal("missing secure session cookie")
	}
	project := Project{Slug: "sample", RouteSlug: "sample-project", Title: "Sample", Client: "Test client", Status: "draft", Industry: "services", Disciplines: []string{"identity"}, GridCoverPosition: "top", Priority: 999, Tags: []string{"identity", "print"}, Details: ProjectDetails{Challenge: "Before", Solution: "After"}}
	body, _ := json.Marshal(project)
	withoutCSRF := httptest.NewRequest(http.MethodPost, "/api/v1/admin/projects", bytes.NewReader(body))
	withoutCSRF.AddCookie(cookies[0])
	blocked := httptest.NewRecorder()
	handler.ServeHTTP(blocked, withoutCSRF)
	if blocked.Code != http.StatusForbidden {
		t.Fatalf("CSRF not enforced: %d", blocked.Code)
	}
	refresh := httptest.NewRequest(http.MethodGet, "/api/v1/admin/auth/session", nil)
	refresh.AddCookie(cookies[0])
	refreshed := httptest.NewRecorder()
	handler.ServeHTTP(refreshed, refresh)
	if refreshed.Code != http.StatusOK || !bytes.Contains(refreshed.Body.Bytes(), []byte(session.CSRFToken)) {
		t.Fatalf("session changed CSRF token: %d %s", refreshed.Code, refreshed.Body.String())
	}
	create := httptest.NewRequest(http.MethodPost, "/api/v1/admin/projects", bytes.NewReader(body))
	create.AddCookie(cookies[0])
	create.Header.Set("X-CSRF-Token", session.CSRFToken)
	created := httptest.NewRecorder()
	handler.ServeHTTP(created, create)
	if created.Code != http.StatusCreated {
		t.Fatalf("create failed: %d %s", created.Code, created.Body.String())
	}
	if !bytes.Contains(created.Body.Bytes(), []byte(`"gridCoverPosition":"center"`)) || !bytes.Contains(created.Body.Bytes(), []byte(`"priority":1`)) {
		t.Fatalf("defaults not applied: %s", created.Body.String())
	}
	public := httptest.NewRecorder()
	handler.ServeHTTP(public, httptest.NewRequest(http.MethodGet, "/api/v1/projects", nil))
	if public.Code != http.StatusOK || public.Body.String() != "[]\n" {
		t.Fatalf("draft leaked: %s", public.Body.String())
	}
	project.Status = "published"
	project.ID = 1
	body, _ = json.Marshal(project)
	update := httptest.NewRequest(http.MethodPut, "/api/v1/admin/projects/1", bytes.NewReader(body))
	update.AddCookie(cookies[0])
	update.Header.Set("X-CSRF-Token", session.CSRFToken)
	updated := httptest.NewRecorder()
	handler.ServeHTTP(updated, update)
	if updated.Code != http.StatusOK {
		t.Fatalf("publish failed: %d %s", updated.Code, updated.Body.String())
	}
	if !bytes.Contains(updated.Body.Bytes(), []byte(`"priority":1`)) {
		t.Fatalf("priority changed on update: %s", updated.Body.String())
	}
	public = httptest.NewRecorder()
	handler.ServeHTTP(public, httptest.NewRequest(http.MethodGet, "/api/v1/projects", nil))
	if !bytes.Contains(public.Body.Bytes(), []byte(`"routeSlug":"sample-project"`)) {
		t.Fatalf("published project missing: %s", public.Body.String())
	}
}
