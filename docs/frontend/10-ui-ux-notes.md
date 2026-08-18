# UI/UX Notes

## Current Strengths

- Core aligned flows now show loading, error, empty, or success states.
- Health-related screens include safer demo warnings.
- Protected features redirect to login if no token exists.
- Doctor search and report upload use clearer cards and result layouts.
- Forms use labels on the newer aligned screens.
- Login/register/contact form fields now have more accessible labels and unique ids.
- Older alert-only messages were reduced in favor of inline user-facing messages.
- Navbar clickable icons now use real links/buttons instead of custom HTML elements.

## Current Weaknesses

- Visual style is inconsistent between old and newer screens.
- Some CSS uses global selectors and repeated class names.
- Some older pages still use unclear wording or mixed language.
- Navbar/mobile behavior needs more polish.
- Some pages may still be static, mock, or stale. Needs verification.
- Some older CSS still relies on id selectors. Needs verification before broader cleanup.

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
- Home blog loading failure message.
- Recommendation demo search error.

Future task: create a shared `AlertMessage` component.

## Empty States

Good examples:

- Symptom checker: "No demo result yet."
- Doctor search: "Enter a demo location and specialty to search."
- Report history: "No demo reports yet."
- Home blog section: "No demo blog posts are available right now."
- Record page: "No demo patient records are saved locally."

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

- Some older CSS and JSX still need a full accessibility pass.
- Keyboard and focus states need verification.
- Contact, login, and register forms now use improved labels/ids.
- The local record delete button now has an accessible label.
- Important images and the map iframe have alt/title text.

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
- Replace old/unclear labels where pages are no longer admin-only or production-like.
- Remove stale wording from old mock flows.

Recent cleanup:

- Replaced "WELL-COME TO DOCTOR ONLINE" with clearer Madai wording.
- Fixed obvious spelling such as "Specialist Recommendation."
- Replaced real-looking phone/contact examples with fictional placeholders.
- Kept health-related wording educational and demo-only.

## Practical Next UI Polish Tasks

- Add one shared alert style.
- Add one shared loading style.
- Improve mobile navbar.
- Standardize page titles.
- Standardize protected-page spacing.
- Add a 404 page.
- Add simple accessibility pass for forms.
- Replace remaining old static pages with backend-aligned or clearly documented demo flows.
