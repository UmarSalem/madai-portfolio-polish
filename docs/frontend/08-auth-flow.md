# Auth Flow

## Register Flow

File: `src/register/Register.jsx`

API function: `register(data)` in `src/api/auth.js`

Endpoint:

```text
POST /api/auth/signup
```

The frontend sends:

- `firstName`
- `lastName`
- `email`
- `password`
- `role: "Patient"`

After successful registration, the user is sent to `/login`.

## Login Flow

File: `src/login/Login.jsx`

API function: `login(email, password)` in `src/api/auth.js`

Endpoint:

```text
POST /api/auth/signin
```

After login succeeds, `saveAuthUser(res.data)` stores a normalized session and the user is navigated to `/doctor`.

If the user was redirected to login from a protected page, React Router state stores the original path and login sends the user back there after successful authentication.

## Token Storage

File: `src/api/authSession.js`

The frontend stores normalized auth data under `Config.userApiTokenName`, currently `user`.

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

## Authorization Header

File: `src/api/httpClient.js`

Every request through `httpClient` checks localStorage. If a token exists, Axios sends:

```text
Authorization: Bearer <token>
```

## Profile Loading

File: `src/profile/Profile.jsx`

The profile page calls:

```text
GET /api/user/me
```

The profile update form calls:

```text
PUT /api/user/me
```

If a `401` happens, the frontend clears local auth storage and redirects to login.

## Logout Flow

`clearAuthUser()` exists in `src/api/authSession.js`. A full visible logout flow needs verification in the current UI.

The navbar uses the stored normalized auth session to decide whether to show login or authenticated menu options. Logout clears the stored auth session and sends the user back to `/`.

## Protected Routes

File: `src/routes/ProtectedRoute.jsx`

Protected routes include:

- `/doctor`
- `/symptomChecker`
- `/admin/medicalHistory`
- `/doctorSearch`
- `/profile`

If no token exists, the user is redirected to login with the attempted route preserved in router state.

Example:

```text
/profile -> /login -> successful login -> /profile
```

## Security Limitations

- localStorage token storage is demo-grade.
- Frontend protected routes improve user experience but do not replace backend authorization.
- The backend must still validate JWTs and roles.
- Route state is useful for user experience, but it is not a security boundary.
- For production, review token expiry, refresh, logout, XSS risk, HTTPS, and cookie/session strategy.

## Interview Explanation

"For this portfolio demo, login returns a JWT token from the backend. The frontend stores a minimal normalized session in localStorage, and the shared Axios client attaches the token to protected API calls. I understand this is demo-grade and would need a production security review."
