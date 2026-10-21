using BozkurtMobilya.Domain.Common;
using BozkurtMobilya.Domain.Enums;

namespace BozkurtMobilya.Domain.Entities;

public class ContactMessage : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Subject { get; set; }
    public string Message { get; set; } = string.Empty;
    public MessageStatus Status { get; set; } = MessageStatus.New;
    /// <summary>Yönetici notu (iç kullanım)</summary>
    public string? AdminNote { get; set; }
}
