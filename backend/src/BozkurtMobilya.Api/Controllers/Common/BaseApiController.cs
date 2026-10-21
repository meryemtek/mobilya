using System.Security.Claims;
using BozkurtMobilya.Application.Common.Models;
using Microsoft.AspNetCore.Mvc;

namespace BozkurtMobilya.Api.Controllers.Common;

/// <summary>
/// Tüm API Controller'ları için temel sınıf.
/// Clean Code ve DRY (Don't Repeat Yourself) ilkelerine göre ortak HTTP yanıtlarını,
/// hata yönetimini ve kullanıcı kimlik bilgilerini sağlar.
/// </summary>
[ApiController]
[Produces("application/json")]
public abstract class BaseApiController : ControllerBase
{
    /// <summary>Giriş yapan kullanıcının benzersiz ID'si</summary>
    protected string? CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier);

    /// <summary>Giriş yapan kullanıcının e-posta adresi</summary>
    protected string? CurrentUserEmail => User.FindFirstValue(ClaimTypes.Email);

    /// <summary>Kullanıcının oturum açıp açmadığı</summary>
    protected bool IsUserAuthenticated => User.Identity?.IsAuthenticated ?? false;

    /// <summary>Başarılı 200 OK yanıtı döner.</summary>
    protected IActionResult Success<T>(T data, string? message = null)
    {
        return Ok(ApiResponse<T>.Ok(data, message));
    }

    /// <summary>Başarılı 200 OK sayfalanmış yanıt döner.</summary>
    protected IActionResult PagedSuccess<T>(
        IReadOnlyList<T> items, int totalCount, int page, int pageSize)
    {
        return Ok(new PagedResponse<T>(items, totalCount, page, pageSize));
    }

    /// <summary>Başarılı 201 Created yanıtı döner.</summary>
    protected IActionResult CreatedResponse<T>(string actionName, object? routeValues, T data)
    {
        return CreatedAtAction(actionName, routeValues, ApiResponse<T>.Ok(data, "Kayıt başarıyla oluşturuldu."));
    }

    /// <summary>404 Not Found RFC 7807 ProblemDetails yanıtı döner.</summary>
    protected ActionResult NotFoundProblem(string detail = "İstenen kayıt bulunamadı.")
    {
        return NotFound(new ProblemDetails
        {
            Status = StatusCodes.Status404NotFound,
            Title = "Kayıt Bulunamadı",
            Detail = detail,
            Instance = HttpContext.Request.Path
        });
    }

    /// <summary>400 Bad Request RFC 7807 ProblemDetails yanıtı döner.</summary>
    protected ActionResult BadRequestProblem(string detail)
    {
        return BadRequest(new ProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Geçersiz İstek",
            Detail = detail,
            Instance = HttpContext.Request.Path
        });
    }

    /// <summary>409 Conflict RFC 7807 ProblemDetails yanıtı döner.</summary>
    protected ActionResult ConflictProblem(string detail)
    {
        return Conflict(new ProblemDetails
        {
            Status = StatusCodes.Status409Conflict,
            Title = "Çakışma Hatası",
            Detail = detail,
            Instance = HttpContext.Request.Path
        });
    }
}
