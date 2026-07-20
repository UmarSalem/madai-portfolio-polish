# API Contract Draft

This draft maps current frontend screens to current or expected backend endpoints. It is intentionally conservative: unclear items are marked `Needs verification`.

| Frontend screen/page | Current frontend API call | Expected backend endpoint | Status | Notes |
| --- | --- | --- | --- | --- |
| Login | `login(email, password)` -> `POST /api/auth/signin` | `POST /api/auth/signin` | Updated | Frontend normalizes the backend response into minimal local session data: `id`, `userId`, `token`, `email`, `role`. |
| Register | `register(data)` -> `POST /api/auth/signup` | `POST /api/auth/signup` | Updated | Old json-server `/users` and Base64 password flow was removed from the register screen. |
| Profile | `getMyProfile()` / `updateMyProfile(data)` -> `/api/user/me` | `GET /api/user/me`, `PUT /api/user/me` | Updated | Uses bearer token through Axios interceptor. Backend returns safe profile DTO without password hash. |
| Symptom checker | `POST /api/symptomchecker` | `POST /api/SymptomChecker` | Needs verification | ASP.NET routing is usually case-insensitive. Requires bearer token. Response shape should be checked. |
| My symptoms/history | Local component history only or old local storage paths | `GET /api/SymptomChecker/my-symptoms` | Missing | Frontend does not appear fully wired to this backend endpoint. |
| Doctor search | `GET /api/doctors/search?location=&specialty=` | `GET /api/Doctors/search?location=&specialty=` | Needs verification | Requires `Patient` role. Backend doctor service registration and maps config need verification. |
| Recommendation | `GET /recommendation` | Needs verification | Missing | Backend does not appear to expose a matching recommendation endpoint. Could become static fake frontend data. |
| Medical report upload/list | `/medical_report` json-server-style calls | `POST /api/MedicalReport/upload-report`, `GET /api/MedicalReport/my-reports` | Mismatch | Frontend currently posts Base64/json data; backend expects multipart form file. |
| Medical report download | Uses `fileData` from json-server-style data | `GET /api/MedicalReport/download-report/{id}` | Mismatch | Frontend needs backend download flow if this feature remains. |
| Medical history | `GET /medical_history`, `POST /medical_history` | `GET /api/user/medical-history` | Mismatch | Backend has read-style medical history endpoint, not the same json-server create/list flow. |
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
