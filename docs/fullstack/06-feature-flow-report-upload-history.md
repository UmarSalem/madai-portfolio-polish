# Feature Flow: Report Upload and History

## File Selection Flow

Frontend file:

- `src/medicalHistory/MedicalHistory.jsx`

The user selects a fictional PDF file. The frontend validates:

- file exists
- file is PDF
- file is 2 MB or smaller
- patient name is fictional/demo text

## Multipart Upload Flow

Frontend API helper:

```js
uploadMedicalReport({ patientName, file })
```

This creates `FormData`:

```text
PatientName
File
```

Backend endpoint:

```text
POST /api/MedicalReport/upload-report
```

## Backend Upload Endpoint

Files:

- `MedicalReportController.cs`
- `MedicalReportService.cs`
- `MedicalReportDTO.cs`
- `MedicalReportSummaryDTO.cs`
- `MedicalReport`

Flow:

```text
MedicalReportController
  -> validates auth
  -> validates PDF and 2 MB limit
  -> MedicalReportService analyzes or returns demo fallback
  -> EF Core saves metadata and analysis only
  -> MedicalReportSummaryDTO returned
```

## PDF Extraction

`MedicalReportService` uses PdfPig to extract PDF text only when provider configuration is valid.

If parsing fails, it returns a safe demo fallback.

## AI Analysis

OpenRouter can be used when configured outside Git.

If the API key is missing, placeholder-only, or provider call fails, the service returns safe demo analysis.

## Database Storage

New demo uploads store:

- patient name
- safe filename
- analysis summary
- suggested conditions
- next steps
- user id

New demo uploads do not store:

- PDF bytes
- uploaded PDF files in `uploads/`
- extracted PDF text

## Report History Loading

Frontend helper:

```js
getMyMedicalReports()
```

Backend endpoint:

```text
GET /api/MedicalReport/my-reports
```

The frontend shows report cards and disables downloads for safe demo behavior.

## Safety and Privacy Warning

The UI warns:

```text
Educational demo only. Do not upload real medical reports or private health information.
```

Real reports must not be used because PDFs can contain names, dates of birth, lab values, scans, identifiers, and private medical details.

## Still Needs Verification

- End-to-end test with a fictional tiny PDF.
- Whether public deployment should disable uploads entirely.
- Whether report upload should stay metadata-only forever in the portfolio demo.
