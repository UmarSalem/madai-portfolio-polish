# Full-Stack Interview Preparation

## 2-Minute Full-Stack Explanation

Madai is an educational healthcare assistant demo originally created as a bachelor group project. I am polishing my local copy as a portfolio project. The frontend is a React app, the backend is an ASP.NET Core Web API, and the database uses EF Core with SQLite for local development. I aligned key feature flows so React screens call real backend endpoints and return safe DTOs.

## 5-Minute Technical Explanation

The React frontend has route-level pages for auth, profile, symptom checking, doctor search, and report upload/history. It uses Axios helpers to call the backend, and the shared Axios client attaches a bearer token from localStorage. The ASP.NET Core backend validates JWTs, runs controller actions, calls services for business logic, uses EF Core for database access, and returns DTOs. External AI/maps services are optional and must be configured through environment variables. For public portfolio safety, the app uses fake/demo data only.

## Group Project Explanation

"Madai was originally created by a bachelor project group. I do not claim sole authorship of the original project. My portfolio role is documentation, safety cleanup, API contract alignment, testing, and deployment readiness."

## Portfolio-Polish Role

"I worked feature by feature: auth/profile, symptom checker, doctor search, report upload/history, then documentation. This kept the changes small and easier to explain."

## Frontend/Backend Separation

"The frontend handles UI state and user interactions. The backend handles authentication, authorization, validation, service logic, database persistence, and external provider integration."

## API Contracts

"An API contract defines the endpoint, method, request shape, response shape, auth requirement, and error behavior. I documented and aligned these contracts so the frontend and backend agree."

## JWT Auth Flow

"After login, the backend returns a JWT. The frontend stores a demo session in localStorage. Axios attaches the token to protected requests. The backend validates the token and role before controller actions run."

## EF Core/Database Flow

"Controllers and services use EF Core through `AppDbContext`. EF Core maps C# entities like `User` and `SymptomEntry` to database tables."

## AI/External Service Safety

"External services can receive sensitive text, so public demo use must rely on fictional data and safe fallback responses."

## File Upload Safety

"Report upload is high risk because PDFs can contain private medical information. The safe demo validates PDF type and size, stores metadata/analysis only, and disables downloads."

## Deployment Readiness

"The frontend can be deployed as a static demo first. The backend should be deployed only after environment variables, CORS, database strategy, health checks, and safety rules are verified."

## AI-Assisted Development

"I used AI coding tools as a development assistant, but I reviewed, tested, debugged, documented, and improved the project myself."

## 20 Full-Stack Interview Questions

1. What does Madai do?
   - It is a React and ASP.NET Core healthcare demo for auth, symptoms, doctor search, and report upload/history.

2. What is your role in the project?
   - Portfolio polish: documentation, safety cleanup, and feature-by-feature API alignment.

3. How does React call the backend?
   - Through Axios helpers in `src/api/`.

4. How is auth handled?
   - Backend returns JWT; frontend sends it as bearer token.

5. What does `ProtectedRoute` do?
   - It redirects users without a token to login.

6. What does `[Authorize]` do?
   - It blocks unauthenticated backend requests.

7. What is a DTO?
   - A safe request/response shape between frontend and backend.

8. Why not return entities?
   - Entities can expose sensitive/internal fields.

9. What is EF Core?
   - The ORM that maps C# models to database tables.

10. Where is data stored?
    - Local SQLite through EF Core for development.

11. What did you fix in auth/profile?
    - The frontend now calls real backend auth/profile endpoints.

12. What did you fix in symptom checker?
    - API alignment, protected route, loading/error states, disclaimer, safe AI fallback.

13. What did you fix in doctor search?
    - Backend endpoint alignment, protected route, Google config fallback, demo doctor data.

14. What did you fix in report upload?
    - Multipart upload, PDF validation, metadata-only storage, disabled downloads.

15. How do you handle loading state?
    - Set loading before request and clear it in `finally`.

16. How do you handle API errors?
    - Catch request errors and show inline messages.

17. What still needs work?
    - tests, env config, deployment config, CI, recommendation safety, UI polish.

18. Why is health data safety important?
    - Even small symptoms or reports can reveal private information.

19. How would you deploy it?
    - Frontend static demo first, backend safe API later.

20. What is your next technical improvement?
    - Replace hard-coded frontend API URL with environment configuration.

## 5 Technical Storytelling Examples

1. Auth/profile:
   - "I started with auth because every protected feature depends on token flow."

2. Symptom checker:
   - "I added safety wording and aligned the React request body with the backend DTO."

3. Doctor search:
   - "I fixed dependency/config issues and added fictional fallback data for missing Google config."

4. Report upload:
   - "I changed the flow from unsafe Base64/mock storage to multipart upload with metadata-only demo storage."

5. Documentation:
   - "I created frontend, backend, and full-stack notes so I can explain the system clearly in interviews."
