# API Contract Draft

This draft maps current frontend screens to current or expected backend endpoints. It is intentionally conservative: unclear items are marked `Needs verification`.

| Frontend screen/page | Current frontend API call | Expected backend endpoint | Status | Notes |
| --- | --- | --- | --- | --- |
| Login | `POST /api/auth/signin` | `POST /api/auth/signin` | Needs verification | Route matches. Token shape and role/user ID handling should be tested. |
| Register | `POST /api/auth/register`; also json-server-style `/users` logic exists | `POST /api/auth/signup` | Mismatch | Frontend and backend route names differ. Frontend still contains old Base64/json-server registration flow. |
| Profile | `GET /users/{id}`, `PUT /users/{id}` | `GET /api/user/me`, `PUT /api/user/me` | Mismatch | Frontend expects `storedUser.id`; backend returns `UserId`. |
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
