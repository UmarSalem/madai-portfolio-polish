# Error, Loading, and Security Flow

## Loading State Pattern

Aligned frontend screens use flags such as:

- `isSubmitting`
- `loading`
- `saving`
- `uploading`

Typical pattern:

```text
setLoading(true)
try request
catch error
finally setLoading(false)
```

## Error State Pattern

Newer flows show inline error messages instead of only browser alerts.

Examples:

- symptom checker error
- doctor search error
- report upload error
- profile load/update error
- home blog load error
- recommendation demo search error
- local record deletion message

## Empty State Pattern

Examples:

- no symptom result yet
- no doctor search yet
- no demo reports yet
- no demo blog posts
- no locally saved demo patient records

Empty states help the user understand that nothing is broken.

## Unauthorized Flow

Frontend:

- `ProtectedRoute` redirects to login if no token exists.
- The attempted protected path is stored in React Router state so login can return the user to that page after successful authentication.
- The navbar reads the normalized auth session and shows login or authenticated menu options.
- Some API catches handle `401` by showing login message or clearing auth.

Backend:

- `[Authorize]` blocks unauthenticated requests.
- `[Authorize(Roles = "Patient")]` blocks wrong roles.

## Token Missing or Expired

Current behavior:

- missing token: protected route redirects.
- missing token with protected route: redirects to `/login` and preserves the attempted route.
- `401` on profile: clears auth and redirects.
- other features mostly show auth-related errors.

Needs verification:

- expired token behavior across all protected flows.

## Backend Validation Errors

Common status codes:

- `400 BadRequest`: invalid input, missing fields, invalid PDF.
- `401 Unauthorized`: missing/invalid token.
- `403 Forbidden`: authenticated but wrong role.
- `404 NotFound`: missing resource or disabled download.
- `200 OK`: successful response.

## Security Limitations

- No centralized error middleware yet.
- No rate limiting yet.
- Production security headers need verification.
- Forgot-password reset token handling is not production safe.
- localStorage token handling is demo-grade.

## Health-Data Safety Rules

- fake/demo data only.
- no real patient data.
- no real reports.
- no private health information.
- no secrets in Git.
- safe AI fallbacks.
- report downloads disabled in demo.

See [Safety and privacy](../safety-and-privacy.md).

## Improvements Later

- shared frontend error component.
- backend error middleware.
- backend health endpoint.
- rate limiting for auth and upload endpoints.
- consistent `401` handling in all frontend API flows.
