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

This task only adds CI. Deployment still needs separate planning for frontend hosting, backend hosting, environment variables, CORS, fake demo data, and privacy rules.

## Current Local Validation

Backend validation:

- `dotnet restore MADAI-BACKEND.sln` succeeded locally.
- `dotnet build MADAI-BACKEND.sln --configuration Release --no-restore` succeeded locally with `0 warnings` and `0 errors`.
- `dotnet test MADAI-BACKEND.sln --configuration Release --no-build` succeeded locally with 11 passing tests.
- Backend tests cover auth signin success/failure, DTO validation, safe external-provider fallbacks, non-PDF upload rejection, and safe profile DTO output.

Frontend validation:

- Local frontend build could not be run in this shell because Node/npm are not available on the local PATH.
- Frontend config now uses `REACT_APP_API_BASE_URL` with a localhost fallback.
- Basic React Testing Library tests have been added for smoke rendering, auth forms, protected route redirect, symptom checker safety text, report upload safety text, and recommendation rendering.
- Local frontend tests could not be run in this shell because Node/npm are not available on the local PATH.
- GitHub Actions installs Node.js LTS and runs the build on GitHub.

Frontend test command, once Node/npm is available:

```powershell
cd MAD-AI_FrontEnd\MAD-AI_FrontEnd-main
npm test -- --watchAll=false
```

Needs verification before adding to CI:

- Run the frontend tests with Node/npm available.
- Fix any Jest/runtime issues.
- Add a `Test frontend` step before `Build frontend` in `.github/workflows/frontend-ci.yml`.

## Still Needed Later

- Frontend deployment workflow.
- Backend deployment workflow.
- Make frontend tests a required CI check after validation.
- More backend test coverage for signup rules, report download behavior, and controller integration flows.
- Docker build and publish workflow, if Docker deployment is chosen.
- Secret scanning check.
- Artifact safety check for database files, upload files, `bin/`, `obj/`, `node_modules/`, `build/`, `dist/`, and `coverage/`.
