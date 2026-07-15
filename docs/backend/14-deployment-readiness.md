# Backend Deployment Readiness

Current status: not ready for unrestricted public backend deployment.

The backend is safer than before, but health-data and file-upload features still need careful deployment decisions.

## Main Blockers

- Production CORS origin not configured.
- Secrets must be set through deployment environment variables.
- Database strategy needs a decision.
- Recommendation AI endpoints need safer fallback handling.
- Dockerfile uses Windows Nano Server images.
- No CI backend workflow yet.
- No health endpoint yet.
- No centralized error middleware.

## Required Work Before Render/Railway/Fly.io

- Configure environment variables.
- Choose database provider.
- Confirm migrations can run.
- Add frontend deployment origin to CORS.
- Decide whether to disable Swagger in production.
- Add health endpoint.
- Confirm uploads remain disabled or metadata-only.
- Run backend build in CI.

## Linux Dockerfile / Native Hosting Notes

The current Dockerfile uses:

```text
mcr.microsoft.com/dotnet/aspnet:8.0-nanoserver-1809
```

Common hosts usually expect Linux containers or native .NET deployment. A Linux-friendly Dockerfile may be easier later.

## Environment Variable Checklist

- `Jwt__Key`
- `Jwt__Issuer`
- `Jwt__Audience`
- `ConnectionStrings__DefaultConnection`
- `OpenRouter__ApiKey`
- `GoogleMaps__ApiKey`

Use placeholders in Git and real values only in deployment settings.

## Database Strategy

Options:

- local SQLite for development only.
- managed Postgres/SQL Server for deployed backend.
- in-memory/demo database for limited portfolio demo.

Needs verification: best host/database choice for this project.

## CORS Checklist

- local frontend origins.
- deployed frontend domain.
- no wildcard origin for authenticated production API.

## Swagger Production Notes

Swagger is useful in development. In production:

- disable it, or
- protect it, or
- expose only when intentionally safe.

## Health Endpoint

Recommended:

```text
GET /health
```

This helps deployment platforms check whether the backend is alive.

## Recommended Deployment Order

1. Keep backend local while frontend static demo is polished.
2. Add backend CI build.
3. Add health endpoint and production CORS.
4. Choose database/deployment provider.
5. Deploy backend with demo-safe settings only.
6. Run end-to-end tests with fictional data.
