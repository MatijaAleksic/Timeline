using Backend.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configuration;

internal class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.Property(u => u.Id).HasDefaultValueSql("uuid_generate_v4()").ValueGeneratedOnAdd();
        builder.HasIndex(u => u.Title).IsUnique();
    }
}
