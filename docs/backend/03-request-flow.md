# Request Flow

This file explains how a request moves through the Madai backend.

## General Flow

1. React frontend sends an HTTP request.
2. ASP.NET Core receives the request.
3. Middleware runs.
4. CORS checks whether the frontend origin is allowed.
5. JWT authentication checks the bearer token if the route requires auth.
6. Authorization checks roles if `[Authorize(Roles = "...")]` is used.
7. Controller action receives the request.
8. DTO/model binding maps JSON/form-data/query values to C# objects.
9. Controller validates `ModelState` or input values.
10. Service handles business/external logic if needed.
11. EF Core reads/writes database data if needed.
12. Controller returns a DTO/status response.
13. React receives the response.

## Login Flow

```text
React Login.jsx
  -> POST /api/auth/signin
  -> AuthController.SignIn
  -> AuthService.SignIn
  -> EF Core finds user by email
  -> BCrypt verifies password
  -> JwtService.GenerateToken
  -> SignInResponseDTO returned
  -> React stores normalized auth session
```

## Profile Flow

```text
React Profile.jsx
  -> GET /api/user/me with bearer token
  -> JWT middleware validates token
  -> UserController.GetMyProfile
  -> ClaimTypes.NameIdentifier gives user id
  -> EF Core loads User
  -> UserProfileDTO returned
```

## Symptom Checker Flow

```text
React SymptomChecker.jsx
  -> POST /api/SymptomChecker with bearer token
  -> SymptomCheckerController.PostSymptom
  -> SymptomEntryCreateDTO model binding
  -> EF Core saves SymptomEntry
  -> SymptomService analyzes or returns demo fallback
  -> EF Core saves AnalysisResult
  -> AnalysisResultDTO returned
```

## Doctor Search Flow

```text
React DoctorSearch.jsx
  -> GET /api/Doctors/search?location=&specialty=
  -> JWT + Patient role authorization
  -> DoctorsController.SearchDoctors
  -> DoctorService.SearchDoctorsAsync
  -> Google Places if configured, demo doctors otherwise
  -> List<DoctorDto> returned
```

## Report Upload Flow

```text
React MedicalHistory.jsx
  -> POST /api/MedicalReport/upload-report
  -> multipart/form-data with PatientName and File
  -> JWT authorization
  -> MedicalReportController.UploadReport
  -> PDF type and 2 MB size validation
  -> MedicalReportService extracts PDF text if safe/provider configured
  -> OpenRouter if configured, demo fallback otherwise
  -> EF Core stores metadata and analysis only
  -> MedicalReportSummaryDTO returned
```
