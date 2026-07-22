# Configuration and Secrets

## appsettings.json

`appsettings.json` contains local placeholder configuration:

- logging
- JWT config
- connection string
- OpenRouter key placeholder
- Google Maps key placeholder

Only placeholders are allowed in Git.

## appsettings.Development.json

Currently contains logging settings only.

## appsettings.Example.json

This file documents safe placeholder values for local setup. It should never contain real secrets.

## Environment Variables

For deployment, use environment variables such as:

```text
Jwt__Key
Jwt__Issuer
Jwt__Audience
ConnectionStrings__DefaultConnection
OpenRouter__ApiKey
GoogleMaps__ApiKey
```

ASP.NET Core maps double underscores to nested config sections.

## JWT Config

Used by:

- `Program.cs`
- `JwtService`

Important values:

- `Jwt:Key`
- `Jwt:Issuer`
- `Jwt:Audience`

## Database Connection String

Used by EF Core in `Program.cs`.

Local SQLite example:

```text
Data Source=MADAI.local.db
```

Deployment may need a managed database connection string instead.

## External API Keys

Used by:

- `OpenRouter:ApiKey`
- `GoogleMaps:ApiKey`

Never commit real keys.

## Why Secrets Must Not Be Committed

Committed secrets can be copied, scanned, abused, and may remain in Git history even after deletion. Treat any committed key as exposed and rotate it.

## Deployment Config Later

For Render/Railway/Fly.io:

- set environment variables in the platform dashboard.
- keep appsettings committed with placeholders only.
- verify CORS origins.
- verify database connection.
- disable or protect Swagger in production.
