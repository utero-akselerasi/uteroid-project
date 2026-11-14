# Utero.id — Admin Controls the Whole Website

Branch: main. Date: 2026-11-14. No secrets in this file.

## Environments (binding)
- Production runs only on the mentor's machine: live SQLite data, SeaweedFS objects, containers, env values and secrets. We have no access and must never try to connect to it.
- This PC runs only a throwaway local stack from docker-compose. Its database/storage are disposable test data and do NOT describe production.
- Anything that changes the server (missing-work import, media migration, env/volume changes) must be delivered as:
  - a one-time command/script with a non-developer checklist, or
  - a button the owner can press in the live /admin after the final deploy.
- Server data rules: add only what is missing; never overwrite or delete existing admin edits; every import/migration must be idempotent (safe to run twice).
- Verification below is split into local-only and server-only. Never use local counts as production facts.

## Goal
One final deploy so /admin is the only control surface: every work, media, deck, site image, EN/ID text, services copy and page SEO. Work media and site media live in SeaweedFS through the Go API. All metadata/content lives in the SQLite admin DB. Production must not depend on lib/projects.ts, data/projects.json or baked public/ files for editable content.

## Decisions (approved)
1. Text: ALL EN/ID strings, services copy, SEO titles/descriptions. ONE generic override mechanism; editor auto-lists keys grouped by page, searchable, reset-to-default.
2. Insights: keep external CMS. Document connection/env only.
3. Decks: per-deck watermark toggle, default ON, never on page 1, real logo public/img/watermark.png; server sharp stamps; browser uploads raw pages.
4. Homepage: per-work "show on homepage" flag replaces HOMEPAGE_EXCLUDED_SLUGS. Later: random rotation (default) or 4 fixed works.
5. Video: URL-only (YouTube/Vimeo) with saved aspect ratio. MP4 upload only if time remains.
6. Security: no TOTP/IP allowlist. M5: gate /admin, close unauthenticated writes, show save errors, CSRF. Never print/commit passwords.

## Architecture target
- Go + SQLite = single source of truth for projects, media metadata, settings, content overrides.
- SeaweedFS = single storage for work/site media; public URLs through Go media endpoint (/portfolio-api/media/...).
- Next.js editable pages render dynamically (or tag-revalidated) from the API. lib/projects.ts is only an import seed.
- Generic content store content_overrides(scope, key, locale, value_json, updated_at); scopes: translations, services, seo, page-copy. Code defaults, DB overrides.
- Media API: authenticated Go endpoints with replace, reorder, delete, alt text. Deck upload raw images/PDF pages; Next proxy forwards; sharp converts + optional logo watermark.
- Homepage: project.homepage_visible; selection excludes false. Later settings switch (random | fixed 4).
- Security: middleware gate /admin; all writes through session + CSRF; admin sees real save errors.

## Persistence and silent-failure facts (local inspection; server must be confirmed)
Persistent Docker volumes (expected):
- portfolio-db:/data — SQLite /data/utero.db.
- portfolio-objects:/data — SeaweedFS objects.

Not persistent / not source of truth:
- Web container filesystem: data/site-settings.json is written there today. Dockerfile does not copy data/ into the runner; /app is not owned by nextjs, so writes can fail or vanish on redeploy. Not a volume.
- Web public/uploads (offline fallback) is container-local and ephemeral.
- Host ./public is bind-mounted read-only as /legacy-public for media migration only; not admin storage.
- .next cache/logs are disposable.

Missing S3 env in the web container:
- docker-compose passes S3_* only to portfolio-api and object-storage; web gets none of S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_ENDPOINT.
- app/api/admin/upload-banner/route.ts therefore fails with "S3 storage belum dikonfigurasi" in production. If given env it still builds an internal object-storage URL browsers cannot reach. Move site-image upload behind an authenticated Go endpoint and return /portfolio-api/media/... URLs.

Silent settings-save chain:
- POST /api/site-settings writes data/site-settings.json first (errors only logged).
- Then calls the Go admin settings endpoint and ignores HTTP status/network errors.
- Always returns 200 with merged object, so admin shows "saved" even when nothing persisted.
- GET merges only banners/serviceImages from the backend, otherwise falls back to local/default values.
- Fix: Go is the write path; require session+CSRF; return backend status; stop local production writes.

## Local test findings (throwaway only — not production evidence)
- Toolchain present: Docker 29.9.2 (Desktop started), Go 1.27.3, Node 22, npm 10.
- Local stack: web :3020, api :8080 healthy, SeaweedFS :8333 healthy.
- Local DB before M1 testing: 37 projects, 0 video aspect ratios, all grid positions center. This was local residue, not the server.
- Local import test: seed has 53 works; 19 local rows missing; import added 19 => 56. No duplicates.
- Newly imported seed preserved 10 aspect ratios (the other 2 seed Shorts already existed locally with stale non-short video IDs). Server state is unknown.
- homepageVisible present on public/admin responses; default true.
- Docker build + Next production build pass; Go tests pass; npm typecheck passes; local /admin returns 200.

## M1 delivered in code
Backend:
- ProjectVideo.aspectRatio accepted by JSON (DisallowUnknownFields no longer rejects it).
- projects.homepage_visible column (default 1) + safe ALTER for existing DB; homepageVisible in admin/public JSON.
- SaveProject: no longer forces gridCoverPosition="center"; submitted value persists.
- Priority is editable/persisted; new project with priority<=0 still auto-appends.
- One-time, add-only migration `backfill_video_aspect_ratios_v1`: fills empty aspectRatio only when src contains /shorts/; marked in schema_migrations; never overwrites non-empty values; safe to rerun.
- Import endpoint still skips existing slug/route_slug rows (safe twice; existing data untouched).

Admin:
- Button always visible: "Import missing works (N)" where N = seed works not in DB by slug/routeSlug; disabled at 0; imports only missing.
- Video aspect-ratio field; auto-fills 9 / 16 when a /shorts/ URL is entered and aspect is empty.
- Editable priority; show-on-homepage toggle (default on); free-text grid cover position.
- Homepage pool uses homepageVisible instead of HOMEPAGE_EXCLUDED_SLUGS.

Still to deliver for server (buttons/scripts, not local edits):
- Live import: press the button after deploy (one action; idempotent).
- Legacy media migration: authenticated Go/bulk tool + checklist (M2).
- Any env/volume change: mentor applies from the corrections list; we do not edit secrets.
- Existing pre-M1 Shorts without aspect: import does not modify them. In live admin, open the work, confirm its video URL, save with 9 / 16 (or use a later safe bulk-repair button).

## Milestones
M1 (done in code, local test): above.
M2: authenticated Go site-media endpoint; work-media replace; per-media alt; atomic cleanup; deck per-deck watermark toggle (default on, never page 1), logo watermark; browser PDF page rendering; whole-deck replace.
M3: all settings fields (hero images, statement CTA, Behance, custom font, insights display); homepage manager (flags/order, later random/fixed-4); services/contacts/SEO editors.
M4: content_overrides table/API/provider merge (DB > code defaults > EN/ID); auto key list grouped/search/reset; SEO/JSON-LD from DB; dynamic rendering for editable pages.
M5: /admin middleware gate; remove unauthenticated writes; CSRF; surface save errors; backup/export; audit.
M6: live verification of all fields, decks, 12 Shorts, copy, flags, SEO; restore drill; e2e coverage.

## Compose/env corrections (mentor applies; no secrets here)
- Confirm PORTFOLIO_API_URL points at the internal API (compose default is empty).
- Remove/rotate the literal fallback admin password in compose; keep credentials in env only.
- Keep portfolio-db and portfolio-objects volumes; back them up before deploy.
- Web needs no S3_* if all uploads go through Go. If a direct upload remains, add S3_ENDPOINT/S3_BUCKET/S3_ACCESS_KEY/S3_SECRET_KEY to web AND use a browser-reachable media URL; otherwise remove that path.
- FRONTEND_ORIGIN must equal the public origin; COOKIE_SECURE=true on HTTPS.
- Verify data/site-settings.json is not required in production after the settings fix.

## Verification: LOCAL ONLY (done)
- go test ./... passes (aspect, homepage flag, priority, grid preserved).
- npm run typecheck passes.
- Docker build of api + web passes; web /admin 200.
- Local import of missing seed works works twice safely; count N decreases to 0; no duplicates.
- Public/admin JSON includes homepageVisible and aspectRatio.

## Verification: SERVER ONLY (post-deploy smoke test; live admin)
Do this after the mentor deploys. Record values before acting.

1. Backup first (mentor/ops): snapshot/export portfolio-db and portfolio-objects. Stop writes during backup if possible.
2. Open /admin -> Work.
   - Expect total and the new button "Import missing works (N)".
   - Expected N = seed works absent on the server. Do NOT assume 19.
3. Click the button; confirm.
   - Expect "X proyek berhasil diimpor", total increases by X, and every seed title appears once.
   - Expected after import: button shows (0) and is disabled. No existing work title disappears.
4. Click the button again (or reload and confirm disabled). Expect no new duplicates.
5. Open one newly imported work.
   - Expect video aspect ratio saved if it was a Short; grid cover position shows its seed value; show-on-homepage is checked.
6. Toggle "Tampilkan di homepage" off, set a distinctive priority and grid value, save, reload.
   - Expected: values persist after reload; that work disappears from the homepage rotation; /work still lists it.
   - Toggle back on when finished.
7. Check known Shorts. Expected: portrait frames (9 / 16). If an older Short is still landscape, open it, confirm its video URL, set aspect 9 / 16, save.
8. Open a live work page and /work. Expected: no duplicate cards, no missing works, ordering honors priority.
9. Media spot-check: open one work with deck/images. Expected: media loads through /portfolio-api/media (no broken object-storage host URLs).

Rollback:
- Preferred: restore the pre-deploy portfolio-db volume snapshot (and portfolio-objects if media changed). This returns all admin data to the exact prior state.
- If no snapshot: in /admin Work, delete only the works that were newly imported in step 3 (record their titles/slugs before import). Do not delete pre-existing works. Revert any flag/priority/grid edits made during the smoke test. Import is add-only, so no existing rows need reconstruction.
- After rollback, reload /admin and /work; confirm counts and titles match the recorded pre-deploy values.

## Deliverables
- plan.md (this file).
- work-fields.csv, non-editable-strings.csv (audit).
- server-runbook.md (non-developer deploy/import/check/rollback checklist).
- progress.md (execution log).
- Code on main, small local commits, no push.

## Non-goals
- Insights CMS migration; TOTP/IP allowlist; MP4 upload (optional); redesign.
