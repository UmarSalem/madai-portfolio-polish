# Frontend Architecture

The Madai frontend is a Create React App style project. The entry point renders `App`, and `App` renders the router.

## Entry Point

- `src/index.js`: creates the React root and wraps the app with Redux `Provider`.
- `src/App.js`: renders `ReactRoute`.
- `src/routes/ReactRoute.jsx`: defines the application routes.

## Important Folders

- `src/api/`: Axios client, auth API functions, feature API functions, auth session helpers.
- `src/routes/`: route constants, route definitions, protected route wrapper.
- `src/components/layout/`: shared navigation.
- `src/login/`, `src/register/`, `src/profile/`: auth and profile screens.
- `src/symptomChecker/`: symptom checker screen, CSS, and a focused test.
- `src/doctorSearch/`: doctor search screen and CSS.
- `src/medicalHistory/`: safe medical report upload/history screen and CSS.
- `src/aidoctor/`: currently exports the safe medical report demo component.
- `src/app/` and `src/input/`: Redux store and a small input slice.
- `src/rkt_query/`: older RTK Query/admin-style code. Needs verification before using or removing.

## Page and Component Organization

Most screens are organized as feature folders. For example:

```text
src/symptomChecker/
  SymptomChecker.jsx
  SymptomChecker.css
  SymptomChecker.test.jsx
```

This is understandable for a junior project because each screen keeps its JSX and CSS close together. A future improvement would be extracting shared form, button, alert, and card components.

## API Service Layer

The frontend should not call Axios directly from every screen. Current aligned features use:

- `src/api/httpClient.js`
- `src/api/auth.js`
- `src/api/features.js`

This is better than scattering URLs across components because endpoint changes can be made in one place.

## Config and Environment Approach

Current code:

- `.env.example` includes `REACT_APP_API_BASE_URL`.
- `src/constant/index.js` reads `process.env.REACT_APP_API_BASE_URL`.
- If the environment variable is missing, it falls back to `http://localhost:5122` for local development.
- Trailing slashes are normalized so `http://localhost:5122` and `http://localhost:5122/` behave the same.

Current pattern:

```js
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5122";
const serverUrl = apiBaseUrl.replace(/\/+$/, "");
```

## Styling Approach

Styling is mostly plain CSS files imported by each screen. Examples:

- `LoginStyle.css`
- `SymptomChecker.css`
- `DoctorSearchStyle.css`
- `MedicalHistoryStyle.css`

Strength: easy to understand.

Weakness: some global selectors and reused class names can accidentally affect other screens.

## Architecture Strengths

- Routes are centralized.
- API functions are increasingly centralized.
- Protected route behavior exists.
- Aligned features have loading/error/empty states.
- Sensitive health features now include demo safety wording.

## Architecture Weaknesses

- Redux is set up but not clearly used by current feature flows.
- Some older folders may be stale or unused.
- Some CSS is global and inconsistent.
- Tests are limited.

## Suggested Improvements Later

- Confirm and remove unused Redux/RTK Query code.
- Create shared UI components for alerts, cards, forms, loading states, and empty states.
- Add a small test for each aligned feature slice.
- Improve accessibility labels, button states, and mobile navigation.
