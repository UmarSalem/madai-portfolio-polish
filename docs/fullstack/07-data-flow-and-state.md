# Data Flow and State

## React State

React local state stores screen-specific values:

- login/register form fields
- profile form fields
- symptom checker patient/symptom/result/history
- doctor search location/specialty/results
- report upload selected file/reports/success/error/loading

This state usually disappears on refresh unless persisted elsewhere.

## localStorage

`authSession.js` stores the demo auth session in localStorage:

- id
- userId
- token
- email
- role

This lets the page keep the user logged in across refreshes. It is demo-grade token storage.

## Backend API Data

Data returned by backend endpoints includes:

- auth response DTO
- profile DTO
- symptom analysis DTO
- doctor DTO list
- report summary DTO list

The frontend should render DTO data, not database entities.

## Database Data

EF Core persists:

- users
- password reset tokens
- symptom entries
- analysis results
- report metadata and analysis

Database files must not be committed.

## Data That Should Never Be Committed

- real patient data
- real symptoms
- real medical reports
- uploaded PDFs
- SQLite database files
- API keys
- JWT secrets
- tokens
- private organization data

## DTO Role

DTOs shape data between frontend and backend.

Examples:

- `UserProfileDTO` avoids password hash exposure.
- `MedicalReportSummaryDTO` avoids file byte exposure.
- `DoctorDto` standardizes doctor result display.

## UI State After Requests

Successful request:

- clear error
- update result/list state
- show success/result UI
- stop loading

Failed request:

- clear or preserve result depending on feature
- set error message
- stop loading
- optionally redirect on `401`

## Current Weaknesses

- localStorage token storage is not production-grade.
- Some older features still need verification.
- API base URL is still hard-coded in frontend config.
- Redux/RTK Query usage needs verification.

## Suggested Improvements

- Use environment-based API base URL.
- Add shared frontend API error handling.
- Add centralized backend error handling.
- Add tests for each major data flow.
- Keep using DTOs for safe API boundaries.
