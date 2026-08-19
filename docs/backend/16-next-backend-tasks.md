# Next Backend Tasks

Small GitHub-style tasks for future backend branches.

## API Safety

- [ ] Add centralized error-handling middleware.
- [ ] Replace admin user entity responses with safe DTOs.
- [x] Harden `AIRecommendationService` with missing-key fallback.
- [ ] Remove reset token from forgot-password API response before production.
- [x] Remove reset token console logging.

## Validation

- [ ] Add request validation for signup password length.
- [ ] Add stricter email normalization/checks.
- [ ] Add upload request size limits at ASP.NET Core level.
- [x] Add basic DTO validation tests.
- [x] Add validation tests for non-PDF report upload rejection.
- [ ] Add validation tests for oversized report upload.

## Auth

- [ ] Add one backend test for `AuthController` signin success/failure.
- [x] Add one backend test for `UserController.GetMyProfile`.
- [ ] Review JWT expiry configuration.
- [ ] Document production token strategy.

## Feature Tests

- [ ] Add one test for `SymptomCheckerController`.
- [x] Add one test for doctor search demo fallback.
- [x] Add one test for symptom service demo fallback.
- [x] Add one test for `MedicalReportController` non-PDF rejection.
- [ ] Add one test for report download disabled behavior.

## Deployment

- [ ] Add `/health` endpoint.
- [x] Add backend GitHub Actions build workflow.
- [x] Add backend test project to the solution so CI can run `dotnet test`.
- [ ] Prepare Linux-friendly Dockerfile.
- [x] Add environment-based CORS origin configuration.
- [ ] Add deployment environment variable checklist to README or deployment docs.

## Cleanup

- [x] Remove `WeatherForecastController` if not needed.
- [ ] Review unused packages.
- [ ] Confirm SQLite vs managed database deployment strategy.
- [ ] Confirm Swagger production policy.

## Security

- [ ] Add secret scan step to CI.
- [ ] Add no-upload-artifacts check to CI.
- [ ] Add logging rules for sensitive health data.
- [ ] Review security headers/rate limiting options.
