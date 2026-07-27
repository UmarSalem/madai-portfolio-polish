# API Integration

## Shared Axios Client

The shared client is `src/api/httpClient.js`.

It creates Axios with:

```js
baseURL: Config.serverUrl
```

It also adds an `Authorization` header when a stored auth token exists.

## API Base URL

Current source:

- `src/constant/index.js`
- `Config.serverUrl`

Current environment variable:

```text
REACT_APP_API_BASE_URL
```

Local fallback:

```text
http://localhost:5122
```

For Create React App, frontend environment variables must start with `REACT_APP_`. Copy `.env.example` to `.env` locally and keep `.env` out of Git.

Example:

```text
REACT_APP_API_BASE_URL=http://localhost:5122
```

Deployment platforms should set `REACT_APP_API_BASE_URL` to the deployed backend origin later. Do not hard-code deployed backend URLs in source code.

## Token Attachment

`httpClient` calls `getStoredAuthUser()` from `authSession.js`. If the stored user has a token, it adds:

```text
Authorization: Bearer <token>
```

Do not print or commit real token values.

## Auth/Profile Flow

Files:

- `src/api/auth.js`
- `src/api/authSession.js`
- `src/login/Login.jsx`
- `src/register/Register.jsx`
- `src/profile/Profile.jsx`

Endpoints:

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/user/me`
- `PUT /api/user/me`

What was fixed:

- Register no longer uses old mock user storage.
- Login stores a normalized session shape.
- Profile uses the backend `/api/user/me` endpoint.

## Symptom Checker Flow

Files:

- `src/symptomChecker/SymptomChecker.jsx`
- `src/api/features.js`

Endpoint:

- `POST /api/SymptomChecker`

Request fields:

- `patientName`
- `symptomsText`
- `dateSubmitted`

What was fixed:

- Uses the real backend endpoint.
- Uses the shared Axios client.
- Shows demo-only medical disclaimer.
- Shows loading, error, empty, and result states.

## Doctor Search Flow

Files:

- `src/doctorSearch/DoctorSearch.jsx`
- `src/api/features.js`

Endpoint:

- `GET /api/Doctors/search?location=&specialty=`

What was fixed:

- Uses the real backend endpoint.
- Uses the shared Axios client.
- Route is protected.
- Shows inline error and empty states.
- Backend can return fictional demo doctors when Google Places is unavailable.

## Report Upload/History Flow

Files:

- `src/medicalHistory/MedicalHistory.jsx`
- `src/aidoctor/AIDoctor.jsx`
- `src/api/features.js`

Endpoints:

- `POST /api/MedicalReport/upload-report`
- `GET /api/MedicalReport/my-reports`
- `GET /api/user/medical-history` helper exists for future broader history UI.

Request format:

- `multipart/form-data`
- `PatientName`
- `File`

What was fixed:

- Removed Base64/mock report upload flow.
- Uses PDF validation and 2 MB max size.
- Shows safety warning.
- Displays safe metadata and analysis only.
- Download links are disabled in the safe demo.

## Error Handling Pattern

Current aligned screens usually:

- clear old error state before submit.
- set a loading/submitting flag.
- call an API helper.
- catch request errors.
- show a friendly inline message.
- reset loading in `finally`.

## Fixed API Mismatches

- Auth/register/profile moved from mock-style routes to backend auth/user endpoints.
- Symptom checker moved to `/api/SymptomChecker`.
- Doctor search moved to `/api/Doctors/search`.
- Report upload moved from json-server style routes to backend multipart upload.

## API Work Remaining

- Recommendation screen needs verification.
- Blog data source needs verification.
- Record/todo flow needs verification.
- Tests should cover the main API helper flows.
