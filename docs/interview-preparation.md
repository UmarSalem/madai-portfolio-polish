# Interview Preparation

## 2-Minute Project Explanation

Madai is an educational healthcare assistant demo originally built as a bachelor group project. It has a React frontend and an ASP.NET Core Web API backend. The app includes login/register, symptom checking, doctor search, profile management, and medical report/history flows.

My current work is a portfolio-polish version. I am documenting the architecture, improving safety, replacing unsafe data with fake/demo data, and refactoring selected features one by one. I do not claim sole authorship of the original group project.

## 5-Minute Technical Explanation

The frontend is a React single-page app with React Router for screens and Axios/fetch for API calls. It has pages for home, authentication, symptom checking, doctor search, profile, and report/history flows.

The backend is an ASP.NET Core Web API. It uses controllers and services, EF Core with SQLite for local development, JWT authentication, BCrypt password hashing, and integration points for AI analysis and maps/doctor search.

The main technical cleanup is aligning the frontend API calls with the backend endpoints. Some screens still use older json-server style routes, while the backend exposes `/api/...` routes. I am approaching this by vertical slices: auth/profile first, then symptom checker, doctor search, report/history, UI polish, CI/CD, and deployment.

## Group-Project Attribution

Say:

"Madai was originally created by a bachelor project group. I am using a local copy as a portfolio-polish project. I am clear about the group origin and focus my claims on the work I personally do now: documentation, safety cleanup, refactoring, testing, and deployment readiness."

## Portfolio-Polish Work

Examples to mention:

- Created technical audit documentation.
- Added architecture and safety docs.
- Identified unsafe secrets/data risks.
- Planned feature-by-feature refactoring.
- Added safe environment examples and gitignore hygiene.
- Prepared the project for responsible public presentation.

## React Frontend Explanation

Talk about:

- Components and pages.
- React Router for navigation.
- `useState` for forms/results.
- `useEffect` for loading data.
- Axios for API calls.
- Loading/error states.
- Token handling through localStorage for demo auth.

## ASP.NET Core Backend Explanation

Talk about:

- Controllers for HTTP endpoints.
- Services for business/external API logic.
- EF Core models and SQLite for local data.
- DTOs for request/response shapes.
- Swagger for development API exploration.

## JWT Auth Explanation

JWT auth flow:

1. User logs in.
2. Backend verifies password hash.
3. Backend returns a signed token.
4. Frontend stores the token for demo use.
5. Frontend sends the token in the `Authorization` header.
6. Backend authorizes protected endpoints and roles.

Mention that production auth would need stricter security review.

## API Mismatch/Refactor Explanation

Say:

"Because it was a student group project, the code has signs of multiple development stages. Some frontend features still call mock json-server endpoints while the backend has real ASP.NET routes. I documented those mismatches in an API contract and planned a vertical-slice refactor so each feature becomes stable without rewriting the whole app."

Auth/profile refactor:

"I fixed the frontend/backend API contract for register, login, and profile so the React frontend uses the ASP.NET Core API instead of old json-server-style endpoints."

You can also explain:

- Register now calls `/api/auth/signup`.
- Login calls `/api/auth/signin` and stores only minimal normalized session data.
- Profile now calls `/api/user/me` with the bearer token.
- The backend returns a safe profile DTO instead of exposing password hashes.

Symptom checker refactor:

"I aligned the symptom checker React flow with the ASP.NET Core API and added safer demo/disclaimer handling for a health-related feature."

You can also explain:

- The symptom checker now calls `/api/SymptomChecker` through the shared Axios client.
- The route is protected because the backend endpoint requires a bearer token.
- The screen has visible demo-only and not-medical-advice wording.
- The backend returns a safe demo fallback if external AI configuration is missing or unavailable.

## AI-Assisted Development

Use this wording:

"I used AI coding tools as a development assistant, but I reviewed, tested, debugged, documented, and improved the project myself."

Explain that AI helped speed up documentation, review, and refactoring support, but responsibility for the final project decisions stays with you.
