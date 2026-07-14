# Pull Request Notes: Symptom Checker API Contract

Use this when creating the pull request for the symptom-checker vertical slice.

## Suggested PR Title

Fix symptom checker frontend/backend API contract

## Summary

This PR aligns the Madai symptom checker React flow with the ASP.NET Core backend API. The frontend now submits demo symptom data to the real `/api/SymptomChecker` endpoint through the shared Axios client, and the symptom checker route is protected because the backend requires a bearer token.

The PR also improves portfolio safety for a health-related feature by adding a visible medical disclaimer, warning users not to enter real patient data, and making the backend return a safe demo fallback response when the external AI provider is not configured or unavailable.

## What Changed

- Updated the React symptom checker screen to call the ASP.NET Core backend endpoint.
- Removed the old commented Gemini/json-server-style symptom checker code path.
- Added inline loading, empty, error, and result states.
- Added a visible disclaimer: this is an educational demo, not medical advice.
- Protected the symptom checker route to match backend authorization.
- Added request length validation to the backend symptom checker DTO.
- Updated backend AI handling so missing placeholder OpenRouter config returns a safe demo response instead of crashing.
- Updated related backend symptom result/history endpoints to filter by authenticated user and return safer DTO-shaped responses.
- Updated the symptom checker test to mock the project API function instead of the old Gemini flow.
- Updated API contract and learning documentation.

## Why This Changed

Before this change, the symptom checker code had signs of multiple development stages: an ASP.NET Core endpoint existed, but the frontend still contained old mock/json-server and direct AI-provider logic. That made the feature harder to deploy safely and harder to explain professionally.

The goal was to stabilize one vertical slice at a time. For this slice, that means the screen, API helper, protected route, backend controller, DTO, service behavior, tests, and documentation now describe the same feature contract.

## Junior Developer Learning Notes

- A frontend/backend feature should have one clear API contract: method, URL, request body, response body, and auth behavior.
- A protected backend endpoint should usually have a protected frontend route or clear login handling.
- DTOs help avoid exposing internal database entity shape directly to the frontend.
- Health-related demo features need visible safety text and must not encourage real medical data entry.
- External AI provider failure should be handled gracefully, especially in a portfolio demo.

## Validation

- `git diff --check` passed, with only normal Windows CRLF warnings.
- No committed SQLite database files were found.
- No generated `bin`, `obj`, `node_modules`, `build`, `dist`, or `coverage` folders were left behind.
- Old symptom checker Gemini/mock endpoint scan is clean.
- Backend build could not complete because local NuGet config access is blocked on this machine.
- Frontend build/test could not run because Node/npm are not available in this environment.

## Remaining Verification

- Run backend build after NuGet access is fixed.
- Run frontend build/test after Node/npm are available.
- Test the full symptom checker flow with a fictional demo account and safe local database.
- Decide later whether public demo symptom submissions should be persisted or kept non-persistent.

