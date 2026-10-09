# Madai — connect AI Doctor to symptom intake

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
