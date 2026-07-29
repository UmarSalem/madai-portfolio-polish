# Controllers and Endpoints

See also the project-wide [API contract](../api-contract.md).

## AuthController

Purpose: user signup, signin, password reset.

Base route: `api/auth`

| Method | Endpoint | Auth | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| POST | `/signin` | No | `SignInRequestDTO` | `SignInResponseDTO` | Returns token on success. |
| POST | `/signup` | No | `SignupRequestDTO` | `{ message }` or `{ error }` | Admin creation has special rule. |
| POST | `/forgot-password` | No | `ForgotPasswordRequestDTO` | reset token response | Currently returns token; unsafe for production. |
| POST | `/reset-password` | No | `ResetPasswordRequestDTO` | message | Needs production email/reset review. |

Safety notes:

- Sign-in response should never include password hash.
- Forgot-password flow should not expose reset tokens in production.

## UserController

Purpose: profile, user admin operations, medical history, recommendations.

Base route: `api/user`

Controller-level auth: `[Authorize]`

| Method | Endpoint | Auth | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | `/all-users` | Admin | none | `User` entities | Should use safe DTO later. |
| PUT | `/{id}` | Admin | `User` entity | `User` entity | Needs DTO review. |
| DELETE | `/{id}` | Admin | route id | message | Admin-only. |
| GET | `/me` | Patient | none | `UserProfileDTO` | Safe profile DTO. |
| PUT | `/me` | Patient | `UpdateUserProfileDTO` | `UserProfileDTO` | Safe profile update. |
| DELETE | `/me` | Patient | none | message | Deletes current profile. |
| GET | `/medical-history` | Authenticated | none | `MedicalHistoryDTO` | Safe DTO-shaped history. |
| GET | `/medical-report/{id}/download` | Authenticated | route id | disabled message | Downloads disabled for safe demo. |
| GET | `/ai-health-recommendation` | Authenticated | none | `AIRecommendationDTO` | Returns safe demo message if provider key is not configured. |
| GET | `/ai-personalized-insights` | Authenticated | none | `HealthInsightDTO` | Returns safe demo message if provider key is not configured. |

## SymptomCheckerController

Purpose: store fictional demo symptoms and return analysis DTOs.

Base route: `api/SymptomChecker`

Controller-level auth: `[Authorize]`

| Method | Endpoint | Auth | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| POST | `/` | Authenticated | `SymptomEntryCreateDTO` | `AnalysisResultDTO` | Stores entry and analysis. |
| GET | `/{id}` | Authenticated | route id | `AnalysisResultDTO` | Filters by authenticated user. |
| GET | `/my-symptoms` | Authenticated | none | projected symptom history | Does not expose EF navigation objects. |

Safety notes:

- UI must use fictional symptoms only.
- External AI falls back to safe demo result if config/provider is missing.

## DoctorsController

Purpose: doctor search through Google Places or fictional demo fallback.

Base route: `api/Doctors`

Controller auth: `[Authorize(Roles = "Patient")]`

| Method | Endpoint | Auth | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | `/search` | Patient | `location`, `specialty` query params | `List<DoctorDto>` | Uses `DoctorService`. |

Safety notes:

- No Google API key should be committed.
- Demo fallback returns fictional doctors with `.example.test` websites.

## MedicalReportController

Purpose: safe demo report upload/history.

Base route: `api/MedicalReport`

Controller-level auth: `[Authorize]`

| Method | Endpoint | Auth | Request | Response | Notes |
| --- | --- | --- | --- | --- | --- |
| POST | `/upload-report` | Authenticated | `MedicalReportDTO` as form-data | `MedicalReportSummaryDTO` | PDF only, max 2 MB. |
| GET | `/download-report/{id}` | Authenticated | route id | disabled message | Downloads disabled. |
| GET | `/{id}` | Authenticated | route id | `MedicalReportResultDTO` | User-filtered result. |
| GET | `/my-reports` | Authenticated | none | `IEnumerable<MedicalReportSummaryDTO>` | Safe report summaries. |

Safety notes:

- New demo uploads store metadata and analysis only.
- Uploaded PDF bytes are not stored for new demo uploads.
- Uploaded PDFs are not written to `uploads/`.

## Removed Template Controller

The default ASP.NET `WeatherForecastController` and `WeatherForecast` model were removed because they were template files and not part of Madai.
