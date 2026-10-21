using BozkurtMobilya.Api.Controllers.Common;
using BozkurtMobilya.Application.Common.Interfaces;
using BozkurtMobilya.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Api.Controllers;

[Route("api/banners")]
public class BannersController : BaseApiController
{
    private readonly IApplicationDbContext _db;

    public BannersController(IApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var banners = await _db.Banners
            .AsNoTracking()
            .Where(b => b.IsPublished)
            .OrderBy(b => b.SortOrder)
            .ToListAsync();

        return Ok(banners);
    }
}

// ── Admin ────────────────────────────────────────────────────────────────────

[Route("api/admin/banners")]
public class AdminBannersController : BaseAdminController
{
    private readonly IApplicationDbContext _db;

    public AdminBannersController(IApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var banners = await _db.Banners
            .AsNoTracking()
            .OrderBy(b => b.SortOrder)
            .ToListAsync();

        return Ok(banners);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var banner = await _db.Banners.FindAsync(id);
        return banner is null ? NotFoundProblem("Banner bulunamadı.") : Ok(banner);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertBannerRequest request)
    {
        if (!ModelState.IsValid) 
            return ValidationProblem(ModelState);

        var banner = new Banner
        {
            Title = request.Title.Trim(),
            Subtitle = request.Subtitle?.Trim(),
            ButtonText = request.ButtonText?.Trim(),
            ButtonLink = request.ButtonLink?.Trim(),
            ImageUrl = request.ImageUrl.Trim(),
            ImageAlt = request.ImageAlt?.Trim(),
            SortOrder = request.SortOrder,
            IsPublished = request.IsPublished
        };

        _db.Banners.Add(banner);
        await _db.SaveChangesAsync();

        return CreatedResponse(nameof(GetById), new { id = banner.Id }, banner);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertBannerRequest request)
    {
        if (!ModelState.IsValid) 
            return ValidationProblem(ModelState);

        var banner = await _db.Banners.FindAsync(id);
        if (banner is null) 
            return NotFoundProblem("Güncellenecek banner bulunamadı.");

        banner.Title = request.Title.Trim();
        banner.Subtitle = request.Subtitle?.Trim();
        banner.ButtonText = request.ButtonText?.Trim();
        banner.ButtonLink = request.ButtonLink?.Trim();
        banner.ImageUrl = request.ImageUrl.Trim();
        banner.ImageAlt = request.ImageAlt?.Trim();
        banner.SortOrder = request.SortOrder;
        banner.IsPublished = request.IsPublished;

        await _db.SaveChangesAsync();
        return Ok(banner);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var banner = await _db.Banners.FindAsync(id);
        if (banner is null) 
            return NotFoundProblem("Silinecek banner bulunamadı.");

        _db.Banners.Remove(banner);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}

public class UpsertBannerRequest
{
    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Banner başlığı zorunludur.")]
    [System.ComponentModel.DataAnnotations.MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.MaxLength(300)]
    public string? Subtitle { get; set; }

    [System.ComponentModel.DataAnnotations.MaxLength(100)]
    public string? ButtonText { get; set; }

    [System.ComponentModel.DataAnnotations.MaxLength(300)]
    public string? ButtonLink { get; set; }

    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Görsel URL'si zorunludur.")]
    [System.ComponentModel.DataAnnotations.MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.MaxLength(200)]
    public string? ImageAlt { get; set; }

    public int SortOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
}
