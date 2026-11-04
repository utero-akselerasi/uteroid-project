# E2E Tests for Utero.id Admin Dashboard

## Running the Tests

1. Start Docker services:
   ```bash
   docker compose up
   ```
   The web app will be on http://localhost:3020

2. Configure credentials:
   ```bash
   cp .env.test.example .env.test
   ```
   Edit `.env.test` and fill in the admin login credentials.

3. Run tests:
   ```bash
   npm run test:e2e
   ```
   Or with UI: `npm run test:e2e:ui`
   Or view report: `npm run test:e2e:report`

## Test Status

- ✅ Login tests pass
- ⏳ Other test groups (project-list, create, edit, delete, media, settings, video) are unfinished - selectors need to be rewritten with getByRole/getByText (CSS module class names are hashed)

## Important Rules

- Tests must use only "ZZ TEST ..." projects
- Run only against local Docker (http://localhost:3020), never the live site
- All test projects are deleted at the end of each test
