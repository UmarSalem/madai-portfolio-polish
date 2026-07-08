# Madai Architecture

Madai is structured as a separated frontend and backend project. The frontend is a React single-page app. The backend is an ASP.NET Core Web API with EF Core and SQLite for local development.

## High-Level Architecture

```text
React frontend
  -> Axios/fetch API calls
  -> ASP.NET Core Web API
  -> EF Core / SQLite
  -> Optional external AI and maps services
```

## Frontend Responsibilities

- Render pages and reusable UI components.
- Manage routing between screens.
- Collect form input for login, registration, symptoms, doctor search, profile, and reports.
- Store the local auth token for demo use.
- Send API requests to the backend or temporary demo data sources.
- Show loading, error, empty, and success states.

## Backend Responsibilities

- Authenticate users and issue JWTs.
- Protect patient/admin endpoints with authorization rules.
- Store local development data through EF Core.
- Analyze symptom/report input through AI-provider integration points.
- Search doctors through an external maps/provider integration point.
- Expose API endpoints for frontend features.

## API Communication Flow

1. The frontend reads its API base URL from environment configuration.
2. The user interacts with a page or form.
3. The frontend sends a request with Axios or fetch.
4. Authenticated requests include a bearer token.
5. The backend validates the request, applies authorization, runs service logic, and returns JSON.

Current issue: several frontend screens still call json-server style routes instead of the ASP.NET Core API. See [API Contract Draft](api-contract.md).

## Authentication Flow

1. User submits email and password.
2. Frontend calls backend sign-in endpoint.
3. Backend checks the user and password hash.
4. Backend returns a JWT.
5. Frontend stores the token locally for demo use.
6. Future API calls attach the token as `Authorization: Bearer <token>`.

Current issues:

- Frontend registration route does not match the backend signup route.
- Some screens expect `id`, while the backend returns `UserId`.
- There is no frontend protected-route wrapper yet.
- JWT secrets must be environment-only before public deployment.

## Database/Data Flow

The backend uses EF Core with SQLite for local development. It has entities for users, symptom entries, analysis results, password reset tokens, and medical reports.

For a public portfolio demo, local database files must not be committed. Demo data should be seeded with fictional users and fictional medical examples only.

## External AI and Maps Service Flow

The backend includes service code for:

- OpenRouter-style AI calls for symptom and report analysis.
- Google Maps/Places-style doctor search.

These integrations must use environment variables only. Public demos should avoid sending real health data to any external provider. A fake/demo provider is safer for the first deployed version.

## Current Architecture Problems

- Mixed frontend API strategy: some calls use backend `/api/...` routes, while others use json-server paths.
- Backend CORS is not configured.
- Backend `IDoctorService` registration needs verification.
- Google Maps config key path appears inconsistent with service code.
- Committed database/upload artifacts are not public-safe.
- Some generated backend files are referenced by the project file.
- Tests do not fully match the current app behavior.

## Recommended Refactor Order

1. Auth/register/profile.
2. Symptom checker.
3. Doctor search.
4. Report upload/history.
5. UI polish.
6. CI/CD.
7. Deployment.
