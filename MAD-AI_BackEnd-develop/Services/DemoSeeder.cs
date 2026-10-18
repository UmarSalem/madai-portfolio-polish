using System.Text;
using MADAI_BACKEND.Data;
using MADAI_BACKEND.Models;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace MADAI_BACKEND.Services;

public static class DemoSeeder
{
    public const string Email = "backend.demo@example.test";
    public static readonly Guid UserId = Guid.Parse("d0000000-0000-0000-0000-000000000001");
    public static readonly Guid SymptomId = Guid.Parse("d0000000-0000-0000-0000-000000000002");
    public static readonly Guid AnalysisId = Guid.Parse("d0000000-0000-0000-0000-000000000003");
    public static readonly Guid ReportId = Guid.Parse("d0000000-0000-0000-0000-000000000004");

    public static string Validate(IConfiguration config, IHostEnvironment environment)
    {
        if (!environment.IsDevelopment()) throw new InvalidOperationException("Demo seeding is allowed only in Development.");
        if (!BackendDemo.IsEnabled(config)) throw new InvalidOperationException("Demo seeding requires BackendDemo:Enabled=true.");
        var password = config["BackendDemo:SeedPassword"];
        if (string.IsNullOrWhiteSpace(password) || password.Length < 12 || Encoding.UTF8.GetByteCount(password) > 72)
            throw new InvalidOperationException("Supply BackendDemo:SeedPassword locally (at least 12 characters, at most 72 UTF-8 bytes). Credentials are never printed.");
        try
        {
            var connection = new SqliteConnectionStringBuilder(config.GetConnectionString("DefaultConnection") ?? string.Empty);
            if (!Path.IsPathFullyQualified(connection.DataSource)
                || !string.Equals(Path.GetFileName(connection.DataSource), "madai.demo.db", StringComparison.OrdinalIgnoreCase)
                || connection.Mode is SqliteOpenMode.Memory or SqliteOpenMode.ReadOnly)
                throw new ArgumentException();
            return Path.GetFullPath(connection.DataSource);
        }
        catch (ArgumentException)
        {
            throw new InvalidOperationException("Demo seeding requires an explicit absolute SQLite path ending in madai.demo.db; memory/read-only databases are not supported.");
        }
    }

    public static async Task SeedAsync(AppDbContext db, IConfiguration config, IHostEnvironment environment)
    {
        Validate(config, environment);
        // Preflight every reserved identity before adding anything. Never update,
        // delete, reset, reassign ownership, or change an existing password.
        var candidates = await db.Users.Where(u => u.Id == UserId || u.Email.ToLower() == Email).ToListAsync();
        if (candidates.Count > 1) throw new InvalidOperationException("Demo user identity conflicts with existing data; no seed records were written.");
        var user = candidates.SingleOrDefault();
        if (user != null && (user.Id != UserId || user.Email != Email || user.Role != UserRole.Patient))
            throw new InvalidOperationException("Demo user identity conflicts with existing data; no seed records were written.");
        if (user != null)
        {
            bool matches;
            try { matches = BCrypt.Net.BCrypt.Verify(config["BackendDemo:SeedPassword"], user.PasswordHash); }
            catch { matches = false; }
            if (!matches) throw new InvalidOperationException("Existing demo credentials differ. Seeding never overwrites a password.");
        }
        var symptom = await db.SymptomEntries.FindAsync(SymptomId);
        var analysis = await db.AnalysisResults.FirstOrDefaultAsync(a => a.Id == AnalysisId || a.SymptomEntryId == SymptomId);
        var report = await db.MedicalReports.FindAsync(ReportId);
        if ((symptom != null && symptom.UserId != UserId)
            || (analysis != null && (analysis.Id != AnalysisId || analysis.UserId != UserId || analysis.SymptomEntryId != SymptomId))
            || (report != null && report.UserId != UserId))
            throw new InvalidOperationException("Demo record identities conflict with existing data; no seed records were written.");

        if (user == null) db.Users.Add(new User
        {
            Id = UserId, FirstName = "Alex", LastName = "Fictional", Email = Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(config["BackendDemo:SeedPassword"]!), Role = UserRole.Patient
        });
        if (symptom == null) db.SymptomEntries.Add(new SymptomEntry
        {
            Id = SymptomId, UserId = UserId, PatientName = "Alex Fictional",
            SymptomsText = "Fictional example question: what happens at a routine check-up?", DateSubmitted = DateTime.UtcNow
        });
        if (analysis == null) db.AnalysisResults.Add(new AnalysisResult
        {
            Id = AnalysisId, UserId = UserId, SymptomEntryId = SymptomId,
            Summary = "Static backend demo seed guidance only — not live AI, diagnosis or medical advice.",
            SuggestedConditions = string.Empty, NextSteps = "Use fictional data only."
        });
        if (report == null) db.MedicalReports.Add(new MedicalReport
        {
            Id = ReportId, UserId = UserId, PatientName = "Alex Fictional", FileName = "fictional-seeded-report.pdf",
            FilePath = string.Empty, FileData = null,
            ExtractedText = "Fictional seeded report: example measurement 42 demonstration units. No real patient.",
            AnalysisSummary = "Static demo fallback — not analysis of this report. This is a fictional seeded example, not a provider explanation.",
            IsDemo = true, TextTruncated = false, SuggestedConditions = string.Empty, NextSteps = "Use fictional data only."
        });
        await db.SaveChangesAsync(); // one batch; EF uses a transaction for relational storage
    }
}
