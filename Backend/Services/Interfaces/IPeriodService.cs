using Backend.Domain.DTO;
using Backend.Domain.Models;

public interface IPeriodService
{
    Task<IEnumerable<Period>> GetPeriodsAsync();
    Task<Period?> GetPeriodByIdAsync(Guid id);
    Task<Period> CreatePeriodAsync(Period ev);
    Task DeletePeriodAsync(Guid eventId);
    Task<Period> UpdatePeriodAsync(Guid id, UpdatePeriodDTO ev);
}
