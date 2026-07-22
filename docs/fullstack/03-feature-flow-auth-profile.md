# Feature Flow: Auth and Profile

## Register Flow

Frontend:

- `src/register/Register.jsx`
- `src/api/auth.js`

Backend:

- `AuthController.Signup`
- `AuthService.Signup`
- `SignupRequestDTO`
- `User`

Flow:

```text
Register form
  -> register({ firstName, lastName, email, password, role: "Patient" })
  -> POST /api/auth/signup
  -> AuthController
  -> AuthService checks duplicate email
  -> BCrypt hashes password
  -> EF Core saves User
  -> frontend navigates to /login
```

## Login Flow

Frontend:

- `src/login/Login.jsx`
- `src/api/auth.js`
- `src/api/authSession.js`

Backend:

- `AuthController.SignIn`
- `AuthService.SignIn`
- `JwtService`
- `SignInRequestDTO`
- `SignInResponseDTO`

Flow:

```text
Login form
  -> login(email, password)
  -> POST /api/auth/signin
  -> EF Core finds User
  -> BCrypt verifies password
  -> JwtService creates JWT
  -> frontend stores normalized session
```

## Token Storage

`saveAuthUser()` stores a minimal demo session in localStorage:

```js
{
  id,
  userId,
  token,
  email,
  role
}
```

This is demo-grade and needs production security review.

## Bearer Token Request Flow

`httpClient.js` reads localStorage and attaches:

```text
Authorization: Bearer <token>
```

Protected backend endpoints use JWT middleware and `[Authorize]`.

## Profile Loading Flow

Frontend:

- `src/profile/Profile.jsx`
- `getMyProfile()`
- `updateMyProfile(data)`

Backend:

- `GET /api/user/me`
- `PUT /api/user/me`
- `UserController`
- `UserProfileDTO`
- `UpdateUserProfileDTO`

Flow:

```text
Profile page opens
  -> useEffect calls getMyProfile()
  -> Axios sends bearer token
  -> backend reads user id claim
  -> EF Core loads User
  -> UserProfileDTO returned
  -> form state is filled
```

## Logout Flow

`clearAuthUser()` exists in `authSession.js`. A full visible logout UI needs verification.

## What Was Fixed

- Register uses backend `/api/auth/signup`.
- Login uses backend `/api/auth/signin`.
- Auth session is normalized.
- Profile uses `/api/user/me`.
- Profile response avoids exposing `PasswordHash`.

## Still Needs Verification

- Full logout UI.
- Token expiry behavior in frontend.
- Better frontend auth tests.
- Production-grade token storage strategy.
