using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BozkurtMobilya.Api.Controllers.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace BozkurtMobilya.Api.Controllers;

[Route("api/auth")]
public class AuthController : BaseApiController
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>Yönetici girişi. Başarılı girişte JWT token döner.</summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return Unauthorized(new ProblemDetails
            {
                Title = "Giriş başarısız",
                Detail = "E-posta veya şifre hatalı.",
                Status = StatusCodes.Status401Unauthorized
            });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

        if (result.IsLockedOut)
        {
            _logger.LogWarning("Hesap kilitlendi: {Email}", request.Email);
            return StatusCode(StatusCodes.Status429TooManyRequests, new ProblemDetails
            {
                Title = "Hesap kilitlendi",
                Detail = "Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.",
                Status = StatusCodes.Status429TooManyRequests
            });
        }

        if (!result.Succeeded)
        {
            return Unauthorized(new ProblemDetails
            {
                Title = "Giriş başarısız",
                Detail = "E-posta veya şifre hatalı.",
                Status = StatusCodes.Status401Unauthorized
            });
        }

        var token = await GenerateJwtTokenAsync(user);
        return Ok(new LoginResponse { Token = token, Email = user.Email! });
    }

    /// <summary>Mevcut token ile kullanıcı bilgilerini döner.</summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null) 
            return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new { user.Email, Roles = roles });
    }

    private async Task<string> GenerateJwtTokenAsync(IdentityUser user)
    {
        var jwtSection = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(
            double.Parse(jwtSection["ExpiresInMinutes"] ?? "1440"));

        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var token = new JwtSecurityToken(
            issuer: jwtSection["Issuer"],
            audience: jwtSection["Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginRequest
{
    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "E-posta adresi zorunludur.")]
    [System.ComponentModel.DataAnnotations.EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
    public string Email { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Şifre zorunludur.")]
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
