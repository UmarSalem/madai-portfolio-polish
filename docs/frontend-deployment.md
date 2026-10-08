# Madai frontend on GitHub Pages

Madai is a bachelor group project with later portfolio improvements. This static
frontend is a demonstration, not medical advice. Use fictional data only.
AI guidance, report analysis and follow-up chat are incomplete. Deployment does
not establish that these features work end to end.

## Publishing status and expected URL

Expected URL: https://umarsalem.github.io/madai-portfolio-polish/

This task prepares publishing; it has not enabled Pages or deployed a site.
GitHub repository metadata reports no active Pages site. No CNAME file exists.
Detailed Pages/custom-domain settings could not be read through the connector;
inspect Settings → Pages before enabling publishing. Do not add a custom domain
without revisiting the explicitly configured repository subpath.

## Workflow

The existing .github/workflows/frontend-ci.yml now validates the Pages build.
Every branch push and PR into develop/main runs npm ci, the production build
with lint enabled, and all frontend tests. Only a successful build/test job on
develop (push or workflow_dispatch) uploads the frontend build/ directory and
permits the dependent deployment job. Feature branches and PRs never publish.

The deployment uses configure-pages@v5, upload-pages-artifact@v4 and
deploy-pages@v4, with the github-pages environment. The build has contents: read;
only deployment has pages: write and id-token: write. Deployment concurrency
uses madai-github-pages and does not cancel an in-progress deployment.
There is no personal access token or generated-files branch. The .NET backend,
source files, node_modules and local databases are not publishing artifacts.

After review and publishing authorization:
1. Commit/push this branch and create a PR into develop.
2. Review successful PR validation before merging.
3. Open Settings → Pages → Build and deployment → Source → GitHub Actions.
   Check the Custom domain field first; leave it empty for the expected URL.
4. Set the github-pages environment deployment branch policy to develop.
5. Merge the reviewed PR. Its develop push validates and publishes automatically.
   If settings are enabled after that run fails, run the frontend workflow manually
   selecting develop. No publishing settings are changed by the preparation task.
6. Verify the deployed commit, public URL, assets and hash-route refreshes.

## Repository subpath and routing

CI sets PUBLIC_URL=/madai-portfolio-polish and REACT_APP_ROUTER_MODE=hash.
CRA embeds the asset prefix in index.html and JavaScript. Public images use
PUBLIC_URL; internal navigation uses React Router Link instead of root anchors.
Local npm start retains BrowserRouter unless hash mode is explicitly selected.

Public routes are /madai-portfolio-polish/#/login, #/profile, #/symptomChecker,
#/doctorSearch and #/admin/medicalHistory (report upload); #/doctor is an upload
alias. The browser sends only the path before # to Pages, so direct entry and
refresh request the same static index.html. Bare /profile URLs are not supported
Pages links. Protected routes still redirect unauthenticated users to login.
The existing _redirects and vercel.json preparation remains for other hosts;
GitHub Pages does not use those SPA rewrites. Hash routing avoids a 404 workaround.

## Public API configuration and backend CORS

Umar confirmed there is no deployed backend. Leave the repository Actions
variable REACT_APP_API_BASE_URL unset for this disconnected demonstration.
The production frontend displays a backend-not-connected notice and guards API
calls rather than sending requests to localhost or relative Pages endpoints.
No live backend, login, profile, upload or paid model call has been verified.

When an approved backend exists, use Settings → Secrets and variables → Actions
→ Variables → New repository variable: REACT_APP_API_BASE_URL, value its actual
HTTPS origin. The workflow rejects non-HTTPS, credential-bearing and loopback
URLs. This URL is public and embedded at build time. Changing it requires a new
build/deployment. Never put model keys, JWT signing secrets, database credentials
or private tokens in REACT_APP_* values.

The backend already reads Cors:AllowedOrigins in Program.cs. Its hosting setting
must include Cors__AllowedOrigins__0=https://umarsalem.github.io (or the next
unused array index). Origins exclude /madai-portfolio-polish and a trailing slash.
Do not replace other approved origins accidentally. No backend configuration or
hosted service is modified in this frontend task. Later verify GET /health and
CORS response headers with Origin: https://umarsalem.github.io before connecting.
A healthy service alone does not verify feature correctness.

## Local production preview

From MAD-AI_FrontEnd/MAD-AI_FrontEnd-main, in PowerShell:

```powershell
npm ci
$env:CI='true'
$env:PUBLIC_URL='/madai-portfolio-polish'
$env:REACT_APP_ROUTER_MODE='hash'
Remove-Item Env:REACT_APP_API_BASE_URL -ErrorAction SilentlyContinue
npm run build
npm test -- --watchAll=false --runInBand
```

Serve build/ mounted at /madai-portfolio-polish/ with a static server that returns
404 for nonexistent paths (no implicit SPA fallback). Preview the hash links,
refresh, image loading, protected-route redirects and unavailable-backend state.
Do not use real health data or paid provider requests. Mocked-session browser
checks may inspect protected UI, but are not proof of real authentication.

## Pause and recovery

To pause all frontend workflow runs, Actions → Madai Frontend CI and Pages →
workflow menu → Disable workflow. The current site remains public; use Settings
→ Pages → Unpublish site if removal is intended. Disabling this workflow also
pauses its frontend validation. Re-enable it to resume validation and publishing.

To restore an earlier reviewed version, create a revert PR into develop and let
the normal build/tests/deploy sequence publish that version. This preserves the
history without force-pushing. Do not dispatch a feature/old branch expecting
publication: deployment is deliberately restricted to develop. To redeploy the
current develop version, use Run workflow selecting develop.

## Limitations

There is no deployed backend. Core AI and report chat remain incomplete; legacy
blog/recommendation screens still use json-server-style endpoints. Protected
features require real authentication once a backend is connected; the static
frontend does not provide demo login. Existing dependency vulnerabilities remain
unresolved. External font/icon/Tailwind CDN assets require internet access.
A CV-ready public URL requires later live verification after authorization.

References: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
