using System.ComponentModel.DataAnnotations;

namespace MADAI_BACKEND.Models.DTO
{
    public class UpdateUserProfileDTO
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
