using MADAI_BACKEND.Contracts;
using MADAI_BACKEND.Models.DTO;
using MADAI_BACKEND.Models;
using Microsoft.EntityFrameworkCore;
using MADAI_BACKEND.Data;

namespace MADAI_BACKEND.Services
{
    public class MedicalHistoryService : IMedicalHistoryService
    {
        private readonly AppDbContext _context;

        public MedicalHistoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MedicalHistoryDTO> GetMedicalHistoryAsync(Guid userId)
        {
            var symptoms = await _context.SymptomEntries
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.DateSubmitted)
                .ToListAsync();

            var reports = await _context.MedicalReports
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.DateUploaded)
                .ToListAsync();

            var responses = await _context.AnalysisResults
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.Id)
                .ToListAsync();

            return new MedicalHistoryDTO
            {
                Symptoms = symptoms.Select(s => new SymptomHistoryDTO
                {
                    Id = s.Id,
                    PatientName = s.PatientName,
                    SymptomsText = s.SymptomsText,
                    DateSubmitted = s.DateSubmitted
                }).ToList(),
                Reports = reports.Select(r => new MedicalReportSummaryDTO
                {
                    Id = r.Id,
                    PatientName = r.PatientName,
                    FileName = r.FileName,
                    DateUploaded = r.DateUploaded,
                    Summary = r.AnalysisSummary,
                    SuggestedConditions = SplitStoredList(r.SuggestedConditions),
                    NextSteps = SplitStoredList(r.NextSteps),
                    DownloadAvailable = false,
                    IsDemo = true
                }).ToList(),
                AIResponses = responses.Select(a => new AnalysisResultDTO
                {
                    Summary = a.Summary,
                    SuggestedConditions = SplitStoredList(a.SuggestedConditions),
                    NextSteps = SplitStoredList(a.NextSteps)
                }).ToList()
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
