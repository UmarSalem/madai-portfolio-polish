# Codex Task Prompt Template

Use this template for future Madai vertical-slice tasks.

```text
Project: Madai / MAD-AI / My AI Doctor

Current branch:
[branch-name]

Goal:
Fix or improve [one feature] as a focused vertical slice.

Context:
- Madai is my portfolio-polish version of a bachelor group project.
- Keep changes focused on [feature name].
- Do not rewrite unrelated features.
- Use fake/demo data only.
- Do not add secrets, real patient data, private health information, API keys, tokens, or passwords.
- Do not deploy anything in this task.

Inspect first:
- Frontend page/component for [feature name]
- Frontend API helper/httpClient usage
- Route/auth behavior
- Backend controller endpoint
- Backend DTO/model/service logic
- Current docs and tests

Requirements:
1. Align the frontend API call with the ASP.NET Core backend endpoint.
2. Use existing API/httpClient patterns.
3. Keep UI changes small and focused.
4. Add or improve loading, error, and empty states where relevant.
5. Ensure request and response shapes are documented.
6. Use DTOs instead of exposing backend entities where practical.
7. Keep fake/demo safety wording visible for health-related features.
8. Update docs/api-contract.md.
9. Add or update a docs/pull-requests/[feature]-pr.md file explaining what changed and why.
10. Add or update docs/learning notes if a new technical concept appears.
11. Run available safe checks.

Validation:
- Run git status.
- Run git diff summary.
- Run backend build if possible.
- Run frontend build/test if Node/npm are available.
- Do not print secret values.
- Remove generated build artifacts if they appear.

Expected result:
- [Feature name] frontend and backend agree on the same API contract.
- The change is explainable in a pull request.
- The learning notes explain the main technical concepts for a junior developer.

Task:
Implement this focused vertical slice, update documentation, provide a PR-ready summary, and recommend the next branch.
```

## Prompt Improvement Notes

For better results, include exact feature names and known files when you have them.

Good:

```text
Fix doctor search API contract. Inspect DoctorSearch.jsx, features.js, DoctorsController.cs, and DoctorDto.cs.
```

Less clear:

```text
Fix the app.
```

The clearer prompt helps keep changes small and avoids accidental rewrites.

