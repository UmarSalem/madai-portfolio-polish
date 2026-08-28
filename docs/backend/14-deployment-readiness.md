# Backend Deployment Readiness

Current status: Render-compatible infrastructure, but not approved for
unrestricted public health-data use.

## Completed Preparation

- Replaced the Windows Nano Server Dockerfile with a multi-stage Linux .NET 8
  image.
- Changed the project Docker target to Linux.
- Bound the API to Render's validated `PORT` value on `0.0.0.0`.
- Added a non-sensitive `GET /health` endpoint.
- Changed production CORS to allow only configured frontend origins.
- Added optional EF Core migration execution for a new deployment database.
- Made non-development startup reject missing, short, or placeholder JWT keys.
- Expanded `.dockerignore` for databases, uploads, secrets, tests, and generated
  artifacts.
- Kept Swagger development-only.
- Kept deployment manual; no deploy hook or workflow was added.

## Selected Render Approach

Use a Render Web Service with the Docker runtime and the backend folder as the
service root. Render does not natively host .NET, so native build/start commands
are not recommended for this repository.

See [Backend Render Deployment](../backend-render-deployment.md) for exact
service settings, environment variables, database options, and validation.

## Environment Checklist

- `ASPNETCORE_ENVIRONMENT=Production`
- `Jwt__Key` stored as a Render secret, at least 32 bytes
- `Jwt__Issuer`
- `Jwt__Audience`
- `ConnectionStrings__DefaultConnection`
- `Database__ApplyMigrationsOnStartup`
- `Cors__AllowedOrigins__0` set to the exact HTTPS frontend origin
- `OpenRouter__ApiKey` left unset for the first safe fallback-only demo
- `GoogleMaps__ApiKey` left unset for the first fictional doctor-search demo

Render supplies `PORT`, and `Program.cs` maps it to `0.0.0.0`.

## Database Decision

Recommended first preview: ephemeral SQLite at `/tmp/madai-demo.db` with startup
migrations enabled. Data can disappear on restart or deploy and must be
fictional.

Persistent SQLite and managed PostgreSQL remain future decisions. Persistent
storage must not be enabled until retention, deletion, backups, privacy, and
scaling limitations are documented.

## CORS and Swagger

- Localhost origins are included only in Development.
- Production allows only indexed `Cors__AllowedOrigins` values.
- No wildcard or credentialed broad-origin policy is used.
- Swagger is disabled in Production.

## Upload and External-Service Policy

PDF bytes are not stored or written to disk, downloads are disabled, and upload
size/type validation remains active. For the first preview, external API keys
should remain unset so fictional fallback responses are used.

This is still not enough for unrestricted public report uploads. Add a
server-side upload-disable switch or a real privacy model first.

## Remaining Public-Release Blockers

- Forgot-password returns its reset token in the API response.
- Public users could enter real symptoms or report metadata.
- No rate limiting or centralized production error middleware exists.
- Exact Render/frontend origins and end-to-end HTTPS/CORS behavior need
  verification.
- Report upload should remain unavailable for unrestricted public use.

## Validation Status

- Solution restore: passed.
- Release build: passed with zero warnings and zero errors.
- Backend tests: all 11 passed.
- Release publish: passed.
- Production `/health`, configured/unconfigured CORS, and ephemeral SQLite
  migration smoke tests: passed.
- Docker build: Needs verification because Docker is not installed locally.
