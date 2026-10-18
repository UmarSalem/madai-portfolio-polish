# Madai: report-grounded follow-up chat

## Scope and base

2026-10-16. Branch `feature/report-follow-up-chat`, isolated worktree
`C:/Users/admin/source/repos/.Net_Project/MAD-AI/.worktrees/report-chat`.
Fetched origin and independently checked GitHub: PRs #23 and #24 are merged
into develop (be41dee and 1d8e87d). Base is
`1d8e87dbfd9b380f1a455003285c404127939b7f`. No PR was merged or closed by this
task. Read README, repository review instructions and report-extraction notes;
no applicable AGENTS.md found. Existing worktrees/uncommitted work and the
original progress audit were retained. No parallel agents or hosting changes.

Madai is a bachelor group project created by multiple students. This portfolio
slice retains that attribution; it is not a claim of sole original authorship.

## Plain-English flow for Umar

Open a saved report through the existing authenticated report screen. Its detail
now contains a chat section. React loads that report's saved conversation using
the existing bearer-token HTTP client. A question POST contains only `question`;
report contents and prior messages sent by a client are ignored.

The .NET controller checks the JWT user and selects the report using both its ID
and owner ID before reading conversation or calling a provider. Missing/foreign
reports return 404; anonymous requests return 401. The server then loads the
stored extracted text and recent successful exchanges for that same user/report.
They are packaged as JSON data under a system instruction that treats all text
as untrusted, explains only supported report information, acknowledges missing
information, and forbids invented findings, diagnosis and treatment instructions.
Old answers are not evidence. Prompts cannot guarantee live model compliance.

A valid provider answer and its question are saved together as one ReportChatTurn
row. Failed calls save neither an assistant answer nor a successful exchange.
Reload reads persisted rows from SQLite, not browser storage. The returned source
is `provider`; UI says **Provider-generated response — not medical advice**.
Without a usable provider or extracted report text, chat is unavailable. There
are no simulated report-specific answers and no chat in the public seeded demo.

## Bounds, states and storage

- Question: trimmed, 1–1,000 characters; POST body limit 16 KiB.
- Report context: at most 5,000 characters from owned stored ExtractedText.
  Existing truncation metadata is respected; UI discloses omitted content.
- Provider history: at most six recent successful exchanges, also limited to
  8,000 combined question/answer characters; oldest whole exchanges are omitted.
- Display/history API: latest 20 successful exchanges, oldest first within that
  window. All successful rows remain stored; no pagination/retention policy added.
- Provider output: requests max_tokens=1000, rejects empty or >4,000-character
  answers; response envelope read is capped at 64 KiB. Invalid responses are 502.
- Timeout: 30 seconds by default, configurable/clamped to 1–30; timeout is 504.
- Provider missing/misconfigured: 503; missing report excerpt: 409; already
  pending on the same report: 409. UI preserves a failed question for retry.

The UI disables submission while waiting and uses a synchronous pending ref to
block rapid duplicate submits. A per-report server gate rejects concurrent sends
in this single process and removes its entry in finally. This is not distributed
locking or durable idempotency: after an ambiguous connection failure, reload
before retrying to see whether a turn was already saved.

The keyed chat component unmounts when report selection changes; late requests
cannot put the previous report's messages under the new report. Loading,
validation/authentication/provider/timeout errors and reload/retry states are
explicit. Report and chat text render as escaped React text, not HTML.

EF migration `ReportFollowUpChat` adds only ReportChatTurns: ID, report FK,
owner ID, question, answer, UTC creation time, context-truncated flag; indexed by
report/user/time. Report deletion cascades to conversation. No report PDF bytes,
keys or tokens are added to storage. Successful fictional questions/answers do
persist locally, so this must not be used with real health information. No
application logging of report text, questions, answers or credentials was added.

## Files and configuration

Backend: ReportChatController/DTO, ReportChatService, ReportChatTurn, DbContext,
DI registration and generated migration/designer/snapshot. Frontend:
api/features.js send/history wrappers, ReportChat.jsx mounted only in the real
saved-report detail, focused ReportChat tests, and an isolated child mock in the
existing report-screen tests. Upload/history/guards/hash router/demo are preserved.

Reuses `OpenRouter:ApiKey`, IHttpClientFactory, the existing OpenRouter endpoint
and model (`deepseek/deepseek-r1-zero:free`). No new provider/dependency. Missing,
demo/replace/placeholder keys disable chat. Model availability and live AI quality
are unverified. Optional `OpenRouter:ChatTimeoutSeconds` defaults to 30.

For deterministic real-HTTP verification only, `OpenRouter:ChatTestEndpoint` may
override chat routing with an HTTP loopback URL **only in Development**; any other
override is rejected. Tests use a dummy `local-stub-key`, never a real key. This
override affects chat only: seed reports with providers disabled first, then
restart for chat-stub checks and do not invoke upload/other provider features
while the dummy test key is enabled. Production uses the existing fixed endpoint.

## Commands and results

Actual frontend directory: `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main`.
Host npm is absent from PATH; used the existing npm 10.9.4 CLI with
`node <cli> <arguments>` for these equivalent commands:

```powershell
npm ci
$env:CI='true'
$env:PUBLIC_URL='/madai-portfolio-polish'
$env:REACT_APP_ROUTER_MODE='hash'
$env:REACT_APP_API_BASE_URL='http://127.0.0.1:5129'
npm run build
npm test -- --watchAll=false --runInBand
```

CLI path:
`C:/Users/admin/source/repos/.Net_Project/MAD-AI/.worktrees/demo-mode/MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/node_modules/.task-tooling/package/bin/npm-cli.js`.
Install passed: 1,434 packages added, 1,435 audited in 10 minutes; unchanged 106
vulnerabilities (6 low, 15 moderate, 81 high, 4 critical). No dependency/lockfile
change. All frontend tests passed: 11 suites / 53 tests, zero failures/skips (52.338 seconds). CI-mode production build passed with lint enabled: gzip JS 107.13 kB (main.c1a7e558.js), CSS 6.9 kB (main.1df89e02.css). Existing fs.F_OK and stale Browserslist notices only.

Actual backend directory: `MAD-AI_BackEnd-develop`:

```powershell
dotnet ef migrations add ReportFollowUpChat --project MADAI-BACKEND.csproj
dotnet build MADAI-BACKEND.sln --configuration Release
dotnet test MADAI-BACKEND.sln --configuration Release --no-build
```

Migration generated with existing EF tool 8.0.22 (older-than-runtime warning;
runtime 9.0.3); no upgrade. Release build passed, zero warnings/errors.
All **41 backend tests passed**, none skipped. Focused chat tests use a local
HttpMessageHandler stub and EF InMemory: anonymous/other-owner rejection on both
actions, report/user isolation, payload bounds and server context, two-turn
persistence/reload, unavailable/empty-context, provider HTTP/empty/malformed/
oversized/envelope failures, timeout and concurrent send/retry cleanup.
Frontend tests mock feature clients; test pending/duplicate submissions,
follow-up/reload, unavailable/error/auth states and late responses after switching
reports. These automated stubs are not evidence of live AI or browser behavior.

### Actual local API/database journey

Temporary helpers/fixtures are outside feature files in the original checkout's
`.worktrees/chat-runtime/`. Ran the real Release .NET app on loopback 5129, with
an isolated SQLite database `fictional-chat.db`, migrations enabled, ephemeral
JWT key held in process environment, MADAI issuer/MADAIUsers audience, CORS
origin `http://127.0.0.1:4178`, and Microsoft logging restricted to Warning.
No existing database/config was changed; no report/chat contents or tokens were
printed. The existing HTTP-only development HTTPS redirect warning appeared.

From original checkout, temporary helpers:

```powershell
& ./.worktrees/chat-runtime/start-api.ps1
& ./.worktrees/chat-runtime/seed.ps1
& ./.worktrees/chat-runtime/verify-chat.ps1
# Stop only the temporary API, then:
node .worktrees/chat-runtime/provider-stub.cjs
& ./.worktrees/chat-runtime/start-api.ps1 -Stub
& ./.worktrees/chat-runtime/verify-chat.ps1
```

First phase uses `OpenRouter__ApiKey=demo-disabled`, validates existing fictional
PDF upload/extraction/history and seeds two owned reports. Anonymous send/history
returned 401, another account's send/history returned 404, missing-provider send
returned 503 with no turn. All PASS through real middleware/SQLite.

Second phase restarts the actual API against the same DB with dummy key,
`OpenRouter__ChatTestEndpoint=http://127.0.0.1:5131/chat` and
`OpenRouter__ChatTimeoutSeconds=1`. The local Node HTTP stub never logs payloads;
it returns an explicitly labelled LOCAL PROVIDER STUB ONLY answer, verifies
selected report text and prior follow-up history, and supports controlled errors.
Question -> follow-up -> GET reload passed; forged client reportText/history were
ignored; a second report had zero turns. Provider failure/empty reply/slow response
returned 502/502/504 and the database conversation stayed at two successful turns.
No paid or live provider calls. The running API uses normal JWT middleware and
fresh EF request scopes; this evidence is separate from InMemory/controller tests. The temporary API and loopback stub were stopped after verification; isolated fictional data/helpers remain outside task changes.

### Browser blocker and short manual checklist

Attempted browser initialization via computer-use; it failed before any UI action:
“failed to write kernel assets … path specified”. No browser verification claimed.
Manual check with fictional data and a local stub when tools are available:

1. Start the isolated API/stub and React build/dev server with matching API/CORS
   settings. Sign in as the fictional report owner; open one saved report.
2. Ask a fictional question and follow-up. Confirm loading/disabled send, provider
   label and truncation notice; reload the conversation/page and compare turns.
3. Switch reports while a request is pending. Confirm no old messages appear in
   the newly selected report; return to the original and reload its saved turns.
4. Exercise unavailable provider, stub failure and timeout; confirm clear errors,
   retained input and no successful assistant message. Verify another account
   cannot load/send against the original report ID.
5. Log out and check protected routes; public `/demo/reports` stays a seeded sample
   with no chat. Do not enter real health data or enable real provider calls.

## Delivery and remaining limits

Task diff reviewed and git diff --check passed. No dependency, hosting, secret, PDF or database artifacts are included. Commit only task
files; push without force and open PR into develop for Umar. Do not merge/close,
enable auto-merge or deploy. Report remote CI separately from local evidence.

Live AI quality, clinical safety, instruction adherence and model availability
remain unverified; a grounded prompt is not a guarantee. Backend hosting, streaming,
OCR, RAG/vector storage, agents and dependency remediation are deferred. Chat uses
only the previously saved excerpt, not the original PDF or earlier omitted pages.
History sent to providers/displayed is bounded; stored successful turns have no
retention/delete-conversation UI yet. The per-process pending gate is not a
multi-instance lock. Ambiguous transport retries are not idempotent. Browser/mobile/
accessibility checks remain manual. Existing 106 dependency vulnerabilities remain.
