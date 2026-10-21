using BozkurtMobilya.Api.Controllers.Common;
using BozkurtMobilya.Application.Common.Interfaces;
using BozkurtMobilya.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Api.Controllers;

[Route("api/site-settings")]
public class SiteSettingsController : BaseApiController
{
    private readonly IApplicationDbContext _db;

    public SiteSettingsController(IApplicationDbContext db) => _db = db;

    /// <summary>Site genelinde herkese açık iletişim ve sosyal medya ayarlarını döner.</summary>
    [HttpGet("public")]
    public async Task<IActionResult> GetPublicSettings()
    {
        var settings = await _db.SiteSettings
            .AsNoTracking()
            .ToDictionaryAsync(s => s.Key, s => s.Value ?? string.Empty);

        return Ok(settings);
    }
}

// ── Admin ────────────────────────────────────────────────────────────────────

[Route("api/admin/site-settings")]
public class AdminSiteSettingsController : BaseAdminController
{
    private readonly IApplicationDbContext _db;
    private readonly ILogger<AdminSiteSettingsController> _logger;

    public AdminSiteSettingsController(IApplicationDbContext db, ILogger<AdminSiteSettingsController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var settings = await _db.SiteSettings
            .AsNoTracking()
            .OrderBy(s => s.Group)
            .ThenBy(s => s.Key)
            .ToListAsync();

        return Ok(settings);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateSettings([FromBody] Dictionary<string, string?> newSettings)
    {
        if (newSettings == null || !newSettings.Any())
            return BadRequestProblem("Güncellenecek ayar verisi bulunamadı.");

        foreach (var (key, value) in newSettings)
        {
            var setting = await _db.SiteSettings.FirstOrDefaultAsync(s => s.Key == key);
            if (setting != null)
            {
                setting.Value = value;
            }
            else
            {
                _db.SiteSettings.Add(new SiteSetting
                {
                    Key = key,
                    Value = value,
                    Group = "General"
                });
            }
        }

        await _db.SaveChangesAsync();
        _logger.LogInformation("Site ayarları güncellendi.");

        return Ok(new { message = "Ayarlar başarıyla güncellendi." });
    }
}
