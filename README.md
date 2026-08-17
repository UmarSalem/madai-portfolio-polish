# Madai — MAD-AI / My AI Doctor

Madai, also known as MAD-AI / My AI Doctor, is an educational healthcare assistant demo with a React frontend and an ASP.NET Core Web API backend. It includes flows for authentication, symptom checking, doctor search, medical report/history handling, profile management, and content/blog pages.

Madai was originally created as a bachelor group project by multiple students. This repository is my local portfolio-polish version, focused on documenting the architecture, improving deployment readiness, replacing unsafe demo data, and incrementally refactoring selected features. I do not claim sole authorship of the original project.

## Current Status

This project is not production-ready and is not public-deployment safe yet. It is being cleaned, documented, and refactored feature by feature for use as a professional portfolio project.

Before public deployment, the repository must be sanitized so it contains only fake/demo data and no real secrets, private records, API keys, JWT secrets, database files, uploaded reports, or private group/university data.

## Medical Disclaimer

This project is an educational portfolio demo. It is not medical advice, not a diagnosis tool, and not for emergency use. Do not enter real patient data or private health information.

## Tech Stack

- React frontend, currently using Create React App.
- ASP.NET Core Web API backend.
- Entity Framework Core with SQLite for local development.
- JWT authentication.
- AI/external API integration points for symptom/report analysis and doctor search.

## Main Features

- Login and register flows.
- Symptom checker.
- Doctor search and recommendation-style screens.
- Medical report/history upload and viewing flows.
- User profile screen.
- Blog/content pages.

## Local Folder Structure

```text
MAD-AI/
  MAD-AI_FrontEnd/
    MAD-AI_FrontEnd-main/
  MAD-AI_BackEnd-develop/
  docs/
    audit/
    api-contract.md
    architecture.md
    deployment-readiness.md
    frontend-learning-notes.md
    interview-preparation.md
    safety-and-privacy.md
```

## Run Frontend Locally

```powershell
cd MAD-AI_FrontEnd\MAD-AI_FrontEnd-main
npm install
npm start
```

The frontend expects an API base URL. Copy `.env.example` to a local `.env` file and set values for your machine. Do not commit `.env`.

## Run Backend Locally

```powershell
cd MAD-AI_BackEnd-develop
dotnet restore
dotnet run
```

The backend development launch profile uses `http://localhost:5122`. Use local environment variables or a local-only settings file for secrets. Do not commit real API keys, JWT secrets, or production settings.

## Environment Variables

Frontend example:

- `REACT_APP_API_BASE_URL`

Backend examples:

- `Jwt__Key`
- `Jwt__Issuer`
- `Jwt__Audience`
- `ConnectionStrings__DefaultConnection`
- `OpenRouter__ApiKey`
- `GoogleMaps__ApiKey`

See:

- [Frontend `.env.example`](MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/.env.example)
- [Backend `.env.example`](MAD-AI_BackEnd-develop/.env.example)

## Fake/Demo Data Policy

Only fake/demo data may be used in this portfolio version. Do not enter or commit real patient names, real medical records, private health information, real reports, database files containing user data, API keys, JWT secrets, tokens, or private organization data.

Known unsafe local artifacts are listed in [Safety and Privacy](docs/safety-and-privacy.md). They should be removed or replaced before any public repository or deployment.

## Documentation

- [Architecture](docs/architecture.md)
- [Safety and Privacy](docs/safety-and-privacy.md)
- [Deployment Readiness](docs/deployment-readiness.md)
- [API Contract Draft](docs/api-contract.md)
- [Frontend Learning Notes](docs/frontend/01-frontend-overview.md)
- [Backend Learning Notes](docs/backend/01-backend-overview.md)
- [Full-Stack Architecture Notes](docs/fullstack/01-fullstack-overview.md)
- [Older Frontend Learning Notes](docs/frontend-learning-notes.md)
- [Interview Preparation](docs/interview-preparation.md)
- [Technical Audit](docs/audit/medai-technical-audit.md)

Note: the previous audit file keeps its historical filename, but the correct project name going forward is Madai.

## Frontend Learning Notes

Detailed frontend learning and interview notes are in [docs/frontend](docs/frontend/). They explain the current React structure, routes, API integration, auth flow, hooks, feature slices, UI notes, and small next tasks using the actual Madai code.

## Backend Learning Notes

Detailed backend learning and interview notes are in [docs/backend](docs/backend/). They explain the current ASP.NET Core structure, controllers, services, DTOs, EF Core, JWT auth, configuration, external services, file upload safety, deployment readiness, and small next tasks using the actual Madai code.

## Full-Stack Architecture Notes

Detailed full-stack notes are in [docs/fullstack](docs/fullstack/). They connect the React frontend, ASP.NET Core backend, EF Core database, API contracts, auth/token flow, external services, deployment flow, and interview preparation using the actual Madai code.

## CI/CD Status

Basic GitHub Actions build checks are configured for the frontend and backend. These checks validate builds on pull requests and pushes to `develop` and `main`, but they do not deploy anything yet. See [CI/CD](docs/ci-cd.md).

## Frontend Deployment Readiness

The React frontend is configured for a later static preview deployment, with
Vercel recommended for the current `BrowserRouter` setup. Netlify and Cloudflare
Pages fallback configuration is also included. No deployment is automated yet,
and API-backed features require a safe backend URL and reviewed CORS settings.
See [Frontend Static Deployment](docs/frontend-deployment.md).

## Testing

The React frontend has a small React Testing Library foundation for smoke rendering, auth forms, protected-route behavior, and safety warnings on health-related demo screens.

```powershell
cd MAD-AI_FrontEnd\MAD-AI_FrontEnd-main
npm test -- --watchAll=false
```

Frontend tests mock API calls and must not call the real backend, use real patient data, or require secrets. See [Frontend Testing Notes](docs/frontend/13-testing-notes.md).

The ASP.NET Core backend has a small xUnit test foundation for auth signin success/failure, DTO validation, safe fallback behavior when external provider keys are placeholders, non-PDF upload rejection, and safe profile DTO output.

```powershell
cd MAD-AI_BackEnd-develop
dotnet test MADAI-BACKEND.sln --configuration Release --no-build
```

Backend tests must not call real AI providers, Google APIs, production databases, uploaded reports, or require secrets. See [Backend Testing Notes](docs/backend/17-testing-notes.md).

## Known Limitations

- Some older frontend screens may still call json-server style endpoints while the backend exposes ASP.NET API routes. Needs verification.
- Auth/profile, symptom checker, doctor search, and report upload/history have been aligned as vertical slices.
- Backend CORS and deployment origins need verification before public hosting.
- Secrets and private-looking demo data must continue to be checked before public release.
- SQLite database, upload artifacts, and generated build outputs must remain out of Git.
- Tests are limited and should be expanded after each feature contract is stabilized.
- Frontend tests need verification in a Node/npm environment before they become required CI checks.
- The backend Dockerfile is currently Visual Studio/Windows-container oriented and may need changes for common hosting platforms.

## Roadmap

1. Sanitize secrets, database files, uploads, and demo data.
2. Document and align frontend/backend API contracts.
3. Refactor auth/register/profile as the first vertical slice.
4. Refactor symptom checker.
5. Refactor doctor search.
6. Refactor report upload/history.
7. Polish UI and accessibility.
8. Add basic frontend/backend CI.
9. Deploy frontend as a static fake-data demo.
10. Deploy backend only after safety cleanup.
