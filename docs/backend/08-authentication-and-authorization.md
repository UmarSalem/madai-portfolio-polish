# Authentication and Authorization

## Signup Flow

Endpoint:

```text
POST /api/auth/signup
```

Flow:

1. `AuthController.Signup` receives `SignupRequestDTO`.
2. `AuthService.Signup` checks if email exists.
3. If creating an admin, it checks whether creator is already an admin.
4. Password is hashed with BCrypt.
5. User is saved with EF Core.

## Signin Flow

Endpoint:

```text
POST /api/auth/signin
```

Flow:

1. `AuthController.SignIn` receives `SignInRequestDTO`.
2. `AuthService.SignIn` finds user by email.
3. BCrypt verifies password against `PasswordHash`.
4. `JwtService.GenerateToken` creates a JWT.
5. `SignInResponseDTO` returns token, message, userId, email, and role.

## BCrypt

BCrypt hashes passwords before storing them. The backend should never store plain-text passwords.

Interview answer:

"BCrypt is used so the database stores password hashes, not real passwords."

## JWT Token Creation

`JwtService` creates tokens with:

- user id claim
- role claim
- issuer
- audience
- expiry
- signing key from configuration

## JWT Bearer Authentication

`Program.cs` configures JWT bearer authentication. It validates:

- issuer
- audience
- signing key

## Claims

Claims are pieces of identity inside the token.

Current important claims:

- `ClaimTypes.NameIdentifier`: user id
- `ClaimTypes.Role`: user role

Controllers read the user id from claims.

## Roles

`UserRole` has:

- `Admin`
- `Patient`

Examples:

- `DoctorsController` requires `Patient`.
- `UserController.GetMyProfile` requires `Patient`.
- Admin user operations require `Admin`.

## Authorize Attributes

Examples:

```csharp
[Authorize]
[Authorize(Roles = "Patient")]
[Authorize(Roles = "Admin")]
```

## Frontend Token

The React frontend stores a demo session in localStorage and sends the token as:

```text
Authorization: Bearer <token>
```

## JWT Secret Safety

The JWT signing key must come from local/deployment configuration, not Git. If someone gets the signing key, they may be able to forge tokens.

## Current Security Limitations

- localStorage token handling is demo-grade.
- Forgot-password returns reset token directly. Not production safe.
- No refresh token flow.
- No rate limiting.
- Production HTTPS/CORS/security headers need review.

## Junior Interview Explanation

"The backend signs a JWT after successful login. Protected endpoints use `[Authorize]`, and role-specific endpoints use `[Authorize(Roles = "...")]`. Controllers read the user id from token claims to filter data to the current user."
