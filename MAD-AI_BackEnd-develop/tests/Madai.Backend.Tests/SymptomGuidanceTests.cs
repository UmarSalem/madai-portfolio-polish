using System.Net;
using System.Security.Claims;
using System.Text;
using MADAI_BACKEND.Controllers;
using MADAI_BACKEND.Data;
using MADAI_BACKEND.Models;
using MADAI_BACKEND.Models.DTO;
using MADAI_BACKEND.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Madai.Backend.Tests;

public class SymptomGuidanceTests
{
    [Fact]
    public async Task MissingProvider_ReturnsExplicitFallback_WithoutCreatingHttpClient()
    {
        var factory = new StubFactory(HttpStatusCode.OK, "{}");
        var result = await Service(factory, "demo-disabled").AnalyzeSymptomsAsync(Entry());
        Assert.True(result.IsDemo);
        Assert.Equal(0, factory.ClientsCreated);
    }

    [Theory]
    [InlineData(200, "{\"choices\":[{\"message\":{\"content\":\"Fictional provider response\"}}]}", false)]
    [InlineData(503, "{}", true)]
    [InlineData(200, "{}", true)]
    [InlineData(200, "{\"choices\":[{\"message\":{\"content\":\" \"}}]}", true)]
    public async Task StubProviderResponse_LabelsSuccessAndFallback(int status, string body, bool isDemo)
    {
        var factory = new StubFactory((HttpStatusCode)status, body);
        var result = await Service(factory, "unit-test-key").AnalyzeSymptomsAsync(Entry());
        Assert.Equal(isDemo, result.IsDemo);
        Assert.False(string.IsNullOrWhiteSpace(result.Summary));
        Assert.Equal(1, factory.ClientsCreated);
    }

    [Fact]
    public async Task AuthenticatedController_PersistsFictionalInput_AndReturnsFallbackProvenance()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"SymptomGuidance-{Guid.NewGuid()}").Options;
        await using var context = new AppDbContext(options);
        var user = new User { FirstName = "Alex", LastName = "Example", Email = "alex@example.test", PasswordHash = "fictional-test-hash", Role = UserRole.Patient };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        var factory = new StubFactory(HttpStatusCode.OK, "{}");
        var controller = new SymptomCheckerController(context, Service(factory, "demo-disabled"))
        {
            ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()) }, "TestAuth"))
            } }
        };
        var response = Assert.IsType<OkObjectResult>(await controller.PostSymptom(Entry()));
        Assert.True(Assert.IsType<AnalysisResultDTO>(response.Value).IsDemo);
        var saved = Assert.Single(context.SymptomEntries);
        Assert.Equal("Fictional mild tiredness", saved.SymptomsText);
        Assert.Equal(user.Id, saved.UserId);
        Assert.Single(context.AnalysisResults);
        Assert.Equal(0, factory.ClientsCreated);
        // Historical records do not store provenance. Never invent a label for them.
        var historical = Assert.IsType<OkObjectResult>(await controller.GetResult(saved.Id));
        Assert.Null(Assert.IsType<AnalysisResultDTO>(historical.Value).IsDemo);
    }

    private static SymptomEntryCreateDTO Entry() => new() { PatientName = "Alex Example", SymptomsText = "Fictional mild tiredness", DateSubmitted = DateTime.UtcNow };
    private static SymptomService Service(IHttpClientFactory factory, string key) => new(factory,
        new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?> { ["OpenRouter:ApiKey"] = key }).Build());

    private sealed class StubFactory(HttpStatusCode status, string body) : IHttpClientFactory
    {
        public int ClientsCreated { get; private set; }
        public HttpClient CreateClient(string name)
        {
            ClientsCreated++;
            return new HttpClient(new StubHandler(status, body));
        }
    }
    private sealed class StubHandler(HttpStatusCode status, string body) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken) =>
            Task.FromResult(new HttpResponseMessage(status) { Content = new StringContent(body, Encoding.UTF8, "application/json") });
    }
}
