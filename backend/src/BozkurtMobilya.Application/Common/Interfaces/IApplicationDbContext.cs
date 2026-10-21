using BozkurtMobilya.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BozkurtMobilya.Application.Common.Interfaces;

/// <summary>
/// Veritabanı bağlamının Application katmanındaki soyutlaması (Dependency Inversion).
/// </summary>
public interface IApplicationDbContext
{
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    DbSet<ProductImage> ProductImages { get; }
    DbSet<Banner> Banners { get; }
    DbSet<Service> Services { get; }
    DbSet<Store> Stores { get; }
    DbSet<PageContent> PageContents { get; }
    DbSet<ContactMessage> ContactMessages { get; }
    DbSet<SiteSetting> SiteSettings { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    int SaveChanges();
}
