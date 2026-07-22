# Madai Full-Stack Overview

Madai is an educational healthcare assistant demo with a React frontend and an ASP.NET Core backend. It supports demo flows for authentication, profile management, fictional symptom checking, doctor search, and safe medical report upload/history.

Madai is not a medical product. It is a portfolio demo and must use fake/demo data only.

## Frontend Responsibilities

- Render pages and forms.
- Manage local UI state such as inputs, loading, errors, empty states, and results.
- Store a demo auth session in localStorage.
- Send requests through Axios API helpers.
- Show safe warnings for health-related features.

Main frontend docs:

- [Frontend notes](../frontend/01-frontend-overview.md)

## Backend Responsibilities

- Expose ASP.NET Core Web API endpoints.
- Register and authenticate demo users.
- Issue and validate JWT bearer tokens.
- Authorize patient/admin endpoints.
- Validate input DTOs.
- Use EF Core for local database reads/writes.
- Call services for AI, maps, report analysis, and business logic.
- Return safe DTO responses.

Main backend docs:

- [Backend notes](../backend/01-backend-overview.md)

## Database Responsibilities

The backend uses EF Core and SQLite for local development. `AppDbContext` manages entities for users, symptom entries, analysis results, medical reports, and password reset tokens.

Database files must not be committed because they can contain private data.

## External Service Responsibilities

Current external integration points:

- OpenRouter-style AI calls for symptom/report/recommendation features.
- Google Maps/Places for doctor search.
- PdfPig for local PDF text extraction.

When provider config is missing or placeholder-only, several services return safe demo fallback data.

## Communication Between Frontend and Backend

The frontend uses `src/api/httpClient.js`, `src/api/auth.js`, and `src/api/features.js`.

The backend uses controllers and routes such as:

- `POST /api/auth/signin`
- `GET /api/user/me`
- `POST /api/SymptomChecker`
- `GET /api/Doctors/search`
- `POST /api/MedicalReport/upload-report`

Authenticated requests include:

```text
Authorization: Bearer <token>
```

## Current Full-Stack Status

Updated/aligned:

- Auth/register/login/profile.
- Symptom checker.
- Doctor search.
- Medical report upload/history safe demo flow.

Still needs verification:

- Recommendation feature.
- Blog/content data source.
- Record/todo flow.
- Full logout UI.
- End-to-end local testing with safe demo users.
- Production CORS/deployment settings.

Related docs:

- [API contract](../api-contract.md)
- [Safety and privacy](../safety-and-privacy.md)
- [Deployment readiness](../deployment-readiness.md)
