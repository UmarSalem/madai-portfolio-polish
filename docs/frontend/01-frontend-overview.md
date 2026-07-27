# Madai Frontend Overview

Madai is an educational healthcare assistant demo. The frontend is a React single-page application that lets a demo user register, log in, view/edit a profile, check fictional symptoms, search demo doctors, and upload fictional PDF reports in a safe portfolio mode.

Madai was originally a bachelor group project. This portfolio-polish version focuses on documenting, cleaning, and aligning the frontend with the ASP.NET Core backend feature by feature.

## Main User Flows

- Public visitor opens the home/about/contact/blog pages.
- Demo patient registers or logs in.
- Authenticated demo patient opens protected features.
- Demo patient edits profile data.
- Demo patient submits fictional symptom text.
- Demo patient searches for doctors using demo-safe search terms.
- Demo patient uploads a fictional PDF report and sees safe report metadata/analysis.

## Main Screens

- `Home`: landing/home content.
- `Register`: creates a demo patient account through the backend.
- `Login`: signs in and stores a normalized auth session.
- `Profile`: loads and updates the logged-in user's profile.
- `SymptomChecker`: submits fictional symptoms to the backend.
- `DoctorSearch`: searches doctors through the backend, with demo fallback handling.
- `MedicalHistory`: safe medical report upload/history demo.
- `AIDoctor`: currently reuses the safe medical report demo component.
- `Recommendation`, `Record`, `BlogDetail`, `About`, `Contact`: still need verification or future cleanup.

## Backend Connection

The frontend uses Axios through `src/api/httpClient.js`. The API base URL comes from `src/constant/index.js` as `Config.serverUrl`.

`Config.serverUrl` now reads `REACT_APP_API_BASE_URL` first and falls back to `http://localhost:5122` for local development.

Feature API functions live in:

- `src/api/auth.js`
- `src/api/features.js`

The shared Axios client attaches a bearer token from localStorage when one exists.

## Backend-Aligned Features

- Auth/register/login/profile.
- Symptom checker.
- Doctor search.
- Medical report upload/history safe demo flow.

## Still Not Finished

- Frontend API base URL is environment-based through `REACT_APP_API_BASE_URL`.
- Some older content/features may still use mock or static patterns. Needs verification.
- Redux and RTK Query exist, but current aligned feature slices mostly use local component state and Axios helpers. Needs verification before removal.
- Frontend tests are limited and may need repair/expansion.
- UI consistency, accessibility, and mobile polish need more work.

## Run Frontend Locally

```powershell
cd MAD-AI_FrontEnd\MAD-AI_FrontEnd-main
copy .env.example .env
npm ci
npm start
```

Expected local backend value in `.env`:

```text
REACT_APP_API_BASE_URL=http://localhost:5122
```

## Build Frontend

```powershell
cd MAD-AI_FrontEnd\MAD-AI_FrontEnd-main
npm ci
npm run build
```

Build validation in Codex could not run because Node/npm are unavailable in this shell. GitHub Actions installs Node.js LTS and runs the build in CI.
