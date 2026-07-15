# State and Hooks

## Local Component State

Most aligned Madai frontend features use local state with `useState`.

Examples:

- Login: `email`, `password`, `message`, `isSubmitting`.
- Register: form fields, message, submit state.
- Profile: profile fields, `loading`, `saving`, `message`.
- Symptom checker: patient, symptoms, result, history, loading, error.
- Doctor search: location, specialty, doctors, loading, error, `hasSearched`.
- Report upload/history: patient name, file, reports, loading, uploading, error, success.

This is reasonable because most state is only needed by one screen.

## localStorage State

`src/api/authSession.js` stores normalized auth data in localStorage.

Stored shape:

```js
{
  id,
  userId,
  token,
  email,
  role
}
```

This is demo-grade. For production, token storage should be reviewed carefully.

## Redux Status

Redux is active at the app root:

- `src/index.js` wraps `App` in `Provider`.
- `src/app/store.js` registers `inputSlice`.
- `src/input/inputSlice.js` stores demo email/password-like placeholder state.

Current aligned feature slices do not appear to depend on Redux. RTK Query code exists in `src/rkt_query/`, but active usage needs verification.

## useState Usage

`useState` is used for form fields and UI status.

Example:

```jsx
const [loading, setLoading] = useState(false);
```

Interview answer: "I use `useState` for values that belong to one screen, like form inputs and loading flags."

## useEffect Usage

`useEffect` is used for initial page actions:

- Redirect logged-in users away from login/register.
- Load profile data when profile page opens.
- Load report history when medical history page opens.

Interview answer: "`useEffect` is for side effects, especially data loading after the component renders."

## Shared State

Shared state currently exists mainly through:

- localStorage auth session.
- Axios interceptor reading the session.
- Redux provider/input slice, though current usage needs verification.

## Strengths

- Local state is simple and easy to trace.
- Auth session normalization is centralized.
- API token attachment is centralized.
- Feature pages mostly avoid unnecessary global state.

## Weaknesses

- Token storage in localStorage is demo-grade.
- Redux may be unnecessary if not used by active features.
- Some old RTK Query imports appear stale and may not compile if used.
- State and UI patterns are not yet extracted into reusable hooks/components.

## Future Improvements

- Confirm whether Redux/RTK Query is needed.
- Add a `useAuth` hook later if auth behavior grows.
- Add reusable `useAsyncAction` or shared loading/error components if duplication becomes painful.
- Keep local state for simple page-only forms.
