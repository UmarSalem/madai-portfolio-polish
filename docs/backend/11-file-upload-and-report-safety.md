# File Upload and Report Safety

Medical report upload is one of the highest-risk parts of Madai because PDF reports can contain private health information.

## Current Upload Endpoint

Endpoint:

```text
POST /api/MedicalReport/upload-report
```

Controller:

```text
MedicalReportController.UploadReport
```

Request type:

```text
multipart/form-data
```

Fields:

- `PatientName`
- `File`

## multipart/form-data

`multipart/form-data` is the normal format for uploading files from a browser to an API.

The frontend uses `FormData`, and the backend uses:

```csharp
[FromForm] MedicalReportDTO
```

## PDF Validation

Current demo validation:

- file must be PDF.
- file must be 2 MB or smaller.

## PdfPig/Text Extraction

`MedicalReportService` uses PdfPig to read text from a PDF when provider config is available.

If parsing fails, it returns a safe demo fallback.

## AI Analysis Flow

If OpenRouter config is valid:

1. Extract PDF text.
2. Trim text to a maximum size.
3. Send demo-safe prompt to provider.
4. Return summary/next steps.

If config/provider/parsing fails:

1. Return safe demo analysis result.

## What Is Stored

New safe demo uploads store:

- patient name
- file name
- analysis summary
- suggested conditions
- next steps
- user id

New safe demo uploads do not store:

- PDF bytes
- uploaded PDF files in `uploads/`
- extracted report text

## Why Real Reports Must Not Be Uploaded

Medical reports may contain names, identifiers, dates of birth, lab values, scans, diagnoses, or other private health information. A portfolio demo should never ask for or store that.

## Logging Risks

Do not log:

- PDF text
- real patient names
- report contents
- provider responses containing medical text
- API keys or tokens

## Upload Folder Risks

`uploads/` content must not be committed. Current safe demo upload does not write files to `uploads/`.

## Public Demo Safety Rules

- Keep report upload demo-only.
- Use fictional tiny PDFs only.
- Disable downloads.
- Keep metadata-only storage.
- Consider disabling uploads entirely before public deployment.
