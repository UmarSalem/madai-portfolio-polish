# Frontend Static Deployment

This guide prepares the Madai React frontend for a later static deployment. It
does not deploy the application.

Madai is an educational portfolio demo. It is not medical advice and must use
fake/demo data only. Never enter real patient data, private health information,
medical reports, credentials, or secrets.

## Recommended Target

Vercel is the easiest current target because the frontend uses `BrowserRouter`
and Vercel supports an SPA rewrite through `vercel.json`. Netlify and Cloudflare
Pages are also suitable; `public/_redirects` is copied into the Create React App
build for their SPA fallback support.

GitHub Pages is not the first recommendation. It does not provide the same
native SPA fallback behavior, and this app would need a 404 fallback workaround,
a repository base-path configuration, or a deliberate switch to `HashRouter`.
Those changes are not included in this task.

## Local Build

From the repository root:

```powershell
cd MAD-AI_FrontEnd\MAD-AI_FrontEnd-main
npm ci
npm run build
```

The static output is written to `build/`. The output is generated and must not
be committed.

## Environment Configuration

Create React App reads the API URL at build time:

```text
REACT_APP_API_BASE_URL=https://your-madai-api.example.com
```

For local development, copy `.env.example` to `.env` and keep the localhost
value. Do not commit `.env`.

`REACT_APP_*` values are included in the browser bundle and are public. The API
base URL is acceptable there, but API keys, JWT signing keys, passwords, tokens,
and other secrets are not.

If the backend is not publicly deployed, authenticated and API-backed features
will not work from the hosted frontend. This is expected until a safe backend
deployment exists.

## Vercel Setup

Use these project settings when importing the repository:

- Root Directory: `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main`
- Framework Preset: Create React App
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `build`
- Environment Variable: `REACT_APP_API_BASE_URL`

`vercel.json` rewrites browser routes such as `/profile` to `index.html`, where
React Router can resolve the route. Configure the API URL separately for Preview
and Production environments. Do not place deployment tokens or secrets in Git.

No Vercel CLI or GitHub Actions deployment is configured yet. A later deployment
task should connect the project only after the target backend URL and CORS policy
have been reviewed.

## Netlify Setup

Use these settings:

- Base directory: `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main`
- Build command: `npm run build`
- Publish directory: `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/build` when the base
  directory is not set, or `build` when it is set
- Environment variable: `REACT_APP_API_BASE_URL`

`public/_redirects` provides the SPA fallback in the generated build.

## Cloudflare Pages Setup

Use these settings:

- Root directory: `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main`
- Build command: `npm run build`
- Build output directory: `build`
- Environment variable: `REACT_APP_API_BASE_URL`

The generated `_redirects` file provides the client-side routing fallback.
Compatibility with the selected Cloudflare Pages configuration needs
verification during the actual deployment task.

## GitHub Pages Notes

The current `BrowserRouter` routes and repository subpath make GitHub Pages less
convenient. Do not publish the current build there until deep-link refreshes and
asset paths have a tested solution. GitHub Pages can be reconsidered if a later
task intentionally adopts `HashRouter` or a documented 404 fallback.

## Post-Deployment Checks

After a later preview deployment:

1. Open the home page and confirm static assets load without 404 errors.
2. Open a nested route directly and refresh it to verify the SPA fallback.
3. Confirm the symptom checker and report upload safety warnings are visible.
4. Confirm unauthenticated protected routes redirect to login.
5. Check the browser console and network panel for failed API or mixed-content
   requests.
6. If a backend is connected, verify its CORS allowlist contains only the exact
   preview/production frontend origins that are intended.
7. Confirm no real patient data, uploaded reports, credentials, or secret values
   are present in the page source, JavaScript bundle, or network requests.

## Known Limitations

- The backend is not prepared or deployed by this task.
- API-backed features require a reachable backend with compatible HTTPS and CORS
  configuration.
- Public users must be prevented from submitting real health information. Needs
  verification before public release.
- The production build passes with `CI=true`. Frontend Jest discovery under the
  current Create React App 5/Jest 27 and Node 24 toolchain needs verification
  before tests become a deployment gate.
- A custom domain, analytics, monitoring, and automated rollback are not
  configured.
