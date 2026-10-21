using BozkurtMobilya.Api.Controllers.Common;
using BozkurtMobilya.Application.Common.Interfaces;
using BozkurtMobilya.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Api.Controllers;

[Route("api/categories")]
public class CategoriesController : BaseApiController
{
    private readonly IApplicationDbContext _db;

    public CategoriesController(IApplicationDbContext db) => _db = db;

    /// <summary>Yayındaki tüm kategorileri döner.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.Categories
            .AsNoTracking()
            .Where(c => c.IsPublished)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                ImageAlt = c.ImageAlt,
                ParentCategoryId = c.ParentCategoryId,
                SortOrder = c.SortOrder,
                MetaTitle = c.MetaTitle,
                MetaDescription = c.MetaDescription
            })
            .ToListAsync();

        return Ok(categories);
    }

    /// <summary>Slug ile tek kategori getirir.</summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var category = await _db.Categories
            .AsNoTracking()
            .Where(c => c.Slug == slug && c.IsPublished)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                ImageAlt = c.ImageAlt,
                ParentCategoryId = c.ParentCategoryId,
                SortOrder = c.SortOrder,
                MetaTitle = c.MetaTitle,
                MetaDescription = c.MetaDescription
            })
            .FirstOrDefaultAsync();

        return category is null ? NotFoundProblem("Kategori bulunamadı.") : Ok(category);
    }
}

// ── Admin ────────────────────────────────────────────────────────────────────

[Route("api/admin/categories")]
public class AdminCategoriesController : BaseAdminController
{
    private readonly IApplicationDbContext _db;
    private readonly ILogger<AdminCategoriesController> _logger;

    public AdminCategoriesController(IApplicationDbContext db, ILogger<AdminCategoriesController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.Categories
            .AsNoTracking()
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                ImageAlt = c.ImageAlt,
                ParentCategoryId = c.ParentCategoryId,
                SortOrder = c.SortOrder,
                IsPublished = c.IsPublished,
                MetaTitle = c.MetaTitle,
                MetaDescription = c.MetaDescription
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var c = await _db.Categories.FindAsync(id);
        return c is null ? NotFoundProblem("Kategori bulunamadı.") : Ok(MapToDto(c));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertCategoryRequest request)
    {
        if (!ModelState.IsValid) 
            return ValidationProblem(ModelState);

        if (await _db.Categories.AnyAsync(c => c.Slug == request.Slug))
            return ConflictProblem("Bu URL (slug) zaten başka bir kategoride kullanımda.");

        var category = new Category
        {
            Name = request.Name.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            Description = request.Description?.Trim(),
            ImageUrl = request.ImageUrl?.Trim(),
            ImageAlt = request.ImageAlt?.Trim(),
            ParentCategoryId = request.ParentCategoryId,
            SortOrder = request.SortOrder,
            IsPublished = request.IsPublished,
            MetaTitle = request.MetaTitle?.Trim(),
            MetaDescription = request.MetaDescription?.Trim()
        };

        _db.Categories.Add(category);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Yeni kategori oluşturuldu: {Name} ({Id})", category.Name, category.Id);
        return CreatedResponse(nameof(GetById), new { id = category.Id }, MapToDto(category));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertCategoryRequest request)
    {
        if (!ModelState.IsValid) 
            return ValidationProblem(ModelState);

        var category = await _db.Categories.FindAsync(id);
        if (category is null) 
            return NotFoundProblem("Güncellenecek kategori bulunamadı.");

        if (await _db.Categories.AnyAsync(c => c.Slug == request.Slug && c.Id != id))
            return ConflictProblem("Bu URL (slug) zaten başka bir kategoride kullanımda.");

        category.Name = request.Name.Trim();
        category.Slug = request.Slug.Trim().ToLowerInvariant();
        category.Description = request.Description?.Trim();
        category.ImageUrl = request.ImageUrl?.Trim();
        category.ImageAlt = request.ImageAlt?.Trim();
        category.ParentCategoryId = request.ParentCategoryId;
        category.SortOrder = request.SortOrder;
        category.IsPublished = request.IsPublished;
        category.MetaTitle = request.MetaTitle?.Trim();
        category.MetaDescription = request.MetaDescription?.Trim();

        await _db.SaveChangesAsync();
        return Ok(MapToDto(category));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _db.Categories
            .Include(c => c.Products)
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category is null) 
            return NotFoundProblem("Silinecek kategori bulunamadı.");

        if (category.Products.Any())
            return ConflictProblem($"Bu kategoriye bağlı {category.Products.Count} ürün bulunmaktadır. Önce ürünleri başka bir kategoriye taşıyınız veya siliniz.");

        if (category.SubCategories.Any())
            return ConflictProblem("Bu kategorinin alt kategorileri bulunmaktadır. Önce alt kategorileri siliniz.");

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static CategoryDto MapToDto(Category c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Slug = c.Slug,
        Description = c.Description,
        ImageUrl = c.ImageUrl,
        ImageAlt = c.ImageAlt,
        ParentCategoryId = c.ParentCategoryId,
        SortOrder = c.SortOrder,
        IsPublished = c.IsPublished,
        MetaTitle = c.MetaTitle,
        MetaDescription = c.MetaDescription
    };
}

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }
    public int? ParentCategoryId { get; set; }
    public int SortOrder { get; set; }
    public bool? IsPublished { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
}

public class UpsertCategoryRequest
{
    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Kategori adı zorunludur.")]
    [System.ComponentModel.DataAnnotations.MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Slug zorunludur.")]
    [System.ComponentModel.DataAnnotations.MaxLength(250)]
    public string Slug { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.MaxLength(2000)]
    public string? Description { get; set; }

    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }
    public int? ParentCategoryId { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
}
