using System;
using System.ComponentModel.DataAnnotations;

namespace MADAI_BACKEND.Models.DTO
{
    public class SymptomEntryCreateDTO
    {
        [Required]
        [StringLength(100)]
        public string? PatientName { get; set; }

        [Required]
        [StringLength(2000)]
        public string? SymptomsText { get; set; }

        public DateTime DateSubmitted { get; set; } = DateTime.Now;
    }
}
