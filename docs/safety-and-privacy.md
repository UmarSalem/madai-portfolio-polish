# Safety and Privacy

Madai must be treated as an educational portfolio demo. It must use fake/demo data only.

## Medical Disclaimer

This project is an educational portfolio demo. It is not medical advice, not a diagnosis tool, and not for emergency use. Do not enter real patient data or private health information.

## Fake/Demo Data Policy

Allowed:

- Fictional users.
- Fictional symptoms.
- Fictional reports.
- Fictional doctors/clinics, unless clearly using a public provider in a safe demo mode.
- Placeholder configuration values.

Not allowed:

- Real patient data.
- Real medical records.
- Private health information.
- Real uploaded reports.
- API keys, JWT secrets, database passwords, tokens, or production credentials.
- Private group, university, organization, or deployment data.

## Secrets Policy

Never commit real secrets. Use local-only files or hosting-provider environment variables.

Examples of values that must stay out of Git:

- `.env`
- `.env.local`
- `appsettings.Production.json`
- `appsettings.Local.json`
- `appsettings.Development.local.json`
- API keys.
- JWT secrets.
- Database passwords.
- OAuth tokens.

## Files That Must Not Be Committed

- `.env`
- `.env.local`
- `appsettings.Production.json`
- `appsettings.Local.json`
- `appsettings.Development.local.json`
- `*.db`
- `*.db-wal`
- `*.db-shm`
- `uploads/`
- `bin/`
- `obj/`
- `node_modules/`
- `build/`
- `dist/`
- `coverage/`

## Cleanup Completed In Portfolio Safety Pass

The following unsafe local artifacts were removed or replaced during the cleanup pass:

- Removed `MAD-AI_BackEnd-develop/MADAI.db`.
- Removed `MAD-AI_BackEnd-develop/MADAI.db-wal`.
- Removed `MAD-AI_BackEnd-develop/MADAI.db-shm`.
- Removed uploaded report content from `MAD-AI_BackEnd-develop/uploads/`.
- Replaced `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/db.json` with fictional demo-only data.
- Removed generated `bin`/`obj` references from the backend project file.
- Replaced committed secret-like values with placeholders.
- Added safe placeholder-only example configuration files.

The repository should still be scanned before every public push. If new local database, upload, build, or secret files appear, do not commit them.

## Files To Keep Out Of Public Deployment

Ongoing cleanup checklist:

- Any future `*.db`, `*.db-wal`, or `*.db-shm` files.
- Any future uploaded report files or `uploads/` content.
- Any future local `bin/`, `obj/`, `node_modules/`, `build/`, `dist/`, or `coverage/` artifacts.
- Any real API keys or JWT secrets in settings/config files.
- Any real user, patient, clinic, report, or medical-history data.

## Why Real Patient Data Must Not Be Used

Health data is sensitive. Even a small symptom note, report filename, email address, or uploaded PDF can identify a person or reveal private information. A public portfolio project should demonstrate engineering ability without exposing anyone's medical or personal data.

## AI Provider Privacy Warning

AI-provider calls may send user-entered symptoms, report text, or medical history to an external service. For the public portfolio version, prefer fake demo responses or only send fictional test data. Do not send real patient data to external AI providers.

## Upload/Report Safety Warning

Report upload features are high risk because PDFs may contain names, dates of birth, identifiers, lab values, scans, or other private data. Before public deployment, add file size limits, file type validation, safe storage rules, deletion/retention rules, and clear warnings. A static fake-report demo is safer for the first portfolio release.

Current report upload demo rules:

- The UI must warn: "Educational demo only. Do not upload real medical reports or private health information."
- Demo upload accepts PDF files only.
- Demo upload is limited to 2 MB.
- New demo uploads must not write PDFs into `uploads/`.
- New demo uploads must not store PDF bytes or extracted report text.
- Report downloads are disabled for the safe portfolio demo.
- AI analysis must fall back to a safe demo response when provider configuration is missing, placeholder-only, or unavailable.
- If live AI report analysis is ever enabled, it must be used only with fictional demo PDFs unless a real privacy and consent model exists.

## Public Demo Safety Rules

- Use only fictional demo accounts.
- Use only fictional symptoms and reports.
- Do not allow public users to upload real files unless the storage and privacy model is safe.
- Keep secrets in hosting environment variables only.
- Add visible medical disclaimers to health-related screens.
- Run a secret scan before publishing.
