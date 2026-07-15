# Feature Build Order

This is the recommended order for understanding and improving the Madai frontend as a junior developer.

## 1. Understand Routes and Pages

What changes: read `src/routes/ReactRoute.jsx` and `src/routes/ReactLinks.js`.

Why first: routes tell you which screens exist and how users move through the app.

Interview point: "I started by mapping routes to pages so I understood the user-facing surface before editing feature code."

## 2. Understand the API Client

What changes: read `src/api/httpClient.js`, `src/api/auth.js`, and `src/api/features.js`.

Why second: most important features depend on backend calls.

Interview point: "I centralized backend calls through a shared Axios client and feature API helpers."

## 3. Understand Auth Token Flow

What changes: read `src/api/authSession.js`, `Login.jsx`, `Profile.jsx`, and `ProtectedRoute.jsx`.

Why third: protected features need a token before they can work.

Interview point: "The demo stores a normalized user session in localStorage and attaches the token to API requests."

## 4. Fix Login/Register/Profile

What changes: align register/login/profile with `/api/auth/...` and `/api/user/me`.

Why here: all later protected features depend on login.

Interview point: "I fixed auth/profile first because it unlocks every authenticated vertical slice."

## 5. Fix Symptom Checker

What changes: call `/api/SymptomChecker`, protect the route, add disclaimer/loading/error/result states.

Why here: it is a core health feature, but smaller than report uploads.

Interview point: "I added visible medical safety wording and aligned request/response handling."

## 6. Fix Doctor Search

What changes: call `/api/Doctors/search`, protect the route, add empty/error/loading states.

Why here: it is useful and less privacy-sensitive than report uploads.

Interview point: "I made external provider handling safe with fictional fallback data."

## 7. Fix Report Upload/History

What changes: use multipart form-data, validate PDF files, show safety warnings, and avoid Base64/mock storage.

Why here: file upload is higher risk and should come after auth/API patterns are stable.

Interview point: "I treated report upload as privacy-sensitive and made the demo metadata-only."

## 8. Improve UI States

What changes: improve consistent loading, empty, success, and error components.

Why here: stable data flows make UI polish easier.

Interview point: "After API contracts were stable, I improved user feedback states."

## 9. Add Tests

What changes: add focused tests for login, profile, symptom checker, doctor search, and report upload validation.

Why here: tests are easier once behavior is clear.

Interview point: "I prefer small tests around fixed feature contracts instead of broad brittle tests."

## 10. Prepare Deployment

What changes: environment variables, build verification, static hosting config, CI.

Why last: deployment should happen only after safety and config are clean.

Interview point: "I did not deploy health-related flows until fake data, secrets, and API contracts were reviewed."
