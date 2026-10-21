using BozkurtMobilya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BozkurtMobilya.Infrastructure.Data.Configurations;

public class ContactMessageConfiguration : IEntityTypeConfiguration<ContactMessage>
{
    public void Configure(EntityTypeBuilder<ContactMessage> builder)
    {
        builder.ToTable("ContactMessages");
        builder.Property(m => m.FullName).IsRequired().HasMaxLength(200);
        builder.Property(m => m.Email).HasMaxLength(300);
        builder.Property(m => m.Phone).HasMaxLength(30);
        builder.Property(m => m.Subject).HasMaxLength(300);
        builder.Property(m => m.Message).IsRequired().HasMaxLength(5000);
        builder.Property(m => m.AdminNote).HasMaxLength(2000);
        builder.Property(m => m.Status).HasConversion<int>();
    }
}
