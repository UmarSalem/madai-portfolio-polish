# Vertical Slice Learning Notes

These notes explain the frontend/backend concepts used in the Madai portfolio-polish work. The goal is to learn one complete feature at a time instead of trying to understand the whole application at once.

## What Is a Vertical Slice?

A vertical slice is one user-facing feature improved from frontend to backend as one complete path.

In this project, the symptom checker slice includes:

- React route: where the user opens the page.
- React screen/component: where the user enters demo symptoms.
- API helper: where the frontend sends the HTTP request.
- Backend controller: where ASP.NET Core receives the request.
- DTOs: the request/response shape shared between frontend and backend.
- Service: where business or external-provider logic happens.
- Documentation: where the contract and safety rules are explained.
- Tests or validation: how we check the feature still works.

This is easier than rewriting the whole app because each task has a clear boundary.

## Concept: API Contract

An API contract answers:

- What URL does the frontend call?
- What HTTP method is used?
- What JSON does the frontend send?
- What JSON does the backend return?
- Does the endpoint require authentication?
- What happens when something fails?

Madai example:

```js
checkSymptoms({
  patientName: 'Demo Patient',
  symptomsText: 'Fictional demo headache',
  dateSubmitted: new Date().toISOString(),
});
```

This now maps to:

```http
POST /api/SymptomChecker
Authorization: Bearer demo-token
```

Why it matters: when the frontend and backend disagree about names like `symptoms` versus `symptomsText`, the feature breaks even if both sides look correct separately.

## Concept: Shared API Helper

The frontend uses a shared Axios client so every authenticated request can reuse the same base URL and token behavior.

Madai example:

```js
httpClient.post('/api/SymptomChecker', {
  patientName,
  symptomsText,
  dateSubmitted,
});
```

Why it matters: without a shared client, each component may manually build URLs and headers differently. That creates bugs and makes deployment harder.

## Concept: Protected Route

The backend symptom checker endpoint uses authorization, so the frontend route should also expect a logged-in user.

Madai example:

```jsx
<Route
  path={ROUTE.SymptomChecker}
  element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>}
/>
```

Why it matters: this gives the user a clearer experience. Instead of sending a request that fails with `401 Unauthorized`, the app can guide the user toward login.

## Concept: DTO

A DTO, or Data Transfer Object, is a simple shape for data crossing the API boundary.

Madai request DTO:

```csharp
public class SymptomEntryCreateDTO
{
    [Required]
    [StringLength(100)]
    public string? PatientName { get; set; }

    [Required]
    [StringLength(2000)]
    public string? SymptomsText { get; set; }

    public DateTime DateSubmitted { get; set; } = DateTime.Now;
}
```

Why it matters: DTOs help keep frontend data separate from database internals. They also make validation easier.

## Concept: Entity vs DTO

An entity is usually the database model. A DTO is usually the API model.

Safer backend pattern:

```csharp
return Ok(new AnalysisResultDTO
{
    Summary = result.Summary,
    SuggestedConditions = SplitStoredList(result.SuggestedConditions),
    NextSteps = SplitStoredList(result.NextSteps)
});
```

Why it matters: returning database entities can accidentally expose fields, relationships, or internal IDs that the frontend does not need.

## Concept: Service Layer

The controller should receive HTTP requests and return HTTP responses. The service should handle feature logic.

Madai example:

- `SymptomCheckerController` handles `POST /api/SymptomChecker`.
- `SymptomService` handles symptom analysis and external AI-provider fallback.

Why it matters: this keeps the controller smaller and makes the business logic easier to test or replace later.

## Concept: Graceful Fallback

A graceful fallback means the app still returns a safe response when a dependency is missing or unavailable.

Madai example:

- If `OpenRouter:ApiKey` is missing or still a placeholder, the backend returns a demo response.
- If the provider fails, the backend returns a safe demo response instead of crashing.

Why it matters: portfolio demos should not break just because a paid or private external service is not configured.

## Concept: Medical Safety Disclaimer

Health-related features need clear boundaries.

Madai symptom checker disclaimer:

```text
This is an educational demo and not medical advice. Do not use it for diagnosis or emergencies.
```

Why it matters: users must not confuse a student portfolio demo with a real medical tool.

## Better Way to Learn This Project

Use this order:

1. Read the screen/component first.
2. Find the API helper function it calls.
3. Find the backend controller endpoint.
4. Compare the request body and response body.
5. Check whether auth is required.
6. Check whether the backend stores data.
7. Add or update one small test.
8. Update the API contract docs.
9. Write a PR summary explaining what changed and why.

This gives you a repeatable learning loop for each feature.

