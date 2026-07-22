# AI and External Services

## External Services in Madai

The backend has integration points for:

- OpenRouter/OpenAI-style chat completions.
- Google Maps/Places doctor search.
- PDF text extraction with PdfPig.

## OpenRouter-Style Integrations

Used by:

- `SymptomService`
- `MedicalReportService`
- `AIRecommendationService`

Config key:

```text
OpenRouter:ApiKey
```

## Symptom Service Behavior

`SymptomService` returns a safe demo fallback if:

- API key is missing.
- API key is placeholder/demo-like.
- provider call fails.
- provider response parsing fails.

## Medical Report Service Behavior

`MedicalReportService` returns a safe demo fallback if:

- API key is missing.
- API key is placeholder/demo-like.
- PDF parsing fails.
- provider call fails.
- provider response parsing fails.

It trims report text before sending it to a provider.

## AI Recommendation Service Behavior

`AIRecommendationService` still directly calls OpenRouter and uses symptom history.

Needs improvement:

- add missing-config fallback.
- avoid sending real medical text.
- add safe demo response.
- avoid crashing when provider fails.

## Google Maps/Places

Used by:

- `DoctorService`

Config key:

```text
GoogleMaps:ApiKey
```

If missing or unavailable, the service returns fictional demo doctors.

## Safety Risks

External AI providers may receive user-entered symptoms, report text, or history. That is sensitive health-related content.

For the portfolio demo:

- use fictional demo data only.
- do not upload real reports.
- show clear disclaimers.
- use safe fallbacks when provider config is missing.

See [Safety and Privacy](../safety-and-privacy.md).

## Needs Verification

- Whether recommendation endpoints should stay enabled before public deployment.
- Whether public backend deployment should force demo fallbacks even when keys exist.
- Whether AI prompts need further privacy filtering.
