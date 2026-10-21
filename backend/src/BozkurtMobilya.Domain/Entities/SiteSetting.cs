using BozkurtMobilya.Domain.Common;

namespace BozkurtMobilya.Domain.Entities;

/// <summary>
/// Site genelindeki ayarlar. Key-Value çiftleri olarak saklanır.
/// Örn: "PhoneNumber", "Email", "WhatsApp", "Address", "InstagramUrl", vb.
/// </summary>
public class SiteSetting : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string? Value { get; set; }
    /// <summary>Ayarları gruplamak için: "Contact", "Social", "Seo", vb.</summary>
    public string Group { get; set; } = "General";
}
