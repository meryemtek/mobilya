using BozkurtMobilya.Domain.Common;
using BozkurtMobilya.Domain.Enums;

namespace BozkurtMobilya.Domain.Entities;

/// <summary>
/// Mobilya ürünü. Dinamik özellikler JSONB olarak saklanır.
/// </summary>
public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? ProductCode { get; set; }
    public string? ShortDescription { get; set; }
    public string? Description { get; set; }

    // Kategori
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    // Dinamik özellikler (JSON kolonları)
    /// <summary>{"key": "value"} biçiminde özellik çiftleri</summary>
    public string? Specifications { get; set; }
    /// <summary>{"width": 120, "height": 75, "depth": 60, "unit": "cm"}</summary>
    public string? Dimensions { get; set; }
    public string? Materials { get; set; }
    public string? ColorOptions { get; set; }
    public string? TechnicalDetails { get; set; }

    public bool IsFeatured { get; set; } = false;
    public ProductStatus Status { get; set; } = ProductStatus.Draft;
    public int SortOrder { get; set; } = 0;

    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }

    // Navigation
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
}
