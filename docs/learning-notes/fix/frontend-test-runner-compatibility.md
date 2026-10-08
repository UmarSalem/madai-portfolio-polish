# Madai frontend build and test compatibility

Date: 2026-10-06
Branch: `fix/frontend-test-runner-compatibility`
Base: current fetched `origin/develop`, `10f96626c80506f1894c0df2d9d5047f1f5118e7`
Worktree: `C:\Users\admin\.codex\worktrees\frontend-test-runner-compatibility\MAD-AI`

## Scope and preservation

This task changes validation tooling, test setup/assertion timing, frontend CI and this note. React, routing behavior, application API clients, backend and deployment functionality are unchanged. No commit, push, PR creation, merge or deployment was performed.

No applicable AGENTS.md was found in the original checkout, its ancestors, the isolated checkout or its relevant ancestors. README, package files, CRA runner source, test setup and CI were inspected. The original checkout remains on `codex/github-push-test` at `4d81d77cb6d9dca413ad36e1998644f54251ad8a`. Its uncommitted progress audit was preserved; SHA-1 Git blob hash: `8d632f3c50d435c642e6b042f2dabbe869a17cc7`.

## Diagnosis

### npm installation versus the old local dependency layout

The repository establishes npm through `package-lock.json`, README commands and GitHub Actions `npm ci`. The old local `node_modules` instead contained a `.pnpm` layout. The history of how it was installed is unknown.

In that installation, frontend resolution of `eslint-config-react-app` returned MODULE_NOT_FOUND. The existing lockfile includes version 7.0.1 as a dependency of react-scripts. A clean npm ci in the isolated worktree restored its root resolution and the production build passed with CI=true. Thus lint configuration was valid; changing or disabling it would have addressed the wrong cause.

This establishes why the local audit build failed while the reported GitHub clean-install build passed. It does not imply that any package manager is inherently broken: the existing local layout was inconsistent with the project's established install workflow. Keep one package manager and its matching lockfile for this checkout.

### Jest 27 and jsdom environment 29

react-scripts 5.0.1 uses Jest 27. The original manifest separately requested babel-jest 29.7 and jest-environment-jsdom 29.7. Those packages expect the Jest 29 runtime interface.

A fresh reproduction in the preserved original checkout ran ProtectedRoute.test.jsx and failed before executing tests with `Cannot read properties of undefined (reading 'testEnvironmentOptions')`. CRA's environment resolution selected the root environment installed through the pnpm-style tree, whose version was 29.7.0, while Jest core was 27.5.1.

The unchanged clean npm lockfile installation had a nested Jest 27 environment under jest-config and a nested babel-jest 27 under react-scripts, and CRA correctly selected them. Aligning the direct tooling dependencies to 27.5.1 removes the mismatched second major and redundant trees, making the manifest consistent with the runner instead of relying on nesting.

The separate direct jsdom 26 dependency was left unchanged. Jest's browser environment uses its own compatible jsdom dependency (16.7.0 for environment 27.5.1); installing a standalone jsdom version does not select Jest's environment.

### Windows discovery

The standard command initially found zero tests even after clean installation. CRA/Jest constructed absolute patterns with mixed slash/escaped-backslash spelling before a dot-prefixed ancestor (`.codex` here, `.Net_Project` in the original checkout). The reported pattern did not match the normalized test path.

The same glob was checked with micromatch using the dot:true option used by Jest: the mixed pattern failed, while a normalized pattern and the equivalent root-independent pattern matched. The package-level testMatch override retains CRA's extensions, spec/test filenames and __tests__ convention, but starts with `**/src/`. Jest's existing roots still limit discovery to this frontend's src directory. It does not exclude or skip existing tests.

### Failures exposed after discovery

Using equivalent patterns on the unchanged clean install discovered all seven suites: five passed, two failed to initialize, and eight tests passed. The failures were:

- react-router-dom could not be resolved: its legacy main path points to a file absent from the installed package, while its exports map points to its real CommonJS entry. Jest 27's legacy resolution does not handle this package layout correctly. That entry also imports react-router/dom, requiring the corresponding mapping.
- Axios's default index contains ES module imports. Jest 27 loaded that file as CommonJS while generating the old automatic mock, producing an unexpected-token error.

Jest-only mappings now point Axios to its distributed browser CommonJS build and React Router DOM and its DOM subpath to their real CommonJS entries. They do not replace the libraries with fake implementations or alter production resolution.

The old global Axios automock also did not define the return value needed by the application's axios.create(...).interceptors.request.use(...) setup. The explicit isolated test client now supplies mocked get/post/put, create and request-interceptor registration; no backend or provider request is made.

Two recommendation tests returned before their promise-driven state updates finished, creating React act warnings. Those tests now await rendered clinic results and an enabled Search button, retaining the original assertions. The App smoke test also waits for the completed empty-blog state. No application assertions were removed or weakened, and no application bug was fixed as part of this task.

## Changes

| File | Reason |
| --- | --- |
| Frontend package.json | Align babel-jest and jest-environment-jsdom with Jest 27; fix Windows discovery; map modern package entries for the existing runner |
| Frontend package-lock.json | npm-generated dependency alignment/deduplication; maintain manifest consistency |
| Frontend src/setupTests.js | Explicit Axios instance/interceptor test double |
| Frontend src/App.test.js | Await completed mocked blog load and assert its empty state |
| Frontend src/recommendation/Recommendation.test.jsx | Await and assert completed search rendering |
| .github/workflows/frontend-ci.yml | Require npm ci and run non-watch tests after production build |
| This document | Explain diagnosis, evidence, validation and limitations |

The lockfile shrinks mainly because duplicate Jest 27/29 trees collapse to 27. Its new environment's form-data 3.0.5 requires hasown ^2.0.4, so hasown moves from 2.0.2 to 2.0.4. An attempt to retain 2.0.2 failed npm ci consistency validation and was corrected with npm's lockfile generation. This is a required transitive compatibility change. React 19.1.0, react-scripts 5.0.1, React Router 7.6.1, Axios 1.9.0, ESLint 8.57.1 and eslint-config-react-app 7.0.1 remain at their previous locked versions. No framework migration, runner replacement, broad upgrade or forced audit fix was made.

## Commands and results

All frontend commands run in `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main` in the isolated worktree unless noted. Local Node: v24.19.0. npm: 10.9.4.

npm was absent from the shell. A temporary npm 10.9.4 CLI was downloaded under the host's temporary directory, without global installation. The commands below were run through the equivalent invocation:

```powershell
$madaiNpmCli = Join-Path $env:TEMP 'madai-npm-10.9.4/package/bin/npm-cli.js'
node $madaiNpmCli ci
$env:CI='true'
node $madaiNpmCli run build
node $madaiNpmCli test -- --watchAll=false --runInBand
```

| Command | Evidence/result |
| --- | --- |
| git fetch origin | Succeeded; develop remains at the base SHA above |
| npm ci --no-audit --no-fund, original lockfile | Pass; 1,555 packages installed |
| $env:CI='true'; npm run build, clean original dependencies | Pass with lint enabled; no ESLint config changes |
| $env:CI='true'; npm test -- --watchAll=false --runInBand, before discovery fix | Exit 1, zero tests found |
| Same test command with CRA-equivalent --testMatch patterns supplied explicitly | Five passing suites, two failed suites, eight passing tests; exposed resolver problems |
| Original checkout: direct react-scripts test, non-watch, serial, explicit testMatch and --testPathPattern ProtectedRoute | Reproduced environment 29/Jest 27 error; one failed suite, zero executed tests |
| npm install --package-lock-only --ignore-scripts --no-audit --no-fund | Generated lockfile for the two tooling dependencies |
| npm ci with manually retained hasown 2.0.2 | Rejected invalid lockfile; diagnosed form-data's ^2.0.4 requirement and regenerated consistent lock |
| npm ci, final lockfile | Pass; 1,434 packages installed and 1,435 audited; exit 0 |
| $env:CI='true'; npm test -- --watchAll=false --runInBand, final configuration | Pass; seven suites, ten tests, zero failed/skipped; exit 0; 11.945 seconds |
| $env:CI='true'; npm run build, final configuration | Pass; compiled successfully with CI=true and lint enabled; exit 0; JS 102.99 kB gzip, CSS 6.6 kB gzip |
| git diff --check | Pass; only expected LF/CRLF conversion notices |

Seven existing suites contain ten declared tests: Recommendation (4), App (1), Login (1), Register (1), MedicalHistory (1), ProtectedRoute (1), SymptomChecker (1). No suites were removed or added.

Production validation uses CI=true, so CRA continues treating lint warnings as errors. The new CI step uses `npm test -- --watchAll=false --runInBand` with CI set to true. Serial execution keeps memory use predictable and does not omit tests. Normal nonzero install/build/test exits fail the job; there is no continue-on-error, passWithNoTests or lint-disable switch.

## GitHub CI versus local evidence

The earlier audit reported successful frontend/backend CI at develop `10f96626...` and PR #18 head `4d81d77...`; those runs used the old workflow and did not run frontend tests. No new GitHub run exists for these uncommitted changes. Local results do not establish that the updated Linux GitHub job has passed. Verify its first build-and-test run after a later authorized push.

The existing Node setup (`lts/*`) and npm manager are retained in CI. Local validation uses Node 24; the actual LTS patch/npm selected by a future hosted run may differ.

## What Umar should understand

Jest runs tests; jsdom supplies a simulated browser, not a real browser. The Jest environment adapter must match the runner's major version. CRA brings a coordinated set of those tools; independently installing newer majors can break the interface even when npm can install both.

ESLint validates source during the production build. A missing configuration package is a dependency-installation problem, not a reason to remove lint checks. The clean npm install proved the existing configuration works.

package.json describes acceptable dependencies, while package-lock.json records the exact tree npm must install. npm ci replaces generated node_modules from that lockfile and rejects inconsistent manifests/locks. Commit both package files together when a dependency changes, and avoid mixing package-manager-generated layouts.

A passing mocked suite validates only its assertions. These ten tests do not verify a real login/provider/report journey, and jsdom does not prove browser accessibility or deployment. The final npm ci audit reported 106 vulnerabilities (6 low, 15 moderate, 81 high, 4 critical). This is a total for the resulting dependency tree, not evidence that this task introduced them; the original baseline install skipped the audit, so no before/after comparison is established. No audit fixes were applied. A separate scoped security/modernization task is needed before treating the dependency tree as release-ready. Existing package deprecations, Node's fs.F_OK deprecation and stale Browserslist data remain outside this compatibility task; no broad modernization was attempted.

## Draft PR

Suggested commit: `fix: restore frontend build and test compatibility`

Problem: Frontend validation failed locally, and CI did not run frontend tests.

Changes: Align CRA's direct test tooling with Jest 27, repair Windows discovery and Jest-only package resolution, provide an explicit Axios client mock, await existing async test results, and add non-watch frontend tests to the existing npm CI job.

Validation: npm ci passed. With CI=true, npm run build compiled successfully with lint enabled, and npm test -- --watchAll=false --runInBand passed all seven suites and ten tests (zero failed/skipped). git diff --check passed. Updated GitHub CI has not run.

Limitations: Updated GitHub CI has not run. Mocked unit/smoke tests do not establish end-to-end feature completion; backend functionality and deployment were not changed.

## Final result

The final clean installation, production build and exact non-watch serial test command all passed. All seven original suites and ten tests execute; none were removed or skipped. The original audit hash remained unchanged. Only the seven files listed above are changed/untracked in the task worktree. GitHub validation remains pending a later authorized push. No commit, push, merge or deployment was performed.
