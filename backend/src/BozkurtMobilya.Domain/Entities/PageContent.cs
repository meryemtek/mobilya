using BozkurtMobilya.Domain.Common;

namespace BozkurtMobilya.Domain.Entities;

/// <summary>
/// Yönetilebilir statik sayfa içerikleri (Hakkımızda, Kurumsal, vb.)
/// </summary>
public class PageContent : BaseEntity
{
    /// <summary>Örn: "hakkimizda", "kurumsal", "gizlilik-politikasi"</summary>
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public bool IsPublished { get; set; } = true;

    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
}
