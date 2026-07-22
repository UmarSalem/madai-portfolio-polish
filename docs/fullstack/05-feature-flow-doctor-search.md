# Feature Flow: Doctor Search

## Search Input Flow

Frontend file:

- `src/doctorSearch/DoctorSearch.jsx`

The user enters:

- demo location
- specialty

The component validates both values before searching.

## API Request Flow

Frontend API helper:

```js
searchDoctors(location, specialty)
```

Backend endpoint:

```text
GET /api/Doctors/search?location=&specialty=
```

Auth:

- Required.
- Backend requires `Patient` role.

## Backend Doctor Search Flow

Files:

- `DoctorsController.cs`
- `DoctorService.cs`
- `DoctorDto.cs`

Flow:

```text
DoctorSearch.jsx
  -> searchDoctors(...)
  -> DoctorsController validates query params
  -> DoctorService.SearchDoctorsAsync
  -> Google Places if configured
  -> fictional demo doctors if not configured/unavailable
  -> List<DoctorDto>
```

## Google Maps/Places or Demo Provider

Config key:

```text
GoogleMaps:ApiKey
```

If missing or placeholder-only, `DoctorService` returns fictional demo doctors.

No Google API key should be committed.

## Result Display

The frontend renders cards with:

- name
- address
- location
- specialty
- rating
- phone
- website
- demo badge when `isDemo` is true

## Error and Empty States

The frontend shows:

- inline error for missing fields
- login/auth error for `401` or `403`
- empty state before search
- empty state when no doctors are found

## Still Needs Verification

- End-to-end local test with a fictional patient account.
- Whether public deployment should force fictional doctors.
- Whether real Google Places results should be used only in private/local demos.
