# Frontend demo mode and fictional seed data

Date: 2026-10-09. Task branch: `fix/demo-mode-and-seed-data`.
Repository: `UmarSalem/madai-portfolio-polish`. React + ASP.NET Core retained.

## Starting state and preservation

Read README and `docs/github-review-workflow.md`; searched checkout and ancestor
locations for AGENTS.md; none applicable was found. Read the untracked
`docs/learning-notes/chore/madai-progress-audit.md` without modifying or staging it.
The original checkout remains on `codex/github-push-test`. Work is isolated in
`.worktrees/demo-mode`, created from refreshed `origin/develop` after PR #21 merged.

PR #21 head `7a4e1da07fd5d64c805cfc3ac25614bb10c05bcc` had successful frontend
run [37883776233](https://github.com/UmarSalem/madai-portfolio-polish/actions/runs/37883776233)
and backend run [37883776327](https://github.com/UmarSalem/madai-portfolio-polish/actions/runs/37883776327).
Merged using the expected head SHA, preserving authorship, at
`3f37ae9681886cd2bd9e7e343201b33cfa1852c9`.
Its subsequent frontend/Pages run
[37907543425](https://github.com/UmarSalem/madai-portfolio-polish/actions/runs/37907543425)
and backend run
[37907543421](https://github.com/UmarSalem/madai-portfolio-polish/actions/runs/37907543421)
passed. Public Home and About rendered; direct `#/doctor` redirected to `#/login`.
Mobile browser viewport: 390 × 844. No backend login was attempted.

## What changed and why

- Dedicated public routes `#/demo`, `#/demo/doctors`, `#/demo/reports` reuse
  SymptomChecker, DoctorSearch and MedicalHistory with an explicit demo prop.
  Existing real routes still use unchanged ProtectedRoute authentication checks.
  Route keys remount demo screens so transient selections/results reset on return.
- Home and About offer “Explore frontend demo — no login”. The disconnected
  backend notice explains where to find fictional examples.
- A shared demo notice and wrapping navigation identify frontend demo mode,
  simulated responses, fictional data and the Exit demo action on every screen.
- Two static symptom/question scenarios have read-only names and text. The
  response is prewritten, explicitly labelled and produced without API calls.
- Two fictional clinics support specialty filtering and a deliberate empty
  Dermatology result. No live search, ratings, contact links or booking actions.
- One fictional report card demonstrates the existing layout. Demo mode has
  no file chooser or upload action; its text says no file was uploaded, read
  or analysed. The sample date is fictional, not an upload timestamp.
- Demo has no free-text health inputs, browser-storage writes, session tokens,
  file-content reads or network feature requests. Only fixed source fixtures
  are displayed; it does not create a real account or backend seed database.
- Demo.test.jsx checks the connected hash-navigation journey, scenario changes,
  filtering/empty state, report provenance/no file input, all three direct demo
  entries, zero feature API calls/storage writes, and preserved real-route guards
  including profile. App.test.js checks the discoverable Home entry link.

## Commands and actual local results

Root: `git status --short`, `git remote -v`, `git fetch origin`,
`git worktree add .worktrees/demo-mode -b fix/demo-mode-and-seed-data origin/develop`.
Fetch/worktree metadata needed sandbox escalation; approved and successful.
GitHub connector checked and merged PR #21. The connector's commit-workflow
lookup only includes PR runs, so public GitHub REST was used for push/deploy runs.

Frontend commands use Node directly because npm is absent from PATH:

```powershell
node ../../package/bin/npm-cli.js ci
$env:CI='true'
$env:PUBLIC_URL='/madai-portfolio-polish'
$env:REACT_APP_ROUTER_MODE='hash'
node node_modules/react-scripts/bin/react-scripts.js build
node node_modules/react-scripts/bin/react-scripts.js test --watchAll=false --runInBand
```

The npm 10.9.4 CLI was downloaded from the official npm registry into temporary
worktree tooling; it is not part of the commit. No manifest/lockfile upgrades.
An initial junction to the original checkout's installed dependencies exposed
stale jsdom 29/Jest 27 incompatibility: nine suites failed initialization, zero
tests ran. Its build was stopped without a result. The junction was removed
without changing original dependencies. An initial npm ci failed with EPERM on
the external npm cache; rerun with approved escalation to install the lockfile.

Clean `npm ci`: passed, 1,434 packages added / 1,435 audited; reported 106
vulnerabilities (6 low, 15 moderate, 81 high, 4 critical). Lockfile unchanged.
Temporary CLI/archive were moved under ignored `node_modules/.task-tooling`
after installation so they do not become task changes.

First clean test run: 7 suites passed / 2 failed, 20 tests passed / 10 failed.
The new no-login link made the existing `/login/i` query ambiguous; changed it
to exact “Login”. A wildcard API import included Babel's default export object
in the no-call assertion; changed to explicit named mocks and a Storage.setItem
spy. These were test-code fixes, not failing application requests.
Rerun: **9 suites / 30 tests passed**, zero failed/skipped (24.691 seconds).
All eight original suites remain; nine demo cases were added. The connected
demo journey, fixed inputs, response labels, report/no-file boundary, API/storage
isolation, direct hash entries and five real auth guards all passed.

Production build: **passed with lint enabled**, Pages hash routing and
`/madai-portfolio-polish/` asset prefix. Gzip JS 105 kB / CSS 6.9 kB;
assets `main.d7b16430.js` and `main.1df89e02.css`. Existing Node fs.F_OK deprecation
and stale Browserslist-data notices appeared; no dependency update was made.
`git diff --check`: passed.

Local production preview: `node node_modules/.task-tooling/demo-preview.cjs`,
a temporary loopback-only static server serving the build, not a backend.
Port 4173 was already occupied; used 4175 without changing the other process.
Browser at 390 × 844 verified:
- direct `#/demo` entry and labelled simulated guidance;
- navigation to fictional doctors and displayed Example Family Clinic;
- sample report provenance and zero file inputs;
- reload on `#/demo/reports`, Exit demo → Home and the Home demo entry;
- `#/doctor` → `#/login`, retaining real auth separation.
All three demo screens had document width 375 px within the 390 px viewport,
without horizontal overflow. Visual screenshots were inspected. No real data
or provider calls were used. Responsive browser emulation does not prove every
physical phone/browser combination. Public deployment is verified after merge
and reported on the task PR; it is not inferred from these local tests.

## Attribution and limitations

Verified the connected GitHub account is UmarSalem, numeric id 138657210.
Existing GitHub merge commit `2626804724ef839ca5e69fe5541a34623dd51764` uses
`138657210+UmarSalem@users.noreply.github.com` and GitHub attributes it to UmarSalem.
Use that observed account-specific email for this task's commit; verify pushed
commit attribution on GitHub. Original group-project authorship is retained.

No backend is deployed. Real authentication/API flows remain unavailable on
Pages. Live AI guidance, genuine report analysis and follow-up chat remain
incomplete. Fixed examples are not diagnoses or medical recommendations. Demo
selections reset on navigation/reload; there is no persistence or upload.
106 previously reported dependency vulnerabilities remain outside scope;
no audit fix or dependency upgrade is included. No Python, RAG, agents,
provider integrations, hosting migration or report chat was added.

Resume branch: `fix/demo-mode-and-seed-data`; isolated checkout `.worktrees/demo-mode`.
