using System.ComponentModel.DataAnnotations;
using MADAI_BACKEND.Models;
using MADAI_BACKEND.Models.DTO;

namespace Madai.Backend.Tests;

public class DtoValidationTests
{
    [Fact]
    public void SignupRequest_WithInvalidEmail_FailsValidation()
    {
        var dto = new SignupRequestDTO
        {
            FirstName = "Demo",
            LastName = "Patient",
            Email = "not-an-email",
            Password = "demo-password-not-real",
            Role = UserRole.Patient
        };

        var results = Validate(dto);

        Assert.Contains(results, result => result.MemberNames.Contains(nameof(SignupRequestDTO.Email)));
    }

    [Fact]
    public void UpdateUserProfile_WithDemoEmail_IsValid()
    {
        var dto = new UpdateUserProfileDTO
        {
            FirstName = "Demo",
            LastName = "Patient",
            Email = "demo.patient@example.test"
        };

        var results = Validate(dto);

        Assert.Empty(results);
    }

    [Fact]
    public void SymptomEntry_WithMissingSymptoms_FailsValidation()
    {
        var dto = new SymptomEntryCreateDTO
        {
            PatientName = "Demo Patient",
            SymptomsText = string.Empty,
            DateSubmitted = DateTime.UtcNow
        };

        var results = Validate(dto);

        Assert.Contains(results, result => result.MemberNames.Contains(nameof(SymptomEntryCreateDTO.SymptomsText)));
    }

    private static List<ValidationResult> Validate(object model)
    {
        var context = new ValidationContext(model);
        var results = new List<ValidationResult>();

        Validator.TryValidateObject(model, context, results, validateAllProperties: true);

        return results;
    }
}
