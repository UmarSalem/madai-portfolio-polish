# CI/CD

This page explains the first CI setup for Madai.

## What CI Means

CI means continuous integration. In this project, it means GitHub automatically checks whether the frontend and backend still build when code is pushed or a pull request is opened.

The current workflows are build validation only. They do not deploy the frontend, deploy the backend, publish Docker images, or use production secrets.

## Workflows

### Frontend CI

File: `.github/workflows/frontend-ci.yml`

The frontend workflow:

- Checks out the repository.
- Installs Node.js LTS.
- Uses the frontend folder `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main`.
- Runs `npm ci` when `package-lock.json` exists.
- Falls back to `npm install` if there is no lockfile.
- Runs `npm run build`.

The workflow does not run frontend tests yet. A small frontend test foundation now exists, but the test command still needs verification in a Node/npm environment before it becomes a required PR check.

The workflow does not set `CI=false`. If Create React App build warnings fail in GitHub Actions, the next step should be to review and fix the warnings or document a temporary exception.

### Backend CI

File: `.github/workflows/backend-ci.yml`

The backend workflow:

- Checks out the repository.
- Installs the .NET 8 SDK.
- Uses the backend folder `MAD-AI_BackEnd-develop`.
- Runs `dotnet restore MADAI-BACKEND.sln`.
- Runs `dotnet build MADAI-BACKEND.sln --configuration Release --no-restore`.
- Runs `dotnet test` when a backend test project is present.

The backend now has a separate xUnit test project at `MAD-AI_BackEnd-develop/tests/Madai.Backend.Tests`. Because it is included in `MADAI-BACKEND.sln`, the workflow should run `dotnet test` after the release build.

## When Workflows Run

Both workflows run on:

- Pull requests targeting `develop`.
- Pull requests targeting `main`.
- Pushes to `develop`.
- Pushes to `main`.
- Manual runs from the GitHub Actions tab with `workflow_dispatch`.

## CI Is Not Deployment

CI answers: "Does the project still build?"

Deployment answers: "Can users access the app on a public hosting platform?"

The frontend now has static-hosting configuration and a deployment guide, but
deployment remains a separate manual task. Backend hosting, environment values,
CORS, fake demo data, and privacy checks must be reviewed before connecting a
public frontend to the API.

## Frontend Deployment Status

- Vercel is the recommended first static-hosting target.
- `vercel.json` provides the `BrowserRouter` SPA rewrite.
- `public/_redirects` supports later Netlify or Cloudflare Pages evaluation.
- `REACT_APP_API_BASE_URL` must be set in the hosting provider and must not
  contain a secret.
- No GitHub Actions deployment workflow or Vercel token has been added.
- The selected preview path is a deliberate local `npx vercel deploy` command.
- The frontend workflow's `workflow_dispatch` trigger runs CI build validation;
  it does not deploy.
- `npx vercel --prod` is outside the scope of the manual preview task.
- API-backed preview testing must wait for a safe backend URL and exact CORS
  origin.

See [Frontend Static Deployment](frontend-deployment.md) for provider settings
and post-deployment checks.

### CI Versus Manual Preview

```text
Pull request or push -> GitHub Actions -> npm ci -> npm run build -> no deploy
Developer command    -> npx vercel deploy -> temporary preview URL
```

Keeping these paths separate prevents every push from publishing the healthcare
demo before its safety checks and backend policy are ready.

## Backend Deployment Status

- The backend has a Linux .NET 8 Dockerfile suitable for a Render Web Service.
- `Program.cs` binds to Render's `PORT` and exposes `GET /health`.
- Production CORS is configured only through indexed environment variables.
- JWT startup rejects committed placeholder values outside Development.
- No Render deploy hook, API key, Blueprint, or GitHub Actions deployment job is
  committed.
- Backend deployment should remain manual until the reset-token and public
  health-data submission blockers are resolved.

See [Backend Render Deployment](backend-render-deployment.md) for the manual
service configuration and safety checklist.

## Current Local Validation

Backend validation:

- `dotnet restore MADAI-BACKEND.sln` succeeded locally.
- `dotnet build MADAI-BACKEND.sln --configuration Release --no-restore` succeeded locally with `0 warnings` and `0 errors`.
- `dotnet test MADAI-BACKEND.sln --configuration Release --no-build` succeeded locally with 11 passing tests.
- Backend tests cover auth signin success/failure, DTO validation, safe external-provider fallbacks, non-PDF upload rejection, and safe profile DTO output.
- Render-style Production health, CORS, and ephemeral SQLite migration smoke tests
  passed locally.
- Release publish passed. Docker image build still needs verification because
  Docker is not installed on the local validation machine.

Frontend validation:

- A local production build passed with `CI=true` using the bundled Node
  `v24.19.0` runtime and the installed Create React App build script.
- Frontend config now uses `REACT_APP_API_BASE_URL` with a localhost fallback.
- Basic React Testing Library tests have been added for smoke rendering, auth forms, protected route redirect, symptom checker safety text, report upload safety text, and recommendation rendering.
- The non-interactive test run reported no tests found, including when an
  existing test file was supplied explicitly. Test discovery under Create React
  App 5/Jest 27 and Node 24 needs verification.
- GitHub Actions installs Node.js LTS and runs the build on GitHub.

Frontend test command, once Node/npm is available:

```powershell
cd MAD-AI_FrontEnd\MAD-AI_FrontEnd-main
npm test -- --watchAll=false
```

Needs verification before adding to CI:

- Pin a compatible Node version or fix the Jest discovery/runtime issue.
- Confirm all existing test files are discovered and pass.
- Add a `Test frontend` step before `Build frontend` in `.github/workflows/frontend-ci.yml`.

## Still Needed Later

- Run and inspect the first manual Vercel preview after build/test verification.
- Backend manual Render preview after public-release blockers are resolved.
- Make frontend tests a required CI check after validation.
- More backend test coverage for signup rules, report download behavior, and controller integration flows.
- Docker build and publish workflow, if Docker deployment is chosen.
- Secret scanning check.
- Artifact safety check for database files, upload files, `bin/`, `obj/`, `node_modules/`, `build/`, `dist/`, and `coverage/`.
