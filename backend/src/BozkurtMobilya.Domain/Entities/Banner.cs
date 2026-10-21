using BozkurtMobilya.Domain.Common;

namespace BozkurtMobilya.Domain.Entities;

public class Banner : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? ButtonText { get; set; }
    public string? ButtonLink { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? ImageAlt { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
}
