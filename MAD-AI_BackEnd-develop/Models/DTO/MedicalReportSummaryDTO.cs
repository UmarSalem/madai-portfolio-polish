namespace MADAI_BACKEND.Models.DTO
{
    public class MedicalReportSummaryDTO
    {
        public Guid Id { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public DateTime DateUploaded { get; set; }
        public string? Summary { get; set; }
        public string[] SuggestedConditions { get; set; } = Array.Empty<string>();
        public string[] NextSteps { get; set; } = Array.Empty<string>();
        public bool DownloadAvailable { get; set; }
        public bool IsDemo { get; set; } = true;
    }
}
