# Backend Architecture

The backend follows a common ASP.NET Core Web API structure: controllers receive HTTP requests, services hold business/external API logic, EF Core manages database access, models represent database entities, and DTOs shape API input/output.

## Folder Structure

```text
MAD-AI_BackEnd-develop/
  Controllers/
  Services/
  Contracts/
  Models/
    DTO/
  Data/
  Migrations/
  Properties/
  Program.cs
  appsettings.json
  appsettings.Example.json
  Dockerfile
```

## Controllers

Controllers define HTTP endpoints. They should stay thin: validate the request, get the current user, call services/database, and return a response.

Examples:

- `AuthController`
- `UserController`
- `SymptomCheckerController`
- `DoctorsController`
- `MedicalReportController`

## Services

Services contain business logic and external provider calls.

Examples:

- `AuthService`: sign in, signup, password reset.
- `JwtService`: creates JWT tokens.
- `SymptomService`: symptom AI/demo fallback.
- `DoctorService`: Google Places/demo fallback.
- `MedicalReportService`: PDF extraction, AI/demo fallback.
- `MedicalHistoryService`: builds safe history DTOs.
- `AIRecommendationService`: recommendation AI calls. Needs safety hardening.

## Contracts/Interfaces

Contracts define service shapes, such as:

- `IAuthService`
- `ISymptomService`
- `IDoctorService`
- `IMedicalReportService`
- `IMedicalHistoryService`
- `IAIRecommendationService`

Interfaces make dependency injection and testing easier.

## Models

Models are EF Core database entities:

- `User`
- `SymptomEntry`
- `AnalysisResult`
- `MedicalReport`
- `PasswordResetToken`

These can contain database/navigation fields and should not always be returned directly to the frontend.

## DTOs

DTOs shape request and response data. Examples:

- `SignupRequestDTO`
- `SignInResponseDTO`
- `UserProfileDTO`
- `SymptomEntryCreateDTO`
- `AnalysisResultDTO`
- `DoctorDto`
- `MedicalReportSummaryDTO`

DTOs help avoid exposing sensitive entity fields like password hashes or file bytes.

## Data/AppDbContext

`Data/DbContext.cs` defines `AppDbContext`, the EF Core database context. It includes `DbSet` properties and relationship configuration.

## Migrations

`Migrations/` stores EF Core migration files. They describe how the database schema is created or changed.

## Strengths

- Clear controller/service/DTO structure.
- JWT auth and role authorization are configured.
- Swagger is enabled for development.
- Several sensitive flows now return safe DTOs and demo fallbacks.
- Service interfaces exist for core features.

## Weaknesses

- Some controllers still use `AppDbContext` directly for logic that could move into services.
- Some admin/user endpoints still return entity objects. Needs verification.
- Error handling is mostly local try/catch or direct status returns.
- `WeatherForecastController` is still present.
- Recommendation AI service does not yet have the same safe fallback pattern as symptom/report/doctor services.

## Suggested Improvements

- Add centralized error-handling middleware.
- Add tests for controllers and services.
- Use DTOs consistently for all responses.
- Move more business logic out of controllers.
- Add health checks.
- Improve deployment configuration.
