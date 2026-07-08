# Cleanup Log

Date: 2026-07-08

Branch observed by Codex: `docs/project-hygiene`

Requested branch name: `chore/remove-secrets-demo-data`

Note: Codex observed the local checkout on `docs/project-hygiene` while performing this cleanup. The cleanup was applied to the current working tree.

## What Was Removed

- `MAD-AI_BackEnd-develop/MADAI.db`
- `MAD-AI_BackEnd-develop/MADAI.db-wal`
- `MAD-AI_BackEnd-develop/MADAI.db-shm`
- `MAD-AI_BackEnd-develop/uploads/Day 1.pdf`

These files were removed because they may contain private-looking user data, health data, report data, database state, generated AI output, or uploaded report content. Public portfolio repositories must not include real or private health-related data.

## What Was Replaced

- `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/db.json`

The previous json-server fixture included private-looking demo users, real-looking emails, encoded password-like values, report metadata, symptom text, and real-looking clinic data. It was replaced with clearly fictional demo data using `.example.test` addresses, fictional clinics, fictional symptoms, and explicit demo-only wording.

## What Was Sanitized

- `MAD-AI_BackEnd-develop/appsettings.json`
- `MAD-AI_BackEnd-develop/Program.cs`
- `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/src/constant/index.js`
- `MAD-AI_FrontEnd/MAD-AI_FrontEnd-main/src/symptomChecker/SymptomChecker.jsx`

Real or secret-like values were replaced with placeholders only. Real secrets were not moved into another committed file.

## What Was Added

- `MAD-AI_BackEnd-develop/appsettings.Example.json`

This file provides safe placeholder configuration for local setup documentation.

## Generated Artifact Cleanup

- `MAD-AI_BackEnd-develop/MADAI-BACKEND.csproj`

Generated `bin`/`obj` item groups were removed from the backend project file. Package references, folders, and source-code project settings were kept.

## Current Safety Rules

The repository ignore files now block common unsafe local files:

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

## Follow-Up

Before pushing publicly, run a secret scan and review `git status` carefully. Any removed files that still appear in Git status should be committed as deletions on the cleanup branch.
