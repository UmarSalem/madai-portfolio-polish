# Next Frontend Tasks

Small GitHub-style tasks for future branches.

## Configuration

- [x] Use `REACT_APP_API_BASE_URL` in `src/constant/index.js`.
- [ ] Remove unused placeholder config values after verification.
- [x] Add frontend deployment environment notes.

## Routing

- [x] Add leading slash to `ROUTE.MedicalHistory`.
- [x] Add a simple fallback route.
- [ ] Replace home fallback with a dedicated 404/not-found screen.
- [ ] Standardize imports from `react-router` vs `react-router-dom`.
- [ ] Decide whether `Recommendation` should become protected or be replaced by the backend-aligned doctor search page.

## Auth

- [x] Confirm visible logout option in authenticated navbar menu.
- [ ] Improve login error message styling.
- [ ] Add one test for failed login.
- [ ] Add one test for protected route redirect.

## Profile

- [ ] Add clearer success/error styles on profile update.
- [ ] Add profile form validation for empty names/email.
- [ ] Add one profile loading test.

## Symptom Checker

- [ ] Add one test for empty form validation.
- [ ] Add one test for 401 error handling.
- [ ] Decide whether local demo history should be persisted or remain temporary.

## Doctor Search

- [ ] Add one test for empty search validation.
- [ ] Add one test for empty search results.
- [ ] Improve mobile result-card layout after browser testing.

## Report Upload/History

- [ ] Add one test for non-PDF validation.
- [ ] Add one test for oversized file validation.
- [ ] Add one test for empty report history.
- [ ] Decide whether public demo should fully disable uploads.

## UI/UX

- [ ] Create a shared alert component.
- [ ] Create a shared loading/empty-state component.
- [ ] Improve mobile navbar.
- [x] Standardize several visible page titles and older demo labels.
- [x] Fix obvious grammar and old wording across older screens.
- [x] Replace invalid custom navbar icon elements with buttons/spans.
- [x] Improve basic labels/ids on login, register, and contact forms.
- [ ] Continue accessibility pass on older/static pages.
- [ ] Add visual styles for inline messages.

## Code Cleanup

- [ ] Confirm whether Redux `inputSlice` is used.
- [ ] Confirm whether `src/rkt_query/` is used.
- [ ] Remove unused Redux/RTK Query code only after verification.
- [ ] Remove unused dependencies after verification.

## Testing and Deployment

- [ ] Run `npm run build` locally.
- [ ] Repair stale tests.
- [x] Add GitHub Actions frontend build workflow.
- [x] Add static hosting notes for Vercel/Netlify/Cloudflare Pages.
