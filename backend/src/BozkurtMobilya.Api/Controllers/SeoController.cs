using System.Text;
using BozkurtMobilya.Api.Controllers.Common;
using BozkurtMobilya.Application.Common.Interfaces;
using BozkurtMobilya.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Api.Controllers;

public class SeoController : BaseApiController
{
    private readonly IApplicationDbContext _db;

    public SeoController(IApplicationDbContext db) => _db = db;

    [HttpGet("robots.txt")]
    [Produces("text/plain")]
    public IActionResult GetRobots()
    {
        var sb = new StringBuilder();
        sb.AppendLine("User-agent: *");
        sb.AppendLine("Disallow: /admin/");
        sb.AppendLine("Disallow: /api/");
        sb.AppendLine("Allow: /");
        sb.AppendLine();
        sb.AppendLine($"Sitemap: {Request.Scheme}://{Request.Host}/sitemap.xml");

        return Content(sb.ToString(), "text/plain", Encoding.UTF8);
    }

    [HttpGet("sitemap.xml")]
    [Produces("application/xml")]
    public async Task<IActionResult> GetSitemap()
    {
        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var sb = new StringBuilder();
        sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        sb.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        // Statik ana sayfalar
        AddUrl(sb, $"{baseUrl}/", "1.0", "daily");
        AddUrl(sb, $"{baseUrl}/hakkimizda", "0.8", "weekly");
        AddUrl(sb, $"{baseUrl}/kurumsal", "0.8", "weekly");
        AddUrl(sb, $"{baseUrl}/urunler", "0.9", "daily");
        AddUrl(sb, $"{baseUrl}/hizmetlerimiz", "0.8", "weekly");
        AddUrl(sb, $"{baseUrl}/iletisim", "0.7", "monthly");

        // Kategoriler (yayındakiler)
        var categories = await _db.Categories
            .AsNoTracking()
            .Where(c => c.IsPublished)
            .Select(c => new { c.Slug, c.UpdatedAt })
            .ToListAsync();

        foreach (var cat in categories)
        {
            AddUrl(sb, $"{baseUrl}/urunler/{cat.Slug}", "0.8", "weekly", cat.UpdatedAt);
        }

        // Ürünler (yayındakiler)
        var products = await _db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Where(p => p.Status == ProductStatus.Published && p.Category.IsPublished)
            .Select(p => new { CategorySlug = p.Category.Slug, ProductSlug = p.Slug, p.UpdatedAt })
            .ToListAsync();

        foreach (var prod in products)
        {
            AddUrl(sb, $"{baseUrl}/urunler/{prod.CategorySlug}/{prod.ProductSlug}", "0.7", "weekly", prod.UpdatedAt);
        }

        // Statik sayfalar (DB'deki)
        var pages = await _db.PageContents
            .AsNoTracking()
            .Where(p => p.IsPublished)
            .Select(p => new { p.Slug, p.UpdatedAt })
            .ToListAsync();

        foreach (var page in pages)
        {
            AddUrl(sb, $"{baseUrl}/{page.Slug}", "0.6", "monthly", page.UpdatedAt);
        }

        sb.AppendLine("</urlset>");
        return Content(sb.ToString(), "application/xml", Encoding.UTF8);
    }

    private static void AddUrl(StringBuilder sb, string loc, string priority, string changefreq, DateTime? lastmod = null)
    {
        sb.AppendLine("  <url>");
        sb.AppendLine($"    <loc>{loc}</loc>");
        if (lastmod.HasValue)
            sb.AppendLine($"    <lastmod>{lastmod.Value:yyyy-MM-dd}</lastmod>");
        sb.AppendLine($"    <changefreq>{changefreq}</changefreq>");
        sb.AppendLine($"    <priority>{priority}</priority>");
        sb.AppendLine("  </url>");
    }
}
