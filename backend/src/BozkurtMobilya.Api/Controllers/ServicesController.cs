using BozkurtMobilya.Api.Controllers.Common;
using BozkurtMobilya.Application.Common.Interfaces;
using BozkurtMobilya.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Api.Controllers;

[Route("api/services")]
public class ServicesController : BaseApiController
{
    private readonly IApplicationDbContext _db;

    public ServicesController(IApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var services = await _db.Services
            .AsNoTracking()
            .Where(s => s.IsPublished)
            .OrderBy(s => s.SortOrder)
            .ToListAsync();

        return Ok(services);
    }
}

// ── Admin ────────────────────────────────────────────────────────────────────

[Route("api/admin/services")]
public class AdminServicesController : BaseAdminController
{
    private readonly IApplicationDbContext _db;

    public AdminServicesController(IApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var services = await _db.Services
            .AsNoTracking()
            .OrderBy(s => s.SortOrder)
            .ToListAsync();

        return Ok(services);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var service = await _db.Services.FindAsync(id);
        return service is null ? NotFoundProblem("Hizmet bulunamadı.") : Ok(service);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertServiceRequest request)
    {
        if (!ModelState.IsValid) 
            return ValidationProblem(ModelState);

        var service = new Service
        {
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            IconOrImageUrl = request.IconOrImageUrl?.Trim(),
            SortOrder = request.SortOrder,
            IsPublished = request.IsPublished
        };

        _db.Services.Add(service);
        await _db.SaveChangesAsync();

        return CreatedResponse(nameof(GetById), new { id = service.Id }, service);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertServiceRequest request)
    {
        if (!ModelState.IsValid) 
            return ValidationProblem(ModelState);

        var service = await _db.Services.FindAsync(id);
        if (service is null) 
            return NotFoundProblem("Güncellenecek hizmet bulunamadı.");

        service.Title = request.Title.Trim();
        service.Description = request.Description?.Trim();
        service.IconOrImageUrl = request.IconOrImageUrl?.Trim();
        service.SortOrder = request.SortOrder;
        service.IsPublished = request.IsPublished;

        await _db.SaveChangesAsync();
        return Ok(service);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var service = await _db.Services.FindAsync(id);
        if (service is null) 
            return NotFoundProblem("Silinecek hizmet bulunamadı.");

        _db.Services.Remove(service);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}

public class UpsertServiceRequest
{
    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Hizmet başlığı zorunludur.")]
    [System.ComponentModel.DataAnnotations.MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.MaxLength(2000)]
    public string? Description { get; set; }

    [System.ComponentModel.DataAnnotations.MaxLength(500)]
    public string? IconOrImageUrl { get; set; }

    public int SortOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
}
