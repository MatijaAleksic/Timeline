using Backend.Data;
using Backend.Domain.Models;
using Backend.Repositories;

namespace Backend.Repositories.Implementations;

public class UserRepository : GenericRepository<User>
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }
}
