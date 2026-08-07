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

The workflow does not run frontend tests yet. The repository has existing test files, but they should be reviewed and stabilized before tests become required PR checks.

The workflow does not set `CI=false`. If Create React App build warnings fail in GitHub Actions, the next step should be to review and fix the warnings or document a temporary exception.

### Backend CI

File: `.github/workflows/backend-ci.yml`

The backend workflow:

- Checks out the repository.
- Installs the .NET 8 SDK.
- Uses the backend folder `MAD-AI_BackEnd-develop`.
- Runs `dotnet restore MADAI-BACKEND.sln`.
- Runs `dotnet build MADAI-BACKEND.sln --configuration Release --no-restore`.
- Runs `dotnet test` only if a backend test project is added later.

The current backend has no separate test project. The workflow is ready to run tests later when a test project exists.

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
- No backend test project exists yet, so `dotnet test` is not required by CI yet.

Frontend validation:

- Local frontend build could not be run in this shell because Node/npm are not available on the local PATH.
- Frontend config now uses `REACT_APP_API_BASE_URL` with a localhost fallback.
- GitHub Actions installs Node.js LTS and runs the build on GitHub.

## Still Needed Later

- Frontend deployment workflow.
- Backend deployment workflow.
- Frontend test coverage.
- Backend test coverage.
- Docker build and publish workflow, if Docker deployment is chosen.
- Secret scanning check.
- Artifact safety check for database files, upload files, `bin/`, `obj/`, `node_modules/`, `build/`, `dist/`, and `coverage/`.
