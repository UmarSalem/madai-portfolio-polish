using System.Security.Claims;
using MADAI_BACKEND.Controllers;
using MADAI_BACKEND.Data;
using MADAI_BACKEND.Models;
using MADAI_BACKEND.Models.DTO;
using MADAI_BACKEND.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace Madai.Backend.Tests;

public class BackendDemoTests
{
    // Generated per test; no seeded login password is committed or printed.
    private readonly string password = Guid.NewGuid().ToString("N") + "!aA9";
    private IConfiguration Config(bool enabled = true, string? seedPassword = null, string? path = null) => new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
    {
        ["BackendDemo:Enabled"] = enabled.ToString(), ["BackendDemo:SeedPassword"] = seedPassword ?? password,
        ["ConnectionStrings:DefaultConnection"] = "Data Source=" + (path ?? Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString(), "madai.demo.db")),
        ["OpenRouter:ApiKey"] = "synthetic-configured-key-never-sent", ["GoogleMaps:ApiKey"] = "synthetic-configured-maps-key-never-sent"
    }).Build();
    private static AppDbContext Db() => new(new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
    private static MedicalReportDTO Pdf() { var bytes = ReportFlowTests.Pdf("Fictional report: sample value 42."); return new() { PatientName = "Alex Fictional", File = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "File", "fictional.pdf") { Headers = new HeaderDictionary(), ContentType = "application/pdf" } }; }

    [Fact]
    public async Task AllProviderPathsMakeZeroCallsDespiteConfiguredKeys()
    {
        await using var db = Db(); var config = Config(); var counter = new Counter();
        var symptoms = await new SymptomService(counter, config).AnalyzeSymptomsAsync(new() { PatientName = "Fictional", SymptomsText = "Fictional question" });
        Assert.True(symptoms.IsDemo); Assert.Contains("Demo symptom checker response only", symptoms.Summary);
        var doctors = await new DoctorService(new HttpClient(counter, false), config).SearchDoctorsAsync("Demo City", "General practice");
        Assert.All(doctors, d => Assert.True(d.IsDemo)); Assert.Equal(2, doctors.Count);
        var report = await new MedicalReportService(counter, config).AnalyzeMedicalReportAsync(Pdf());
        Assert.True(report.IsDemo); Assert.Contains("not analysis of this report", report.Summary);
        Assert.Contains("sample value 42", report.ExtractedText);
        var service = new ReportChatService(counter, config, new Env());
        Assert.False(service.Available);
        await Assert.ThrowsAsync<ChatUnavailableException>(() => service.AnswerAsync(new MedicalReport { ExtractedText = "Fictional" }, Array.Empty<ReportChatTurn>(), "Fictional question"));
        var recommendations = new AIRecommendationService(db, new HttpClient(counter, false), config);
        Assert.Contains("disabled in backend demo mode", await recommendations.GenerateHealthAdviceAsync(Guid.NewGuid()));
        Assert.Contains("disabled in backend demo mode", await recommendations.GeneratePersonalizedHealthInsightsAsync(Guid.NewGuid()));
        Assert.Equal(0, counter.Calls); Assert.Equal(0, counter.ClientsCreated);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task FactoryTransportGuardBlocksDemoAndAllowsNormalStubFlow(bool enabled)
    {
        var counter = new Counter(); var services = new ServiceCollection();
        services.AddSingleton<IConfiguration>(Config(enabled)); services.AddTransient<BackendDemoProviderGuard>();
        services.ConfigureHttpClientDefaults(client => client.AddHttpMessageHandler<BackendDemoProviderGuard>());
        services.AddHttpClient("probe").ConfigurePrimaryHttpMessageHandler(() => counter);
        using var provider = services.BuildServiceProvider();
        var client = provider.GetRequiredService<IHttpClientFactory>().CreateClient("probe");
        if (enabled) { await Assert.ThrowsAsync<InvalidOperationException>(() => client.GetAsync("https://example.test/provider")); Assert.Equal(0, counter.Calls); }
        else { using var response = await client.GetAsync("https://example.test/provider"); Assert.True(response.IsSuccessStatusCode); Assert.Equal(1, counter.Calls); }
        Assert.False(BackendDemo.IsEnabled(new ConfigurationBuilder().Build()));
    }

    [Fact]
    public async Task SeedTwiceKeepsCountsHashDatesAndExistingEdits()
    {
        await using var db = Db(); var config = Config(); var env = new Env();
        await DemoSeeder.SeedAsync(db, config, env);
        var user = Assert.Single(db.Users); var hash = user.PasswordHash; var date = user.CreatedAt;
        Assert.True(BCrypt.Net.BCrypt.Verify(password, hash));
        var report = Assert.Single(db.MedicalReports); report.PatientName = "Edited fictional name"; await db.SaveChangesAsync();
        await DemoSeeder.SeedAsync(db, config, env);
        Assert.Single(db.Users); Assert.Single(db.SymptomEntries); Assert.Single(db.AnalysisResults); Assert.Single(db.MedicalReports); Assert.Empty(db.ReportChatTurns);
        Assert.Equal(hash, user.PasswordHash); Assert.Equal(date, user.CreatedAt); Assert.Equal("Edited fictional name", report.PatientName);
        Assert.True(report.IsDemo); Assert.Contains("not analysis of this report", report.AnalysisSummary);
        Assert.Null(report.FileData);
    }

    [Fact]
    public async Task SeedPreservesUnrelatedUserAndRecords_AndNeverChangesPasswords()
    {
        await using var db = Db(); var config = Config(); var user = new User { FirstName = "Other", LastName = "Fictional", Email = "other@example.test", PasswordHash = "existing-test-hash" };
        var report = new MedicalReport { UserId = user.Id, FileName = "other.pdf", PatientName = "Other Fictional", AnalysisSummary = "Preserve this fictional record" };
        db.AddRange(user, report); await db.SaveChangesAsync();
        await DemoSeeder.SeedAsync(db, config, new Env());
        Assert.Equal(2, db.Users.Count()); Assert.Equal(2, db.MedicalReports.Count());
        Assert.Equal("existing-test-hash", user.PasswordHash); Assert.Equal("Preserve this fictional record", report.AnalysisSummary);
        var seedHash = (await db.Users.FindAsync(DemoSeeder.UserId))!.PasswordHash;
        await Assert.ThrowsAsync<InvalidOperationException>(() => DemoSeeder.SeedAsync(db, Config(seedPassword: Guid.NewGuid().ToString("N")), new Env()));
        Assert.Equal(seedHash, (await db.Users.FindAsync(DemoSeeder.UserId))!.PasswordHash);
    }

    [Theory]
    [InlineData("Production")]
    [InlineData("Staging")]
    public async Task RejectsSeedOutsideDevelopmentWithoutChanges(string environment)
    {
        await using var db = Db();
        await Assert.ThrowsAsync<InvalidOperationException>(() => DemoSeeder.SeedAsync(db, Config(), new Env { EnvironmentName = environment }));
        Assert.Empty(db.Users); Assert.Empty(db.MedicalReports);
    }

    [Fact]
    public async Task RejectsUnsafeSeedConfigurationAndIdentityCollision()
    {
        Assert.Throws<InvalidOperationException>(() => DemoSeeder.Validate(Config(false), new Env()));
        Assert.Throws<InvalidOperationException>(() => DemoSeeder.Validate(Config(seedPassword: ""), new Env()));
        Assert.Throws<InvalidOperationException>(() => DemoSeeder.Validate(Config(path: "MADAI.db"), new Env()));
        Assert.Throws<InvalidOperationException>(() => DemoSeeder.Validate(Config(path: Path.Combine(Path.GetTempPath(), "ordinary.db")), new Env()));
        await using var db = Db();
        db.Users.Add(new User { FirstName = "Existing", LastName = "Fictional", Email = DemoSeeder.Email, PasswordHash = "existing-hash" });
        await db.SaveChangesAsync();
        await Assert.ThrowsAsync<InvalidOperationException>(() => DemoSeeder.SeedAsync(db, Config(), new Env()));
        Assert.Single(db.Users); Assert.Empty(db.SymptomEntries); Assert.Empty(db.MedicalReports);
    }

    [Fact]
    public async Task DemoChatStillChecksAuthAndOwnershipBeforeUnavailable_AndSavesNothing()
    {
        await using var db = Db(); var config = Config(); await DemoSeeder.SeedAsync(db, config, new Env());
        var counter = new Counter(); var controller = new ReportChatController(db, new ReportChatService(counter, config, new Env())) { ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() } };
        Assert.IsType<UnauthorizedResult>(await controller.History(DemoSeeder.ReportId));
        Assert.IsType<UnauthorizedResult>(await controller.Send(DemoSeeder.ReportId, new() { Question = "Fictional question" }));
        controller.HttpContext.User = Principal(Guid.NewGuid());
        Assert.IsType<NotFoundResult>(await controller.History(DemoSeeder.ReportId));
        Assert.IsType<NotFoundResult>(await controller.Send(DemoSeeder.ReportId, new() { Question = "Fictional question" }));
        controller.HttpContext.User = Principal(DemoSeeder.UserId);
        Assert.Equal(503, Assert.IsType<ObjectResult>(await controller.Send(DemoSeeder.ReportId, new() { Question = "Fictional question" })).StatusCode);
        Assert.Empty(db.ReportChatTurns); Assert.Equal(0, counter.Calls);
    }

    [Fact]
    public async Task ReservedReportOwnedBySomeoneElseRejectsBeforeAddingAnySeedRows()
    {
        await using var db = Db();
        var user = new User { FirstName = "Other", LastName = "Fictional", Email = "preserve@example.test", PasswordHash = "existing-test-hash" };
        db.Add(user); db.Add(new MedicalReport { Id = DemoSeeder.ReportId, UserId = user.Id, PatientName = "Other Fictional", FileName = "preserve.pdf" });
        await db.SaveChangesAsync();
        await Assert.ThrowsAsync<InvalidOperationException>(() => DemoSeeder.SeedAsync(db, Config(), new Env()));
        Assert.Single(db.Users); Assert.Single(db.MedicalReports); Assert.Empty(db.SymptomEntries); Assert.Empty(db.AnalysisResults);
        Assert.Equal(user.Id, (await db.MedicalReports.FindAsync(DemoSeeder.ReportId))!.UserId);
    }

    private static ClaimsPrincipal Principal(Guid id) => new(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, id.ToString()) }, "Test"));
    private sealed class Counter : HttpMessageHandler, IHttpClientFactory
    {
        public int Calls, ClientsCreated;
        public HttpClient CreateClient(string name) { ClientsCreated++; return new HttpClient(this, false); }
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken) { Calls++; return Task.FromResult(new HttpResponseMessage(System.Net.HttpStatusCode.OK) { Content = new StringContent("{}") }); }
    }
    private sealed class Env : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = "Development";
        public string ApplicationName { get; set; } = "Tests";
        public string ContentRootPath { get; set; } = ".";
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }
}
