# Error Handling and Security Notes

## Current Error Handling Style

Controllers generally return:

- `Ok(...)`
- `BadRequest(...)`
- `Unauthorized(...)`
- `NotFound(...)`

Services often use fallback behavior for demo-safe flows.

Examples:

- `SymptomService` returns demo fallback on provider failure.
- `DoctorService` returns demo doctors on Google failure.
- `MedicalReportService` returns demo analysis on parsing/provider failure.

## Risks of Returning Internal Errors

APIs should avoid returning:

- stack traces
- provider response bodies
- database details
- file paths
- secrets

Current code is improved in several demo flows, but centralized error handling is still recommended.

## Validation Errors

ASP.NET Core model validation works with attributes like:

- `[Required]`
- `[EmailAddress]`
- `[StringLength]`

Controllers often check:

```csharp
if (!ModelState.IsValid)
    return BadRequest(ModelState);
```

## Status Responses

- `BadRequest`: invalid input.
- `Unauthorized`: missing or invalid auth.
- `NotFound`: resource not found or intentionally disabled.
- `Ok`: successful response.

## Security Features Not Present or Needing Verification

- Rate limiting: not present.
- Centralized exception middleware: not present.
- Security headers: Needs verification.
- Request body size limits: partly present for report upload only.
- Audit logging: Needs verification.
- Production Swagger safety: Needs verification.

## Secret Scanning

Before every public push:

- scan for secrets.
- review `appsettings`.
- review `.env` files.
- check Git status for DB/upload/build artifacts.

## Logging Rules

Do not log:

- JWT tokens
- reset tokens
- API keys
- passwords
- medical report text
- symptoms tied to real people

Current issue:

- Forgot-password writes reset token to console. This is not production safe.

## Safe Public Demo Behavior

- fake/demo data only.
- safe AI fallbacks.
- metadata-only report upload or disabled upload.
- no real medical documents.
- no committed database or upload files.
