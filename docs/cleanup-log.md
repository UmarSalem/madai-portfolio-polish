# Cleanup Log

Date: 2026-07-08

Branch observed by Codex: `docs/project-hygiene`

Requested branch name: `chore/remove-secrets-demo-data`

Note: Codex observed the local checkout on `docs/project-hygiene` while performing this cleanup. The cleanup was applied to the current working tree.

## What Was Removed

- `MAD-AI_BackEnd-develop/MADAI.db`
- `MAD-AI_BackEnd-develop/MADAI.db-wal`
- `MAD-AI_BackEnd-develop/MADAI.db-shm`
- `MAD-AI_BackEnd-develop/uploads/Day 1.pdf`

These files were removed because they may contain private-looking user data, health data, report data, database state, generated AI output, or uploaded report content. Public portfolio repositories must not include real or private health-related data.

## What Was Replaced

- `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/db.json`

The previous json-server fixture included private-looking demo users, real-looking emails, encoded password-like values, report metadata, symptom text, and real-looking clinic data. It was replaced with clearly fictional demo data using `.example.test` addresses, fictional clinics, fictional symptoms, and explicit demo-only wording.

## What Was Sanitized

- `MAD-AI_BackEnd-develop/appsettings.json`
- `MAD-AI_BackEnd-develop/Program.cs`
- `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/src/constant/index.js`
- `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/src/symptomChecker/SymptomChecker.jsx`

Real or secret-like values were replaced with placeholders only. Real secrets were not moved into another committed file.

## What Was Added

- `MAD-AI_BackEnd-develop/appsettings.Example.json`

This file provides safe placeholder configuration for local setup documentation.

## Generated Artifact Cleanup

- `MAD-AI_BackEnd-develop/MADAI-BACKEND.csproj`

Generated `bin`/`obj` item groups were removed from the backend project file. Package references, folders, and source-code project settings were kept.

## Current Safety Rules

The repository ignore files now block common unsafe local files:

- `.env`
- `.env.local`
- `appsettings.Production.json`
- `appsettings.Local.json`
- `appsettings.Development.local.json`
- `*.db`
- `*.db-wal`
- `*.db-shm`
- `uploads/`
- `bin/`
- `obj/`
- `node_modules/`
- `build/`
- `dist/`
- `coverage/`

## Follow-Up

Before pushing publicly, run a secret scan and review `git status` carefully. Any removed files that still appear in Git status should be committed as deletions on the cleanup branch.

## Auth/Profile Vertical Slice

Date: 2026-07-08

- Updated frontend register to call the ASP.NET Core `/api/auth/signup` endpoint.
- Updated frontend login to normalize the backend sign-in response into minimal local session data.
- Updated frontend profile to call `/api/user/me` instead of old json-server-style `/users/{id}` routes.
- Added a small protected route wrapper for the profile route.
- Updated backend profile responses to use a safe DTO that does not expose password hashes.
- Added a safe backend profile update DTO for editable profile fields only.
- Added minimal local CORS policy for React development origins.

Remaining verification:

- Run full local end-to-end auth/profile testing once a local database has safe demo users.
- Confirm deployment CORS origins before public hosting.

## Symptom Checker Vertical Slice

Date: 2026-07-08

- Updated the React symptom checker to call the ASP.NET Core `/api/SymptomChecker` endpoint through the shared Axios client.
- Protected the symptom checker route so bearer-token behavior matches the backend `[Authorize]` endpoint.
- Added a visible medical disclaimer and no-real-patient-data warning to the symptom checker screen.
- Added inline loading, empty, error, and result states for the demo flow.
- Added request length validation to the backend symptom checker DTO.
- Updated backend symptom analysis handling so missing placeholder OpenRouter configuration or provider failure returns a safe demo response instead of crashing.
- Updated related backend symptom result/history endpoints to filter by the authenticated user and return safer DTO-shaped data instead of EF entities.

Remaining verification:

- Run an end-to-end symptom checker test with a fictional demo account and a local safe database.
- Decide whether public demo deployments should store submitted fictional symptoms or switch this feature to non-persistent demo mode.
- Confirm deployment environment variables never contain provider secrets in Git.

## Doctor Search Vertical Slice

Date: 2026-07-10

- Updated the React doctor search screen to call the ASP.NET Core `/api/Doctors/search` endpoint through the shared Axios client.
- Protected the doctor search route so bearer-token behavior matches the backend `[Authorize(Roles = "Patient")]` endpoint.
- Added inline loading, empty, and error states for the doctor search flow.
- Removed unused frontend imports and old local state that were not part of the API contract.
- Registered `IDoctorService` with `DoctorService` in backend dependency injection.
- Updated `DoctorService` to read `GoogleMaps:ApiKey`, matching the safe example configuration.
- Added a fictional demo doctor fallback when Google Places configuration is missing, placeholder-only, or unavailable.
- Extended the doctor response DTO with `location`, `specialty`, and `isDemo` fields for clearer frontend rendering.

Remaining verification:

- Run full backend build after NuGet restore access is available.
- Run frontend build/tests after Node/npm is available.
- Test doctor search end-to-end with a fictional patient account.
- Decide whether public deployments should allow live Google Places results or force fictional demo results only.

## Report Upload/History Vertical Slice

Date: 2026-07-13

- Updated the React medical report/history screen to call ASP.NET Core report endpoints through the shared Axios client.
- Updated the AI doctor route to reuse the same safe report demo component instead of the old mock `/medical_report` flow.
- Protected report upload/history routes because the backend endpoints require authentication.
- Added visible warning text: educational demo only, do not upload real medical reports or private health information.
- Added frontend PDF type and 2 MB size validation.
- Removed frontend Base64 file conversion and download links for uploaded report content.
- Updated backend upload handling to validate PDF files and store metadata/analysis only for new demo uploads.
- Disabled writing uploaded PDFs to `uploads/` and disabled storing file bytes for new demo uploads.
- Updated backend report/history endpoints to return safe DTOs instead of exposing file bytes or EF entities.
- Updated report analysis to return a safe demo fallback when OpenRouter configuration is missing, placeholder-only, PDF parsing fails, or the provider is unavailable.
- Removed an unused medical-history copy file that contained old real-looking clinic data.

Remaining verification:

- Run backend build after NuGet restore access is available.
- Run frontend build/tests after Node/npm is available.
- Test upload/list with a fictional tiny PDF and a fictional patient account.
- Decide whether public deployment should disable report uploads entirely or keep metadata-only demo uploads.
