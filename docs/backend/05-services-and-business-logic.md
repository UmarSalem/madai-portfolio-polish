# Services and Business Logic

Services are classes that hold business logic or external API calls. Controllers should call services instead of doing everything themselves.

## Why Services Matter

Good controller responsibilities:

- receive request
- validate simple inputs
- get current user id
- call service/database
- return response

Good service responsibilities:

- password hashing and signup logic
- token generation
- AI/external provider calls
- PDF text extraction
- doctor search fallback logic
- assembling medical history DTOs

## Current Services

### AuthService

Handles:

- sign in
- signup
- forgot password
- reset password

Uses:

- EF Core
- BCrypt password verification/hashing
- `JwtService`

Needs improvement:

- Forgot-password should not return/reset-token directly in production.
- `Console.WriteLine` should not print reset tokens in production.

### JwtService

Handles JWT token creation.

Adds claims:

- `ClaimTypes.NameIdentifier`
- `ClaimTypes.Role`

Uses configuration section:

```text
Jwt
```

### SymptomService

Handles symptom analysis.

Uses:

- OpenRouter-style chat completion endpoint when configured.
- Safe demo fallback when config/provider is unavailable.

### DoctorService

Handles doctor search.

Uses:

- `GoogleMaps:ApiKey` when configured.
- Google Places Text Search and Details.
- Fictional demo doctors if config/provider is unavailable.

### MedicalReportService

Handles report analysis.

Uses:

- `PdfPig` to extract PDF text.
- OpenRouter-style provider when configured.
- Safe demo fallback for missing config, parsing failure, or provider failure.

### MedicalHistoryService

Builds a `MedicalHistoryDTO` for the current user.

It maps database entities to safer DTOs:

- symptoms to `SymptomHistoryDTO`
- reports to `MedicalReportSummaryDTO`
- analysis results to `AnalysisResultDTO`

### AIRecommendationService

Generates AI advice/insights from symptoms.

Needs improvement:

- Missing safe provider fallback.
- Sends symptom history to external provider if configured.
- Should use demo-only policy and graceful failure.

## Business Logic To Improve Later

- Move more direct EF logic from controllers into services.
- Add validation services for uploads and health text.
- Add centralized error handling.
- Add service tests with fake dependencies.
