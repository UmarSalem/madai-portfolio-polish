# Madai Backend Overview

The Madai backend is an ASP.NET Core Web API. It supports the React frontend with authentication, profile data, symptom checking, doctor search, medical report upload/history, and AI-related demo features.

Madai is an educational portfolio demo. It must use fake/demo data only and must not store or expose real patient data, private health information, secrets, API keys, database passwords, JWT secrets, or tokens.

## Main Responsibilities

- Accept HTTP requests from the React frontend.
- Register and sign in demo users.
- Create JWT tokens for authenticated requests.
- Protect patient/admin routes with `[Authorize]` and role checks.
- Store local demo data through EF Core and SQLite.
- Call service classes for business logic and external integrations.
- Return DTOs instead of exposing sensitive entities where possible.
- Provide Swagger documentation in development.

## Main API Areas

- Auth: `AuthController`
- User/profile: `UserController`
- Symptom checker: `SymptomCheckerController`
- Doctor search: `DoctorsController`
- Medical report upload/history: `MedicalReportController`, `UserController`, `MedicalHistoryService`

## Frontend Connection

The React frontend calls backend endpoints through Axios. The frontend sends a bearer token for protected endpoints:

```text
Authorization: Bearer <token>
```

The backend validates the token using JWT bearer authentication configured in `Program.cs`.

See also:

- [Frontend learning notes](../frontend/01-frontend-overview.md)
- [API contract](../api-contract.md)

## Run Backend Locally

```powershell
cd MAD-AI_BackEnd-develop
dotnet restore
dotnet run
```

The development launch profile uses:

```text
http://localhost:5122
```

Swagger opens at:

```text
http://localhost:5122/swagger
```

## Build Backend

```powershell
cd MAD-AI_BackEnd-develop
dotnet build
```

## What Still Needs Improvement

- Add automated backend tests.
- Add centralized error handling middleware.
- Harden AI recommendation endpoints with safe demo fallbacks.
- Add production-safe CORS configuration.
- Replace Windows Nano Server Dockerfile with a Linux-friendly deployment path if using common hosts.
- Add a health endpoint.
- Review admin endpoints for safe DTO responses.
- Keep database, upload files, and secrets out of Git.
