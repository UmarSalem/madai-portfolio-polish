# Feature Slices

This file documents the feature-by-feature refactor work done in the Madai frontend.

## Auth/Profile Slice

What it does:

- Register a demo patient.
- Log in.
- Store normalized auth session.
- Load and update profile.

Frontend files:

- `src/register/Register.jsx`
- `src/login/Login.jsx`
- `src/profile/Profile.jsx`
- `src/api/auth.js`
- `src/api/authSession.js`
- `src/api/httpClient.js`
- `src/routes/ProtectedRoute.jsx`

Backend endpoints:

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/user/me`
- `PUT /api/user/me`

Fixed/aligned:

- Removed old mock-user style auth flow.
- Normalized user session storage.
- Attached bearer token with shared Axios client.
- Profile no longer uses old `/users/{id}` flow.

Needs verification:

- Full logout UI.
- More tests for failed login/register/profile update.

## Symptom Checker Slice

What it does:

- Lets a logged-in demo user submit fictional symptoms.
- Shows backend summary, possible conditions, and next steps.

Frontend files:

- `src/symptomChecker/SymptomChecker.jsx`
- `src/symptomChecker/SymptomChecker.css`
- `src/symptomChecker/SymptomChecker.test.jsx`
- `src/api/features.js`
- `src/routes/ReactRoute.jsx`

Backend endpoint:

- `POST /api/SymptomChecker`

Fixed/aligned:

- Uses shared Axios helper.
- Route is protected.
- Added medical disclaimer.
- Added loading, error, empty, result, and local history states.

Needs verification:

- End-to-end test with a safe local demo user.
- Whether symptom history should be persisted or demo-only.

## Doctor Search Slice

What it does:

- Lets a logged-in demo user search by location and specialty.
- Shows live or fictional demo doctor results depending on backend configuration.

Frontend files:

- `src/doctorSearch/DoctorSearch.jsx`
- `src/doctorSearch/DoctorSearchStyle.css`
- `src/api/features.js`
- `src/routes/ReactRoute.jsx`

Backend endpoint:

- `GET /api/Doctors/search?location=&specialty=`

Fixed/aligned:

- Uses backend endpoint and shared Axios client.
- Route is protected.
- Added loading, error, empty, and result states.
- Demo UI labels avoid claiming real provider data.

Needs verification:

- End-to-end local test.
- Whether public deployment should force fictional demo data.

## Report Upload/History Slice

What it does:

- Lets a logged-in demo user upload a fictional PDF report.
- Shows report metadata and safe analysis summary.

Frontend files:

- `src/medicalHistory/MedicalHistory.jsx`
- `src/medicalHistory/MedicalHistoryStyle.css`
- `src/aidoctor/AIDoctor.jsx`
- `src/api/features.js`
- `src/routes/ReactRoute.jsx`

Backend endpoints:

- `POST /api/MedicalReport/upload-report`
- `GET /api/MedicalReport/my-reports`

Fixed/aligned:

- Removed Base64 upload flow.
- Uses multipart form-data.
- Adds PDF type and 2 MB validation.
- Adds clear warning not to upload real reports.
- Does not show download links for stored PDFs.
- `AIDoctor` reuses the safe report demo component.

Needs verification:

- End-to-end upload with a fictional tiny PDF.
- Whether public deployment should disable uploads entirely.
