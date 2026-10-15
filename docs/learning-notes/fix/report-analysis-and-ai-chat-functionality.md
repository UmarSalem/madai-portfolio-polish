# Madai: reliable local report extraction and explanation

## Scope and origin

2026-10-15. Branch `fix/report-analysis-and-ai-chat-functionality`, isolated worktree
`C:/Users/admin/source/repos/.Net_Project/MAD-AI/.worktrees/report-analysis`.
Base: fetched `origin/develop`, `60d7651520201290c39c39d22e0d27ab509fa0be`.
Read README and docs/github-review-workflow.md; no applicable AGENTS.md found.
Inspected the upload controller/service, DTOs, EF model/migrations, API client,
report UI, authentication and existing tests before editing. PR #23 is neither
required nor merged/closed. Other worktrees and the original progress audit are
preserved. No parallel agents, dependency upgrades or hosting changes.

Madai remains a bachelor group project by multiple students. This is a focused
portfolio-polish slice, not a claim of sole authorship of the original project.
Follow-up report chat is explicitly a later task.

## What Umar should understand

Previously a missing provider key skipped extraction entirely. Invalid or empty
documents could appear successful with a static sample, and every history item
was marked demo without preserving its actual source.

Now the authenticated React screen sends the selected fictional PDF and name via
the existing multipart upload client to `/api/MedicalReport/upload-report`.
The controller verifies the JWT identity has an existing account. Size is capped
at 2 MiB per file, with a 3 MiB multipart request ceiling. Filename/MIME checks are
supplemented by actual `%PDF-` content validation and strict PdfPig parsing.
Malformed/encrypted PDFs and documents with no readable text return clear 400
errors before saving anything or calling a provider. Scanned PDFs without text
report extraction unavailable; no OCR was added.

Valid PDF text is extracted even with providers disabled. Up to 5,000 characters
are retained; `textTruncated: true` discloses omitted text. The existing provider
request receives exactly that selected report excerpt as JSON data, separate from
a system instruction to ignore embedded instructions, avoid diagnoses/treatment
and invented findings, and disclose uncertainty. The patient name is not sent.
Input is bounded and the request has a 30-second timeout. This prompt is a safety
instruction, not proof that an untested live model will always follow it.

Missing/placeholder keys or provider failure/empty/malformed responses retain a
fixed fallback which explicitly says it is **not analysis of this report**, with
no invented conditions. A nonempty provider explanation has `isDemo: false`.
This provenance indicates the source, not correctness or medical validation.

EF SQLite saves the report metadata, bounded extracted text, explanation and
nullable provenance/truncation flags in the existing MedicalReports table.
Original PDF bytes are still not retained (`FileData=null`, empty FilePath), and
downloads remain disabled. Reopening is reopening the stored result/excerpt,
not downloading or reanalysing the original PDF. Actual local API use persists
fictional text; the public frontend demo still uses fixed seeds without uploads.

The additive `ReportExplanationMetadata` migration adds only nullable columns.
Existing rows keep unknown provenance and no reconstructed extracted text.
Both `/api/MedicalReport/my-reports` and `/api/MedicalReport/{id}` filter by JWT
owner. Another account receives 404 for an individual report and cannot list it.
React has Open saved result actions using the existing HTTP client and a new
GET wrapper; refreshing history/reopening reads the stored result. No report text
is put into URLs. Existing auth guards, hash routing and public demo routes stay
unchanged. React renders document text as escaped text, not HTML/instructions.

## API/UI source labels

- `isDemo: true`: **Static demo fallback — not analysis of this report**.
- `isDemo: false`: **Provider-generated explanation — not medical advice**.
- `isDemo: null`/absent: **Unknown historical provenance — not verified live AI**.
- Public seeded demo: **Simulated explanation — not analysed**, with upload
  disabled and fictional sample badges.
- `textTruncated: true`: only the first 5,000 characters were saved/supplied;
  a provider receives only this excerpt when available; omitted content is not explained.

Upload/extraction/provider wait, saved-result loading, success, validation,
authentication and retryable network failures have explicit UI states. History
has a refresh/retry action; reopening can be retried. A provider failure saves an
honest fallback; to request another explanation later, reselect/reupload the
fictional PDF. No automatic paid retries or new chat endpoint were introduced.

## Changed files

Backend: MedicalReportController.cs (validation/auth/persistence/read metadata),
MedicalReportService.cs (actual extraction/bounded provider data/provenance),
MedicalHistoryService.cs (same provenance in the existing combined history),
MedicalReport.cs and its two response DTOs, generated nullable EF migration,
designer and model snapshot; ReportFlowTests.cs for focused regression coverage.
Frontend: api/features.js GET wrapper; MedicalHistory.jsx and its tests for source
labels, upload states, bounded-text disclosure and saved-result reopening.
This learning note records setup and actual evidence.

## Commands and evidence

Host npm is not on PATH. Used the existing npm 10.9.4 CLI, without changing
package.json/package-lock.json, as `node <cli> <arguments>`:
`C:/Users/admin/source/repos/.Net_Project/MAD-AI/.worktrees/demo-mode/MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/node_modules/.task-tooling/package/bin/npm-cli.js`.

From `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main`:

```powershell
npm ci
$env:CI='true'
$env:PUBLIC_URL='/madai-portfolio-polish'
$env:REACT_APP_ROUTER_MODE='hash'
$env:REACT_APP_API_BASE_URL='http://127.0.0.1:5127'
npm run build
npm test -- --watchAll=false --runInBand
```

Install passed: 1,434 packages added/1,435 audited in 13 minutes; unchanged
106 vulnerabilities (6 low, 15 moderate, 81 high, 4 critical). Existing deprecation
notices appeared; no audit fix/upgrades applied.
Frontend tests passed: 9 suites / 36 tests, zero failures/skips (103.822 seconds), including public demo/auth/hash-routing regression tests. After final truncation-disclosure wording, affected report UI tests passed again: 1 suite / 7 tests (8.908 seconds). The initial in-progress build was stopped to rebuild final source. Final CI-mode production build passed with lint enabled: JS gzip 105.77 kB (main.03db1950.js), CSS gzip 6.9 kB (main.1df89e02.css). Existing fs.F_OK/Browserslist notices only.

From `MAD-AI_BackEnd-develop`:

```powershell
dotnet ef migrations add ReportExplanationMetadata --project MADAI-BACKEND.csproj
dotnet build MADAI-BACKEND.sln --configuration Release
dotnet test MADAI-BACKEND.sln --configuration Release --no-build
```

Migration generated using existing EF tool 8.0.22; it warned that runtime 9.0.3 is
newer. No tool/package update. Release build passed: zero warnings/errors.
All **22 backend tests passed**, zero skipped. Initial new-test run failed due to
FormFile test-fixture initialization order (ContentType before Headers), corrected
the helper, rebuilt and reran successfully; no application workaround was added.

Focused backend tests use genuine minimal PDF bytes and the installed PdfPig
parser for extraction/empty/encrypted/malformed/size cases. The provider transport
is a local HttpMessageHandler stub: checks selected report text, 5,000-character
bound, truncation, untrusted-data system instruction, nonempty provider provenance,
503/malformed/empty-response fallback. Controller persistence tests use EF InMemory
and test owner filtering, anonymous/missing-account rejection, historical null
provenance (including the existing combined-history service) and rejection without saving. These are not live-provider tests or
middleware authentication tests. Frontend tests mock feature clients and test
selected file handoff, loading/retry, three source labels, truncation and reopening.

### Actual runtime, separate from mocks

Temporary fixtures/scripts live outside this feature worktree under
`MAD-AI/.worktrees/report-runtime/`; none of those PDFs/scripts/DBs are committed.
Used genuine text PDF, text-empty PDF and a spoofed .pdf, all fictional.
Started the actual Release .NET API on loopback 5127 with a new isolated SQLite
database, applying both migrations successfully. Environment setup:

```powershell
$env:ASPNETCORE_ENVIRONMENT='Development'
$env:ASPNETCORE_URLS='http://127.0.0.1:5127'
$env:PORT=''
$env:Jwt__Key=[Guid]::NewGuid().ToString('N')+[Guid]::NewGuid().ToString('N')
$env:Jwt__Issuer='MADAI'
$env:Jwt__Audience='MADAIUsers'
$env:ConnectionStrings__DefaultConnection='Data Source=C:/Users/admin/source/repos/.Net_Project/MAD-AI/.worktrees/report-runtime/fictional-reports.db'
$env:Database__ApplyMigrationsOnStartup='true'
$env:OpenRouter__ApiKey='demo-disabled'
$env:GoogleMaps__ApiKey='demo-disabled'
$env:GoogleApiKey='demo-disabled'
$env:Cors__AllowedOrigins__0='http://127.0.0.1:4179'
$env:Logging__LogLevel__Microsoft='Warning'
dotnet run --project MADAI-BACKEND.csproj --configuration Release --no-build --no-launch-profile
```

Executed temporary `node .worktrees/report-runtime/fixtures.cjs` and
`& ./.worktrees/report-runtime/verify-api.ps1` from the original writable checkout.
Actual HTTP/SQLite verification PASS: fictional Patient signup/signin; anonymous
multipart upload 401; spoofed/text-empty PDF 400; genuine text PDF 200, extracted
expected fictional text and explicit static fallback; list and GET reload match
the saved text/summary/provenance; second account read 404 and isolated history.
Keys/tokens/report contents were not printed or added to application logs.
Development emitted the existing missing HTTPS redirect port warning for this
HTTP-loopback run. Existing configuration/databases were not changed. The temporary API was stopped after the checks; fictional fixtures and the isolated database remain outside task changes.

Browser verification is blocked: the computer-use browser tool failed to initialize
with “failed to write kernel assets … path specified” on both initial attempt and
after reset. No browser upload/screenshot is claimed for this slice. Actual API
verification above is real; UI evidence is automated mocked Jest coverage.

## Limitations and next slice

No paid/live provider calls were made. Live-provider validation, clinical accuracy
and instruction-following are pending, including model availability. The existing
model/provider integration was reused. No diagnosis is promised. Scanned PDFs need
OCR, which is deliberately absent. Files must be unencrypted and have readable
text. Only 5,000 characters are retained/explained; original PDFs cannot be
downloaded. Historical provenance/text cannot be recovered by the migration.
The fallback is static, not report-dependent analysis. Provider output is unverified.
No full mobile/accessibility audit or real-browser upload due to the tool blocker.
Local SQLite stores fictional extracted text; do not use real health data.
106 existing dependency vulnerabilities remain. Follow-up chat, RAG/vector storage,
backend hosting, password reset, blogs and broad refactoring remain outside scope.

Task diff reviewed and git diff --check passed; no config, database, PDF, dependency or hosting files are included. Delivery: commit only named task
files, push without force, open PR into develop. Do not merge, close or enable
auto-merge; do not deploy. CI must be reported separately from local results.
