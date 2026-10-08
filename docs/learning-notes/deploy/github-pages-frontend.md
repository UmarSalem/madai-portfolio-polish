# Madai — GitHub Pages frontend preparation

Date: 2026-10-08
Repository: UmarSalem/madai-portfolio-polish
Task branch: deploy/github-pages-frontend
Base: origin/develop, 554d1d395a03728e4af084a3496c346a645b5e77
Status: prepared and locally verified; not committed, pushed, merged or deployed.

## Starting evidence and preservation

PR #19 is merged (2026-10-08), and its frontend and backend checks completed
successfully. That is existing GitHub evidence, separate from today's local
validation. No applicable AGENTS.md was found in the checkout or parent paths.
The task uses C:/Users/admin/source/repos/.Net_Project/MAD-AI-pages, an isolated
worktree created from freshly fetched origin/develop.

The original MAD-AI checkout remains on codex/github-push-test. Its uncommitted
progress audit is preserved; its Git blob hash is
8d632f3c50d435c642e6b042f2dabbe869a17cc7. No backend files, dependency versions,
package.json or lockfile were changed.

## What changed and why

- .github/workflows/frontend-ci.yml: reuse frontend validation, build for the
  Pages subpath, test before artifact upload, and deploy only successful develop
  push/manual runs. Feature branch pushes and PRs validate without publishing.
  Build uses contents: read; deployment alone uses pages: write/id-token: write,
  the github-pages environment and non-cancelling deployment concurrency.
- src/routes/ReactRoute.jsx: select HashRouter when REACT_APP_ROUTER_MODE=hash;
  retain BrowserRouter for ordinary local development. GitHub Pages cannot run
  ASP.NET or use the existing Vercel/Netlify rewrite files.
- src/constant/index.js and src/api/httpClient.js: retain the existing public
  API environment setting, limit localhost fallback to non-production, and guard
  requests when the production API is unconfigured. Add publicAsset for local
  public images. Never embed private credentials in REACT_APP_* values.
- src/home/Home.jsx, src/components/layout/Navbar.js, src/login/Login.jsx,
  src/blog-detail/BlogDetail.jsx and src/components/dataCards/DataCards.jsx:
  prefix public images with PUBLIC_URL. Home/blog requests are guarded; blog
  details show an error instead of indefinite loading. Login distinguishes an
  unavailable backend from credential rejection.
- src/recommendation/Recommendation.jsx: guard the legacy fetch when no API is
  configured. Its existing test mock retains the real configuration helpers;
  all original assertions remain.
- src/about/About.jsx, src/bookappointment/AppointmentCards.jsx,
  src/diagnory/DiagnorySummary.jsx, src/contact/Contact.jsx and
  src/files-upload/UploadFile.jsx: replace active root anchors with router Links
  so navigation stays inside the repository site. The About CTA now targets the
  actual /doctor route instead of the nonexistent /ai-doctor route.
- src/App.js: visible bachelor group project/portfolio disclaimer, incomplete
  AI/report-chat status, fictional-data warning and disconnected backend notice.
- src/about/About.jsx, src/home/Home.jsx, src/components/card/Card.jsx and
  src/components/cards/Cards.jsx: remove misleading instant-diagnosis claims,
  identify illustrative metrics as fictional, and mark appointment booking as
  unavailable. This does not implement new features.
- README.md and docs/frontend-deployment.md: replace obsolete deployment guidance
  with Pages routing, publishing review steps, API/CORS settings and recovery.
- This learning note records the evidence, validation and limitations.

## How publication works

Push develop → npm ci → lint-enabled production build → frontend tests → upload
only build/ with upload-pages-artifact@v4 → dependent deployment with
configure-pages@v5/deploy-pages@v4. Failed validation prevents the artifact and
deployment. A manual workflow run also publishes only when develop is selected.
Publishing settings have not been enabled by this task.

The workflow sets PUBLIC_URL=/madai-portfolio-polish and
REACT_APP_ROUTER_MODE=hash. A Pages URL such as
https://umarsalem.github.io/madai-portfolio-polish/#/profile requests only the
static root from GitHub; React resolves /profile after #. Refresh works without
a server rewrite. Bare /madai-portfolio-polish/profile is not a supported link.
Existing protected pages continue requiring login.

## Validation performed locally

Node v24.19.0, npm 10.9.4. npm is not on this host's PATH, so the existing
npm CLI was invoked with:

```powershell
node (Join-Path $env:TEMP 'madai-npm-10.9.4/package/bin/npm-cli.js') ci
$env:CI='true'
$env:PUBLIC_URL='/madai-portfolio-polish'
$env:REACT_APP_ROUTER_MODE='hash'
Remove-Item Env:REACT_APP_API_BASE_URL -ErrorAction SilentlyContinue
node (Join-Path $env:TEMP 'madai-npm-10.9.4/package/bin/npm-cli.js') run build
node (Join-Path $env:TEMP 'madai-npm-10.9.4/package/bin/npm-cli.js') test -- --watchAll=false --runInBand
git -c safe.directory=C:/Users/admin/source/repos/.Net_Project/MAD-AI-pages diff --check
```

Results:
- npm ci: exit 0; added 1,434 packages and audited 1,435.
- Final production build: exit 0, compiled successfully, lint enabled;
  build explicitly targets /madai-portfolio-polish/. JS gzip 103.59 kB; CSS 6.6 kB.
- Final tests: exit 0; 7 suites and 10 tests passed, none failed or skipped.
- git diff --check: passed. YAML parsed successfully; deployment requires build,
  is develop-only and has the scoped Pages/OIDC permissions.
- Generated index.html asset paths use the subpath. Production JavaScript
  contains no localhost:5122 fallback.

An initial build caught an unused import added to a commented-out link; the
unnecessary file change was removed. Initial tests were 6 suites/8 tests passing
and 1 suite/2 tests failing because Recommendation's full configuration mock
hid the new guard. The mock now preserves actual helpers; assertions were not
weakened. The final complete build/test run above passed after all source edits.
Browserslist data-age and Node deprecation notices remain; no dependency upgrade
was attempted. npm reports 106 unresolved vulnerabilities: 6 low, 15 moderate,
81 high and 4 critical.

## Production browser preview

A temporary Node static server mounted build/ at
http://127.0.0.1:4173/madai-portfolio-polish/ with ordinary 404 behaviour and no
SPA fallback. A temporary Playwright script used installed headless Edge.
These temporary tools are not repository changes.

Verified on the final production output:
- Home, CSS/JS and all three home images load under the subpath.
- Home → Login and About → Explore the Demo navigate using hash links.
- Direct entry and refresh work for /login, /profile, /symptomChecker,
  /doctorSearch, /admin/medicalHistory (upload), and /doctor (upload alias).
- Unauthenticated protected routes redirect to login on entry and refresh.
- A fictional, locally injected session exercised protected UI entry/refresh;
  it is not evidence of real login or a working backend.
- Submitting fictional login fields shows a backend-unavailable message.
- Disconnected mode sent zero API requests, had zero local asset failures and
  zero uncaught JavaScript errors. A bare /profile request returns 404 as expected.
- The portfolio/backend notice is visible. Screenshot reviewed locally.

External CDN/font requests were blocked in the main scripted routing preview to
isolate local assets. A subsequent read-only browser check outside the network-
restricted sandbox loaded the existing font/icon/Tailwind CDN resources with
zero request failures; the responsive desktop grid was applied and its screenshot
reviewed. No real health data, model request, database write or deployment was used.

## Required configuration and limitations

Umar confirmed no backend is deployed. There is no actual HTTPS backend URL to
health-check or use. Live API request targeting and hosted CORS remain unverified.
Leave the repository Actions variable REACT_APP_API_BASE_URL unset for the
explicitly disconnected frontend. Once an approved backend exists, set that
variable to its real public HTTPS origin and rebuild. It is public configuration,
not a place for keys or passwords.

Backend Program.cs already supports an environment-based CORS allowlist. Add
Cors__AllowedOrigins__0=https://umarsalem.github.io (or the next unused index)
on the backend host. Do not include the repository subpath or trailing slash.
No hosted backend or backend file was changed.

Fresh repository metadata reports has_pages=false and homepage=null; no CNAME
exists. The connector rejects the detailed Pages settings endpoint, so custom
settings/domain inspection requires Settings → Pages. After authorization,
select GitHub Actions as Source, check Custom domain, and restrict github-pages
environment deployment branches to develop. These settings are untouched.

Expected public URL: https://umarsalem.github.io/madai-portfolio-polish/
It is not a verified live CV URL yet. This branch has no new GitHub CI run because
it has not been pushed. Main AI guidance, report analysis and follow-up chat
remain incomplete. Legacy blog/recommendation endpoints need later API alignment.
There is no static demo login and no verified real-provider integration.

To pause publishing, disable the frontend workflow (also pauses its validation);
the existing site remains public. Unpublish via Pages settings if removal is
wanted. Restore earlier code via a reviewed revert PR into develop, allowing
normal validation and deployment; do not force-push. Redeploy current develop
with workflow_dispatch selecting develop. See the deployment guide for details.

## Draft PR description

Problem:
Madai needs a public frontend URL for portfolio and CV review.

Changes:
Reuse frontend CI for gated GitHub Pages deployment from develop. Configure the
repository asset subpath and hash routing, correct internal links, prevent
production localhost fallback, and show honest portfolio/incomplete/backend
status. Update deployment guidance and learning notes; retain React/.NET.

Validation:
Clean npm ci passed. CI=true npm run build passed with lint enabled.
CI=true npm test -- --watchAll=false --runInBand passed: 7 suites, 10 tests.
git diff --check and workflow YAML parsing passed. Final production preview
verified local assets, navigation, protected redirects and hash-route entry/
refresh for login, profile, symptom checker, doctor search and upload. Disconnected
login error handling passed; zero API requests and uncaught JS errors.

Limitations:
No backend is deployed, so HTTPS backend requests, real login/API features and
hosted CORS are unverified. AI/report-chat features remain incomplete.
106 dependency vulnerabilities remain unresolved. New GitHub CI and live Pages verification are pending. Pages settings remain
untouched; publishing requires review and authorization.

Suggested commit: deploy: add automated GitHub Pages frontend hosting

## Publishing authorization and settings inspection

On 2026-10-08 Umar explicitly authorized committing, pushing, creating the PR,
merging after passing checks, configuring Pages as needed and deploying. An
authenticated settings inspection confirmed build_type=workflow, no custom domain,
HTTPS enforced and no REACT_APP_API_BASE_URL variable. Earlier connector-only
settings limitations above describe the preparation stage. Live deployment
verification will be reported after publication.
