namespace MADAI_BACKEND.Models.DTO
{
    public class MedicalHistoryDTO
    {
        public List<SymptomHistoryDTO> Symptoms { get; set; } = new();
        public List<MedicalReportSummaryDTO> Reports { get; set; } = new();
        public List<AnalysisResultDTO> AIResponses { get; set; } = new();
    }
}
