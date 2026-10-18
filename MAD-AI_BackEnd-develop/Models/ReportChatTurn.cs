using System.ComponentModel.DataAnnotations;

namespace MADAI_BACKEND.Models;

public class ReportChatTurn
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ReportId { get; set; }
    public MedicalReport Report { get; set; } = null!;
    public Guid UserId { get; set; }
    [MaxLength(1000)] public string Question { get; set; } = string.Empty;
    [MaxLength(4000)] public string Answer { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool ContextTruncated { get; set; }
}
