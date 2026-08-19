# Frontend Testing Notes

These notes describe the small frontend test foundation added for Madai.

## How To Run Tests

From the frontend folder:

```powershell
cd MAD-AI_FrontEnd\MAD-AI_FrontEnd-main
npm test -- --watchAll=false
```

To confirm the production build still works:

```powershell
cd MAD-AI_FrontEnd\MAD-AI_FrontEnd-main
npm run build
```

## Current Test Setup

The frontend uses the Create React App test setup:

- `react-scripts test`
- Jest
- React Testing Library
- `@testing-library/jest-dom`
- `src/setupTests.js`

The test setup includes basic browser-like mocks for `localStorage`, `fetch`, and `axios`.

## Tests Added Or Stabilized

Current basic tests cover:

- App smoke rendering through the Madai home route.
- Login page form fields and visible actions.
- Register page form fields and submit action.
- Protected route redirect for an unauthenticated user.
- Symptom checker disclaimer and mocked demo submit flow.
- Medical report upload warning and empty history state.
- Recommendation page render and simple mocked search behavior.

These tests use user-visible labels, button names, and safety text where practical. That makes them easier to understand and less tied to CSS classes or internal component details.

## API Mocking Policy

Frontend tests must not call the real ASP.NET Core backend.

Why:

- Tests should run without backend startup.
- Tests should not need real secrets, tokens, API keys, or database files.
- Health-related demo flows must not send private data anywhere.
- CI should be deterministic and safe.

Current tests mock:

- Auth API functions for login/register render tests.
- Feature API functions for symptom checker and report history.
- `fetch` for recommendation demo data.
- `axios.get` for the home page blog request.

All test data must stay clearly fictional, using names such as Demo Patient and URLs such as `example.test`.

## What Tests Do Not Cover Yet

Needs verification:

- Failed login behavior.
- Register submit success/error behavior.
- Profile loading and update states.
- Symptom checker 401 and validation branches.
- Doctor search API success/error behavior.
- Report upload non-PDF and oversized-file validation.
- Full navigation across all protected pages.
- Browser-based visual checks across mobile and desktop.

## CI Status

Frontend CI currently runs dependency installation and `npm run build`.

Tests are not yet required in CI because local validation in the Codex PowerShell shell could not run `npm`; the command was unavailable on PATH. After tests pass in a local Node/npm environment or in GitHub Actions, the next CI task should add:

```yaml
- name: Test frontend
  run: npm test -- --watchAll=false
```

before the build step.

## Next Frontend Testing Tasks

Recommended small follow-up tasks:

- Run `npm test -- --watchAll=false` locally with Node/npm available.
- Fix any test runtime issues found by the real Jest runner.
- Add frontend tests to GitHub Actions after they pass.
- Add one failed-login test.
- Add one profile screen test.
- Add one doctor search empty-results test.
- Add report upload validation tests for non-PDF and oversized files.
