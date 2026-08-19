using System.Security.Claims;
using System.Text;
using MADAI_BACKEND.Contracts;
using MADAI_BACKEND.Controllers;
using MADAI_BACKEND.Data;
using MADAI_BACKEND.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Madai.Backend.Tests;

public class MedicalReportControllerTests
{
    [Fact]
    public async Task UploadReport_WithNonPdfFile_ReturnsBadRequestWithoutCallingAnalysisService()
    {
        await using var context = CreateContext();
        var reportService = new FakeMedicalReportService();
        var controller = new MedicalReportController(context, reportService)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = BuildPatientPrincipal(Guid.NewGuid())
                }
            }
        };
        var dto = new MedicalReportDTO
        {
            PatientName = "Demo Patient",
            File = CreateFormFile("demo-report.txt", "text/plain")
        };

        var result = await controller.UploadReport(dto);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Only PDF files are accepted for this demo.", badRequest.Value);
        Assert.False(reportService.WasCalled);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"MadaiTests-{Guid.NewGuid()}")
            .Options;

        return new AppDbContext(options);
    }

    private static ClaimsPrincipal BuildPatientPrincipal(Guid userId)
    {
        var identity = new ClaimsIdentity(
            new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) },
            authenticationType: "TestAuth");

        return new ClaimsPrincipal(identity);
    }

    private static IFormFile CreateFormFile(string fileName, string contentType)
    {
        var bytes = Encoding.UTF8.GetBytes("fictional demo file content only");
        var stream = new MemoryStream(bytes);

        return new FormFile(stream, 0, bytes.Length, "File", fileName)
        {
            Headers = new HeaderDictionary(),
            ContentType = contentType
        };
    }

    private sealed class FakeMedicalReportService : IMedicalReportService
    {
        public bool WasCalled { get; private set; }

        public Task<MedicalReportResultDTO> AnalyzeMedicalReportAsync(MedicalReportDTO report)
        {
            WasCalled = true;

            return Task.FromResult(new MedicalReportResultDTO
            {
                Summary = "Demo analysis only.",
                SuggestedConditions = Array.Empty<string>(),
                NextSteps = Array.Empty<string>()
            });
        }
    }
}
