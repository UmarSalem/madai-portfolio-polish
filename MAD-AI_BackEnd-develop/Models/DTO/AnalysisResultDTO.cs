namespace MADAI_BACKEND.Models.DTO
{
    public class AnalysisResultDTO
    {
        public string? Summary { get; set; }
        public string[]? SuggestedConditions { get; set; }
        public string[]? NextSteps { get; set; }
        // null means provenance is unknown (for example a previously stored result).
        public bool? IsDemo { get; set; }
    }
}
