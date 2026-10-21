using System.ComponentModel.DataAnnotations;
using BozkurtMobilya.Api.Controllers.Common;
using BozkurtMobilya.Application.Common.Interfaces;
using BozkurtMobilya.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Api.Controllers;

[Route("api/stores")]
public class StoresController : BaseApiController
{
    private readonly IApplicationDbContext _db;

    public StoresController(IApplicationDbContext db) => _db = db;

    /// <summary>Yayındaki tüm mağazaları sıralı döner.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var stores = await _db.Stores
            .AsNoTracking()
            .Where(s => s.IsPublished)
            .OrderBy(s => s.SortOrder)
            .ThenBy(s => s.Name)
            .ToListAsync();

        return Ok(stores);
    }
}

// ── Admin ────────────────────────────────────────────────────────────────────

[Route("api/admin/stores")]
public class AdminStoresController : BaseAdminController
{
    private readonly IApplicationDbContext _db;

    public AdminStoresController(IApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var stores = await _db.Stores
            .AsNoTracking()
            .OrderBy(s => s.SortOrder)
            .ThenBy(s => s.Name)
            .ToListAsync();

        return Ok(stores);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var store = await _db.Stores.FindAsync(id);
        return store is null ? NotFoundProblem("Mağaza bulunamadı.") : Ok(store);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertStoreRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var store = new Store();
        ApplyRequest(store, request);

        _db.Stores.Add(store);
        await _db.SaveChangesAsync();

        return CreatedResponse(nameof(GetById), new { id = store.Id }, store);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertStoreRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var store = await _db.Stores.FindAsync(id);
        if (store is null)
            return NotFoundProblem("Güncellenecek mağaza bulunamadı.");

        ApplyRequest(store, request);
        store.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(store);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var store = await _db.Stores.FindAsync(id);
        if (store is null)
            return NotFoundProblem("Silinecek mağaza bulunamadı.");

        _db.Stores.Remove(store);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static void ApplyRequest(Store store, UpsertStoreRequest request)
    {
        store.Name = request.Name.Trim();
        store.Address = request.Address.Trim();
        store.Phone = Trim(request.Phone);
        store.WhatsApp = Trim(request.WhatsApp);
        store.Email = Trim(request.Email);
        store.WorkingHours = Trim(request.WorkingHours);
        store.MapEmbedUrl = Trim(request.MapEmbedUrl);
        store.SortOrder = request.SortOrder;
        store.IsPublished = request.IsPublished;
    }

    private static string? Trim(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}

public class UpsertStoreRequest
{
    [Required(ErrorMessage = "Mağaza adı zorunludur.")]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mağaza adresi zorunludur.")]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Phone { get; set; }

    [MaxLength(50)]
    public string? WhatsApp { get; set; }

    [MaxLength(200)]
    [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi girin.")]
    public string? Email { get; set; }

    [MaxLength(200)]
    public string? WorkingHours { get; set; }

    [MaxLength(2000)]
    public string? MapEmbedUrl { get; set; }

    public int SortOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
}
