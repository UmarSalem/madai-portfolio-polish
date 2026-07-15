# EF Core and Database

## What EF Core Does

Entity Framework Core maps C# classes to database tables and lets code query/update data using C#.

## AppDbContext

File:

```text
Data/DbContext.cs
```

`AppDbContext` defines the database sets:

- `SymptomEntries`
- `AnalysisResults`
- `MedicalReports`
- `Users`
- `PasswordResetTokens`

## Relationships

Configured in `OnModelCreating`:

- User has many symptom entries.
- User has many medical reports.
- User has many analysis results.
- Symptom entry has one analysis result.

Delete behavior is cascade for these relationships.

## Current Database Provider

`Program.cs` configures SQLite:

```csharp
options.UseSqlite(configuration.GetConnectionString("DefaultConnection") ?? "Data Source=MADAI.db")
```

The example config uses:

```text
Data Source=MADAI.local.db
```

## Migrations

`Migrations/` contains EF Core migration files. A migration records schema changes so the database can be created or updated consistently.

Typical commands:

```powershell
dotnet ef migrations add MigrationName
dotnet ef database update
```

Needs verification: whether EF CLI tools are installed locally.

## Why Committed DB Files Are Unsafe

SQLite database files can contain:

- real users
- email addresses
- password hashes
- symptoms
- report metadata
- medical text

For a portfolio repo, database files must stay out of Git.

## Before Deployment

- Decide database strategy.
- Use environment variables for connection strings.
- Avoid local SQLite files in public hosting unless intentionally configured.
- Add seed data only if it is clearly fictional.
- Confirm migrations can run safely.

## Interview Explanation

"EF Core is the ORM. `AppDbContext` represents the database session, `DbSet` properties represent tables, and migrations track schema changes. In Madai, EF Core stores users, symptoms, analysis results, and safe report metadata."
