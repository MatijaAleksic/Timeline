using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Backend.Domain.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Period> Periods {get; set;}
        public DbSet<Event> Events {get; set;}
}

