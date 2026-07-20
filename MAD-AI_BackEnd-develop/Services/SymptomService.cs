using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MADAI_BACKEND.Contracts;
using MADAI_BACKEND.Models.DTO;
using Microsoft.Extensions.Configuration;

namespace MADAI_BACKEND.Services
{
    public class SymptomService : ISymptomService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public SymptomService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task<AnalysisResultDTO> AnalyzeSymptomsAsync(MADAI_BACKEND.Models.DTO.SymptomEntryCreateDTO entry)
        {
            var apiKey = _configuration["OpenRouter:ApiKey"];
            if (IsMissingProviderConfig(apiKey))
            {
                return CreateDemoFallbackResult();
            }
            var configuredApiKey = apiKey ?? string.Empty;

            var systemMessage = new
            {
                role = "system",
                content = "You are supporting an educational demo only. Do not diagnose. Explain that the response is not medical advice, avoid certainty, and recommend professional care for real symptoms or emergencies."
            };
            var userMessage = new
            {
                role = "user",
                content = $"Demo symptoms only: {entry.SymptomsText}"
            };

            var requestBody = new
            {
                model = "deepseek/deepseek-r1-zero:free",
                messages = new[] { systemMessage, userMessage }
            };

            string jsonPayload = JsonSerializer.Serialize(requestBody);

            using var client = _httpClientFactory.CreateClient();
            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", configuredApiKey);
            httpRequest.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            httpRequest.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            HttpResponseMessage response;
            try
            {
                response = await client.SendAsync(httpRequest);
            }
            catch
            {
                return CreateDemoFallbackResult();
            }

            if (!response.IsSuccessStatusCode)
            {
                return CreateDemoFallbackResult();
            }

            try
            {
                string responseJson = await response.Content.ReadAsStringAsync();
                using JsonDocument jsonDoc = JsonDocument.Parse(responseJson);
                JsonElement root = jsonDoc.RootElement;

                string summaryText = root.GetProperty("choices")[0]
                                          .GetProperty("message")
                                          .GetProperty("content")
                                          .GetString() ?? string.Empty;

                return new AnalysisResultDTO
                {
                    Summary = summaryText,
                    SuggestedConditions = Array.Empty<string>(),
                    NextSteps = new[]
                    {
                        "This demo response is not medical advice.",
                        "For real symptoms, contact a qualified healthcare professional.",
                        "For emergencies, call local emergency services."
                    }
                };
            }
            catch
            {
                return CreateDemoFallbackResult();
            }
        }

        private static bool IsMissingProviderConfig(string? apiKey)
        {
            return string.IsNullOrWhiteSpace(apiKey)
                || apiKey.Contains("replace", StringComparison.OrdinalIgnoreCase)
                || apiKey.Contains("placeholder", StringComparison.OrdinalIgnoreCase)
                || apiKey.Contains("demo", StringComparison.OrdinalIgnoreCase);
        }

        private static AnalysisResultDTO CreateDemoFallbackResult()
        {
            return new AnalysisResultDTO
            {
                Summary = "Demo symptom checker response only. This is not medical advice and must not be used for diagnosis or emergencies.",
                SuggestedConditions = new[]
                {
                    "Demo-only possible condition",
                    "Needs verification by a qualified professional for any real concern"
                },
                NextSteps = new[]
                {
                    "Use fictional demo data only in this portfolio project.",
                    "For real symptoms, contact a qualified healthcare professional.",
                    "For emergencies, call local emergency services."
                }
            };
        }
    }
}
