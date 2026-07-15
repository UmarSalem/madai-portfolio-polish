# Swagger, CORS, and API Testing

## Swagger Purpose

Swagger gives an interactive API page for development. It helps inspect endpoints, request bodies, response shapes, and auth requirements.

Configured in:

```text
Program.cs
```

Swagger is enabled only in development:

```csharp
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
```

## JWT Auth in Swagger

Swagger has a Bearer security definition. To test protected endpoints:

1. Call `POST /api/auth/signin`.
2. Copy the returned token.
3. Click Authorize in Swagger.
4. Enter the bearer token.
5. Call protected endpoints.

Do not share or commit real token values.

## CORS

CORS controls which browser origins can call the backend.

Current local policy:

```text
http://localhost:3000
http://localhost:3002
```

Policy name:

```text
LocalFrontend
```

## Why CORS Matters

The frontend and backend usually run on different origins in development and deployment. The browser blocks cross-origin calls unless the backend allows them.

## Local Testing

Typical local setup:

- backend: `http://localhost:5122`
- frontend: `http://localhost:3000`

## Testing With Frontend

1. Start backend.
2. Start frontend.
3. Register/login with fictional account.
4. Test protected flows.
5. Watch browser network tab for request/response status.

## What Still Needs Improvement

- Add deployment frontend domain to CORS config later.
- Avoid broad `AllowAnyOrigin` in production.
- Consider disabling Swagger in production.
- Add a health endpoint for deployment checks.
- Add automated API tests.
