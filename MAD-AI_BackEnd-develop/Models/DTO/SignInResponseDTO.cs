namespace MADAI_BACKEND.Models.DTO
{
    public class SignInResponseDTO
    {
        public string Token { get; set; } = string.Empty;
        public string Message { get; set; } = "Sign in successful";

        public Guid UserId { get; set; }

        public string? Email { get; set; }

        public string? Role { get; set; }

    }
}
