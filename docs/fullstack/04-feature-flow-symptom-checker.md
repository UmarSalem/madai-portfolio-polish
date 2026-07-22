# Feature Flow: Symptom Checker

## User Input Flow

Frontend file:

- `src/symptomChecker/SymptomChecker.jsx`

The user enters:

- fictional demo patient name
- fictional demo symptoms

The component stores these in local `useState` values.

## API Request Flow

Frontend API helper:

- `checkSymptoms({ patientName, symptomsText, dateSubmitted })`

Backend endpoint:

```text
POST /api/SymptomChecker
```

Auth:

- Required.
- Bearer token is attached by Axios.

## Backend Flow

Files:

- `SymptomCheckerController.cs`
- `SymptomService.cs`
- `SymptomEntryCreateDTO.cs`
- `AnalysisResultDTO.cs`
- `SymptomEntry`
- `AnalysisResult`

Flow:

```text
Controller validates DTO
  -> reads user id claim
  -> confirms user exists
  -> saves SymptomEntry
  -> calls SymptomService
  -> saves AnalysisResult
  -> returns AnalysisResultDTO
```

## AI/External Provider Flow

`SymptomService` can call OpenRouter when `OpenRouter:ApiKey` is configured outside Git.

If the key is missing, placeholder-only, or provider call fails, it returns a safe demo fallback.

## Database Storage

Stored:

- symptom entry
- analysis result
- user id relationship

Public demo note: use fictional symptoms only.

## Response Display

The frontend normalizes:

- `summary`
- `suggestedConditions`
- `nextSteps`

Then it shows:

- demo result card
- possible conditions
- recommended actions
- local demo history

## Medical Disclaimer and Safety

The screen warns:

```text
This is an educational demo and not medical advice.
```

Users are also told not to enter real patient data or private health information.

## Still Needs Verification

- End-to-end local test with a fictional account.
- Whether persistent symptom history should be shown in the UI.
- Whether public deployment should force demo-only AI responses.
