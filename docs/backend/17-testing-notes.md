# Backend Testing Notes

These notes describe the small backend test foundation added for Madai.

## How To Run Backend Tests

From the backend folder:

```powershell
cd MAD-AI_BackEnd-develop
dotnet restore MADAI-BACKEND.sln
dotnet build MADAI-BACKEND.sln --configuration Release --no-restore
dotnet test MADAI-BACKEND.sln --configuration Release --no-build
```

## Current Test Project

Test project:

- `MAD-AI_BackEnd-develop/tests/Madai.Backend.Tests/Madai.Backend.Tests.csproj`

The project uses:

- xUnit
- `Microsoft.NET.Test.Sdk`
- EF Core InMemory for isolated controller tests
- Simple fake service classes instead of a mocking framework

The test project is included in `MADAI-BACKEND.sln`. The main web project excludes `tests/**/*.cs` so backend test files are not compiled into the application.

## Tests Added

Current backend tests cover:

- DTO validation for signup email format.
- DTO validation for safe profile update data.
- DTO validation for missing symptom text.
- `DoctorService` fallback behavior when the Google Maps key is a placeholder.
- `SymptomService` fallback behavior when the OpenRouter key is a placeholder.
- `MedicalReportController` rejection of non-PDF uploads before calling report analysis.
- `UserController.GetMyProfile` returning `UserProfileDTO` without exposing `PasswordHash`.

These tests use fictional demo values only, such as `demo.patient@example.test` and `Demo Patient`.

## Why Tests Do Not Call Real External APIs

Backend tests must not call real AI providers, Google Maps/Places, OpenRouter, production databases, uploaded PDFs, or private services.

Reasons:

- Tests should run safely in CI without secrets.
- Tests should be deterministic and not depend on external network state.
- This is a health-related portfolio demo, so no real patient data or private health information should leave the machine.
- Missing API keys should be handled gracefully by the app, not by failing tests.

The fallback tests use fake HTTP handlers that throw if an external HTTP call is attempted. Passing tests confirm the service returns demo-safe data before any real provider call is made.

## What Tests Do Not Cover Yet

Needs verification:

- Auth signin success/failure with hashed demo users.
- Signup duplicate email and admin-creation rules.
- `SymptomCheckerController` authenticated save/analyze flow.
- Medical report upload success path with a fake PDF stream.
- Report download disabled behavior.
- AI recommendation fallback/service behavior.
- Full API integration tests with `WebApplicationFactory`.
- Authorization policy tests for Admin vs Patient endpoints.

## CI Status

Backend CI already has a conditional test step:

```yaml
dotnet test MADAI-BACKEND.sln --configuration Release --no-build
```

Now that `Madai.Backend.Tests.csproj` exists and is included in the solution, GitHub Actions should discover and run backend tests after the release build.

## Latest Local Validation

Validation completed:

- `dotnet restore MADAI-BACKEND.sln` passed.
- `dotnet build MADAI-BACKEND.sln --configuration Release --no-restore` passed with 0 warnings and 0 errors.
- `dotnet test MADAI-BACKEND.sln --configuration Release --no-build` passed: 7 tests.

Note: `dotnet restore` needed permission to read the normal user-level NuGet configuration in this Codex sandbox.

## Next Backend Testing Tasks

Recommended small follow-up tasks:

- Add one auth signin failure test.
- Add one auth signin success test using a fake demo user.
- Add one `SymptomCheckerController` authenticated flow test.
- Add one report download disabled test.
- Add one medical report oversized-file validation test.
- Add one CI artifact-safety check for `*.db`, uploads, `bin`, and `obj`.
