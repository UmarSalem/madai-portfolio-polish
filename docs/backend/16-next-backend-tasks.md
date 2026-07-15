# Next Backend Tasks

Small GitHub-style tasks for future backend branches.

## API Safety

- [ ] Add centralized error-handling middleware.
- [ ] Replace admin user entity responses with safe DTOs.
- [ ] Harden `AIRecommendationService` with missing-key fallback.
- [ ] Remove reset token from forgot-password API response before production.
- [ ] Remove reset token console logging.

## Validation

- [ ] Add request validation for signup password length.
- [ ] Add stricter email normalization/checks.
- [ ] Add upload request size limits at ASP.NET Core level.
- [ ] Add validation tests for report upload.

## Auth

- [ ] Add one backend test for `AuthController` signin success/failure.
- [ ] Add one backend test for `UserController.GetMyProfile`.
- [ ] Review JWT expiry configuration.
- [ ] Document production token strategy.

## Feature Tests

- [ ] Add one test for `SymptomCheckerController`.
- [ ] Add one test for `DoctorsController` demo fallback.
- [ ] Add one test for `MedicalReportController` non-PDF rejection.
- [ ] Add one test for report download disabled behavior.

## Deployment

- [ ] Add `/health` endpoint.
- [ ] Add backend GitHub Actions build workflow.
- [ ] Prepare Linux-friendly Dockerfile.
- [ ] Add production CORS configuration.
- [ ] Add deployment environment variable checklist to README or deployment docs.

## Cleanup

- [ ] Remove `WeatherForecastController` if not needed.
- [ ] Review unused packages.
- [ ] Confirm SQLite vs managed database deployment strategy.
- [ ] Confirm Swagger production policy.

## Security

- [ ] Add secret scan step to CI.
- [ ] Add no-upload-artifacts check to CI.
- [ ] Add logging rules for sensitive health data.
- [ ] Review security headers/rate limiting options.
