using MADAI_BACKEND.Contracts;
using MADAI_BACKEND.Controllers;
using MADAI_BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace Madai.Backend.Tests;

public class AuthControllerTests
{
    [Fact]
    public async Task SignIn_WhenServiceReturnsEmptyToken_ReturnsBadRequest()
    {
        var controller = new AuthController(new FakeAuthService(new SignInResponseDTO
        {
            Token = string.Empty,
            Message = "Invalid email or password"
        }));

        var result = await controller.SignIn(new SignInRequestDTO
        {
            Email = "demo.patient@example.test",
            Password = "wrong-demo-password"
        });

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public async Task SignIn_WhenServiceReturnsToken_ReturnsOk()
    {
        var userId = Guid.NewGuid();
        var controller = new AuthController(new FakeAuthService(new SignInResponseDTO
        {
            Token = "demo-jwt-token-not-real",
            Message = "Login successful",
            UserId = userId,
            Email = "demo.patient@example.test",
            Role = "Patient"
        }));

        var result = await controller.SignIn(new SignInRequestDTO
        {
            Email = "demo.patient@example.test",
            Password = "correct-demo-password"
        });

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<SignInResponseDTO>(okResult.Value);
        Assert.Equal(userId, response.UserId);
        Assert.Equal("demo.patient@example.test", response.Email);
        Assert.Equal("Patient", response.Role);
    }

    private sealed class FakeAuthService : IAuthService
    {
        private readonly SignInResponseDTO _signInResponse;

        public FakeAuthService(SignInResponseDTO signInResponse)
        {
            _signInResponse = signInResponse;
        }

        public Task<SignInResponseDTO> SignIn(SignInRequestDTO signInRequest)
        {
            return Task.FromResult(_signInResponse);
        }

        public Task<string> Signup(SignupRequestDTO signupRequest, string creatorEmail)
        {
            return Task.FromResult("Signup successful");
        }

        public Task<string?> ForgotPasswordAsync(string email)
        {
            return Task.FromResult<string?>(null);
        }

        public Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            return Task.FromResult(false);
        }
    }
}
