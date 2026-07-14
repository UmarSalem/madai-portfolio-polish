using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MADAI_BACKEND.Contracts;
using MADAI_BACKEND.Models;
using MADAI_BACKEND.Models.DTO;
using MADAI_BACKEND.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace MADAI_BACKEND.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalReportController : ControllerBase
    {
        private const long MaxDemoReportBytes = 2 * 1024 * 1024;
        private readonly AppDbContext _context;
        private readonly IMedicalReportService _reportService;

        public MedicalReportController(AppDbContext context, IMedicalReportService reportService)
        {
            _context = context;
            _reportService = reportService;
        }

        private Guid? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(userIdClaim, out var id) ? id : null;
        }

        [HttpPost("upload-report")]
        public async Task<IActionResult> UploadReport([FromForm] MedicalReportDTO reportDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("Invalid user ID.");

            if (!IsPdf(reportDto.File))
                return BadRequest("Only PDF files are accepted for this demo.");

            if (reportDto.File.Length > MaxDemoReportBytes)
                return BadRequest("Demo report files must be 2 MB or smaller.");

            var analysisResult = await _reportService.AnalyzeMedicalReportAsync(reportDto);
            var safeFileName = Path.GetFileName(reportDto.File.FileName);

            var report = new MedicalReport
            {
                PatientName = reportDto.PatientName,
                FileName = safeFileName,
                FilePath = string.Empty,
                FileData = null,
                AnalysisSummary = analysisResult.Summary,
                SuggestedConditions = string.Join(",", analysisResult.SuggestedConditions ?? new string[] { }),
                NextSteps = string.Join(",", analysisResult.NextSteps ?? new string[] { }),
                UserId = userId.Value
            };

            _context.MedicalReports.Add(report);
            await _context.SaveChangesAsync();

            return Ok(ToSummaryDto(report));
        }

        [HttpGet("download-report/{id}")]
        public async Task<IActionResult> DownloadReport(Guid id)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var report = await _context.MedicalReports
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId.Value);

            if (report == null)
                return NotFound(new { message = "Report downloads are disabled for the safe demo." });

            return NotFound(new { message = "Report downloads are disabled for the safe demo." });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReport(Guid id)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var report = await _context.MedicalReports
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId.Value);
            if (report == null)
                return NotFound();

            var resultDto = new MedicalReportResultDTO
            {
                Summary = report.AnalysisSummary,
                SuggestedConditions = report.SuggestedConditions?.Split(',') ?? new string[] { },
                NextSteps = report.NextSteps?.Split(',') ?? new string[] { }
            };

            return Ok(resultDto);
        }

        [HttpGet("my-reports")]
        public async Task<IActionResult> GetMyReports()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var reports = await _context.MedicalReports
                .Where(r => r.UserId == userId.Value)
                .OrderByDescending(r => r.DateUploaded)
                .ToListAsync();

            return Ok(reports.Select(ToSummaryDto));
        }

        private static bool IsPdf(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName);
            return file.Length > 0
                && string.Equals(extension, ".pdf", StringComparison.OrdinalIgnoreCase)
                && (string.Equals(file.ContentType, "application/pdf", StringComparison.OrdinalIgnoreCase)
                    || string.IsNullOrWhiteSpace(file.ContentType));
        }

        private static MedicalReportSummaryDTO ToSummaryDto(MedicalReport report)
        {
            return new MedicalReportSummaryDTO
            {
                Id = report.Id,
                PatientName = report.PatientName,
                FileName = report.FileName,
                DateUploaded = report.DateUploaded,
                Summary = report.AnalysisSummary,
                SuggestedConditions = SplitStoredList(report.SuggestedConditions),
                NextSteps = SplitStoredList(report.NextSteps),
                DownloadAvailable = false,
                IsDemo = true
            };
        }

        private static string[] SplitStoredList(string? value)
        {
            return string.IsNullOrWhiteSpace(value)
                ? Array.Empty<string>()
                : value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        }
    }
}
