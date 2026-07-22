# Deployment Flow

Madai is not production medical software. Deployment should be treated as an educational portfolio demo only.

## Frontend Static Hosting Options

Possible hosts:

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

Frontend needs:

- build command: `npm run build`
- publish directory: `build`
- SPA fallback/rewrite rules
- API base URL environment variable

## Backend Hosting Options

Possible hosts:

- Render
- Railway
- Fly.io

Backend needs:

- environment variables
- database strategy
- production CORS
- safe Swagger policy
- health endpoint
- Linux-friendly Dockerfile or native .NET deployment path

## Environment Variables

Frontend:

```text
REACT_APP_API_BASE_URL
```

Backend:

```text
Jwt__Key
Jwt__Issuer
Jwt__Audience
ConnectionStrings__DefaultConnection
OpenRouter__ApiKey
GoogleMaps__ApiKey
```

## CORS Requirement

The backend must allow the deployed frontend origin.

Current local origins:

```text
http://localhost:3000
http://localhost:3002
```

Production should not use a broad wildcard origin for authenticated APIs.

## API Base URL Configuration

Current frontend code still uses `Config.serverUrl`. A future branch should replace the hard-coded local URL with `REACT_APP_API_BASE_URL`.

## Database Strategy

Needs verification:

- local SQLite for development only
- managed database for deployed backend
- in-memory/static demo mode for limited public portfolio demo

Do not commit database files.

## External API Key Strategy

- Keep real keys in hosting environment variables only.
- Use placeholders in Git.
- Prefer demo fallbacks for public portfolio mode.
- Do not send real health data to AI providers.

## Recommended Deployment Order

1. Frontend static demo.
2. Backend safe demo API.
3. Full end-to-end demo.

## Why This Is Not Production Medical Use

Madai is educational. It is not medical advice, not a diagnosis tool, and not for emergencies. A real medical application would need privacy, compliance, security, consent, audit logging, retention, and clinical review far beyond this portfolio demo.
