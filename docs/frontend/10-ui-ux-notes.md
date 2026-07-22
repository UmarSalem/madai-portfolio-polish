# UI/UX Notes

## Current Strengths

- Core aligned flows now show loading, error, empty, or success states.
- Health-related screens include safer demo warnings.
- Protected features redirect to login if no token exists.
- Doctor search and report upload use clearer cards and result layouts.
- Forms use labels on the newer aligned screens.

## Current Weaknesses

- Visual style is inconsistent between old and newer screens.
- Some CSS uses global selectors and repeated class names.
- Some older pages still use unclear wording or mixed language.
- Navbar/mobile behavior needs more polish.
- Some pages may still be static, mock, or stale. Needs verification.

## Loading States

Good examples:

- Login: `Signing in...`
- Register: `Registering...`
- Profile: `Loading profile...`, `Updating...`
- Symptom checker: `Checking...`
- Doctor search: `Searching...`
- Report upload: `Uploading...`, `Loading demo reports...`

Future task: make loading indicators visually consistent.

## Error States

Good examples:

- Symptom checker inline error.
- Doctor search inline error.
- Report upload inline error.
- Profile message on failed load/update.

Future task: create a shared `AlertMessage` component.

## Empty States

Good examples:

- Symptom checker: "No demo result yet."
- Doctor search: "Enter a demo location and specialty to search."
- Report history: "No demo reports yet."

Future task: make empty states consistent across pages.

## Form Validation

Current validation:

- Login/register require filled fields.
- Symptom checker requires demo patient and symptoms.
- Doctor search requires location and specialty.
- Report upload checks patient name, PDF type, and max file size.

Future task: improve validation messages and add tests.

## Accessibility Issues

Known or likely issues:

- Some older labels use `for` instead of React `htmlFor`.
- Some image `alt` text is empty.
- Some buttons/links may need clearer accessible names.
- Keyboard and focus states need verification.

## Mobile Responsiveness

Some screens include media queries, but mobile layout is not consistent yet.

Future tasks:

- Test each aligned flow on a narrow viewport.
- Improve navbar behavior.
- Avoid wide fixed form widths.

## Text and Grammar Cleanup

Practical cleanup targets:

- Standardize "demo" wording.
- Use "Madai" consistently.
- Replace old/unclear labels like "Only For Admin" where the page is no longer admin-only.
- Remove stale wording from old mock flows.

## Practical Next UI Polish Tasks

- Add one shared alert style.
- Add one shared loading style.
- Improve mobile navbar.
- Standardize page titles.
- Standardize protected-page spacing.
- Add a 404 page.
- Add simple accessibility pass for forms.
