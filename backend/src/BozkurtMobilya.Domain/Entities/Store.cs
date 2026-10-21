using BozkurtMobilya.Domain.Common;

namespace BozkurtMobilya.Domain.Entities;

/// <summary>Fiziksel mağaza / showroom kaydı. İletişim sayfasında harita ve kartlarla listelenir.</summary>
public class Store : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public string? Email { get; set; }
    public string? WorkingHours { get; set; }
    /// <summary>Google Maps "Yerleştirme HTML'i" içindeki iframe src adresi.</summary>
    public string? MapEmbedUrl { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
}
