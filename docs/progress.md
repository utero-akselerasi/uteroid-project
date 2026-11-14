# Progress log

## 2026-11-14
- Toolchain: Docker 29.9.2 (Docker Desktop started), Go 1.27.3.
- Local stack: web :3020 up, portfolio-api :8080 healthy, SeaweedFS :8333 healthy.
- Docker volumes verified: portfolio-db:/data (SQLite), portfolio-objects:/data (SeaweedFS).
- Admin DB inspection (read-only, credentials used in memory, never printed):
  - DB projects: 37.
  - Missing vs seed: 19 (aqua-1, kavora, kopiko, mountea, narava, pocari-sweat, ronava, sareva, sariwangi, soreva, silverqueen, teh-gelas, tumbuhara, vitara, wardah, biskuat, kapal-api, sedral, tolakangin).
  - video.aspectRatio in DB: 0.
  - gridCoverPosition center: 37/37 (Go forces).
- Wrote D:\Temp\opencode\admin-plan\plan.md.
- Wrote D:\Temp\opencode\admin-plan\work-fields.csv.
- Wrote D:\Temp\opencode\admin-plan\non-editable-strings.csv.
- Decisions recorded: full EN/ID overrides via one generic mechanism; Insights CMS untouched; deck logo watermark toggle default on never page 1; homepage flag then mode switch; URL-only video with aspect; M5 security without TOTP/IP.
- Next: M1 backend + admin changes, compose/env notes, tests, local commit (no push).

## 2026-11-14 — M2 through M6 execution log

- M2 `5779f4c`: Go site-media endpoint (SeaweedFS), media replace/reorder/delete/alt, deck watermark (logo, never page 1, per-deck toggle default ON), whole-deck replace, browser PDF→pages.
- M3 `770fab4`: homepage.mode + campaign section in site settings; TransitionCampaignSpotlight renders DB config EN/ID; admin "Kampanye & Homepage" tab with uploads via Go media endpoint.
- M4 `1a6c4b2`: content_overrides table + public GET / admin PUT/DELETE; translations/services/seo merge; admin "Konten (EN/ID)" editor with search/reset.
- M5 `433f968`: proxy.ts /admin gate + /admin/login; settings writes go to Go with real status; offline admin fallback fails closed in production; export + audit endpoints and admin buttons.
- M6: docs/server-runbook.md final deploy runbook (pull → ./public check → build → owner clicks → /portfolio-api/media check → /legacy-public removal → restore drill).
- Local verification: go test ./... PASS, npm run typecheck PASS. Server verification pending owner clicks (runbook sections C–F).
