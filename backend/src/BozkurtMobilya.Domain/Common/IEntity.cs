namespace BozkurtMobilya.Domain.Common;

/// <summary>
/// Varlıkların benzersiz kimlik (ID) taşımasını zorunlu kılan arayüz.
/// </summary>
public interface IEntity<TKey>
{
    TKey Id { get; set; }
}

/// <summary>
/// Oluşturulma ve güncellenme zaman damgalarını izleyen arayüz.
/// </summary>
public interface IAuditableEntity
{
    DateTime CreatedAt { get; set; }
    DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Yazılımsal silme (Soft Delete) desteği sunan arayüz.
/// </summary>
public interface ISoftDeletable
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
}
