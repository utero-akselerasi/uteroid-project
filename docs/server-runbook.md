# Server Runbook — Final Deploy, Import, Smoke Test, Rollback

For the mentor/owner. Do not paste secrets into tickets or chat. Production is only on the mentor's machine.

## 0. Roles
- Mentor/ops: backup volumes, deploy, apply env/volume corrections.
- Owner (non-developer): press the admin import button, follow the smoke test, report results.
- Us: no production access. Never connect to the live server from this PC.

## 1. Before deploy (mentor, ~5 min)
1. Record current admin Work total and live /work count.
2. Back up both persistent volumes:
   - portfolio-db (SQLite)
   - portfolio-objects (SeaweedFS media)
3. Confirm the two volumes are still attached in docker-compose. Do not recreate them.
4. Apply env/volume corrections from plan.md. Keep existing values; do not rotate data volumes. Rotate the compose fallback admin password via env only.
5. Deploy the final image once.

Example backup (Linux server; run as the docker user):
```
docker volume ls
DBVOL=<portfolio-db volume name>
OBJVOL=<portfolio-objects volume name>
docker run --rm -v "$DBVOL":/data -v "$PWD":/backup alpine tar czf /backup/portfolio-db-$(date +%F-%H%M).tgz -C /data .
docker run --rm -v "$OBJVOL":/data -v "$PWD":/backup alpine tar czf /backup/portfolio-objects-$(date +%F-%H%M).tgz -C /data .
ls -lh /backup
```
If the server is Windows, use the equivalent PowerShell volume export or ask the mentor to snapshot the Docker volumes.

## 2. Import missing works (owner, live /admin)
Import is add-only: it skips works that already exist by slug/routeSlug, never overwrites admin edits, and is safe to run twice.

1. Open https://<live-site>/admin and log in.
2. Work tab.
3. Record the total and the button text: "Import missing works (N)". Do not assume N.
4. Press it and confirm.
5. Expect: success message "X proyek berhasil diimpor"; total increases by X; button then shows (0) and is disabled; no existing title disappears.
6. Reload. Press again if still enabled. Expect no duplicates.
7. Write down the imported count and the new total.

## 3. Post-deploy smoke test (owner, live admin)
Tick each item. "PASS" only if the expected result is visible after a page reload.

| # | Click | Expected |
|---|-------|----------|
| 1 | Work tab | Total matches pre-deploy total + imported X. Button "Import missing works (0)" disabled. |
| 2 | Open one newly imported work | Title/client/media present; show-on-homepage checked; seed grid value shown; Shorts show aspect 9 / 16. |
| 3 | Uncheck "Tampilkan di homepage", set a unique priority and grid value, Save, reload | Values persist. Work leaves homepage rotation; still visible on /work. Re-check it after the test. |
| 4 | Open a known Shorts work | Video is portrait (9 / 16). If an older Short is landscape: confirm its video URL, set aspect 9 / 16, Save. |
| 5 | Open /work and one work page | No duplicates; all expected works present; priority order correct; media loads (no broken object-storage URL). |
| 6 | Open a work with a deck/images | Thumbnails/deck load through /portfolio-api/media. Watermark rules unchanged (no watermark on page 1). |
| 7 | Reload /admin | No error banner; total unchanged; edits still present. |

Stop and report if: total drops, an existing work disappears, duplicates appear, media URLs break, or a save reports success but does not persist after reload.

## 4. Rollback
Preferred (exact pre-deploy state): restore the two backups. This replaces current server data; only do it with mentor approval.
```
docker compose down
docker run --rm -v "$DBVOL":/data -v "$PWD":/backup alpine sh -c "rm -rf /data/* && tar xzf /backup/<portfolio-db-file>.tgz -C /data"
docker run --rm -v "$OBJVOL":/data -v "$PWD":/backup alpine sh -c "rm -rf /data/* && tar xzf /backup/<portfolio-objects-file>.tgz -C /data"
docker compose up -d
```
Then open /admin and /work; confirm totals and titles match the pre-deploy record.

No-backup fallback (data-loss-free for existing works):
1. In /admin Work, delete only the works that were imported in this deploy (use the recorded titles/slugs). Do not delete pre-existing works.
2. Revert the flag/priority/grid edits made during the smoke test.
3. Reload /admin and /work; confirm counts match the pre-deploy record.
4. The import is add-only, so no pre-existing row needs reconstruction.

## 5. Known limitations to report, not fix blindly
- Import does not modify existing works. Pre-M1 Shorts without an aspect ratio must be saved once in admin (or repaired by a later safe bulk button).
- Do not use S3_* in the web container unless URLs are browser-reachable. Prefer the Go media endpoint.
- Settings save errors are currently silent in old builds; this is fixed in M5. Until then, verify Go settings persistence after each save.

---

# FINAL DEPLOY RUNBOOK (M2–M6) — non-developer edition

Production lives only on the mentor's machine. This PC never connects to it.
Everything below is done BY the mentor/owner on the server.

## A. Before building (mentor, ~2 min)

1. On the server, in the project folder:
   ```
   git pull origin main
   ```
2. Check the host media folder BEFORE building. It must contain the new works:
   ```
   ls public/projects | wc -l
   ```
   Expected: **54** folders (the 19 new works + transition-feed-campaign + existing).
   If the count is lower, `git pull` did not finish — stop and re-pull.
3. Back up both volumes (section 1 above) before deploying.

## B. Build & deploy (mentor)

```
docker compose build
docker compose up -d
```

First boot runs SQLite migrations automatically (new columns/tables only —
existing data is never rewritten). Expect ~30–60 s extra on first start.

## C. One-time actions in live /admin (owner)

Order matters; each step is safe to repeat.

1. **Login** at `/admin/login` (new gate; old bookmark `/admin` redirects here).
2. **Import missing works**: Work tab → "Import missing works (N)" → confirm.
   Expect success message, count rises by N, button ends at (0).
3. **Seed sync (M1b)**: Work tab → SeedSync panel → review per-field/media
   diffs, tick only what to apply, or use "fill empty fields only".
   Nothing overwrites existing edits unless explicitly ticked.
4. **Media migration to SeaweedFS**: for each work that still shows
   `/projects/...` static paths, open the work → media section →
   "Pindahkan media lama" (migrate-media). Progress shows per file
   ("X/Y file dipindahkan"). Estimate: ~1–3 s per image; a full portfolio
   takes roughly 10–30 min depending on file sizes. Safe to stop and resume —
   already-migrated files are skipped.
5. **Site media**: Banners/Studio/Campaign tabs → re-upload or confirm each
   image shows a `/portfolio-api/media/...` URL after migration.
6. **Campaign & Homepage tab**: verify the Studio Campaign section text
   (EN/ID) and the two videos + middle image; set homepage mode
   (random rotation default, or fixed top-4 by priority).
7. **Konten (EN/ID) tab**: optional — override any translation/service/SEO
   string; Reset returns to code defaults.
8. **Security tab**: download "Backup JSON" once after migration, and keep
   the file somewhere safe.

## D. Final verification (owner, after migration)

| Check | Expected |
|---|---|
| `/work` and homepage | All works visible, no duplicates, media loads |
| Any work page media/deck | URLs start with `/portfolio-api/media/` — no `object-storage:` or raw S3 hostnames, no broken images |
| Deck page 1 | NO watermark; pages 2+ show logo watermark (default ON) |
| Homepage campaign section | 3 posts render (2 videos + 1 image), EN/ID toggle works |
| `/admin` logged out | Redirects to `/admin/login`; API writes without session return 401/403 |
| Save any setting | Success message AND value persists after reload |

## E. Remove the legacy mount (mentor, only AFTER section D passes)

Once every editable image resolves through `/portfolio-api/media`:

1. In `docker-compose.yml`, delete the line mounting host media:
   `./public:/legacy-public:ro`  (under the `portfolio-api` service).
2. `docker compose up -d` to recreate the api container.
3. Re-run section D spot checks. If anything breaks, re-add the mount and
   report — do NOT delete `public/projects` on the host; it is the seed
   source for reinstalls.

## F. Restore drill (M6) — do once on the server

1. With volumes backed up, run the rollback commands in section 4.
2. `docker compose up -d`, open `/admin` → Work.
3. Confirm the work count and titles match the pre-restore record.
4. Restore the newer backup again if the drill was on live data.
   A failed drill = stop and report before the real deploy.

## G. What was verified locally vs server-only

Local (this PC, throwaway stack): `go test ./...`, `npm run typecheck`,
Docker builds, import/sync idempotency, media endpoint, deck watermark.
Server-only (owner clicks): everything in sections C–F. Local counts are
NOT production facts.
