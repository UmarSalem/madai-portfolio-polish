# React Concepts Used

This file explains React ideas using current Madai frontend examples.

## React Components

Simple explanation: a component is a reusable function that returns UI.

Where it appears: `Login`, `Register`, `Profile`, `SymptomChecker`, `DoctorSearch`, `MedicalHistory`, `ProtectedRoute`.

Interview answer: "Each page is a React function component. It owns its local state, renders JSX, and calls API helpers when the user submits a form."

## Pages vs Components

Simple explanation: pages are route-level screens; components are reusable UI pieces used inside pages.

Where it appears: `src/routes/ReactRoute.jsx` loads page components. `Navbar` and `ProtectedRoute` are shared components.

Interview answer: "In this project, most feature folders are page-level components. Shared components are still limited, so extracting reusable UI is a future improvement."

## Props

Simple explanation: props are values passed from a parent component to a child component.

Where it appears: `ProtectedRoute` receives `children`.

Example:

```jsx
<ProtectedRoute><Profile /></ProtectedRoute>
```

Interview answer: "`ProtectedRoute` uses the `children` prop to either render the protected page or redirect to login."

## State

Simple explanation: state is data a component remembers while the user interacts with it.

Where it appears: form fields, loading flags, error messages, API results.

Interview answer: "I used local state for screen-specific values like email, password, symptoms, selected file, loading, and errors."

## useState

Simple explanation: `useState` creates a value and an update function.

Where it appears: `Login.jsx`, `Profile.jsx`, `SymptomChecker.jsx`, `DoctorSearch.jsx`, `MedicalHistory.jsx`.

Example:

```jsx
const [email, setEmail] = useState('');
```

Interview answer: "`useState` keeps controlled form values in sync with user input."

## useEffect

Simple explanation: `useEffect` runs side effects, like loading data after a component appears.

Where it appears:

- `Login.jsx`: redirects if already logged in.
- `Register.jsx`: redirects if already logged in.
- `Profile.jsx`: loads profile data.
- `MedicalHistory.jsx`: loads report history.

Interview answer: "I use `useEffect` for actions that happen after render, such as fetching profile data or report history."

## Conditional Rendering

Simple explanation: show different UI depending on state.

Where it appears:

- `{error && <p>...` in feature screens.
- `loading ? 'Searching...' : 'Search Demo Doctors'`.
- Empty states in symptom checker, doctor search, and report history.

Interview answer: "Conditional rendering lets the UI show loading, error, empty, or result states from the same component."

## Lists and Keys

Simple explanation: lists render arrays; keys help React track each item.

Where it appears:

- `doctors.map(...)` in `DoctorSearch.jsx`.
- `reports.map(...)` in `MedicalHistory.jsx`.
- `history.map(...)` in `SymptomChecker.jsx`.

Interview answer: "When mapping arrays to JSX, I use a stable `key` such as an id so React can update the list efficiently."

## Forms and Controlled Inputs

Simple explanation: a controlled input gets its value from React state and updates state on change.

Where it appears:

- Login email/password.
- Register fields.
- Symptom checker patient/symptom fields.
- Doctor search location/specialty fields.
- Report upload patient name and file input.

Interview answer: "Controlled inputs make validation and submit logic predictable because React always knows the current form value."

## API Calls With Axios

Simple explanation: Axios sends HTTP requests to the backend.

Where it appears:

- `httpClient.js` creates the shared Axios instance.
- `auth.js` contains auth/profile calls.
- `features.js` contains feature calls.

Interview answer: "I moved aligned backend calls into API helper files so components stay focused on UI behavior."

## Loading States

Simple explanation: a loading state tells the user something is happening.

Where it appears:

- `isSubmitting` in login/register.
- `loading` and `saving` in profile.
- `loading` in symptom checker and doctor search.
- `loading` and `uploading` in report upload/history.

Interview answer: "Loading state prevents duplicate submits and gives the user feedback during network requests."

## Error States

Simple explanation: error state stores a message when something goes wrong.

Where it appears: symptom checker, doctor search, report upload/history, profile, auth screens.

Interview answer: "I prefer inline error messages over browser alerts because they are easier to style, test, and understand."

## localStorage

Simple explanation: localStorage stores small browser data between page refreshes.

Where it appears: `authSession.js` stores the normalized auth user under `Config.userApiTokenName`.

Interview answer: "This is demo-grade token storage. For production, I would review stronger auth/session options."

## Environment Variables

Simple explanation: environment variables let each machine or deployment choose config values.

Where it appears: `.env.example` exists, but `Config.serverUrl` is still hard-coded.

Interview answer: "The next improvement is using `REACT_APP_API_BASE_URL` instead of a hard-coded local backend URL."

## Routing

Simple explanation: routing chooses which page component to show for a URL.

Where it appears: `ReactRoute.jsx`, `ReactLinks.js`, `ProtectedRoute.jsx`.

Interview answer: "Routes are centralized, and protected routes redirect unauthenticated users to login."
