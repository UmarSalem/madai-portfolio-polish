# Next Full-Stack Tasks

Small GitHub-style tasks for future branches.

## API and Auth

- [ ] Add centralized frontend API error handling.
- [ ] Add consistent `401` handling for all protected frontend pages.
- [ ] Add visible logout UI if not already present.
- [ ] Add backend health endpoint.
- [ ] Add centralized backend error middleware.

## Tests

- [ ] Add one frontend test for login flow.
- [ ] Add one frontend test for protected route behavior.
- [ ] Add one frontend test for symptom checker request.
- [ ] Add one backend test for `AuthController`.
- [ ] Add one backend test for `SymptomCheckerController`.
- [ ] Add one backend test for report upload PDF validation.

## CI/CD

- [x] Add GitHub Actions frontend build workflow.
- [x] Add GitHub Actions backend build workflow.
- [ ] Review and stabilize frontend tests before making them required CI checks.
- [ ] Add backend test project before making backend tests required CI checks.
- [ ] Add secret scan check.
- [ ] Add artifact safety check for DB/upload/build files.

## Deployment

- [ ] Replace frontend hard-coded API URL with `REACT_APP_API_BASE_URL`.
- [ ] Prepare frontend deployment config.
- [ ] Prepare backend Render deployment notes/config.
- [ ] Add production CORS documentation and config.
- [ ] Decide database strategy for deployed backend.

## Portfolio Presentation

- [ ] Create screenshots for README.
- [ ] Create Madai portfolio case study.
- [ ] Add architecture diagram to README or docs.
- [ ] Add short demo script for interviews.

## Safety

- [ ] Confirm public demo uses fake data only.
- [ ] Decide whether report upload should be disabled in public deployment.
- [ ] Harden recommendation AI endpoints with safe fallback.
- [ ] Remove or protect Swagger in production.
