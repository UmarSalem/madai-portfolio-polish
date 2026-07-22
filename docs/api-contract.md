# API Contract Draft

This draft maps current frontend screens to current or expected backend endpoints. It is intentionally conservative: unclear items are marked `Needs verification`.

| Frontend screen/page | Current frontend API call | Expected backend endpoint | Status | Notes |
| --- | --- | --- | --- | --- |
| Login | `login(email, password)` -> `POST /api/auth/signin` | `POST /api/auth/signin` | Updated | Frontend normalizes the backend response into minimal local session data: `id`, `userId`, `token`, `email`, `role`. |
| Register | `register(data)` -> `POST /api/auth/signup` | `POST /api/auth/signup` | Updated | Old json-server `/users` and Base64 password flow was removed from the register screen. |
| Profile | `getMyProfile()` / `updateMyProfile(data)` -> `/api/user/me` | `GET /api/user/me`, `PUT /api/user/me` | Updated | Uses bearer token through Axios interceptor. Backend returns safe profile DTO without password hash. |
| Symptom checker | `checkSymptoms(data)` -> `POST /api/SymptomChecker` | `POST /api/SymptomChecker` | Updated | Requires bearer token. Uses safe DTO request/response shapes and visible demo medical disclaimer. |
| My symptoms/history | Local component history only or old local storage paths | `GET /api/SymptomChecker/my-symptoms` | Missing | Frontend does not appear fully wired to this backend endpoint. |
| Doctor search | `searchDoctors(location, specialty)` -> `GET /api/Doctors/search?location=&specialty=` | `GET /api/Doctors/search?location=&specialty=` | Updated | Requires `Patient` role. Uses shared Axios bearer token. Falls back to fictional demo doctors if Google Places config is missing/unavailable. |
| Recommendation | `GET /recommendation` | Needs verification | Missing | Backend does not appear to expose a matching recommendation endpoint. Could become static fake frontend data. |
| Medical report upload/list | `uploadMedicalReport(...)`, `getMyMedicalReports()` | `POST /api/MedicalReport/upload-report`, `GET /api/MedicalReport/my-reports` | Updated | Uses multipart form-data, bearer token, PDF/size validation, and safe DTOs without file bytes. |
| Medical report download | Download links disabled in frontend | `GET /api/MedicalReport/download-report/{id}` | Disabled for demo | Backend returns a safe disabled message because uploaded PDF storage is not enabled for the portfolio demo. |
| Medical history | `getMedicalHistory()` helper available | `GET /api/user/medical-history` | Partially updated | Backend returns safe DTO-shaped symptoms/reports/AI responses. Main frontend report screen uses `my-reports`; broader history UI still needs future UX work. |
| Blog list | `GET /blogs` | Needs verification | Missing | Backend does not appear to expose blog endpoints. Static fake blog data may be better for portfolio frontend. |
| Blog detail | `GET /blogs?id={id}` | Needs verification | Missing | Same as blog list. |
| Contact | No backend call observed | None required | Working | Static/contact UI only, unless later adding real contact behavior. |

## Contract Cleanup Principles

- Pick one source of truth per feature.
- Prefer backend `/api/...` endpoints for authenticated features.
- Prefer static fictional frontend data for public demo content until backend is safe.
- Keep API responses shaped through DTOs rather than exposing backend entities directly.
- Add tests after each vertical slice is aligned.

## Auth/Profile Contract

### Register

- Frontend screen: `Register`
- Frontend API function: `register(data)`
- Backend endpoint: `POST /api/auth/signup`
- Auth required: No
- Request body:

```json
{
  "firstName": "Demo",
  "lastName": "Patient",
  "email": "demo.patient@example.test",
  "password": "local-demo-password",
  "role": "Patient"
}
```

- Response body:

```json
{
  "message": "Signup successful"
}
```

- Status after this task: Updated. The frontend no longer uses `/api/auth/register`, `/users`, or Base64 password storage for this flow.

### Login

- Frontend screen: `Login`
- Frontend API function: `login(email, password)`
- Backend endpoint: `POST /api/auth/signin`
- Auth required: No
- Request body:

```json
{
  "email": "demo.patient@example.test",
  "password": "local-demo-password"
}
```

- Response body:

```json
{
  "token": "jwt-token-from-backend",
  "message": "Login successful",
  "userId": "00000000-0000-0000-0000-000000000000",
  "email": "demo.patient@example.test",
  "role": "Patient"
}
```

- Status after this task: Updated. The frontend stores only minimal normalized session data in localStorage and does not store passwords.

### Profile

- Frontend screen: `Profile`
- Frontend API functions: `getMyProfile()`, `updateMyProfile(data)`
- Backend endpoints: `GET /api/user/me`, `PUT /api/user/me`
- Auth required: Yes, bearer token
- GET response body:

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "firstName": "Demo",
  "lastName": "Patient",
  "email": "demo.patient@example.test",
  "role": "Patient"
}
```

- PUT request body:

```json
{
  "firstName": "Demo",
  "lastName": "Patient",
  "email": "demo.patient@example.test"
}
```

- PUT response body: same safe profile shape as GET.
- Status after this task: Updated. The frontend no longer calls `/users/{id}` for profile, and the backend no longer returns `PasswordHash` from `me`.

## Symptom Checker Contract

### Submit Demo Symptoms

- Frontend screen/component: `SymptomChecker`
- Frontend API function: `checkSymptoms({ patientName, symptomsText, dateSubmitted })`
- Backend endpoint: `POST /api/SymptomChecker`
- Auth required: Yes, bearer token through the shared Axios client.
- Request body:

```json
{
  "patientName": "Demo Patient",
  "symptomsText": "Fictional demo headache and mild tiredness",
  "dateSubmitted": "2026-07-08T12:00:00.000Z"
}
```

- Response body:

```json
{
  "summary": "Demo symptom checker response only. This is not medical advice and must not be used for diagnosis or emergencies.",
  "suggestedConditions": [
    "Demo-only possible condition"
  ],
  "nextSteps": [
    "Use fictional demo data only in this portfolio project.",
    "For real symptoms, contact a qualified healthcare professional.",
    "For emergencies, call local emergency services."
  ]
}
```

- Status after this task: Updated. The frontend no longer depends on json-server-style symptom checker calls for this flow and now posts to the ASP.NET Core endpoint.
- Medical safety note: The symptom checker screen displays: "This is an educational demo and not medical advice. Do not use it for diagnosis or emergencies." Users are also told not to enter real patient data or private health information.
- External provider note: The backend can call OpenRouter when a real provider key is configured outside Git. If the key is missing, placeholder-only, or the provider fails, the backend returns a safe demo fallback DTO instead of crashing. Sending real health data to an external provider remains blocked by project policy.
- Related backend endpoints: `GET /api/SymptomChecker/{id}` now filters to the authenticated user and returns the same safe result DTO shape. `GET /api/SymptomChecker/my-symptoms` now returns a minimal projected history shape instead of EF navigation entities, but the frontend is not wired to this endpoint yet.
- Remaining verification: Run a local end-to-end check with a safe demo user after the backend database is initialized locally. Confirm whether stored symptom entries should remain part of the public demo or become in-memory/static-only later.

## Doctor Search Contract

### Search Doctors

- Frontend screen/component: `DoctorSearch`
- Frontend API function: `searchDoctors(location, specialty)`
- Backend endpoint: `GET /api/Doctors/search`
- Auth required: Yes, bearer token. Backend requires the `Patient` role.
- Query parameters:

```text
location=Demo City
specialty=Cardiology
```

- Response body:

```json
[
  {
    "name": "Demo Cardiology Clinic",
    "address": "100 Demo Health Street",
    "phoneNumber": "Demo phone not available",
    "website": "https://example.test/madai-demo-clinic",
    "location": "Demo City",
    "specialty": "Cardiology",
    "rating": 4.6,
    "userRatingsTotal": 24,
    "isDemo": true
  }
]
```

- Status after this task: Updated. The frontend now uses the shared Axios client and the backend `/api/Doctors/search` endpoint. The doctor search route is protected so token behavior matches the backend authorization requirement.
- External API dependency: The backend can use Google Places when `GoogleMaps:ApiKey` is configured outside Git. If the key is missing, placeholder-only, or Google Places fails, the backend returns fictional demo doctor data instead of crashing or exposing a secret.
- Data safety note: Committed fallback data uses fictional names, fictional addresses, no real phone numbers, and `.example.test` demo websites.
- Remaining verification: Run an end-to-end doctor search with a fictional patient login after local build/restore works. Confirm whether the public portfolio should always force demo results or allow live Google Places only in private/local environments.

## Medical Report Upload and History Contract

### Upload Demo Report

- Frontend screen/component: `MedicalHistory`; `AIDoctor` now reuses the same safe report demo component.
- Frontend API function: `uploadMedicalReport({ patientName, file })`
- Backend endpoint: `POST /api/MedicalReport/upload-report`
- Auth required: Yes, bearer token.
- Request format: `multipart/form-data`
- Form fields:

```text
PatientName=Demo Patient
File=<fictional PDF file>
```

- File constraints:
  - PDF only.
  - 2 MB maximum in the current demo flow.
  - Real medical reports and private health information are not allowed.

- Response body:

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "patientName": "Demo Patient",
  "fileName": "fictional-demo-report.pdf",
  "dateUploaded": "2026-07-13T12:00:00",
  "summary": "Demo report analysis only. This portfolio demo does not store uploaded PDF content and this result is not medical advice.",
  "suggestedConditions": [
    "Demo-only report review"
  ],
  "nextSteps": [
    "Use fictional PDF files only.",
    "Do not upload real medical reports or private health information.",
    "For real medical reports, contact a qualified healthcare professional."
  ],
  "downloadAvailable": false,
  "isDemo": true
}
```

- Status after this task: Updated. The frontend no longer converts PDFs to Base64 or posts to json-server-style `/medical_report` or `/medical_history` routes for this flow.
- Storage behavior: The backend stores report metadata and analysis only. It does not write uploaded PDFs to `uploads/` and does not save PDF bytes in `FileData` for new demo uploads.
- External provider dependency: The backend can analyze report text with OpenRouter only when `OpenRouter:ApiKey` is configured outside Git. If the key is missing, placeholder-only, PDF parsing fails, or the provider fails, the backend returns a safe demo analysis DTO.
- Download behavior: File downloads are disabled for the safe portfolio demo.
- Remaining verification: Run end-to-end upload with a fictional tiny PDF after local build/restore and frontend tooling are available. Decide whether public deployment should disable uploads entirely or keep this metadata-only demo mode.

### List My Demo Reports

- Frontend API function: `getMyMedicalReports()`
- Backend endpoint: `GET /api/MedicalReport/my-reports`
- Auth required: Yes, bearer token.
- Response body: array of the safe report summary DTO shown above.
- Status after this task: Updated. The frontend displays empty/loading/error/success states and no longer renders download links from Base64 data.
