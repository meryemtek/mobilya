using BozkurtMobilya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BozkurtMobilya.Infrastructure.Data.Configurations;

public class PageContentConfiguration : IEntityTypeConfiguration<PageContent>
{
    public void Configure(EntityTypeBuilder<PageContent> builder)
    {
        builder.ToTable("PageContents");
        builder.Property(p => p.Slug).IsRequired().HasMaxLength(250);
        builder.HasIndex(p => p.Slug).IsUnique();
        builder.Property(p => p.Title).IsRequired().HasMaxLength(300);
        builder.Property(p => p.MetaTitle).HasMaxLength(100);
        builder.Property(p => p.MetaDescription).HasMaxLength(300);
    }
}
