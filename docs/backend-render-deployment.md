# Backend Render Deployment

This guide prepares the Madai ASP.NET Core API for a later Render deployment. It
does not deploy the service.

Madai is an educational portfolio demo. It is not medical advice and must use
fake/demo data only. Never enter real patient data, symptoms, medical reports,
credentials, or private health information.

## Selected Approach

Use a Render Web Service with the Docker runtime.

Render does not provide a native .NET runtime. The backend therefore uses a
multi-stage Linux Dockerfile with the official .NET 8 SDK and ASP.NET runtime
images. The final image runs as the non-root user supplied by the .NET image.

Official references:

- [Render language support](https://render.com/docs/language-support)
- [Render web services and port binding](https://render.com/docs/web-services)
- [Render health checks](https://render.com/docs/health-checks)
- [Render persistent disks](https://render.com/docs/disks)

## Render Service Settings

Create a Web Service with these settings:

- Runtime: Docker
- Root Directory: `MAD-AI_BackEnd-develop`
- Dockerfile Path: `./Dockerfile`
- Docker Build Context: `.`
- Health Check Path: `/health`
- Auto-Deploy: disabled for the first safety review, or manual deploy only

Docker performs restore and publish, so separate Render build and start commands
are not required. The image starts with:

```text
dotnet MADAI-BACKEND.dll
```

Render sets `PORT` automatically. `Program.cs` validates that value and binds to
`0.0.0.0:<PORT>`. The Docker image uses port `10000` as its fallback. Do not
hard-code a public host name or Render URL in source control.

## Required Environment Variables

Configure these in the Render dashboard. Values below are names or examples,
not production secrets.

| Variable | Required | Safe Render demo value or rule |
| --- | --- | --- |
| `ASPNETCORE_ENVIRONMENT` | Yes | `Production` |
| `Jwt__Key` | Yes | Generate a private random value of at least 32 bytes. Never commit it. |
| `Jwt__Issuer` | Yes | `MADAI` or another documented non-secret identifier |
| `Jwt__Audience` | Yes | `MADAIUsers` or another documented non-secret identifier |
| `ConnectionStrings__DefaultConnection` | Yes | `Data Source=/tmp/madai-demo.db` for an ephemeral demo |
| `Database__ApplyMigrationsOnStartup` | Yes for new ephemeral DB | `true` |
| `Cors__AllowedOrigins__0` | Yes for browser access | Exact HTTPS frontend origin, with no trailing slash |
| `OpenRouter__ApiKey` | No | Leave unset for the first safe demo so fallback responses are used |
| `GoogleMaps__ApiKey` | No | Leave unset for the first safe demo so fictional doctor data is used |

Render provides `PORT`; it normally should not be added manually.
`ASPNETCORE_URLS` is also unnecessary because the application reads `PORT`.

Environment variable values with double underscores map to nested ASP.NET Core
configuration. For example, `Jwt__Key` maps to `Jwt:Key`.

The application refuses to start in non-development environments when the JWT
key is missing, recognizable as a placeholder, or shorter than 32 bytes. This
prevents an accidental deployment with the committed development placeholder.

## CORS

Local development allows `http://localhost:3000` and
`http://localhost:3002`. Production does not include those defaults.

For Render, configure only the exact deployed frontend origin:

```text
Cors__AllowedOrigins__0=https://your-madai-frontend.example.com
```

Add additional origins with sequential indexes such as
`Cors__AllowedOrigins__1`. Do not use `*`, and do not add a trailing slash. The
policy allows the configured origins to send the headers and HTTP methods used
by the API, but it does not enable cross-origin credentials.

If no production origin is configured, browser cross-origin requests are denied
by default. Direct tools such as `curl` are not governed by browser CORS.

## Health Check

`GET /health` returns only:

```json
{"status":"healthy"}
```

It does not reveal configuration, secrets, database contents, user information,
or external-provider status. Configure Render's Health Check Path as `/health`.
The endpoint checks process readiness, not database readiness.

## Database Strategy

The current application uses SQLite and its existing migrations target SQLite.
For the first limited Render preview, the safest low-complexity option is an
ephemeral database:

```text
ConnectionStrings__DefaultConnection=Data Source=/tmp/madai-demo.db
Database__ApplyMigrationsOnStartup=true
```

The database is recreated after a restart or deploy. That means demo accounts
and demo history can disappear at any time. This is acceptable only for clearly
fictional portfolio testing and is not suitable for production data.

A Render persistent disk could later be mounted at `/app/data` with a connection
such as `Data Source=/app/data/madai-demo.db`. Do not enable this until retention,
deletion, backups, privacy, and single-instance limitations have been reviewed.

Managed PostgreSQL is a better long-term multi-instance direction, but changing
the EF Core provider and migrations is a separate feature task. Needs
verification.

## Medical and File-Upload Safety

Database files, WAL/SHM files, `uploads/`, local environment files, build output,
tests, and secret-like files are excluded from the Docker build context.

The report endpoint currently:

- requires authentication;
- accepts PDF files only;
- limits files to 2 MB;
- stores no PDF bytes and writes no uploaded file;
- disables report downloads;
- returns a fictional fallback without calling OpenRouter when its key is unset.

The file still reaches server memory, and a configured OpenRouter key would
allow extracted report text to be sent to an external provider. For the first
public portfolio preview, leave `OpenRouter__ApiKey` unset and do not encourage
report uploads. Before unrestricted public deployment, add a server-side switch
that disables uploads or implement a genuine privacy, consent, deletion, and
retention model.

Symptom text and report metadata are still stored in the configured database.
Ephemeral storage reduces retention but does not make real health data safe.

## Swagger Policy

Swagger is enabled only in the Development environment. It remains disabled on
Render when `ASPNETCORE_ENVIRONMENT=Production`.

Do not enable public Swagger until endpoint exposure, authorization, abuse
controls, and reset/upload flows have been reviewed. `/health` is the intended
unauthenticated operational endpoint.

## Public-Release Blockers

The infrastructure is Render-compatible, but unrestricted public deployment is
not approved yet:

- `POST /api/auth/forgot-password` returns a reset token in the API response.
- Public users can still submit real-looking symptoms or report metadata despite
  the fake-data warning.
- Report upload needs a server-side deployment switch or a stronger privacy
  model.
- Rate limiting and centralized production error handling are not configured.
- The exact deployed frontend origin still needs to be added to Render CORS.

Use a private/manual preview with fictional data until these items are resolved.

## Post-Deployment Checklist

After a later manual preview deployment:

1. Request `GET /health` and confirm HTTP 200 with only the healthy status.
2. Confirm `/swagger` is unavailable in Production.
3. Confirm an unapproved browser origin receives no CORS permission.
4. Register and sign in only with an `example.test` demo identity.
5. Verify the protected profile endpoint requires and accepts a valid demo JWT.
6. Use fictional symptom text and confirm the fallback disclaimer response.
7. Search for a fictional doctor location/specialty and confirm demo data is
   clearly marked.
8. Do not test report upload publicly until its deployment policy is resolved.
   If explicitly approved for a private preview, use a tiny fictional PDF only.
9. Restart the service and confirm ephemeral demo data loss is expected.
10. Inspect logs without printing tokens, request bodies, symptoms, or report
    contents.

## Deployment Automation

No Render deploy hook, API key, Blueprint, or GitHub Actions deployment workflow
is added. Keep deployment manual until the public-release blockers are closed
and backend CI remains green.

## Local Validation Result

- `dotnet restore MADAI-BACKEND.sln`: passed.
- Release solution build: passed with zero warnings and zero errors.
- Backend tests: all 11 passed.
- Release publish: passed.
- Production `/health` smoke test using a Render-style `PORT`: passed.
- Production CORS smoke test: configured origin allowed and unconfigured origin
  denied.
- Ephemeral SQLite startup migration smoke test: passed; temporary database files
  were removed afterward.
- Docker build: not run because Docker is not installed on the validation
  machine. Needs verification on GitHub Actions, Render, or a Docker-enabled
  workstation before deployment.
