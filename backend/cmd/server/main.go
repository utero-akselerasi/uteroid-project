package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"time"

	"uteroid/backend/internal/app"
)

func main() {
	cfg, err := loadConfig()
	if err != nil {
		slog.Error("configuration error", "error", err)
		os.Exit(1)
	}
	if err = os.MkdirAll(filepath.Dir(cfg.DatabasePath), 0700); err != nil {
		slog.Error("database directory error", "error", err)
		os.Exit(1)
	}
	store, err := app.OpenStore(cfg.DatabasePath)
	if err != nil {
		slog.Error("database error", "error", err)
		os.Exit(1)
	}
	defer store.DB.Close()
	var count int
	if err = store.DB.QueryRow(`SELECT COUNT(*) FROM admins`).Scan(&count); err != nil {
		slog.Error("admin lookup error", "error", err)
		os.Exit(1)
	}
	if count == 0 {
		hash, hashErr := app.HashBootstrapPassword(cfg.AdminPassword)
		if hashErr != nil {
			slog.Error("password error", "error", hashErr)
			os.Exit(1)
		}
		if err = store.EnsureAdmin(context.Background(), cfg.AdminUsername, hash); err != nil {
			slog.Error("admin bootstrap error", "error", err)
			os.Exit(1)
		}
	}
	storage, err := app.OpenObjectStorage(context.Background(), cfg)
	if err != nil {
		slog.Error("object storage error", "error", err)
		os.Exit(1)
	}
	server := &http.Server{Addr: cfg.Addr, Handler: app.NewServer(cfg, store, storage).Handler(), ReadHeaderTimeout: 10 * time.Second, ReadTimeout: 30 * time.Second, WriteTimeout: 60 * time.Second, IdleTimeout: 90 * time.Second, MaxHeaderBytes: 1 << 20}
	go func() {
		slog.Info("portfolio api started", "addr", cfg.Addr)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server failed", "error", err)
			os.Exit(1)
		}
	}()
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	_ = server.Shutdown(ctx)
}
func env(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}
func envBool(key string, fallback bool) bool {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	result, err := strconv.ParseBool(value)
	return err == nil && result
}
func loadConfig() (app.Config, error) {
	password := os.Getenv("ADMIN_PASSWORD")
	if len(password) < 16 {
		return app.Config{}, errors.New("ADMIN_PASSWORD must contain at least 16 characters")
	}
	access := os.Getenv("S3_ACCESS_KEY")
	secret := os.Getenv("S3_SECRET_KEY")
	if access == "" || secret == "" {
		return app.Config{}, errors.New("S3 credentials are required")
	}
	return app.Config{Addr: env("API_ADDR", ":8080"), DatabasePath: env("DATABASE_PATH", "/data/utero.db"), FrontendOrigin: strings.TrimRight(env("FRONTEND_ORIGIN", "http://localhost:3020"), "/"), CookieSecure: envBool("COOKIE_SECURE", false), AdminUsername: env("ADMIN_USERNAME", "admin"), AdminPassword: password, AdminTOTPSecret: os.Getenv("ADMIN_TOTP_SECRET"), S3Endpoint: env("S3_ENDPOINT", "object-storage:9000"), S3AccessKey: access, S3SecretKey: secret, S3Bucket: env("S3_BUCKET", "utero-media"), S3UseSSL: envBool("S3_USE_SSL", false), LegacyMediaRoot: env("LEGACY_MEDIA_ROOT", "/legacy-public")}, nil
}
