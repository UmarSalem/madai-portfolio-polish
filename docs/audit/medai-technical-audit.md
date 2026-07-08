# Madai Technical Audit

Audit date: 2026-07-08

Naming note: this file keeps its original historical filename, but the correct project name going forward is Madai. MAD-AI / My AI Doctor may be used as the longer descriptive name.

Scope: local combined review of `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main` and `MAD-AI_BackEnd-develop`. The folder names differ from the requested `medai-frontend` and `medai-backend`; this report treats the discovered folders as the frontend and backend copies.

No application code was changed during this audit.

## 1. Project overview

Madai / MAD-AI / My AI Doctor is a bachelor group project with a React frontend and ASP.NET Core backend. The product concept is a demo health assistant with blog content, login/register, symptom checking, doctor search, profile editing, and medical report/history upload flows.

Current state: promising portfolio material, but not public-deployment safe yet. The biggest blockers are committed secrets, demo/private-looking health data, mismatched frontend/backend API contracts, missing backend CORS, and unclear data ownership/disclaimer documentation.

Portfolio direction should be: keep the project, document it honestly as a group project, sanitize all data/secrets, and refactor feature by feature rather than rebuilding everything.

## 2. Repository/folder structure

Observed structure:

- `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main`: Create React App frontend.
- `MAD-AI_BackEnd-develop`: ASP.NET Core backend.
- No top-level Git repository was detected from the combined folder.
- No top-level `README.md`, architecture docs, or deployment docs were found.
- No GitHub Actions workflow files were found.

Frontend notable folders:

- `src/routes`: route constants and route mounting.
- `src/api`: Axios client and newer API wrappers.
- `src/components`: reusable UI pieces.
- Feature folders such as `home`, `login`, `register`, `symptomChecker`, `doctorSearch`, `recommendation`, `aidoctor`, `medicalHistory`, `profile`, `blog-detail`.
- `public`: images, manifest, index, robots.
- `db.json`: json-server style demo data.

Backend notable folders:

- `Controllers`: API controllers.
- `Services`: business/external API logic.
- `Contracts`: service interfaces.
- `Models` and `Models/DTO`: EF entities and request/response DTOs.
- `Data`: EF Core `AppDbContext`.
- `Migrations`: EF migration files.
- `uploads`: committed uploaded PDF.
- `MADAI.db`, `MADAI.db-wal`, `MADAI.db-shm`: committed SQLite database files.

## 3. Frontend assessment

Framework and package setup:

- React app bootstrapped with Create React App (`react-scripts`).
- Uses React 19, React Router 7, Redux Toolkit, React Redux, Axios, React Icons, json-server, and testing-library packages.
- `bcryptjs` is installed but current registration code uses Base64 encoding in `db.json` style flow, not real password hashing.
- Some dependencies referenced by unused RTK Query code are not listed in `package.json` (`connected-react-router`, `history`, `crypto-js`, `clsx`, MUI icons, `react-world-flags`).

Routing:

- Routes are centralized in `src/routes/ReactRoute.jsx` and `src/routes/ReactLinks.js`.
- Uses `BrowserRouter`, which is suitable for Vercel/Netlify/Cloudflare Pages if rewrite rules are configured.
- GitHub Pages would need extra SPA fallback handling or `HashRouter`.
- One route is missing a leading slash: `MedicalHistory: 'admin/medicalHistory'`. It may still work in some contexts but should be normalized.

Pages/screens:

- Home/blog list, blog detail, login, register, profile, AI doctor/report upload, symptom checker, doctor search, recommendation, contact, about, record/history-like screen.
- Several screens appear partially demo/prototype quality, with commented blocks and mixed old/new logic.

Components:

- Component extraction exists, especially nav/cards/data cards/buttons.
- Component naming and casing are inconsistent (`Button/button.jsx`, `cards` vs `card`, feature folders mixed with components).
- Some custom elements like `<icon>` are invalid HTML and should become buttons/links/spans with accessible labels.

API integration:

- Newer wrapper exists in `src/api/httpClient.js`, `src/api/auth.js`, and `src/api/features.js`.
- Several screens still call json-server style endpoints directly (`/users`, `/blogs`, `/recommendation`, `/medical_report`, `/medical_history`).
- This creates a deployment problem because the ASP.NET backend exposes `/api/auth`, `/api/SymptomChecker`, `/api/Doctors`, `/api/MedicalReport`, and `/api/user`, not the json-server routes.

Authentication flow:

- Login calls `/api/auth/signin` and stores the response in `localStorage` under `Config.userApiTokenName`.
- The Axios interceptor adds `Authorization: Bearer <token>` if present.
- Register currently calls `/api/auth/register`, but the backend exposes `/api/auth/signup`.
- Some screens rely only on localStorage presence, not protected routes.
- User identity shape is inconsistent: backend returns `UserId`, while frontend screens often expect `storedUser.id`.

State management and hooks:

- Active Redux store is `src/app/store.js` with a single input slice.
- A larger RTK Query store exists in `src/rkt_query`, but it appears unused and imports unavailable modules.
- Most state is local component state.
- Some DOM manipulation is done manually in `Navbar.js`; this could be refactored into React state later.

Forms and validation:

- Mostly required fields and alert-based validation.
- No schema validation library.
- No strong validation for file size, file type beyond `accept=".pdf"`, email uniqueness against the real backend, password rules, or medical text safety.

Error/loading states:

- Loading states exist in symptom checker and doctor search.
- Errors are mostly `alert(...)` and console logging.
- No consistent user-facing error component or retry pattern.

Styling approach:

- Plain CSS files per feature/component, plus some utility-looking class names.
- No clear design system.
- There are encoding/rendering issues in visible text (`Ã˜`, `â­`, emoji mojibake), likely from file encoding or copied data.
- The UI can be polished feature by feature without replacing the frontend.

Environment variables:

- Frontend environment variables are commented out in `src/constant/index.js`.
- `serverUrl` is hard-coded to `http://localhost:5122`.
- A Google API key-like value and a `secretPass` value are committed in frontend config. Treat as exposed and rotate/remove.

Deployment readiness:

- Vercel/Netlify/Cloudflare Pages: possible after moving config to env vars, adding SPA rewrites, sanitizing data, and fixing backend API contracts.
- GitHub Pages: possible for static/demo frontend only, but needs routing adjustments and no real backend dependency unless using mocked/demo data.
- Current frontend is not ready for public deployment because it contains committed demo users/password-like values, API key-like values, and real-looking clinic/contact/location data.

## 4. Backend assessment

Framework and package setup:

- ASP.NET Core Web API targeting `net8.0`.
- Uses EF Core with SQLite, JWT bearer auth, Swagger, BCrypt, OpenRouter/OpenAI-related packages, PdfPig, and Docker tooling.
- `.NET SDK 9.0.313` is installed locally, with .NET 8 runtimes available.
- The `.csproj` explicitly includes `bin` and `obj` generated files as compile/content items. This is unusual and may cause build or repository hygiene problems.

Folder structure:

- Conventional controller/service/interface/model layout.
- WeatherForecast template files remain and should be removed later.
- `Data/DAOs` is declared as a folder in the project but no DAO implementation was found.

API endpoints/controllers:

- `AuthController`: `/api/auth/signin`, `/api/auth/signup`, `/api/auth/forgot-password`, `/api/auth/reset-password`.
- `SymptomCheckerController`: authorized symptom post/get/my-symptoms endpoints.
- `DoctorsController`: authorized patient doctor search endpoint.
- `MedicalReportController`: authorized upload/download/report endpoints.
- `UserController`: profile/admin/medical-history/AI recommendation endpoints.
- `WeatherForecastController`: template endpoint, should not be part of portfolio demo API.

Authentication/authorization:

- JWT bearer auth configured.
- Roles exist (`Admin`, `Patient`) and are used in controller attributes.
- JWT key is committed in `appsettings.json` and has fallback code in `Program.cs`; both are unsafe for public deployment.
- Forgot-password endpoint returns reset token in API response and logs it. That is acceptable only for a local demo, not a public app.
- Admin signup logic expects an existing authenticated admin, but there is no clear seed/admin setup documented.

Database/data access:

- EF Core `AppDbContext` uses SQLite with `Data Source=MADAI.db`.
- Entities: `User`, `SymptomEntry`, `AnalysisResult`, `MedicalReport`, `PasswordResetToken`.
- SQLite database and WAL/SHM files are committed and contain real-looking names/emails, bcrypt hashes, symptoms, generated health advice, and binary/report-like content.
- Public repo/deployment must not include these DB files.

DTOs/models/entities:

- DTOs exist for signup/signin, symptom entry, medical report, medical history, AI recommendation, doctor data, and password reset.
- Some DTO validation is basic (`[Required]`, `[EmailAddress]`).
- Several API responses expose entity models directly, including fields that should be shaped through safe DTOs before public use.

Validation/business logic:

- Core validation is minimal.
- Medical report upload accepts PDF form data, extracts text with PdfPig, sends content to OpenRouter, stores file bytes in DB and writes files to `uploads`.
- No observed file size limits, malware scanning, filename sanitization, content redaction, or PHI warning flow.
- Symptom checking stores user-entered medical text and sends it to OpenRouter.

CORS configuration:

- No `AddCors` / `UseCors` configuration was found.
- Frontend calls from another origin will fail in browser deployments until CORS is configured.

Swagger/OpenAPI:

- Swagger is configured with JWT support in development only.
- No exported OpenAPI document or endpoint documentation was found.

Docker/deployment files:

- Dockerfile exists, but uses Windows Nano Server images.
- This is unlikely to be convenient for Render/Railway/Fly.io, which generally expect Linux containers.
- Dockerfile excludes README and Dockerfile via `.dockerignore`, which is normal for Visual Studio debug containers but not polished deployment documentation.

Environment variables:

- Backend secrets are committed in `appsettings.json`: JWT secret, OpenRouter API key-like value, and Google Maps API key-like value.
- `DoctorService` reads `_configuration["GoogleApiKey"]`, but config stores `GoogleMaps:ApiKey`. Needs verification/fix.
- No `.env`, sample env, or deployment environment documentation was found.

Render/Railway/Fly.io readiness:

- Not ready yet.
- Required first: remove secrets, configure env vars, switch/adjust Docker to Linux or use native .NET deployment, configure CORS, remove committed DB/upload files, add safe seed/demo data, and document startup/migration steps.

## 5. Architecture assessment

The intended architecture is a separated SPA frontend plus API backend:

- React frontend handles UI, forms, local state, and token storage.
- ASP.NET Core backend handles auth, protected data, AI requests, reports, and doctor search.
- SQLite is local persistence.
- OpenRouter and Google Places/Maps are external services.

Main architecture issue: the frontend is halfway migrated from json-server to ASP.NET API. Some features call the backend API, while others still call json-server data paths. This is the highest-value feature-by-feature refactor target.

Keep the separation. Do not rebuild from scratch. Stabilize one vertical slice at a time: auth, symptom checker, doctor search, then report upload.

## 6. API integration assessment

Confirmed mismatches:

- Frontend register: `/api/auth/register`; backend: `/api/auth/signup`.
- Frontend profile: `/users/{id}`; backend: `/api/user/me`.
- Frontend report upload/list: `/medical_report`; backend: `/api/MedicalReport/upload-report` and `/api/MedicalReport/my-reports`.
- Frontend medical history: `/medical_history`; backend: `/api/user/medical-history`.
- Frontend blogs/recommendations: `/blogs`, `/recommendation`; backend has no matching blog/recommendation data endpoints.
- Frontend doctor search: `/api/doctors/search`; backend route should match case-insensitively on ASP.NET, but the controller requires role `Patient` and the service dependency is not registered.

Needs verification:

- Whether the deployed portfolio should include a backend-powered blog endpoint or keep blogs as static frontend demo data.
- Whether doctor search should use Google Places live data or a fake/demo provider.

Recommendation: define an API contract document before code changes. Then update one frontend feature to one backend endpoint at a time.

## 7. Authentication and authorization assessment

Strengths:

- Backend uses BCrypt password hashing.
- Backend issues JWTs and has role checks.
- Frontend has an Axios interceptor for bearer tokens.

Risks/gaps:

- Frontend registration still contains json-server/Base64 logic, even though `register(...)` import exists.
- Frontend stores token in localStorage; acceptable for a portfolio demo but should be documented as demo-grade.
- No protected route wrapper in frontend.
- Backend JWT secret is committed.
- Role/claim setup should be tested end to end.
- Password reset returns tokens directly and logs them.
- User ID naming mismatch may break authenticated screens.

## 8. Database and data safety assessment

Current database/data files are not safe for public release:

- `MADAI_BackEnd-develop/MADAI.db`
- `MADAI_BackEnd-develop/MADAI.db-wal`
- `MADAI_BackEnd-develop/MADAI.db-shm`
- `MADAI_BackEnd-develop/uploads/Day 1.pdf`
- `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/db.json`

Observed risks:

- Frontend `db.json` includes sample users with emails and password-like values.
- Backend SQLite/WAL contains real-looking names/emails, password hashes, symptom text, AI health analysis text, and binary report-like data.
- Uploaded PDF content could not be fully verified from source inspection. Needs verification.
- Some doctor/clinic entries appear to reference real Danish clinics and phone numbers. For a fake/demo-only portfolio, replace with clearly fictional clinics or document that the doctor search uses live public Google Places data only if using an API safely.

Recommendation: before public repo/deploy, remove committed DB/upload files and replace with a small fake seed/demo dataset using fictional people, fictional clinics, and no real medical records.

## 9. Privacy/security risks

Critical before public deployment:

- Rotate/remove committed frontend and backend API keys/secrets.
- Remove all committed database files, WAL/SHM files, uploaded PDFs, generated binaries, and private-looking demo data.
- Ensure no real patient data, real medical records, or PHI is present.
- Add medical disclaimer: demo project only, not medical advice, not diagnosis, not emergency care, no real patient data should be entered.
- Add data disclaimer: all demo users, clinics, symptoms, and reports are fictional.
- Disable or clearly guard file upload in public demo unless storage, retention, file size, and PHI handling are safe.
- Do not send user-entered private health data to OpenRouter/AI providers in the public demo unless the user explicitly understands it and the privacy policy covers it. For a portfolio, prefer fake local demo responses.

Other risks:

- No CORS policy.
- No rate limiting.
- No input size limits on AI prompts/uploads.
- No centralized exception handling.
- No security headers.
- No clear secret management.
- Public Swagger should be controlled in production.

## 10. Build and local run status

Frontend:

- `package.json` has `start`, `build`, `test`, and `eject`.
- Local shell did not have `node` or `npm` on PATH, so frontend build/test was not run.
- `project runing code.txt` suggests old local flow: `npx json-server db.json --port=3002`, frontend at `localhost:3000`, and `npm test`.
- Current hard-coded backend URL is `http://localhost:5122`, so local run instructions are inconsistent.
- Tests appear stale and may fail without updates.

Backend:

- `dotnet --info` works and .NET 8 runtime is installed.
- Build was not run to avoid generating/changing output during an audit-only task.
- The backend has existing `bin`/`obj` artifacts and the `.csproj` explicitly includes generated files, which should be cleaned later.
- Launch settings expose HTTP at `http://localhost:5122` and HTTPS at `https://localhost:7140`.

Needs verification:

- Whether `dotnet build` currently succeeds after removing `bin`/`obj` from the project file.
- Whether frontend tests/build pass after installing Node/npm and dependencies.

## 11. CI/CD status

No GitHub Actions workflows were found.

Recommended simple CI/CD:

- Frontend CI: install Node, `npm ci`, `npm test -- --watchAll=false` if tests are repaired, `npm run build`.
- Backend CI: `dotnet restore`, `dotnet build --configuration Release --no-restore`, optional `dotnet test` once test project exists.
- Secret scanning: use GitHub secret scanning plus a lightweight check such as Gitleaks later.
- Docker CI: only after Dockerfile is converted or confirmed for the target hosting platform.

Keep CI simple at first. One frontend build workflow and one backend build workflow is enough.

## 12. Deployment readiness

Frontend public deployment:

- Not ready today, but close after sanitization and config cleanup.
- Needs env-based API URL.
- Needs SPA rewrite config for Vercel/Netlify/Cloudflare.
- Needs replacement/removal of `db.json` private-looking data and API keys.
- Needs a demo-data-only mode if backend is not deployed.

Backend public deployment:

- Not ready today.
- Must remove committed secrets and DB/upload files.
- Must configure CORS for the frontend domain.
- Must configure environment variables.
- Must decide whether public demo should call external AI/maps APIs or use fake/demo providers.
- Must move to a deploy-friendly Docker/runtime setup.
- Must avoid storing real medical reports or symptoms.

Recommended deployment order:

1. Deploy frontend as static demo using fake local data and clear disclaimers.
2. Then deploy backend only after auth, CORS, secret handling, fake seed data, and upload/AI safety are addressed.

## 13. UI/UX assessment

Strengths:

- The app has a clear healthcare assistant concept.
- It includes multiple recognizable user flows.
- There are existing visual assets and branded pages.
- Loading states exist in some feature screens.

Gaps:

- UI text has spelling/grammar issues (`WELL-COME`, `Specilist`, `Recomendation`, etc.).
- Encoding issues appear in clinic names and symbols.
- Alerts are used heavily instead of inline form feedback.
- Accessibility needs work: invalid `<icon>` elements, missing alt text on some images, repeated IDs, labels using `for` instead of `htmlFor` in some JSX.
- Layout/styling is inconsistent across screens.
- Medical disclaimers are missing from diagnosis/report flows.

Recommendation: polish one screen at a time after the data/API contract cleanup.

## 14. Documentation gaps

Current README status:

- Frontend README is the default Create React App template.
- Backend README only contains `# MAD-AI`.
- No combined project README was found.

Missing documentation:

- What the project does.
- Group-project attribution.
- Your individual role/contributions.
- Architecture overview.
- Frontend/backend folder explanation.
- Local setup instructions.
- Required environment variables.
- Fake/demo data policy.
- Medical disclaimer.
- API endpoint summary.
- Deployment notes.
- Known limitations.
- Screenshots/demo flow.
- Security/privacy notes.

## 15. What should be kept

- Separate frontend/backend architecture.
- React feature-folder approach as a starting point.
- ASP.NET Core service/controller structure.
- EF Core models and migrations as a starting point.
- JWT + BCrypt direction for auth.
- Symptom checker, doctor search, and report upload as portfolio features.
- Existing visual assets if licensing is safe. Needs verification.
- Swagger setup for development.

## 16. What should be refactored

Refactor gradually:

- Move frontend config to environment variables.
- Replace json-server calls with backend API calls or static demo modules.
- Fix auth route and user ID contract.
- Add protected frontend routes.
- Add backend CORS.
- Register `IDoctorService`.
- Fix Google Maps config key path or replace live doctor search with fake data.
- Remove committed secrets and database/upload artifacts.
- Clean `.csproj` generated file includes.
- Remove/retire unused RTK Query store or make it active intentionally.
- Repair tests to match current UI/API behavior.
- Replace alert-based errors with inline UI states.
- Add disclaimers to health features.

## 17. What should be rebuilt, if anything

No full rebuild is recommended.

Potential rebuild candidates:

- The auth/register/profile vertical slice may be easier to rewire cleanly than patching the mixed json-server/backend logic in place.
- The public demo data layer may be worth rebuilding as a small fake-data module if the backend is not deployed yet.
- The Dockerfile should likely be replaced with a Linux-friendly version if backend deployment targets Render/Railway/Fly.io.

Everything else can be improved incrementally.

## 18. Portfolio safety checklist

Before making the project public:

- [ ] Remove all committed API keys, JWT secrets, and secret-like values.
- [ ] Rotate any exposed keys.
- [ ] Remove `MADAI.db`, `MADAI.db-wal`, `MADAI.db-shm`.
- [ ] Remove uploaded PDFs and any generated report files.
- [ ] Remove or replace `db.json` users/password-like data.
- [ ] Replace real-looking names/emails with fictional demo identities.
- [ ] Replace real-looking patient symptoms/reports with fictional demo content.
- [ ] Replace or clearly separate real clinic lookup from fake demo doctor data.
- [ ] Add `.gitignore` entries for SQLite DB files, uploads, `bin`, `obj`, and env files.
- [ ] Add medical disclaimer on health feature screens.
- [ ] Add README disclaimer: educational portfolio demo, not medical advice, no real data.
- [ ] Add group-project attribution and your role.
- [ ] Add env var setup docs without secret values.
- [ ] Confirm no secrets remain with a scanner before publishing.

## 19. Group project attribution notes

Recommended wording for README/portfolio:

> Madai was originally created as a bachelor group project by multiple students. This repository is my local portfolio-polish version, focused on documenting the architecture, improving deployment readiness, replacing unsafe demo data, and incrementally refactoring selected features. I do not claim sole authorship of the original project.

Also document:

- Original group context.
- Your specific contributions, if known.
- Changes you make after this audit in a changelog.
- That all public/demo data is fictional.

Needs verification:

- Exact group member attribution requirements.
- Which parts you personally built during the bachelor project.
- Whether the visual assets are licensed for public portfolio use.

## 20. Recommended next 10 small tasks

1. Create a top-level README with project overview, group attribution, fake-data policy, and medical disclaimer.
2. Remove/rotate committed secrets and replace config with `.env.example` / appsettings placeholders.
3. Update `.gitignore` so DB files, uploads, `bin`, and `obj` cannot be recommitted.
4. Remove committed SQLite database files, WAL/SHM files, uploaded PDFs, and generated backend artifacts from the repo copy.
5. Write a short API contract document mapping frontend screens to backend endpoints.
6. Fix the auth/register/profile contract as the first vertical slice.
7. Add backend CORS for local frontend and future deployed frontend origin.
8. Decide whether blogs/recommendations are static fake frontend data or backend endpoints.
9. Repair frontend tests enough to cover one current screen.
10. Add simple GitHub Actions build checks for frontend and backend.

## Recommended next single Codex task

Next task: create a safe top-level documentation and hygiene plan without changing application code: add a top-level `README.md`, `docs/architecture.md`, and `.env.example` files for frontend/backend, including group-project attribution, fake-data-only policy, medical disclaimer, local setup notes, and a checklist for removing secrets/database/upload artifacts before public deployment.
