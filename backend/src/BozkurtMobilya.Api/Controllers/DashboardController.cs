using BozkurtMobilya.Api.Controllers.Common;
using BozkurtMobilya.Application.Common.Interfaces;
using BozkurtMobilya.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Api.Controllers;

[Route("api/admin/dashboard")]
public class DashboardController : BaseAdminController
{
    private readonly IApplicationDbContext _db;

    public DashboardController(IApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetStats()
    {
        var totalProducts = await _db.Products.CountAsync();
        var publishedProducts = await _db.Products.CountAsync(p => p.Status == ProductStatus.Published);
        var totalCategories = await _db.Categories.CountAsync();
        var totalMessages = await _db.ContactMessages.CountAsync();
        var newMessages = await _db.ContactMessages.CountAsync(m => m.Status == MessageStatus.New);
        var totalBanners = await _db.Banners.CountAsync();
        var totalServices = await _db.Services.CountAsync();

        var recentMessages = await _db.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .Take(5)
            .Select(m => new
            {
                m.Id,
                m.FullName,
                m.Email,
                m.Subject,
                Status = m.Status.ToString(),
                m.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            TotalProducts = totalProducts,
            PublishedProducts = publishedProducts,
            TotalCategories = totalCategories,
            TotalMessages = totalMessages,
            NewMessages = newMessages,
            TotalBanners = totalBanners,
            TotalServices = totalServices,
            RecentMessages = recentMessages
        });
    }
}
