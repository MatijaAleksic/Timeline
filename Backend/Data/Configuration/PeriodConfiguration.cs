using Backend.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

internal class PeriodConfiguration : IEntityTypeConfiguration<Period>
{
    public void Configure(EntityTypeBuilder<Period> builder)
    {
        builder.Property(u => u.Id).HasDefaultValueSql("uuid_generate_v4()").ValueGeneratedOnAdd();
        builder.HasIndex(u => u.Title).IsUnique();
    }
}
