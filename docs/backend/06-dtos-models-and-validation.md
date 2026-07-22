# DTOs, Models, and Validation

## Entity/Model vs DTO

An entity/model represents database data. A DTO represents data sent into or out of the API.

Example:

- Entity: `User`
- Safe response DTO: `UserProfileDTO`

The `User` entity has `PasswordHash`. `UserProfileDTO` does not. That is why DTOs are important.

## Entities

- `User`
- `SymptomEntry`
- `AnalysisResult`
- `MedicalReport`
- `PasswordResetToken`

## DTOs

Auth:

- `SignupRequestDTO`
- `SignInRequestDTO`
- `SignInResponseDTO`
- `ForgotPasswordRequestDTO`
- `ResetPasswordRequestDTO`

User/profile:

- `UserProfileDTO`
- `UpdateUserProfileDTO`

Symptoms:

- `SymptomEntryCreateDTO`
- `SymptomHistoryDTO`
- `AnalysisResultDTO`

Doctors:

- `DoctorDto`

Reports/history:

- `MedicalReportDTO`
- `MedicalReportResultDTO`
- `MedicalReportSummaryDTO`
- `MedicalHistoryDTO`

AI:

- `AIRecommendationDTO`
- `HealthInsightDTO`

## Validation Attributes

Common validation attributes:

- `[Required]`: value must be present.
- `[EmailAddress]`: value must look like an email.
- `[StringLength]`: value length is limited.

Examples in current code:

- `User.Email` uses `[Required]` and `[EmailAddress]`.
- `MedicalReportDTO.PatientName` uses `[Required]` and `[StringLength(100)]`.
- `SymptomEntryCreateDTO` uses `[Required]` and string length limits.

## Why Not Expose Entities Directly

Entities can contain:

- password hashes
- file bytes
- navigation properties
- internal IDs or relationship shape
- fields not intended for the frontend

Safer pattern:

```text
Entity -> DTO -> API response
```

## Responses To Check Later

- Admin user list/update responses currently return `User` entities. Needs safer DTO review.
- AI recommendation endpoints should be reviewed for safe failure behavior.
- Any future endpoint returning `MedicalReport` must avoid `FileData`.
