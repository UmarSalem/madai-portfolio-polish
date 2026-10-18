# Madai: explicit backend demo mode and repeatable fictional seeds

## Scope and starting state

2026-10-18. Branch `fix/backend-demo-mode-and-seed-data`; isolated worktree
`C:/Users/admin/source/repos/.Net_Project/MAD-AI/.worktrees/backend-demo`.
Fetched origin and confirmed PR #25 merged into develop at
`1160356f655495ef958250f84dd19bbbf6ca4993`; this is the task base. Read README,
repository review instructions and frontend-demo/report-chat learning notes.
No applicable AGENTS.md found. Other worktrees, uncommitted work and the original
progress audit are preserved. No parallel agents, dependency/hosting changes,
database resets or new migrations.

Madai remains a bachelor group project created by multiple students. This slice
is portfolio-polish work, not a claim of sole authorship of the original project.

## Plain-English explanation for Umar

The public frontend demo is a fixed simulation: it needs no account or backend
and does not upload files or make provider requests. It is unchanged.

The local backend demo is different: it runs the real .NET API, JWT login,
ownership checks, PDF parser and SQLite persistence. It accepts fictional data
only. `BackendDemo:Enabled=true` explicitly turns provider access off regardless
of configured keys. Absent/false keeps the normal existing provider behavior.

Previously the services mostly depended on missing/placeholder keys to choose a
fallback; setting a usable key could unexpectedly enable external requests. The
new setting has priority in symptoms, doctor search, PDF explanation, report chat
and both legacy AI recommendation/insight paths. A factory HTTP transport guard
also blocks requests when demo mode is enabled, including loopback test providers.
All existing authentication and owner filters remain active; this is not a login
bypass or simulated backend authentication.

Responses reuse honest labels:

- Symptoms: existing `isDemo:true` static guidance, explicitly demo/not advice;
  the real UI labels it static fallback, not live AI.
- Doctors: existing `isDemo:true` invented clinics/ratings; the UI labels them
  fictional and suppresses fictional booking/site links.
- PDF upload: normal size/content/parsing checks and extraction still run first;
  `isDemo:true` fallback says **not analysis of this report**. No provider is called.
- Saved seed report: explicitly a fictional seeded example with bounded sample
  text, `isDemo:true`, no original PDF bytes and no download.
- Chat history: `available:false`; send returns 503 for the owner with no fake
  assistant turn. Anonymous/foreign report requests remain 401/404.
- Legacy recommendation/insight endpoints: explicit disabled-in-backend-demo
  message, not personalized advice/insights.

## Seed command and preservation rules

`--seed-demo` is an explicit CLI action, not automatic normal-startup seeding.
It requires Development, enabled demo mode, a locally supplied password of at
least 12 characters / at most 72 UTF-8 bytes, and an explicitly configured absolute
SQLite filename `madai.demo.db`. Memory/read-only/ordinary relative database paths
are rejected. The command applies existing EF migrations only to that selected
file, seeds, prints a credential-free completion message and exits without a
server. Expected refusal returns exit code 1 with a fixed message.

Stable reserved IDs identify one fictional Patient user, one symptom entry, one
static analysis and one sample report. Username: `backend.demo@example.test`.
Password is hashed with the same BCrypt implementation/defaults used by existing
signup. It is never printed, stored as plaintext, committed or reset by seeding.
The seed report is a text fixture, not an uploaded/analyzed PDF. No chat is seeded.

Seeding adds only missing records. Repeat runs preserve original dates, password
hashes, edited fixture records, unrelated users/records and later API submissions.
All reserved identities are checked before additions. Conflicting email/ID/owner
or a different supplied password causes refusal, not overwrite. EF saves the new
records as one batch/relational transaction. Concurrent seed invocations are not
a supported workflow: run the command sequentially; fixed primary keys prevent
duplicate reserved rows. Nothing is deleted or reset. Historical symptom analysis
provenance remains unknown in its existing DTO; the seed summary itself explicitly
says static backend demo guidance. New symptom POSTs return `isDemo:true`.

## Exact local setup (PowerShell)

From this worktree's `MAD-AI_BackEnd-develop` directory:

```powershell
dotnet build MADAI-BACKEND.sln --configuration Release
$env:ASPNETCORE_ENVIRONMENT='Development'
$env:BackendDemo__Enabled='true'
$taskDemoDb=Join-Path (Get-Location) 'demo-data/madai.demo.db'
$env:ConnectionStrings__DefaultConnection="Data Source=$taskDemoDb"
$taskDemoPassword=Read-Host 'Choose a local-only demo password (12+ characters)' -AsSecureString
$env:BackendDemo__SeedPassword=[Net.NetworkCredential]::new('', $taskDemoPassword).Password
$env:Jwt__Key=[Guid]::NewGuid().ToString('N')+[Guid]::NewGuid().ToString('N')
$env:Jwt__Issuer='MADAI'
$env:Jwt__Audience='MADAIUsers'
$env:PORT=''
$env:ASPNETCORE_URLS='http://127.0.0.1:5133'
$env:Database__ApplyMigrationsOnStartup='false'
$env:Cors__AllowedOrigins__0='http://localhost:3000'
dotnet run --project MADAI-BACKEND.csproj --configuration Release --no-build --no-launch-profile -- --seed-demo
dotnet run --project MADAI-BACKEND.csproj --configuration Release --no-build --no-launch-profile -- --seed-demo
dotnet run --project MADAI-BACKEND.csproj --configuration Release --no-build --no-launch-profile
```

Use the supplied private password at normal login; do not echo secret variables
or capture credentials in shell transcripts. `.env.example` documents the mode
with default false and no seed password. .NET does not automatically import that
file: use environment/local configuration. No provider keys are needed. Existing
keys, if present, cannot override enabled demo mode. Keep using the dedicated demo
database for these demonstrations; no command selects or resets an ordinary DB.

For a local React development server, set its `REACT_APP_API_BASE_URL` to
`http://127.0.0.1:5133`. For the Pages-style built preview, also set hash routing
and PUBLIC_URL as below and match the preview origin in backend CORS settings.
This setup is local only; hosting remains deferred.

## Changed files

BackendDemo.cs: setting helper and transport guard. Five provider services:
small priority checks preserving normal branches and existing labelled fallbacks.
DemoSeeder.cs: validation/reserved fictional fixtures/insert-only repeatability.
Program.cs: explicit CLI handling, existing migration application and HTTP guard
registration. `.env.example`: non-secret example/comment only. BackendDemoTests.cs:
focused regression coverage. No React source, auth/ownership code, schema or
dependency changes. This note documents commands/results and limitations.

## Validation commands and results

From `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main`:

```powershell
npm ci
$env:CI='true'
$env:PUBLIC_URL='/madai-portfolio-polish'
$env:REACT_APP_ROUTER_MODE='hash'
$env:REACT_APP_API_BASE_URL='http://127.0.0.1:5133'
npm run build
npm test -- --watchAll=false --runInBand
```

Host npm is not on PATH; commands are executed as `node <cli> <arguments>` with
the existing npm 10.9.4 CLI:
`C:/Users/admin/source/repos/.Net_Project/MAD-AI/.worktrees/demo-mode/MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/node_modules/.task-tooling/package/bin/npm-cli.js`.
npm ci passed: 1,434 packages added / 1,435 audited in 12 minutes; unchanged 106 vulnerabilities (6 low, 15 moderate, 81 high, 4 critical). Existing deprecation notices only; no audit fix/upgrades. Frontend tests passed: 11 suites / 53 tests, zero failures/skips (75.943 seconds). CI-mode production build passed with lint enabled: gzip JS 107.13 kB (main.8fd4b0c5.js), CSS 6.9 kB (main.1df89e02.css). Existing fs.F_OK/Browserslist notices only.

From `MAD-AI_BackEnd-develop`:

```powershell
dotnet build MADAI-BACKEND.sln --configuration Release
dotnet test MADAI-BACKEND.sln --configuration Release --no-build
```

Final Release build passed: zero warnings/errors. All 51 backend tests passed, zero skipped (11 seconds), including 10 new focused cases.
`git diff --check` passed from the task worktree.

Focused tests use non-placeholder synthetic provider keys, counter HTTP handlers,
genuine PDF fixture bytes and EF InMemory: zero sends/client factory creations
across all provider paths, static source flags, extraction/not-analysis text,
unavailable chat, factory guard on/off, default-disabled mode, repeated seeds,
BCrypt verification, unchanged dates/hashes/edits/unrelated records, identity and
password conflicts, missing mode/password/unsafe path, Production/Staging rejection,
and chat auth/ownership rejection without fake messages. Existing non-demo/provider
stub/auth/report tests remain regression coverage. None use live provider calls.

### Real API/database verification

Actual .NET/SQLite runtime verification passed. Temporary orchestration is outside task files under the
original checkout's `.worktrees/backend-demo-runtime/verify.ps1`. It generates
password/JWT key only in process environment, creates a fresh GUID-named directory
with `madai.demo.db`, seeds twice, rejects Production seeding, then starts the
actual Release API at loopback 5133. Synthetic non-placeholder AI/Google keys are
set to prove the mode takes precedence; no real keys are loaded or printed.

Verified journey: real BCrypt login -> seeded history -> symptom POST/static
guidance -> fictional doctor search -> saved report -> chat unavailable. Additional
checks cover legacy AI paths, anonymous/foreign access, fictional PDF extraction,
and a third seed after another user/API records exist. This evidence must be
reported separately from the counter-handler/InMemory tests, not as browser or
live-AI verification. The helper stopped only the temporary server process it started. All checks passed: two seeds left one symptom/report, login worked, guidance/doctors/report labels were accurate, legacy AI endpoints were disabled, chat returned available:false/503 with zero turns, anonymous reads were 401 and foreign report/chat access was 404. Fictional PDF extraction passed. A third seed preserved the second user, newly submitted symptom and uploaded report (two owned symptom/report records each). Production seed returned nonzero. No credentials or report contents were logged and no live provider calls were made.
The verification password was generated in memory and not retained; use the documented setup and your own private password with a fresh dedicated database for manual demonstrations. No reset/recovery is performed on this verification artifact.
Actual new database: `C:/Users/admin/source/repos/.Net_Project/MAD-AI/.worktrees/backend-demo-runtime/run-353744022bb94723b9be76b29e086a7a/madai.demo.db`.

### Browser evidence and manual checklist

Browser initialization was attempted via computer-use and failed before UI action:
“failed to write kernel assets … path specified”. No actual browser verification
is claimed for this task. When a browser is available:

1. Run the setup, sign in as the seeded Patient using the locally supplied password.
2. Submit fictional intake and search Demo City/General practice. Check static
   guidance and fictional-doctor notices; no live AI/results claims.
3. Open the saved seeded report: static/not-analysis source; chat unavailable.
4. Upload a readable fictional PDF: extraction succeeds, explanation stays static
   and explicitly not report analysis. Do not upload real health data.
5. Log out; real routes require login. Public `#/demo` and its directory/report
   sample remain independent, account-free frontend simulations.

## Limits and delivery

Provider-off means a functional local demo, not symptom-dependent medical guidance
or report-specific AI analysis. Chat is intentionally unavailable. Normal mode and
live-provider quality are not runtime-verified against real services; they remain
stub/regression evidence only. Backend hosting, OCR, password reset, RAG and
dependency remediation are deferred. Existing dependency vulnerabilities remain.
The SQLite database stores fictional user/report/symptom data; no original PDF
bytes are retained. Seeded report text is a sample, not proof of PDF parsing;
separate upload tests/runtime checks establish parser behavior. The mode guard
covers existing factory-managed HTTP integrations, not arbitrary future direct
socket/network code. No database reset or credential recovery command is supplied.

Task diff reviewed and diff check passed. Commit only named task files, push without force
and create a PR into develop for Umar's manual review. Do not merge/close, enable
auto-merge, change hosting or deploy. Report remote CI separately from local checks.
