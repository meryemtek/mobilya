using BozkurtMobilya.Domain.Common;

namespace BozkurtMobilya.Domain.Entities;

public class ProductImage : BaseEntity
{
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsCover { get; set; } = false;
    public int SortOrder { get; set; } = 0;
}
