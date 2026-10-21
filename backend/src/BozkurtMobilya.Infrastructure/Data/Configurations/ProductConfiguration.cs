using BozkurtMobilya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BozkurtMobilya.Infrastructure.Data.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name).IsRequired().HasMaxLength(300);
        builder.Property(p => p.Slug).IsRequired().HasMaxLength(350);
        builder.HasIndex(p => p.Slug).IsUnique();
        builder.HasIndex(p => p.ProductCode).IsUnique().HasFilter("\"ProductCode\" IS NOT NULL");

        builder.Property(p => p.ProductCode).HasMaxLength(100);
        builder.Property(p => p.ShortDescription).HasMaxLength(500);
        builder.Property(p => p.MetaTitle).HasMaxLength(100);
        builder.Property(p => p.MetaDescription).HasMaxLength(300);

        // JSON kolonları
        builder.Property(p => p.Specifications).HasColumnType("jsonb");
        builder.Property(p => p.Dimensions).HasColumnType("jsonb");
        builder.Property(p => p.ColorOptions).HasColumnType("jsonb");
        builder.Property(p => p.TechnicalDetails).HasColumnType("jsonb");

        builder.Property(p => p.Status).HasConversion<int>();

        // İlişki: ürün silinirse görsel de silinsin (Cascade)
        builder.HasMany(p => p.Images)
               .WithOne(i => i.Product)
               .HasForeignKey(i => i.ProductId)
               .OnDelete(DeleteBehavior.Cascade);

        // Kategori silinirse ürün kaybolmasın (Restrict)
        builder.HasOne(p => p.Category)
               .WithMany(c => c.Products)
               .HasForeignKey(p => p.CategoryId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
