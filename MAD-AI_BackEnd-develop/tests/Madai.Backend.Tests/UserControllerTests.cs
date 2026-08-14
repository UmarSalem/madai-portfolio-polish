using System.Security.Claims;
using MADAI_BACKEND.Contracts;
using MADAI_BACKEND.Controllers;
using MADAI_BACKEND.Data;
using MADAI_BACKEND.Models;
using MADAI_BACKEND.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Madai.Backend.Tests;

public class UserControllerTests
{
    [Fact]
    public async Task GetMyProfile_ReturnsSafeProfileDtoWithoutPasswordHash()
    {
        await using var context = CreateContext();
        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Demo",
            LastName = "Patient",
            Email = "demo.patient@example.test",
            PasswordHash = "hashed-demo-password-not-real",
            Role = UserRole.Patient
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var controller = new UserController(new FakeMedicalHistoryService(), context, new FakeAIRecommendationService())
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = BuildPatientPrincipal(user.Id)
                }
            }
        };

        var result = await controller.GetMyProfile();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var profile = Assert.IsType<UserProfileDTO>(okResult.Value);
        Assert.Equal("demo.patient@example.test", profile.Email);
        Assert.DoesNotContain("PasswordHash", profile.GetType().GetProperties().Select(property => property.Name));
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"MadaiTests-{Guid.NewGuid()}")
            .Options;

        return new AppDbContext(options);
    }

    private static ClaimsPrincipal BuildPatientPrincipal(Guid userId)
    {
        var identity = new ClaimsIdentity(
            new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) },
            authenticationType: "TestAuth");

        return new ClaimsPrincipal(identity);
    }

    private sealed class FakeMedicalHistoryService : IMedicalHistoryService
    {
        public Task<MedicalHistoryDTO> GetMedicalHistoryAsync(Guid userId)
        {
            return Task.FromResult(new MedicalHistoryDTO());
        }
    }

    private sealed class FakeAIRecommendationService : IAIRecommendationService
    {
        public Task<string> GenerateHealthAdviceAsync(Guid userId)
        {
            return Task.FromResult("Demo advice only.");
        }

        public Task<string> GeneratePersonalizedHealthInsightsAsync(Guid userId)
        {
            return Task.FromResult("Demo insight only.");
        }
    }
}
