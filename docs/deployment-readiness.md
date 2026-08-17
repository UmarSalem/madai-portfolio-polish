# Deployment Readiness

Madai is not ready for public deployment yet. The frontend is closer to a public demo than the backend, but both require safety and configuration cleanup.

## Frontend Readiness

Current status: configuration-ready for a later static preview deployment. An
actual public deployment and backend connection still need verification.

Completed preparation:

- Fake/demo-only data.
- Frontend API base URL reads `REACT_APP_API_BASE_URL`.
- `vercel.json` provides a Vercel SPA rewrite for `BrowserRouter` routes.
- `public/_redirects` provides a Netlify/Cloudflare Pages SPA fallback.
- `.env.example` contains local and deployed placeholder examples only.
- Health-related symptom and report screens retain educational demo warnings.
- Public HTML and manifest metadata identify the application as Madai.

Still needed before public release:

- Keep the frontend production build passing in CI.
- Resolve the frontend Jest discovery issue before adding tests as a required
  deployment gate. Needs verification.
- Configure a safe deployed `REACT_APP_API_BASE_URL` or clearly present the site
  as frontend-only while the backend is unavailable.
- Verify backend CORS and HTTPS before connecting a public frontend.
- Perform a final secret/private-data scan and browser network inspection.
- Confirm deep-link refresh behavior in a preview deployment.

Recommended target: Vercel. It is the simplest match for the current Create
React App project and `BrowserRouter` setup. Netlify and Cloudflare Pages remain
good alternatives. See [Frontend Static Deployment](frontend-deployment.md).

Latest local validation:

- Production build passed with `CI=true` using Node `v24.19.0`.
- The generated build contains `index.html`, static assets, and `_redirects`.
- Frontend tests did not run because Jest reported no tests found even when an
  existing test file was passed explicitly. The Create React App 5/Jest 27 and
  Node 24 combination needs verification in a focused testing task.

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

GitHub Pages can host a static frontend demo. Because the app uses browser
routing and is served from a repository subpath, it needs a tested 404 fallback,
base-path setup, or a deliberate switch to hash routing.

GitHub Pages should not be used for backend hosting.

## Vercel/Netlify/Cloudflare Pages Notes

Vercel is the recommended first target. Netlify and Cloudflare Pages are also
good candidates. The repository now includes provider-compatible SPA fallbacks.
They need:

- Build command such as `npm run build`.
- Publish directory such as `build`.
- SPA rewrite/fallback rules, now provided by `vercel.json` and
  `public/_redirects`.
- `REACT_APP_API_BASE_URL` configured without secrets or real patient data.

## Render Backend Notes

Render can host an ASP.NET Core backend, but the current backend is not ready. Before using Render:

- Move all secrets to environment variables.
- Configure CORS.
- Remove committed SQLite/upload artifacts.
- Decide whether SQLite is acceptable for the demo or switch to a managed database later.
- Review Dockerfile because it currently uses Windows Nano Server images. A Linux-friendly setup is usually easier on common hosting platforms.

## Report Upload Status

Current status: safer for local demo testing, but still not ready for unrestricted public uploads.

The report upload/history slice now uses multipart form-data, PDF/size validation, safe DTO responses, and metadata-only storage for new demo uploads. Uploaded PDFs are not written to `uploads/`, file bytes are not stored for new demo uploads, and downloads are disabled for the safe portfolio demo.

Before public deployment, decide whether to:

- Disable report uploads entirely and show a static fictional demo.
- Keep metadata-only demo uploads for authenticated fictional users.
- Add a full production-grade privacy, retention, deletion, and consent model before allowing any real files.

## CI Status

Current status: build validation and static-hosting configuration are present.

The repository now includes GitHub Actions workflows for pull requests and pushes to `develop` and `main`:

- Frontend CI builds the React app from `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main`.
- Backend CI restores and builds the ASP.NET Core solution from `MAD-AI_BackEnd-develop`.

These workflows are CI checks only. They do not deploy the frontend, deploy the
backend, publish Docker images, or require production secrets. No automatic or
manual deployment workflow has been added yet.

Frontend tests and backend tests are not required checks yet. The next step is to review and stabilize tests feature by feature before making them block pull requests.

## Required Work Before Deployment

- Environment configuration.
- CORS.
- Remove secrets.
- Remove DB/upload files.
- Fake seed data.
- API contract cleanup.
- Deployment workflows after CI is stable.

## Suggested Deployment Order

1. Frontend static demo with fake data.
2. Backend after safety cleanup.
3. Full end-to-end demo later.
