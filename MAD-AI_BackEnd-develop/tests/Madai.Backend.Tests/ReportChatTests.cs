using System.Net;
using System.Security.Claims;
using System.Text.Json;
using MADAI_BACKEND.Controllers;
using MADAI_BACKEND.Data;
using MADAI_BACKEND.Models;
using MADAI_BACKEND.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace Madai.Backend.Tests;

public class ReportChatTests
{
    private readonly Guid owner = Guid.NewGuid(), other = Guid.NewGuid();
    private readonly Stub stub = new();
    private AppDbContext Db() => new(new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
    private ReportChatService Service(string key = "unit-test-key") => new(stub, new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?> { ["OpenRouter:ApiKey"] = key }).Build(), new Env());
    private ReportChatController Controller(AppDbContext db, Guid? user, string key = "unit-test-key") => new(db, Service(key)) { ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user == null ? new ClaimsPrincipal() : new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, user.ToString()!) }, "Test")) } } };
    private MedicalReport Report(Guid user, string text = "Fictional selected report: sample value 42.") => new() { UserId = user, PatientName = "Fictional", FileName = "sample.pdf", ExtractedText = text };
    private static ReportQuestionDTO Question(string text = "What does this fictional value mean?") => new() { Question = text };

    [Fact]
    public async Task AnonymousAndOtherOwnerRejectedOnBothPaths_WithoutProviderCall()
    {
        await using var db = Db(); var report = Report(owner); db.Add(report); await db.SaveChangesAsync();
        Assert.IsType<UnauthorizedResult>(await Controller(db, null).History(report.Id));
        Assert.IsType<UnauthorizedResult>(await Controller(db, null).Send(report.Id, Question()));
        Assert.IsType<NotFoundResult>(await Controller(db, other).History(report.Id));
        Assert.IsType<NotFoundResult>(await Controller(db, other).Send(report.Id, Question()));
        Assert.Equal(0, stub.Calls); Assert.Empty(db.ReportChatTurns);
        Assert.NotNull(typeof(ReportChatController).GetCustomAttributes(typeof(Microsoft.AspNetCore.Authorization.AuthorizeAttribute), true).SingleOrDefault());
    }

    [Fact]
    public async Task SuccessfulFollowUpsPersistReloadAndStayIsolated()
    {
        await using var db = Db(); var report = Report(owner); var second = Report(owner, "Other report"); var foreign = Report(other);
        db.AddRange(report, second, foreign); await db.SaveChangesAsync();
        var controller = Controller(db, owner);
        Assert.IsType<OkObjectResult>(await controller.Send(report.Id, Question("First fictional question")));
        Assert.IsType<OkObjectResult>(await controller.Send(report.Id, Question("Follow-up fictional question")));
        db.ChangeTracker.Clear();
        Assert.Equal(2, await db.ReportChatTurns.CountAsync());
        var history = Assert.IsType<OkObjectResult>(await Controller(db, owner).History(report.Id));
        using var result = JsonDocument.Parse(JsonSerializer.Serialize(history.Value));
        Assert.Equal(2, result.RootElement.GetProperty("turns").GetArrayLength());
        var empty = Assert.IsType<OkObjectResult>(await controller.History(second.Id));
        using var isolated = JsonDocument.Parse(JsonSerializer.Serialize(empty.Value));
        Assert.Empty(isolated.RootElement.GetProperty("turns").EnumerateArray());
        Assert.IsType<NotFoundResult>(await controller.History(foreign.Id));
        using var payload = JsonDocument.Parse(stub.Payload!);
        using var data = JsonDocument.Parse(payload.RootElement.GetProperty("messages")[1].GetProperty("content").GetString()!);
        Assert.Single(data.RootElement.GetProperty("history").EnumerateArray());
        Assert.Equal(report.ExtractedText, data.RootElement.GetProperty("reportText").GetString());
    }

    [Fact]
    public async Task ProviderPayloadIsBoundedAndUsesOnlyOwnedServerContext()
    {
        await using var db = Db(); var report = Report(owner, new string('r', 6000)); db.Add(report);
        for (var i = 0; i < 25; i++) db.ReportChatTurns.Add(new() { ReportId = report.Id, UserId = owner, Question = new string('q', 1000), Answer = new string('a', 4000), CreatedAt = DateTime.UtcNow.AddMinutes(-i) });
        db.ReportChatTurns.Add(new() { ReportId = report.Id, UserId = other, Question = "FOREIGN QUESTION", Answer = "FOREIGN ANSWER" });
        await db.SaveChangesAsync();
        Assert.IsType<OkObjectResult>(await Controller(db, owner).Send(report.Id, Question()));
        Assert.DoesNotContain("FOREIGN", stub.Payload!);
        using var payload = JsonDocument.Parse(stub.Payload!);
        var messages = payload.RootElement.GetProperty("messages");
        Assert.Contains("untrusted data", messages[0].GetProperty("content").GetString());
        using var data = JsonDocument.Parse(messages[1].GetProperty("content").GetString()!);
        Assert.Equal(5000, data.RootElement.GetProperty("reportText").GetString()!.Length);
        Assert.True(data.RootElement.GetProperty("contextTruncated").GetBoolean());
        Assert.Single(data.RootElement.GetProperty("history").EnumerateArray());
        var result = Assert.IsType<OkObjectResult>(await Controller(db, owner).History(report.Id));
        using var history = JsonDocument.Parse(JsonSerializer.Serialize(result.Value));
        Assert.Equal(20, history.RootElement.GetProperty("turns").GetArrayLength());
    }

    [Theory]
    [InlineData("", 400)]
    [InlineData("   ", 400)]
    public async Task InvalidQuestionDoesNotPersist(string question, int status)
    {
        await using var db = Db(); var report = Report(owner); db.Add(report); await db.SaveChangesAsync();
        Assert.Equal(status, Assert.IsType<BadRequestObjectResult>(await Controller(db, owner).Send(report.Id, Question(question))).StatusCode);
        Assert.IsType<BadRequestObjectResult>(await Controller(db, owner).Send(report.Id, Question(new string('x', 1001))));
        Assert.Empty(db.ReportChatTurns); Assert.Equal(0, stub.Calls);
    }

    [Fact]
    public async Task NoProviderAndNoReportTextAreUnavailableNotSimulated()
    {
        await using var db = Db(); var report = Report(owner); var legacy = Report(owner, ""); db.AddRange(report, legacy); await db.SaveChangesAsync();
        Assert.Equal(503, Assert.IsType<ObjectResult>(await Controller(db, owner, "demo-disabled").Send(report.Id, Question())).StatusCode);
        Assert.IsType<ConflictObjectResult>(await Controller(db, owner).Send(legacy.Id, Question()));
        using var history = JsonDocument.Parse(JsonSerializer.Serialize(Assert.IsType<OkObjectResult>(await Controller(db, owner, "demo-disabled").History(report.Id)).Value));
        Assert.False(history.RootElement.GetProperty("available").GetBoolean());
        Assert.Empty(db.ReportChatTurns); Assert.Equal(0, stub.Calls);
    }

    [Theory]
    [InlineData("http")]
    [InlineData("empty")]
    [InlineData("malformed")]
    [InlineData("oversize")]
    [InlineData("envelope")]
    [InlineData("timeout")]
    public async Task FailedProviderSavesNothingAndAllowsRetry(string failure)
    {
        await using var db = Db(); var report = Report(owner); db.Add(report); await db.SaveChangesAsync(); stub.Failure = failure;
        var controller = Controller(db, owner);
        Assert.Equal(failure == "timeout" ? 504 : 502, Assert.IsType<ObjectResult>(await controller.Send(report.Id, Question())).StatusCode);
        Assert.Empty(db.ReportChatTurns);
        stub.Failure = "";
        Assert.IsType<OkObjectResult>(await controller.Send(report.Id, Question()));
        Assert.Single(db.ReportChatTurns);
    }

    [Fact]
    public async Task PendingQuestionRejectsSecondSend()
    {
        await using var db = Db(); var report = Report(owner); db.Add(report); await db.SaveChangesAsync();
        stub.Wait = new TaskCompletionSource(); var controller = Controller(db, owner);
        var first = controller.Send(report.Id, Question());
        Assert.IsType<ConflictObjectResult>(await controller.Send(report.Id, Question()));
        stub.Wait.SetResult(); await first;
        Assert.Single(db.ReportChatTurns); Assert.Equal(1, stub.Calls);
    }

    private sealed class Stub : HttpMessageHandler, IHttpClientFactory
    {
        public int Calls; public string? Payload; public string Failure = ""; public TaskCompletionSource? Wait;
        public HttpClient CreateClient(string name) => new(this, false);
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken token)
        {
            Calls++; Payload = await request.Content!.ReadAsStringAsync(token);
            if (Wait != null) await Wait.Task;
            if (Failure == "timeout") throw new TaskCanceledException();
            var body = Failure switch { "malformed" => "{}", "envelope" => new string('x', 70000), _ => JsonSerializer.Serialize(new { choices = new[] { new { message = new { content = Failure == "empty" ? " " : Failure == "oversize" ? new string('x', 4001) : "Stub explanation of fictional report only." } } } }) };
            return new HttpResponseMessage(Failure == "http" ? HttpStatusCode.ServiceUnavailable : HttpStatusCode.OK) { Content = new StringContent(body) };
        }
    }
    private sealed class Env : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = "Development";
        public string ApplicationName { get; set; } = "Tests";
        public string ContentRootPath { get; set; } = ".";
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }
}
