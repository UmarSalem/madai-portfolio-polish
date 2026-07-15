# Frontend Interview Preparation

## 2-Minute Project Explanation

Madai is an educational healthcare assistant demo originally created as a bachelor group project. I am polishing my local copy as a portfolio project. The frontend is a React single-page app with routes for login, registration, profile, symptom checking, doctor search, and safe medical report upload/history. My work focuses on documentation, safety cleanup, and aligning frontend screens with the ASP.NET Core backend one feature at a time.

## 5-Minute Technical Explanation

The frontend uses React with Create React App, React Router for navigation, Axios for backend calls, and local component state for most feature screens. A shared Axios client attaches the bearer token from localStorage to protected requests. The route file defines public and protected pages, and `ProtectedRoute` redirects users to login if there is no stored token.

I refactored the frontend/backend contract feature by feature. Auth/profile was aligned first because later features need login. Then I aligned symptom checker, doctor search, and report upload/history. For health-related features, I added demo-only warnings and safer handling so the portfolio does not encourage real patient data or real medical reports.

## Group Project Explanation

"Madai was originally created by a bachelor project group. I do not claim I built the original project alone. My portfolio work is the cleanup and polish: auditing the code, documenting the architecture, replacing unsafe data, aligning API contracts, and improving feature flows."

## Portfolio-Polish Role

Say:

"My role in this portfolio version is to make the project safer, clearer, and more professional. I am refactoring feature by feature instead of rewriting the whole app."

## Frontend Architecture

Say:

"The app has route-level feature folders, a shared router, a shared Axios client, auth session helpers, and feature API helper functions. Most screens use local state because their state is page-specific."

## React Hooks

Say:

"I use `useState` for form values, loading flags, errors, and API results. I use `useEffect` for side effects like loading profile data or report history when the page opens."

## API Integration

Say:

"I moved API calls into helper files. The shared Axios client owns the base URL and attaches the bearer token, while components call feature functions like `login`, `checkSymptoms`, `searchDoctors`, or `uploadMedicalReport`."

## Auth/Token Handling

Say:

"For the demo, login stores a normalized user object in localStorage, including the JWT token. The Axios interceptor reads that token and attaches it to protected API requests. I understand this is demo-grade and needs security review before production."

## Feature-by-Feature Refactoring

Say:

"I worked in vertical slices: auth/profile, symptom checker, doctor search, then report upload/history. This kept each change small and easier to test."

## Health-Data Safety

Say:

"Because this is health-related, I use fake/demo data only. The UI warns users not to enter real patient data. Report uploads are metadata-only in the safe demo and do not store uploaded PDF bytes."

## AI-Assisted Development

"I used AI coding tools as a development assistant, but I reviewed, tested, debugged, documented, and improved the project myself."

## 15 Interview Questions and Junior Answers

1. What does the Madai frontend do?
   - It is a React app for demo auth, profile, symptom checking, doctor search, and safe report upload/history.

2. What is a React component?
   - A function that returns UI. In Madai, pages like `Login` and `DoctorSearch` are components.

3. What is `useState`?
   - A hook for storing component state, like form values or loading flags.

4. What is `useEffect`?
   - A hook for side effects, like loading profile data when a page opens.

5. How does routing work?
   - `ReactRoute.jsx` maps URL paths to page components using React Router.

6. What is a protected route?
   - A wrapper that checks if a token exists and redirects to login when it does not.

7. How does the frontend call the backend?
   - Through Axios helper functions in `src/api/`.

8. Where is the API base URL configured?
   - Currently in `src/constant/index.js`; moving it fully to environment variables is a future task.

9. How is the token sent to the backend?
   - The Axios interceptor adds `Authorization: Bearer <token>` when a stored token exists.

10. Why did you fix auth/profile first?
    - Other protected features need login and token handling to work.

11. Why use multipart form-data for reports?
    - File uploads should send the PDF as form data, matching the backend upload endpoint.

12. Why avoid Base64 file storage?
    - It is inefficient and unsafe for real medical documents; the safe demo should not store report content.

13. What is conditional rendering?
    - Showing UI based on state, like error messages only when an error exists.

14. What would you improve next?
    - Environment config, tests, mobile UI, accessibility, and removing confirmed unused code.

15. How do you describe the group project honestly?
    - I say it was originally a bachelor group project and my portfolio work is the cleanup, documentation, safety, and refactoring.
