using BozkurtMobilya.Api.Controllers.Common;
using BozkurtMobilya.Application.Common.Interfaces;
using BozkurtMobilya.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Api.Controllers;

[Route("api/pages")]
public class PagesController : BaseApiController
{
    private readonly IApplicationDbContext _db;

    public PagesController(IApplicationDbContext db) => _db = db;

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var page = await _db.PageContents
            .AsNoTracking()
            .Where(p => p.Slug == slug && p.IsPublished)
            .FirstOrDefaultAsync();

        return page is null ? NotFoundProblem("Sayfa içeriği bulunamadı.") : Ok(page);
    }
}

// ── Admin ────────────────────────────────────────────────────────────────────

[Route("api/admin/pages")]
public class AdminPagesController : BaseAdminController
{
    private readonly IApplicationDbContext _db;

    public AdminPagesController(IApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var pages = await _db.PageContents
            .AsNoTracking()
            .OrderBy(p => p.Title)
            .ToListAsync();

        return Ok(pages);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var page = await _db.PageContents.FindAsync(id);
        return page is null ? NotFoundProblem("Sayfa içeriği bulunamadı.") : Ok(page);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertPageRequest request)
    {
        if (!ModelState.IsValid) 
            return ValidationProblem(ModelState);

        if (await _db.PageContents.AnyAsync(p => p.Slug == request.Slug))
            return ConflictProblem("Bu URL (slug) zaten kullanımda.");

        var page = new PageContent
        {
            Slug = request.Slug.Trim().ToLowerInvariant(),
            Title = request.Title.Trim(),
            Content = request.Content,
            IsPublished = request.IsPublished,
            MetaTitle = request.MetaTitle?.Trim(),
            MetaDescription = request.MetaDescription?.Trim()
        };

        _db.PageContents.Add(page);
        await _db.SaveChangesAsync();

        return CreatedResponse(nameof(GetById), new { id = page.Id }, page);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertPageRequest request)
    {
        if (!ModelState.IsValid) 
            return ValidationProblem(ModelState);

        var page = await _db.PageContents.FindAsync(id);
        if (page is null) 
            return NotFoundProblem("Güncellenecek sayfa bulunamadı.");

        if (await _db.PageContents.AnyAsync(p => p.Slug == request.Slug && p.Id != id))
            return ConflictProblem("Bu URL (slug) zaten başka bir sayfada kullanımda.");

        page.Slug = request.Slug.Trim().ToLowerInvariant();
        page.Title = request.Title.Trim();
        page.Content = request.Content;
        page.IsPublished = request.IsPublished;
        page.MetaTitle = request.MetaTitle?.Trim();
        page.MetaDescription = request.MetaDescription?.Trim();

        await _db.SaveChangesAsync();
        return Ok(page);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var page = await _db.PageContents.FindAsync(id);
        if (page is null) 
            return NotFoundProblem("Silinecek sayfa bulunamadı.");

        _db.PageContents.Remove(page);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}

public class UpsertPageRequest
{
    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Sayfa URL'si (slug) zorunludur.")]
    [System.ComponentModel.DataAnnotations.MaxLength(250)]
    public string Slug { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Sayfa başlığı zorunludur.")]
    [System.ComponentModel.DataAnnotations.MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    public string? Content { get; set; }
    public bool IsPublished { get; set; } = true;
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
}
