# Deployment Readiness

Madai is not ready for public deployment yet. The frontend is closer to a public demo than the backend, but both require safety and configuration cleanup.

## Frontend Readiness

Current status: not public-deployment safe yet.

Needs:

- Environment-based API base URL.
- Fake/demo-only data.
- Removal or replacement of private-looking data in `db.json`.
- SPA fallback configuration for the chosen host.
- API contract cleanup so screens call the intended backend or static demo data source.
- Medical disclaimer in health-related flows.

## Backend Readiness

Current status: not public-deployment safe yet.

Needs:

- Secrets moved to environment variables.
- Committed database and upload artifacts removed.
- CORS configured for the frontend domain.
- Safe fake seed/demo data.
- API contract alignment with frontend.
- Safer upload/report behavior.
- Clear production/development configuration split.
- Deployment-friendly Docker or native .NET hosting setup.

## GitHub Pages Notes

GitHub Pages can host a static frontend demo. Because the app uses browser routing, it needs a GitHub Pages SPA fallback approach or a switch to hash routing for that deployment target.

GitHub Pages should not be used for backend hosting.

## Vercel/Netlify/Cloudflare Pages Notes

These platforms are good candidates for the React frontend. They need:

- Build command such as `npm run build`.
- Publish directory such as `build`.
- SPA rewrite/fallback rules.
- `REACT_APP_API_BASE_URL` configured without secrets.

## Render Backend Notes

Render can host an ASP.NET Core backend, but the current backend is not ready. Before using Render:

- Move all secrets to environment variables.
- Configure CORS.
- Remove committed SQLite/upload artifacts.
- Decide whether SQLite is acceptable for the demo or switch to a managed database later.
- Review Dockerfile because it currently uses Windows Nano Server images. A Linux-friendly setup is usually easier on common hosting platforms.

## Required Work Before Deployment

- Environment configuration.
- CORS.
- Remove secrets.
- Remove DB/upload files.
- Fake seed data.
- API contract cleanup.
- CI/CD.

## Suggested Deployment Order

1. Frontend static demo with fake data.
2. Backend after safety cleanup.
3. Full end-to-end demo later.
