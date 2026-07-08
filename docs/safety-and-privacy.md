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

## Files To Remove Before Public Deployment

Cleanup checklist:

- `MAD-AI_BackEnd-develop/MADAI.db`
- `MAD-AI_BackEnd-develop/MADAI.db-wal`
- `MAD-AI_BackEnd-develop/MADAI.db-shm`
- `MAD-AI_BackEnd-develop/uploads/`
- `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/db.json`, or replace it with fully fictional demo content.
- Any local generated `bin/` and `obj/` folders.
- Any real API keys or JWT secrets in settings/config files.

These files were not removed in this documentation task. They are listed so cleanup can be done deliberately in a later safety task.

## Why Real Patient Data Must Not Be Used

Health data is sensitive. Even a small symptom note, report filename, email address, or uploaded PDF can identify a person or reveal private information. A public portfolio project should demonstrate engineering ability without exposing anyone's medical or personal data.

## AI Provider Privacy Warning

AI-provider calls may send user-entered symptoms, report text, or medical history to an external service. For the public portfolio version, prefer fake demo responses or only send fictional test data. Do not send real patient data to external AI providers.

## Upload/Report Safety Warning

Report upload features are high risk because PDFs may contain names, dates of birth, identifiers, lab values, scans, or other private data. Before public deployment, add file size limits, file type validation, safe storage rules, deletion/retention rules, and clear warnings. A static fake-report demo is safer for the first portfolio release.

## Public Demo Safety Rules

- Use only fictional demo accounts.
- Use only fictional symptoms and reports.
- Do not allow public users to upload real files unless the storage and privacy model is safe.
- Keep secrets in hosting environment variables only.
- Add visible medical disclaimers to health-related screens.
- Run a secret scan before publishing.
