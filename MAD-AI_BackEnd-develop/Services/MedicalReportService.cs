using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MADAI_BACKEND.Contracts;
using MADAI_BACKEND.Models.DTO;
using Microsoft.Extensions.Configuration;
using UglyToad.PdfPig;

namespace MADAI_BACKEND.Services
{
    public class MedicalReportService : IMedicalReportService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public MedicalReportService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task<MedicalReportResultDTO> AnalyzeMedicalReportAsync(MedicalReportDTO report)
        {
            var client = _httpClientFactory.CreateClient();
            var apiKey = _configuration.GetValue<string>("OpenRouter:ApiKey");
            if (IsMissingProviderConfig(apiKey))
            {
                return CreateDemoFallbackResult();
            }

            string extractedText;
            try
            {
                extractedText = ExtractTextFromPdf(report.File);
            }
            catch
            {
                return CreateDemoFallbackResult();
            }

            if (string.IsNullOrWhiteSpace(extractedText))
            {
                return CreateDemoFallbackResult();
            }

            var systemMessage = new
            {
                role = "system",
                content = "You are supporting an educational demo only. Do not diagnose. Do not claim certainty. Summarize fictional report text safely and remind the user this is not medical advice."
            };
            var userMessage = new
            {
                role = "user",
                content = $"Demo patient name: {report.PatientName}, Demo report text: {TrimForProvider(extractedText)}"
            };

            var requestBody = new
            {
                model = "deepseek/deepseek-r1-zero:free",
                messages = new[] { systemMessage, userMessage }
            };

            string jsonPayload = JsonSerializer.Serialize(requestBody);

            var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            try
            {
                var response = await client.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    return CreateDemoFallbackResult();
                }

                var responseJson = await response.Content.ReadAsStringAsync();
                using var jsonDoc = JsonDocument.Parse(responseJson);
                var summaryText = jsonDoc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

                return new MedicalReportResultDTO
                {
                    Summary = summaryText,
                    SuggestedConditions = Array.Empty<string>(),
                    NextSteps = new[]
                    {
                        "This demo response is not medical advice.",
                        "Do not upload real medical reports to this portfolio demo.",
                        "For real report interpretation, contact a qualified healthcare professional."
                    }
                };
            }
            catch
            {
                return CreateDemoFallbackResult();
            }
        }

        private string ExtractTextFromPdf(IFormFile file)
        {
            try
            {
                using var stream = file.OpenReadStream();
                using var pdfDocument = PdfDocument.Open(stream);
                var textBuilder = new StringBuilder();

                foreach (var page in pdfDocument.GetPages())
                {
                    textBuilder.AppendLine(page.Text);
                }

                return textBuilder.ToString();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Failed to extract text from PDF.", ex);
            }
        }

        private static bool IsMissingProviderConfig(string? apiKey)
        {
            return string.IsNullOrWhiteSpace(apiKey)
                || apiKey.Contains("replace", StringComparison.OrdinalIgnoreCase)
                || apiKey.Contains("placeholder", StringComparison.OrdinalIgnoreCase)
                || apiKey.Contains("demo", StringComparison.OrdinalIgnoreCase);
        }

        private static string TrimForProvider(string text)
        {
            const int maxCharacters = 5000;
            return text.Length <= maxCharacters ? text : text[..maxCharacters];
        }

        private static MedicalReportResultDTO CreateDemoFallbackResult()
        {
            return new MedicalReportResultDTO
            {
                Summary = "Demo report analysis only. This portfolio demo does not store uploaded PDF content and this result is not medical advice.",
                SuggestedConditions = new[]
                {
                    "Demo-only report review"
                },
                NextSteps = new[]
                {
                    "Use fictional PDF files only.",
                    "Do not upload real medical reports or private health information.",
                    "For real medical reports, contact a qualified healthcare professional."
                }
            };
        }
    }
}
