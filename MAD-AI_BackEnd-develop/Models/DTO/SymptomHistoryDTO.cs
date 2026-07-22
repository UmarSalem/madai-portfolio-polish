namespace MADAI_BACKEND.Models.DTO
{
    public class SymptomHistoryDTO
    {
        public Guid Id { get; set; }
        public string? PatientName { get; set; }
        public string? SymptomsText { get; set; }
        public DateTime DateSubmitted { get; set; }
    }
}
