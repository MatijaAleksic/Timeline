using Backend.Data;
using Backend.Domain.Models;
using Backend.Repositories;

namespace Backend.Repositories.Implementations;

public class PeriodRepository : GenericRepository<Period>
{
    private readonly AppDbContext _context;

    public PeriodRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }
}
