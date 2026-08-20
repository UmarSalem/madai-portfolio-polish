using MADAI_BACKEND.Data;
using MADAI_BACKEND.Models;
using MADAI_BACKEND.Models.DTO;
using MADAI_BACKEND.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Madai.Backend.Tests;

public class AuthServiceTests
{
    [Fact]
    public async Task SignIn_WithWrongPassword_ReturnsEmptyToken()
    {
        await using var context = CreateContext();
        await AddDemoPatientAsync(context, "demo.patient@example.test", "correct-demo-password");
        var service = new AuthService(context, new JwtService(CreateJwtConfiguration()));

        var response = await service.SignIn(new SignInRequestDTO
        {
            Email = "demo.patient@example.test",
            Password = "wrong-demo-password"
        });

        Assert.Equal(string.Empty, response.Token);
        Assert.Equal("Invalid email or password", response.Message);
        Assert.Null(response.Email);
        Assert.Null(response.Role);
    }

    [Fact]
    public async Task SignIn_WithValidDemoPatient_ReturnsTokenAndSafeUserFields()
    {
        await using var context = CreateContext();
        var user = await AddDemoPatientAsync(context, "demo.patient@example.test", "correct-demo-password");
        var service = new AuthService(context, new JwtService(CreateJwtConfiguration()));

        var response = await service.SignIn(new SignInRequestDTO
        {
            Email = "demo.patient@example.test",
            Password = "correct-demo-password"
        });

        Assert.False(string.IsNullOrWhiteSpace(response.Token));
        Assert.Equal("Login successful", response.Message);
        Assert.Equal(user.Id, response.UserId);
        Assert.Equal("demo.patient@example.test", response.Email);
        Assert.Equal(UserRole.Patient.ToString(), response.Role);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"MadaiAuthTests-{Guid.NewGuid()}")
            .Options;

        return new AppDbContext(options);
    }

    private static async Task<User> AddDemoPatientAsync(AppDbContext context, string email, string password)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Demo",
            LastName = "Patient",
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = UserRole.Patient
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user;
    }

    private static IConfiguration CreateJwtConfiguration()
    {
        return new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "test-only-placeholder-jwt-key-at-least-32-chars",
                ["Jwt:Issuer"] = "MadaiTests",
                ["Jwt:Audience"] = "MadaiTestUsers",
                ["Jwt:ExpiryInMinutes"] = "30"
            })
            .Build();
    }
}
