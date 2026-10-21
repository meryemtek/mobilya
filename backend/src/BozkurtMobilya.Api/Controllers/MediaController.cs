using BozkurtMobilya.Api.Controllers.Common;
using BozkurtMobilya.Application.Common.Interfaces;
using BozkurtMobilya.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Api.Controllers;

[Route("api/admin/media")]
public class MediaController : BaseAdminController
{
    private readonly IWebHostEnvironment _env;
    private readonly IApplicationDbContext _db;
    private readonly ILogger<MediaController> _logger;

    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

    public MediaController(IWebHostEnvironment env, IApplicationDbContext db, ILogger<MediaController> logger)
    {
        _env = env;
        _db = db;
        _logger = logger;
    }

    /// <summary>Görsel dosyası yükler (JPG, PNG, WebP — maks 5MB).</summary>
    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequestProblem("Lütfen geçerli bir dosya seçiniz.");

        if (file.Length > MaxFileSize)
            return BadRequestProblem("Dosya boyutu 5 MB'dan büyük olamaz.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequestProblem("Yalnızca JPG, PNG veya WebP formatında görsel yükleyebilirsiniz.");

        var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = $"{Guid.NewGuid():N}{ext}";
        var physicalPath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(physicalPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var relativeUrl = $"/uploads/{uniqueFileName}";
        _logger.LogInformation("Yeni medya dosyası yüklendi: {Url}", relativeUrl);

        return Ok(new { url = relativeUrl, fileName = uniqueFileName, size = file.Length });
    }

    /// <summary>Yüklenmiş tüm medya dosyalarını ve sistemdeki görselleri listeler.</summary>
    [HttpGet("files")]
    public async Task<IActionResult> GetFiles()
    {
        var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
        var fileList = new List<MediaFileItemDto>();

        if (Directory.Exists(uploadsFolder))
        {
            var files = new DirectoryInfo(uploadsFolder).GetFiles()
                .OrderByDescending(f => f.LastWriteTimeUtc);

            foreach (var file in files)
            {
                var ext = file.Extension.ToLowerInvariant();
                if (AllowedExtensions.Contains(ext))
                {
                    fileList.Add(new MediaFileItemDto
                    {
                        FileName = file.Name,
                        Url = $"/uploads/{file.Name}",
                        Size = file.Length,
                        CreatedAt = file.LastWriteTimeUtc,
                        Source = "Yüklenen Dosya"
                    });
                }
            }
        }

        // Ayrıca ürünlerde kullanılan harici görselleri de listeleyelim
        var productImages = await _db.ProductImages
            .AsNoTracking()
            .Select(pi => new { pi.Url, pi.AltText, pi.CreatedAt })
            .ToListAsync();

        var existingUrls = fileList.Select(f => f.Url).ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var pi in productImages)
        {
            if (!string.IsNullOrWhiteSpace(pi.Url) && !existingUrls.Contains(pi.Url))
            {
                existingUrls.Add(pi.Url);
                fileList.Add(new MediaFileItemDto
                {
                    FileName = !string.IsNullOrWhiteSpace(pi.AltText) ? pi.AltText : "Ürün Görseli",
                    Url = pi.Url,
                    Size = 0,
                    CreatedAt = pi.CreatedAt,
                    Source = "Ürün Kataloğu"
                });
            }
        }

        return Ok(fileList);
    }

    /// <summary>Yüklenmiş bir medya dosyasını sunucudan siler.</summary>
    [HttpDelete("files/{fileName}")]
    public IActionResult DeleteFile(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName) || fileName.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
            return BadRequestProblem("Geçersiz dosya adı.");

        var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
        var physicalPath = Path.Combine(uploadsFolder, fileName);

        if (!System.IO.File.Exists(physicalPath))
            return NotFoundProblem("Dosya bulunamadı.");

        try
        {
            System.IO.File.Delete(physicalPath);
            _logger.LogInformation("Medya dosyası silindi: {FileName}", fileName);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Medya dosyası silinirken hata oluştu: {FileName}", fileName);
            return StatusCode(500, "Dosya silinirken bir sunucu hatası oluştu.");
        }
    }

    /// <summary>Bir ürüne yeni görsel ekler.</summary>
    [HttpPost("products/{productId:int}/images")]
    public async Task<IActionResult> AddProductImage(int productId, [FromBody] AddProductImageRequest request)
    {
        var product = await _db.Products.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == productId);
        if (product == null) 
            return NotFoundProblem("Ürün bulunamadı.");

        if (request.IsCover)
        {
            foreach (var img in product.Images)
            {
                img.IsCover = false;
            }
        }

        var newImage = new ProductImage
        {
            ProductId = productId,
            Url = request.Url,
            AltText = request.AltText,
            IsCover = request.IsCover,
            SortOrder = request.SortOrder
        };

        _db.ProductImages.Add(newImage);
        await _db.SaveChangesAsync();

        return Ok(newImage);
    }

    /// <summary>Ürün görselini siler.</summary>
    [HttpDelete("product-images/{imageId:int}")]
    public async Task<IActionResult> DeleteProductImage(int imageId)
    {
        var image = await _db.ProductImages.FindAsync(imageId);
        if (image == null) 
            return NotFoundProblem("Görsel bulunamadı.");

        _db.ProductImages.Remove(image);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}

public class MediaFileItemDto
{
    public string FileName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public long Size { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Source { get; set; } = "Yüklenen Dosya";
}

public class AddProductImageRequest
{
    [System.ComponentModel.DataAnnotations.Required]
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsCover { get; set; }
    public int SortOrder { get; set; } = 0;
}
