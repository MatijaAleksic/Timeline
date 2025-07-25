using Backend.Domain.DTO;
using Backend.Domain.Models;

public interface IPeriodService
{
    Task<(IEnumerable<Period> Periods, int TotalCount)> GetPeriodsPaginatedAsync(
        int pageNumber,
        int pageSize,
        string searchString,
        string? sortColumn,
        string? sortDirection
    );
    Task<IEnumerable<Period>> GetPeriodsByDateRangeAndLevelAsync(
        int startYear,
        int? startMonth,
        int? startDay,
        int endYear,
        int? endMonth,
        int? endDay,
        int level
    );
    Task<Period?> GetPeriodByIdAsync(Guid id);
    Task<Period> CreatePeriodAsync(Period period);
    Task DeletePeriodAsync(Guid eventId);
    Task<Period> UpdatePeriodAsync(Guid id, UpdatePeriodDTO period);
}
