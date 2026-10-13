# Madai — local symptom guidance to doctor search

## Review — 2026-10-13

Ready for Umar's review: yes, no blocking functional finding in the requested local fallback flow. The feature was already committed/pushed before this review; PR https://github.com/UmarSalem/madai-portfolio-polish/pull/23 remains open. This review changes only the learning note, not application code or history. Umar subsequently authorized committing/pushing this note to the existing PR; Umar will review and close the PR himself.

Reviewed README, repository review instructions, feature diff against origin/develop and relevant API clients, controllers/services, JWT setup, routes/guards and focused tests. No applicable AGENTS.md found. Eight feature files remain narrowly scoped: two screens, DTO/service provenance, three test files and this note. No changed secrets/config/databases/dependencies or real health records. Existing auth client adds the bearer token; .NET validates it. No symptom text is passed in navigation. No provider/medical efficacy claim is established by these checks.

Implemented behavior: intake POSTs to the existing authenticated endpoint; true/false/null provenance means static fallback/provider output/unknown. Historical retrieval leaves isDemo null, and the guidance UI's unknown-source branch does not claim live AI. Guidance handoff contains only fromGuidance, with blank editable real search fields. Report links, hash router, guards and public fixed-seed demo are preserved.

Reused evidence: production build, 10 frontend suites/40 tests and Release backend build (zero warnings/errors)/17 tests from 2026-10-09. Reused actual built React -> .NET -> isolated SQLite success journey, report navigation, logout guards and no-login demo. No npm ci or full-suite repeat; no application change requiring a new build. Both GitHub workflows for 9a1af35 are now completed/success (frontend run 38374385413, backend 38374385479); this review made no remote mutation.

Focused mocked verification repeated:
- From frontend, CI=true, REACT_APP_ROUTER_MODE=hash, existing npm CLI: test -- --watchAll=false --runInBand --runTestsByPath src/routes/GuidanceJourney.test.jsx src/symptomChecker/SymptomChecker.test.jsx. PASS: 2 suites/13 tests. Axios is mocked; validates empty guidance failure, empty doctor array, auth errors, retained inputs/retry and safe handoff.
- From backend, dotnet test MADAI-BACKEND.sln --configuration Release --no-build --filter FullyQualifiedName~SymptomGuidanceTests. PASS: 6 tests. HTTP provider handler is stubbed, EF InMemory; verifies provider 503/malformed/empty-summary fallbacks, explicit source flags and historical null. Not live-provider verification.

New real local HTTP verification (temporary .worktrees/core-flow-runtime/review-api.ps1 outside feature files): used existing isolated fictional SQLite and documented providers-disabled settings. Repeated signup/signin, POST persistence/fallback, two fictional doctors, anonymous 401, invalid symptom 400 and CORS smoke checks. Generated a correctly signed JWT expired 15 minutes ago with the ephemeral local signing key kept in process memory. Symptom POST, history GET and doctor GET all returned 401; no expired entry persisted. Authenticated historical response had isDemo null. Whitespace doctor terms returned 400. All PASS; no key/token output or paid calls.

New built-React browser verification (real local API, no Axios mocking): temporarily configured Jwt__ExpiryInMinutes=-15, signed in using the documented isolated fictional Patient, then submitted fictional intake and doctor search. Both displayed login-required errors, retained editable input, and showed no successful guidance/doctors. Stopped the API and retried both screens: both displayed retryable unable-to-request errors and retained fictional inputs. The frontend guard deliberately remains a token-presence guard; an expired token is rejected by .NET, with no automatic session clearing/redirect added. Users can log out and sign in again with normal expiry.

Verification limits: disabled providers always return two fictional doctors and nonempty static guidance. A real provider returning zero doctors, provider network failure, HTTP 500 response rendering and malformed doctor-response shape have not been exercised end-to-end. Empty-result UI and symptom-provider failure/empty-summary paths above are mocked/stubbed coverage only. Historical null was verified over real HTTP; its UI label branch was exercised in mocked tests. No mobile/accessibility audit, report file upload/analysis, live providers or backend deployment. Historical provenance is not persisted; 106 existing dependency vulnerabilities remain. Temporary review API/preview processes were stopped; other worktrees and the original progress audit were preserved.

Final git diff --check passed. Only this learning note changed after the existing feature commit.

Suggested commit message if Umar later commits further reviewed changes: feat: complete local symptom guidance and doctor search flow. Do not rename/rewrite the already pushed commit solely to match this wording.

Draft PR description:
The previous authenticated journey returned guidance without a result-level doctor-search action or source labels. Connect existing React/.NET intake to labelled guidance and editable doctor search without health text in URLs or route state; retain report access, auth guards, hash routing and the public fictional demo. Label static fallback and invented clinics, and treat historical provenance as unknown.
Validation: existing production/Release builds, 40 frontend/17 backend tests and successful real local React/API/SQLite journey; review repeats 13 focused UI tests and 6 focused backend tests, plus actual expired-JWT rejection, historical null, validation and browser API-unavailable errors. git diff --check passed; existing PR frontend/backend CI both successful.
Limits: paid/live providers, real provider empty results/500 responses, report analysis and backend deployment remain unverified/deferred. Existing dependency vulnerabilities and historical provenance persistence remain outside scope. Fictional data only.

## Implementation evidence — 2026-10-09

Branch: `feature/core-ai-doctor-and-doctor-search-flow`.
Worktree: `C:/Users/admin/source/repos/.Net_Project/MAD-AI-core-navigation`.
Base: current develop, `60d7651520201290c39c39d22e0d27ab509fa0be`.
Status: committed and pushed as 9a1af350e5d0211ec7ed7cc2b0bf3a152c9167bf on 2026-10-13 after Umar authorized the push. PR #23 is open into develop. Umar authorized the documentation commit/push after review. Merge, PR closure and deployment are reserved for Umar. No parallel agents were used.

Read README, the repository review workflow, and the PR #21/#22 learning notes.
No applicable AGENTS.md was found. Inspected the real frontend client/router,
JWT authentication, symptom controller/service/DTO, doctor controller/service,
validation and existing tests before editing. The existing feature worktree was
clean and fast-forwarded to current develop. All other worktrees were retained;
the original untracked progress audit was neither changed nor staged. Edits in
this worktree required sandbox approval because it is outside the writable root.

### Previous broken journey and resulting behavior

PR #21 corrected the AI Doctor route, and PR #22 added a public fictional
frontend demo. Neither proved real local API behavior. The symptom form already
called the .NET API, but its guidance had no result-level doctor-search action,
and the response did not say whether it was static fallback text or generated
by a provider. Conditions and a free-text summary are not structured specialties.

The local authenticated flow now submits fictional symptoms or a question,
displays guidance with honest provenance, and offers **Find doctors**. Search
opens with blank, editable location/specialty fields. No specialty is inferred
from the summary, conditions or symptom text. Report upload/history stays
reachable from intake, guidance and real doctor search.

### Changed files and contract

- `Models/DTO/AnalysisResultDTO.cs`: additive nullable `isDemo` flag. True means
  static fallback, false means a successfully parsed provider response, null
  means source unknown. No database schema change. Historical result retrieval
  still has unknown provenance because the existing model does not store it.
- `Services/SymptomService.cs`: sets the flag on fallback/provider paths;
  an empty provider summary is treated as fallback. Existing endpoint/provider
  integration is reused. No new provider or paid call was introduced.
- `src/symptomChecker/SymptomChecker.jsx`: explicit fallback/provider/unknown
  labels; waiting status, bounded inputs matching DTO limits, 400/401/403 errors,
  empty-response failure and clearing stale guidance before a new submission.
  Result-level Find doctors and report links. Handoff state contains only
  `{ fromGuidance: true }`, never names, symptoms, conditions or summary text.
- `src/doctorSearch/DoctorSearch.jsx`: handoff explanation, editable terms,
  accessible loading/errors, explicit fictional fallback notice/badges,
  suppressed fictional website links and a report-upload/history link.
- `src/symptomChecker/SymptomChecker.test.jsx`: provenance, validation and
  rejected/empty response tests in addition to retained existing tests.
- `src/routes/GuidanceJourney.test.jsx`: real router/screens/clients with mocked
  Axios transport; verifies endpoint bodies, bearer interceptor, loading,
  guidance-to-search navigation, blank specialty, safe state/URL, editable
  search terms, fictional labels, errors/retry/empty results and report access.
- `tests/Madai.Backend.Tests/SymptomGuidanceTests.cs`: no-provider-call fallback,
  stubbed success/failure/malformed/empty-provider provenance, authenticated
  controller persistence and historical unknown provenance. No external HTTP.
- This learning note documents current results and retains PR #21 history below.

Frontend paths are under `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main`; backend paths
are under `MAD-AI_BackEnd-develop`.

### How React calls .NET

Existing `api/features.js` calls existing `httpClient`:

1. `checkSymptoms` POSTs JSON `{ patientName, symptomsText, dateSubmitted }`
   to `/api/SymptomChecker`. `REACT_APP_API_BASE_URL` selects the local API.
2. The existing request interceptor adds `Authorization: Bearer <token>` from
   the existing authenticated user. No fake authentication or new client.
3. The .NET controller validates the DTO and JWT user, saves the fictional
   entry/analysis and returns `{ summary, suggestedConditions, nextSteps, isDemo }`.
4. Find doctors navigates to `#/doctorSearch` without health text in the URL.
5. Existing `searchDoctors` GETs `/api/Doctors/search` with only user-selected
   `location` and `specialty` query terms. .NET still requires the Patient role.
   Missing/disabled keys return existing `isDemo: true` fictional doctors.

Hash routing, ProtectedRoute and public `/demo` routes are unchanged. Demo
screens still use fixed seeds and bypass feature API requests without bypassing
real authentication. A real API call returning static fallback proves the HTTP
journey works; it does not prove that live AI analysed the submitted symptoms.

### Validation commands and actual results

From the frontend directory (PowerShell):

```powershell
npm ci
$env:CI='true'
$env:PUBLIC_URL='/madai-portfolio-polish'
$env:REACT_APP_ROUTER_MODE='hash'
$env:REACT_APP_API_BASE_URL='http://127.0.0.1:5125'
npm run build
npm test -- --watchAll=false --runInBand
```

Host npm is not on PATH. Each npm command was executed with the existing
npm 10.9.4 CLI as `node <cli> <arguments>`, where `<cli>` is:
`C:/Users/admin/source/repos/.Net_Project/MAD-AI/.worktrees/demo-mode/MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/node_modules/.task-tooling/package/bin/npm-cli.js`.
No manifest or lockfile changed. `npm ci` passed: 1,434 packages added / 1,435
audited, 106 vulnerabilities (6 low, 15 moderate, 81 high, 4 critical).
Frontend tests passed: **10 suites / 40 tests**, zero failed/skipped, 60.886 seconds.
Production build passed with lint enabled, local API configuration, hash routing
and the Pages subpath. Gzip JS 105.49 kB / CSS 6.9 kB; output assets
`main.fdf66e37.js` / `main.1df89e02.css`. Existing Node fs.F_OK deprecation and
stale Browserslist-data notices appeared; dependencies were not upgraded.

From the backend directory:

```powershell
dotnet build MADAI-BACKEND.sln --configuration Release
dotnet test MADAI-BACKEND.sln --configuration Release --no-build
```

Build passed: **zero warnings/errors**, including restore of existing packages.
Tests passed: **17/17**, zero failed/skipped. Controller tests use EF in-memory;
provider responses are stubs. They do not test live providers or HTTP middleware.
`git diff --check` from the feature worktree passed.

### Actual local API verification

Started the real .NET application on `http://127.0.0.1:5125`, with an isolated
SQLite database under `.worktrees/core-flow-runtime/fictional-runtime.db` in the
original writable workspace. Existing databases/config files were not changed.
The existing migration ran successfully. Process environment used:

```powershell
$env:ASPNETCORE_ENVIRONMENT='Development'
$env:ASPNETCORE_URLS='http://127.0.0.1:5125'
$env:PORT=''
$env:Jwt__Key=[Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N')
$env:Jwt__Issuer='MADAI'
$env:Jwt__Audience='MADAIUsers'
$env:ConnectionStrings__DefaultConnection='Data Source=C:/Users/admin/source/repos/.Net_Project/MAD-AI/.worktrees/core-flow-runtime/fictional-runtime.db'
$env:Database__ApplyMigrationsOnStartup='true'
$env:OpenRouter__ApiKey='demo-disabled'
$env:GoogleMaps__ApiKey='demo-disabled'
$env:GoogleApiKey='demo-disabled'
$env:Cors__AllowedOrigins__0='http://127.0.0.1:4177'
dotnet run --project MADAI-BACKEND.csproj --configuration Release --no-build --no-launch-profile
```

Real loopback HTTP verification passed: fictional Patient signup/signin,
authenticated symptom/question POST, explicit `isDemo: true` fallback, persisted
fictional symptom history, and GET doctor search returning two fictional clinics.
Anonymous symptom POST returned 401, invalid authenticated input returned 400,
and the frontend origin's CORS preflight passed. Tokens were not printed.
Development logged that no HTTPS redirect port was configured for this
HTTP-only loopback run; it did not block the local requests. No HTTPS/hosting
configuration was changed.
An initial PowerShell smoke assertion incorrectly wrapped the returned doctor
array; corrected the temporary verification script, then the full run passed.
This was a verification-script issue, not an API error.

### Actual React → .NET browser verification

Served the production build on loopback port 4177 using a temporary Node static
server (`node .worktrees/core-flow-runtime/preview.cjs` from the original writable
workspace). This preview is verification tooling, not a new hosting/backend layer.
The built frontend's API base URL was `http://127.0.0.1:5125`.

Computer-use browser verification passed, without HTTP mocks:

1. Direct `#/doctor` redirected to login before authentication.
2. Existing login UI authenticated the isolated fictional Patient account via
   the running .NET signin endpoint and returned to symptom intake.
3. React submitted the fictional name “Alex Browser Example” and a fictional
   routine-check-up question. The real response displayed the static fallback
   label and summary. An independent authenticated GET of `my-symptoms` confirmed
   this exact browser-created entry in the isolated SQLite database.
4. Find doctors navigated to `#/doctorSearch`, without symptom text in the URL.
   Specialty remained blank; the handoff explained that no specialty was supplied.
5. Edited location/specialty to Demo City / General practice, submitted search,
   and saw both real API fallback clinics with Fictional badges and the explicit
   “not live doctor search results” notice. No fictional website link was offered.
6. Search's report link opened Medical Report Demo and empty report history.
   No file was selected or uploaded; report analysis was not tested.
7. Logout restored `#/doctor` → `#/login`. Afterwards `#/demo` still displayed
   its fixed simulated guidance without an account.

This verifies the real local browser → API → SQLite → response journey with
providers disabled. It is separate from the mocked Jest/controller/provider tests.
The browser checks were desktop checks, not a complete mobile/accessibility audit.
Temporary API/preview processes are stopped after validation. The isolated
fictional database and temporary verification scripts remain outside task changes
for reproducibility. No secret token/JWT key was printed or placed in this note.

Next verification step for Umar: repeat the documented local login/intake/search
journey using a different fictional Patient, reviewing the PR diff and this review note first.
Provider-enabled behavior remains deliberately unverified and deferred.

### Limitations and what Umar should understand

Use fictional data: unlike the public frontend demo, the real local API persists
symptom entries and analyses in SQLite. This run used a separate fictional DB.
The frontend auth guard checks token presence; .NET validates the actual JWT and
Patient role. No deployed backend or public runtime change was made. No paid
provider calls, real patient data, provider-enabled verification, new integration,
report chat, password reset, blogs, hosting or dependency upgrades.

Live provider usefulness and medical accuracy are not verified. Static fallback
is fixed text and is not symptom-dependent AI. The contract supplies no specialty,
so users must choose one. Historical analysis provenance is unknown; persisting
that metadata is a separate future task. The 106 dependency vulnerabilities remain.

### Draft PR description for later review

Previous journey: AI Doctor reached intake, but returned guidance did not link
to doctor search and did not distinguish static fallback from provider output.

Result: keep existing authenticated React/.NET calls; label guidance provenance,
show loading/validation/errors, and link guidance to editable location/specialty
search without health text in navigation. Label fictional fallback doctors and
keep report upload/history reachable. Preserve the public seeded demo and guards.

Validation: unchanged-lockfile install, 10 frontend suites/40 tests, .NET build
with zero warnings/errors, 17 backend tests and diff check passed. Actual local
HTTP verification passed with providers disabled and isolated fictional SQLite.
Production build and the actual React → .NET → SQLite browser journey also passed,
including report access, logout/guard behavior and the no-login fictional demo.

Limitations: no live-provider/medical verification, deployed backend or historical
provenance persistence. Existing vulnerabilities remain. No new hosting/provider,
report-chat or dependency work. Suggested commit for later authorization:
`feat: connect symptom guidance to doctor search`.

## Historical PR #21 navigation slice (retained for context)

The following records the earlier task before it was committed, pushed and
merged as PR #21. Its base/status/validation statements are historical, not the
current task status. PR #22's demo learning note is in
`docs/learning-notes/fix/demo-mode-and-seed-data.md`.

Branch to resume: feature/core-ai-doctor-and-doctor-search-flow
Base: origin/develop at 1ef69816d1a112d64cf6b1922621b29c8a0bdbe4
Worktree: C:/Users/admin/source/repos/.Net_Project/MAD-AI-core-navigation
Status: local changes only; do not commit, push or merge without authorization.

## Scope and preservation

No applicable AGENTS.md was found in the repository or checked parent paths.
Fetched origin before branching. The requested branch did not already exist
locally or among fetched remote refs, so an isolated worktree was created from
updated develop. The original MAD-AI checkout and its uncommitted learning notes,
including the progress audit, were left untouched. No parallel agents were used.

Inspection was limited to the relevant navigation/routes, symptom UI/tests and
existing API contract, plus package metadata needed to run validation.
No backend, hosting workflow, dependency, provider or report-chat changes.

## Why AI Doctor opened upload

Navbar uses ROUTE.AiDoctor (/doctor). ReactRoute rendered AIDoctor there, but
AIDoctor was an alias for MedicalHistory. The symptom checker already existed at
/symptomChecker. This was a route-mapping problem, not a missing component or API.

ReactRoute now renders the existing SymptomChecker inside the same ProtectedRoute
at /doctor. The /symptomChecker alias remains available. The BrowserRouter versus
HashRouter selection is unchanged; Pages still uses #/doctor under the repository
subpath. Unauthenticated users still go to login with their intended destination
preserved. No login bypass or frontend demo authentication was added.

## Changed files

- src/routes/ReactRoute.jsx: map AI Doctor to SymptomChecker, removing the unused
  upload-alias import. Preserve auth guards and existing upload/search routes.
- src/components/layout/Navbar.js: clearly name Doctor search and Report upload
  & history in the authenticated menu.
- src/symptomChecker/SymptomChecker.jsx: identify the screen as AI Doctor/Symptom
  Checker; label the textarea for symptoms or a health question; use a fictional
  question placeholder; add separate doctor-search and report-upload links.
  Request errors have role=alert. Existing validation, loading prevention, result
  rendering and retry behaviour are retained.
- src/symptomChecker/SymptomChecker.css: keep the form below the fixed header and
  style its separate action links with wrapping and keyboard focus visibility.
- src/routes/ReactRoute.test.jsx: focused Pages hash-navigation tests verify the
  AI Doctor destination, direct entry at both symptom paths, protected redirects
  with return destinations, and separate search/upload actions. Unrelated page
  contents are stubbed; the real router, Navbar, SymptomChecker and auth guard run.
- src/symptomChecker/SymptomChecker.test.jsx: retain the existing fictional symptom
  submission test; add fictional question-contract and failed-request retry tests.
- This learning note records the scope, validation and next work.

Paths above are relative to MAD-AI_FrontEnd/MAD-AI_FrontEnd-main.

## API contract stays the same

The form continues calling checkSymptoms with patientName, symptomsText and
dateSubmitted. The existing client posts to /api/SymptomChecker. A question uses
symptomsText; no new endpoint or model integration is introduced. Tests mock the
response; a passing UI test does not prove real AI guidance works.
Doctor search stays at /doctorSearch and report upload/history stays at
/admin/medicalHistory. The legacy /doctor upload alias intentionally becomes
symptom intake; use the explicitly labelled report-upload action for reports.

## Local validation

Established package manager: npm and the existing package-lock.json.
Clean install used the existing lockfile without changing dependencies.
Commands from MAD-AI_FrontEnd/MAD-AI_FrontEnd-main:

```powershell
npm ci
$env:CI='true'
$env:PUBLIC_URL='/madai-portfolio-polish'
$env:REACT_APP_ROUTER_MODE='hash'
npm run build
npm test -- --watchAll=false --runInBand
```

npm is not on this host's PATH, so each npm invocation above was executed as:

```powershell
node (Join-Path $env:TEMP 'madai-npm-10.9.4/package/bin/npm-cli.js') <arguments>
```

Results:
- npm ci: passed, 1,434 packages added / 1,435 audited.
- CI=true production build: passed with lint enabled, Pages hash routing and
  /madai-portfolio-polish/ asset prefix. JS gzip 103.65 kB / CSS 6.62 kB.
- Tests: passed, 8 suites / 21 tests, zero failed or skipped.
  Previous inventory was 7 suites / 10 tests. Added one navigation suite with
  9 cases and 2 symptom-entry cases; no original suite was removed.
- git diff --check: passed after implementation and documentation.
- Checks are local only. This branch has not been pushed, so no new GitHub CI.
- No real patient data, backend requests or paid provider calls were used.

## Limitations and remaining work

This task fixes navigation and entry UI only. It does not complete the entire
core AI doctor/doctor-search roadmap milestone. The backend is not deployed, so
API-backed features on the public frontend remain unavailable. Real authenticated
submission, provider guidance, location/specialty results and complete journeys
still need separate verification and development. Report analysis and follow-up
chat remain outside this task. No live deployment or browser preview was run here;
hash navigation and auth are verified by focused frontend tests.

npm still reports 106 vulnerabilities (6 low, 15 moderate, 81 high, 4 critical).
No forced audit fix or dependency upgrade was applied. Keep the React/.NET stack.

## Draft PR description

Problem:
AI Doctor opened the report-upload screen, hiding existing symptom intake.

Changes:
Render the existing guarded SymptomChecker at /doctor, retain /symptomChecker,
clarify fictional symptom/question entry, and provide separate doctor-search and
report-upload actions. Preserve Pages hash routing and the existing API contract.
Add focused navigation and submission/retry coverage.

Validation:
Clean npm ci and CI=true npm run build passed with lint enabled.
CI=true npm test -- --watchAll=false --runInBand: 8 suites / 21 tests passed.
git diff --check passed. Navigation tests exercise Pages hash routing.

Limitations:
Local UI/route verification only; no deployed backend or live AI/provider journey.
Existing dependency vulnerabilities remain. No hosting or backend changes.

Suggested commit: feat: connect AI Doctor navigation to symptom intake
