using BozkurtMobilya.Api.Controllers.Common;
using BozkurtMobilya.Application.Common.Interfaces;
using BozkurtMobilya.Domain.Entities;
using BozkurtMobilya.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Api.Controllers;

[Route("api/contact-messages")]
public class ContactMessagesController : BaseApiController
{
    private readonly IApplicationDbContext _db;
    private readonly ILogger<ContactMessagesController> _logger;

    public ContactMessagesController(IApplicationDbContext db, ILogger<ContactMessagesController> logger)
    {
        _db = db;
        _logger = logger;
    }

    /// <summary>Ziyaretçiden gelen iletişim formunu doğrular ve kaydeder.</summary>
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] CreateContactMessageRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (string.IsNullOrWhiteSpace(request.Email) && string.IsNullOrWhiteSpace(request.Phone))
        {
            return BadRequestProblem("Lütfen e-posta veya telefon bilgilerinizden en az birini belirtiniz.");
        }

        var message = new ContactMessage
        {
            FullName = request.FullName.Trim(),
            Email = request.Email?.Trim(),
            Phone = request.Phone?.Trim(),
            Subject = request.Subject?.Trim(),
            Message = request.Message.Trim(),
            Status = MessageStatus.New,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.ContactMessages.Add(message);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Yeni iletişim mesajı alındı: {FullName} ({Email}/{Phone})", message.FullName, message.Email, message.Phone);

        return Ok(new { message = "Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçilecektir.", id = message.Id });
    }
}

// ── Admin ────────────────────────────────────────────────────────────────────

[Route("api/admin/contact-messages")]
public class AdminContactMessagesController : BaseAdminController
{
    private readonly IApplicationDbContext _db;

    public AdminContactMessagesController(IApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] MessageStatus? status = null, 
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20)
    {
        pageSize = Math.Clamp(pageSize, 1, 100);
        page = Math.Max(1, page);

        var query = _db.ContactMessages.AsNoTracking();

        if (status.HasValue)
            query = query.Where(m => m.Status == status.Value);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new ContactMessageDto
            {
                Id = m.Id,
                FullName = m.FullName,
                Email = m.Email,
                Phone = m.Phone,
                Subject = m.Subject,
                Message = m.Message,
                Status = m.Status.ToString(),
                AdminNote = m.AdminNote,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();

        return PagedSuccess(items, totalCount, page, pageSize);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var m = await _db.ContactMessages.FindAsync(id);
        if (m is null) 
            return NotFoundProblem("İletişim mesajı bulunamadı.");

        return Ok(new ContactMessageDto
        {
            Id = m.Id,
            FullName = m.FullName,
            Email = m.Email,
            Phone = m.Phone,
            Subject = m.Subject,
            Message = m.Message,
            Status = m.Status.ToString(),
            AdminNote = m.AdminNote,
            CreatedAt = m.CreatedAt
        });
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateMessageStatusRequest request)
    {
        var message = await _db.ContactMessages.FindAsync(id);
        if (message is null) 
            return NotFoundProblem("İletişim mesajı bulunamadı.");

        if (Enum.TryParse<MessageStatus>(request.Status, true, out var status))
        {
            message.Status = status;
        }
        else
        {
            return BadRequestProblem("Geçersiz durum değeri (New, InReview, Replied).");
        }

        if (request.AdminNote != null)
        {
            message.AdminNote = request.AdminNote;
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Mesaj durumu güncellendi.", id = message.Id, status = message.Status.ToString() });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var message = await _db.ContactMessages.FindAsync(id);
        if (message is null) 
            return NotFoundProblem("Silinecek mesaj bulunamadı.");

        _db.ContactMessages.Remove(message);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public class CreateContactMessageRequest
{
    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Ad Soyad alanı zorunludur.")]
    [System.ComponentModel.DataAnnotations.MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
    [System.ComponentModel.DataAnnotations.MaxLength(300)]
    public string? Email { get; set; }

    [System.ComponentModel.DataAnnotations.MaxLength(30)]
    public string? Phone { get; set; }

    [System.ComponentModel.DataAnnotations.MaxLength(300)]
    public string? Subject { get; set; }

    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Mesaj alanı zorunludur.")]
    [System.ComponentModel.DataAnnotations.MaxLength(5000)]
    public string Message { get; set; } = string.Empty;
}

public class UpdateMessageStatusRequest
{
    [System.ComponentModel.DataAnnotations.Required]
    public string Status { get; set; } = "New";
    public string? AdminNote { get; set; }
}

public class ContactMessageDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Subject { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "New";
    public string? AdminNote { get; set; }
    public DateTime CreatedAt { get; set; }
}
