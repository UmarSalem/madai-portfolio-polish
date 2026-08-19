using System.Net;
using MADAI_BACKEND.Services;
using Microsoft.Extensions.Configuration;

namespace Madai.Backend.Tests;

public class ExternalProviderFallbackTests
{
    [Fact]
    public async Task DoctorService_WithPlaceholderGoogleKey_ReturnsDemoDoctorsWithoutExternalCall()
    {
        var configuration = BuildConfiguration(new Dictionary<string, string?>
        {
            ["GoogleMaps:ApiKey"] = "replace-with-google-api-key"
        });
        var service = new DoctorService(new HttpClient(new ThrowIfCalledHandler()), configuration);

        var doctors = await service.SearchDoctorsAsync(" Demo City ", " Cardiology ");

        Assert.NotEmpty(doctors);
        Assert.All(doctors, doctor =>
        {
            Assert.True(doctor.IsDemo);
            Assert.Equal("Demo City", doctor.Location);
            Assert.Equal("Cardiology", doctor.Specialty);
            Assert.Contains("example.test", doctor.Website);
        });
    }

    [Fact]
    public async Task SymptomService_WithPlaceholderOpenRouterKey_ReturnsDemoFallbackWithoutExternalCall()
    {
        var configuration = BuildConfiguration(new Dictionary<string, string?>
        {
            ["OpenRouter:ApiKey"] = "replace-with-openrouter-api-key"
        });
        var service = new SymptomService(new ThrowIfCalledHttpClientFactory(), configuration);

        var result = await service.AnalyzeSymptomsAsync(new()
        {
            PatientName = "Demo Patient",
            SymptomsText = "fictional headache",
            DateSubmitted = DateTime.UtcNow
        });

        Assert.Contains("Demo symptom checker response only", result.Summary);
        Assert.Contains(result.NextSteps ?? Array.Empty<string>(), step => step.Contains("fictional demo data only"));
    }

    private static IConfiguration BuildConfiguration(Dictionary<string, string?> values)
    {
        return new ConfigurationBuilder()
            .AddInMemoryCollection(values)
            .Build();
    }

    private sealed class ThrowIfCalledHttpClientFactory : IHttpClientFactory
    {
        public HttpClient CreateClient(string name)
        {
            return new HttpClient(new ThrowIfCalledHandler());
        }
    }

    private sealed class ThrowIfCalledHandler : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            throw new InvalidOperationException("External HTTP calls are not allowed in backend tests.");
        }
    }
}
