using BozkurtMobilya.Api.Controllers.Common;
using BozkurtMobilya.Application.Common.Interfaces;
using BozkurtMobilya.Domain.Entities;
using BozkurtMobilya.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Api.Controllers;

[Route("api/products")]
public class ProductsController : BaseApiController
{
    private readonly IApplicationDbContext _db;

    public ProductsController(IApplicationDbContext db) => _db = db;

    /// <summary>Yayındaki ürünleri sayfalı, filtrelenmiş ve sıralı döner.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        [FromQuery] string? category = null,
        [FromQuery] string? search = null,
        [FromQuery] string? sort = null,
        [FromQuery] bool? featured = null)
    {
        pageSize = Math.Clamp(pageSize, 1, 48);
        page = Math.Max(1, page);

        var query = _db.Products
            .AsNoTracking()
            .Include(p => p.Images)
            .Include(p => p.Category)
            .Where(p => p.Status == ProductStatus.Published)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(p => p.Category.Slug == category ||
                                     p.Category.ParentCategoryId != null &&
                                     p.Category.Slug == category);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(term) ||
                (p.ProductCode != null && p.ProductCode.ToLower().Contains(term)) ||
                (p.ShortDescription != null && p.ShortDescription.ToLower().Contains(term)));
        }

        if (featured.HasValue)
            query = query.Where(p => p.IsFeatured == featured.Value);

        query = sort switch
        {
            "name_asc"  => query.OrderBy(p => p.Name),
            "name_desc" => query.OrderByDescending(p => p.Name),
            "newest"    => query.OrderByDescending(p => p.CreatedAt),
            _           => query.OrderBy(p => p.SortOrder).ThenBy(p => p.Name)
        };

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductListItemDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                ProductCode = p.ProductCode,
                ShortDescription = p.ShortDescription,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                CategorySlug = p.Category.Slug,
                IsFeatured = p.IsFeatured,
                Specifications = p.Specifications,
                CoverImageUrl = p.Images.Where(i => i.IsCover).OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault()
                              ?? p.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault()
            })
            .ToListAsync();

        return PagedSuccess(items, totalCount, page, pageSize);
    }

    /// <summary>Ana sayfa vitrini (Yeni Ürünler ve En Çok Satanlar) listelerini döner.</summary>
    [HttpGet("showcase")]
    public async Task<IActionResult> GetShowcase()
    {
        var newSetting = await _db.SiteSettings.AsNoTracking().FirstOrDefaultAsync(s => s.Key == "Showcase_NewProductIds");
        var bestSetting = await _db.SiteSettings.AsNoTracking().FirstOrDefaultAsync(s => s.Key == "Showcase_BestSellerIds");

        var newIds = new List<int>();
        var bestIds = new List<int>();

        if (!string.IsNullOrWhiteSpace(newSetting?.Value))
        {
            try { newIds = System.Text.Json.JsonSerializer.Deserialize<List<int>>(newSetting.Value) ?? new List<int>(); } catch { }
        }

        if (!string.IsNullOrWhiteSpace(bestSetting?.Value))
        {
            try { bestIds = System.Text.Json.JsonSerializer.Deserialize<List<int>>(bestSetting.Value) ?? new List<int>(); } catch { }
        }

        var allIds = newIds.Concat(bestIds).Distinct().ToList();

        var productsQuery = _db.Products
            .AsNoTracking()
            .Include(p => p.Images)
            .Include(p => p.Category)
            .Where(p => p.Status == ProductStatus.Published);

        List<Product> products;
        if (allIds.Any())
        {
            products = await productsQuery.Where(p => allIds.Contains(p.Id)).ToListAsync();
        }
        else
        {
            // Eğer henüz özel seçim yapılmadıysa varsayılan yayındaki ürünleri getir
            products = await productsQuery.OrderByDescending(p => p.CreatedAt).Take(12).ToListAsync();
        }

        var productMap = products.ToDictionary(p => p.Id);

        var mapToDto = (Product p, string? badgeText, string? badgeType) => new ShowcaseProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            CategoryName = p.Category.Name,
            CategorySlug = p.Category.Slug,
            ImageUrl = p.Images.Where(i => i.IsCover).OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault()
                      ?? p.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault()
                      ?? "",
            Price = ExtractPrice(p.Specifications),
            BadgeText = badgeText,
            BadgeType = badgeType
        };

        var newProducts = new List<ShowcaseProductDto>();
        if (newIds.Any())
        {
            foreach (var id in newIds)
            {
                if (productMap.TryGetValue(id, out var p))
                    newProducts.Add(mapToDto(p, "Yeni Ürün", "teal"));
            }
        }
        else
        {
            newProducts = products.Take(6).Select(p => mapToDto(p, "Yeni Ürün", "teal")).ToList();
        }

        var bestSellers = new List<ShowcaseProductDto>();
        if (bestIds.Any())
        {
            foreach (var id in bestIds)
            {
                if (productMap.TryGetValue(id, out var p))
                    bestSellers.Add(mapToDto(p, "Çok Satan", "gold"));
            }
        }
        else
        {
            bestSellers = products.Skip(2).Take(6).Select(p => mapToDto(p, "Çok Satan", "gold")).ToList();
        }

        return Ok(new
        {
            newProducts,
            bestSellers
        });
    }

    private static string ExtractPrice(string? specsJson)
    {
        if (string.IsNullOrWhiteSpace(specsJson)) return "Fiyat Bilgisi Alınız";
        try
        {
            using var doc = System.Text.Json.JsonDocument.Parse(specsJson);
            if (doc.RootElement.TryGetProperty("Fiyat", out var priceProp))
            {
                var val = priceProp.GetString();
                if (!string.IsNullOrWhiteSpace(val)) return val;
            }
            if (doc.RootElement.TryGetProperty("Price", out var priceProp2))
            {
                var val = priceProp2.GetString();
                if (!string.IsNullOrWhiteSpace(val)) return val;
            }
        }
        catch { }
        return "Fiyat Bilgisi Alınız";
    }

    /// <summary>Slug ile ürün detayını döner (yalnızca yayındakiler).</summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var product = await _db.Products
            .AsNoTracking()
            .Include(p => p.Images.OrderBy(i => i.SortOrder))
            .Include(p => p.Category)
            .Where(p => p.Slug == slug && p.Status == ProductStatus.Published)
            .Select(p => new ProductDetailDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                ProductCode = p.ProductCode,
                ShortDescription = p.ShortDescription,
                Description = p.Description,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                CategorySlug = p.Category.Slug,
                Specifications = p.Specifications,
                Dimensions = p.Dimensions,
                Materials = p.Materials,
                ColorOptions = p.ColorOptions,
                TechnicalDetails = p.TechnicalDetails,
                IsFeatured = p.IsFeatured,
                MetaTitle = p.MetaTitle,
                MetaDescription = p.MetaDescription,
                Images = p.Images.Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    Url = i.Url,
                    AltText = i.AltText,
                    IsCover = i.IsCover,
                    SortOrder = i.SortOrder
                }).ToList()
            })
            .FirstOrDefaultAsync();

        return product is null ? NotFoundProblem("Ürün bulunamadı.") : Ok(product);
    }
}

// ── Admin ────────────────────────────────────────────────────────────────────

[Route("api/admin/products")]
public class AdminProductsController : BaseAdminController
{
    private readonly IApplicationDbContext _db;
    private readonly ILogger<AdminProductsController> _logger;

    public AdminProductsController(IApplicationDbContext db, ILogger<AdminProductsController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] string? search = null,
        [FromQuery] ProductStatus? status = null,
        [FromQuery] int? categoryId = null)
    {
        pageSize = Math.Clamp(pageSize, 1, 100);
        page = Math.Max(1, page);

        var query = _db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(term) ||
                                     (p.ProductCode != null && p.ProductCode.ToLower().Contains(term)));
        }

        if (status.HasValue)
            query = query.Where(p => p.Status == status.Value);

        if (categoryId.HasValue && categoryId.Value > 0)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(p => p.UpdatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductListItemDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                ProductCode = p.ProductCode,
                ShortDescription = p.ShortDescription,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                CategorySlug = p.Category.Slug,
                IsFeatured = p.IsFeatured,
                Status = p.Status.ToString(),
                Specifications = p.Specifications,
                CoverImageUrl = p.Images.Where(i => i.IsCover).OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault()
                              ?? p.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault()
            })
            .ToListAsync();

        return PagedSuccess(items, totalCount, page, pageSize);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _db.Products
            .Include(p => p.Images.OrderBy(i => i.SortOrder))
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null) 
            return NotFoundProblem("Ürün bulunamadı.");

        return Ok(new ProductDetailDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            ProductCode = product.ProductCode,
            ShortDescription = product.ShortDescription,
            Description = product.Description,
            CategoryId = product.CategoryId,
            CategoryName = product.Category.Name,
            CategorySlug = product.Category.Slug,
            Specifications = product.Specifications,
            Dimensions = product.Dimensions,
            Materials = product.Materials,
            ColorOptions = product.ColorOptions,
            TechnicalDetails = product.TechnicalDetails,
            IsFeatured = product.IsFeatured,
            Status = product.Status.ToString(),
            SortOrder = product.SortOrder,
            MetaTitle = product.MetaTitle,
            MetaDescription = product.MetaDescription,
            Images = product.Images.Select(i => new ProductImageDto
            {
                Id = i.Id, Url = i.Url, AltText = i.AltText,
                IsCover = i.IsCover, SortOrder = i.SortOrder
            }).ToList()
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertProductRequest request)
    {
        if (!ModelState.IsValid) 
            return ValidationProblem(ModelState);

        if (await _db.Products.AnyAsync(p => p.Slug == request.Slug))
            return ConflictProblem("Bu URL (slug) zaten başka bir üründe kullanımda.");

        if (!string.IsNullOrEmpty(request.ProductCode) &&
            await _db.Products.AnyAsync(p => p.ProductCode == request.ProductCode))
            return ConflictProblem("Bu ürün kodu zaten kayıtlı.");

        if (!await _db.Categories.AnyAsync(c => c.Id == request.CategoryId))
            return BadRequestProblem("Belirtilen kategori bulunamadı.");

        var product = new Product
        {
            Name = request.Name.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            ProductCode = request.ProductCode?.Trim(),
            ShortDescription = request.ShortDescription?.Trim(),
            Description = request.Description?.Trim(),
            CategoryId = request.CategoryId,
            Specifications = request.Specifications,
            Dimensions = request.Dimensions,
            Materials = request.Materials?.Trim(),
            ColorOptions = request.ColorOptions?.Trim(),
            TechnicalDetails = request.TechnicalDetails?.Trim(),
            IsFeatured = request.IsFeatured,
            Status = Enum.TryParse<ProductStatus>(request.Status, true, out var s) ? s : ProductStatus.Draft,
            SortOrder = request.SortOrder,
            MetaTitle = request.MetaTitle?.Trim(),
            MetaDescription = request.MetaDescription?.Trim()
        };

        if (!string.IsNullOrWhiteSpace(request.CoverImageUrl))
        {
            product.Images.Add(new ProductImage
            {
                Url = request.CoverImageUrl.Trim(),
                AltText = product.Name,
                IsCover = true,
                SortOrder = 0
            });
        }

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Yeni ürün oluşturuldu: {Name} ({Id})", product.Name, product.Id);
        return CreatedResponse(nameof(GetById), new { id = product.Id }, new { product.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertProductRequest request)
    {
        if (!ModelState.IsValid) 
            return ValidationProblem(ModelState);

        var product = await _db.Products.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) 
            return NotFoundProblem("Güncellenecek ürün bulunamadı.");

        if (await _db.Products.AnyAsync(p => p.Slug == request.Slug && p.Id != id))
            return ConflictProblem("Bu URL (slug) zaten başka bir üründe kullanımda.");

        if (!string.IsNullOrEmpty(request.ProductCode) &&
            await _db.Products.AnyAsync(p => p.ProductCode == request.ProductCode && p.Id != id))
            return ConflictProblem("Bu ürün kodu zaten başka bir üründe kayıtlı.");

        if (!await _db.Categories.AnyAsync(c => c.Id == request.CategoryId))
            return BadRequestProblem("Belirtilen kategori bulunamadı.");

        product.Name = request.Name.Trim();
        product.Slug = request.Slug.Trim().ToLowerInvariant();
        product.ProductCode = request.ProductCode?.Trim();
        product.ShortDescription = request.ShortDescription?.Trim();
        product.Description = request.Description?.Trim();
        product.CategoryId = request.CategoryId;
        product.Specifications = request.Specifications;
        product.Dimensions = request.Dimensions;
        product.Materials = request.Materials?.Trim();
        product.ColorOptions = request.ColorOptions?.Trim();
        product.TechnicalDetails = request.TechnicalDetails?.Trim();
        product.IsFeatured = request.IsFeatured;
        product.Status = Enum.TryParse<ProductStatus>(request.Status, true, out var s) ? s : ProductStatus.Draft;
        product.SortOrder = request.SortOrder;
        product.MetaTitle = request.MetaTitle?.Trim();
        product.MetaDescription = request.MetaDescription?.Trim();

        if (!string.IsNullOrWhiteSpace(request.CoverImageUrl))
        {
            var existingCover = product.Images.FirstOrDefault(i => i.IsCover);
            if (existingCover != null)
            {
                existingCover.Url = request.CoverImageUrl.Trim();
            }
            else
            {
                product.Images.Add(new ProductImage
                {
                    Url = request.CoverImageUrl.Trim(),
                    AltText = product.Name,
                    IsCover = true,
                    SortOrder = 0
                });
            }
        }

        await _db.SaveChangesAsync();
        return Ok(new { product.Id, message = "Ürün başarıyla güncellendi." });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) 
            return NotFoundProblem("Silinecek ürün bulunamadı.");

        // Soft-delete
        product.Status = ProductStatus.Archived;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}/permanent")]
    public async Task<IActionResult> DeletePermanent(int id)
    {
        var product = await _db.Products.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) 
            return NotFoundProblem("Silinecek ürün bulunamadı.");

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>Admin için vitrin (Yeni Ürünler & En Çok Satanlar) seçimlerini döner.</summary>
    [HttpGet("showcase-settings")]
    public async Task<IActionResult> GetShowcaseSettings()
    {
        var newSetting = await _db.SiteSettings.AsNoTracking().FirstOrDefaultAsync(s => s.Key == "Showcase_NewProductIds");
        var bestSetting = await _db.SiteSettings.AsNoTracking().FirstOrDefaultAsync(s => s.Key == "Showcase_BestSellerIds");

        var newIds = new List<int>();
        var bestIds = new List<int>();

        if (!string.IsNullOrWhiteSpace(newSetting?.Value))
        {
            try { newIds = System.Text.Json.JsonSerializer.Deserialize<List<int>>(newSetting.Value) ?? new List<int>(); } catch { }
        }

        if (!string.IsNullOrWhiteSpace(bestSetting?.Value))
        {
            try { bestIds = System.Text.Json.JsonSerializer.Deserialize<List<int>>(bestSetting.Value) ?? new List<int>(); } catch { }
        }

        return Ok(new
        {
            newProductIds = newIds,
            bestSellerIds = bestIds
        });
    }

    /// <summary>Admin için vitrin seçimlerini veritabanına kaydeder.</summary>
    [HttpPut("showcase-settings")]
    public async Task<IActionResult> UpdateShowcaseSettings([FromBody] UpdateShowcaseSettingsRequest request)
    {
        var newSetting = await _db.SiteSettings.FirstOrDefaultAsync(s => s.Key == "Showcase_NewProductIds");
        if (newSetting == null)
        {
            newSetting = new SiteSetting { Key = "Showcase_NewProductIds", Group = "Showcase" };
            _db.SiteSettings.Add(newSetting);
        }
        newSetting.Value = System.Text.Json.JsonSerializer.Serialize(request.NewProductIds ?? new List<int>());

        var bestSetting = await _db.SiteSettings.FirstOrDefaultAsync(s => s.Key == "Showcase_BestSellerIds");
        if (bestSetting == null)
        {
            bestSetting = new SiteSetting { Key = "Showcase_BestSellerIds", Group = "Showcase" };
            _db.SiteSettings.Add(bestSetting);
        }
        bestSetting.Value = System.Text.Json.JsonSerializer.Serialize(request.BestSellerIds ?? new List<int>());

        await _db.SaveChangesAsync();
        return Ok(new { message = "Vitrin ürünleri başarıyla güncellendi." });
    }
}

public class UpdateShowcaseSettingsRequest
{
    public List<int> NewProductIds { get; set; } = new();
    public List<int> BestSellerIds { get; set; } = new();
}

public class ShowcaseProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public string? OldPrice { get; set; }
    public string? BadgeText { get; set; }
    public string? BadgeType { get; set; }
    public bool HasCompare { get; set; } = true;
}

public class ProductListItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? ProductCode { get; set; }
    public string? ShortDescription { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? Status { get; set; }
    public string? Specifications { get; set; }
}

public class ProductDetailDto : ProductListItemDto
{
    public string? Description { get; set; }
    public string? Dimensions { get; set; }
    public string? Materials { get; set; }
    public string? ColorOptions { get; set; }
    public string? TechnicalDetails { get; set; }
    public int SortOrder { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public List<ProductImageDto> Images { get; set; } = new();
}

public class ProductImageDto
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsCover { get; set; }
    public int SortOrder { get; set; }
}

public class UpsertProductRequest
{
    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Ürün adı zorunludur.")]
    [System.ComponentModel.DataAnnotations.MaxLength(300)]
    public string Name { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Slug zorunludur.")]
    [System.ComponentModel.DataAnnotations.MaxLength(350)]
    public string Slug { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.MaxLength(100)]
    public string? ProductCode { get; set; }

    [System.ComponentModel.DataAnnotations.MaxLength(500)]
    public string? ShortDescription { get; set; }
    public string? Description { get; set; }

    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Kategori seçimi zorunludur.")]
    [System.ComponentModel.DataAnnotations.Range(1, int.MaxValue, ErrorMessage = "Geçerli bir kategori seçiniz.")]
    public int CategoryId { get; set; }

    public string? Specifications { get; set; }
    public string? Dimensions { get; set; }
    public string? Materials { get; set; }
    public string? ColorOptions { get; set; }
    public string? TechnicalDetails { get; set; }
    public bool IsFeatured { get; set; }
    public string? Status { get; set; } = "Draft";
    public int SortOrder { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? CoverImageUrl { get; set; }
}
