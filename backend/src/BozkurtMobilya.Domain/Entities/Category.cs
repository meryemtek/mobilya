using BozkurtMobilya.Domain.Common;

namespace BozkurtMobilya.Domain.Entities;

/// <summary>
/// Ürün kategorisi. Hiyerarşik yapı (üst kategori ilişkisi ile alt kategori desteği).
/// </summary>
public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }

    /// <summary>Üst kategori ID'si; null ise kök kategoridir.</summary>
    public int? ParentCategoryId { get; set; }
    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();

    public int SortOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;

    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }

    // Navigation
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
