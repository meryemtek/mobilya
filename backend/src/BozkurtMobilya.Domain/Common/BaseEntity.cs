namespace BozkurtMobilya.Domain.Common;

/// <summary>
/// Genel TKey türü destekleyen temel varlık sınıfı.
/// Clean Code & SOLID ilkelerine uygun olarak kimlik ve zaman damgası yönetimini soyutlar.
/// </summary>
public abstract class BaseEntity<TKey> : IEntity<TKey>, IAuditableEntity
{
    public virtual TKey Id { get; set; } = default!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public override bool Equals(object? obj)
    {
        if (obj is not BaseEntity<TKey> other)
            return false;

        if (ReferenceEquals(this, other))
            return true;

        if (GetType() != other.GetType())
            return false;

        if (EqualityComparer<TKey>.Default.Equals(Id, default))
            return false;

        return EqualityComparer<TKey>.Default.Equals(Id, other.Id);
    }

    public override int GetHashCode()
    {
        return EqualityComparer<TKey>.Default.Equals(Id, default) 
            ? base.GetHashCode() 
            : HashCode.Combine(GetType(), Id);
    }
}

/// <summary>
/// Standart int kimlikli temel varlık sınıfı.
/// </summary>
public abstract class BaseEntity : BaseEntity<int>
{
}
