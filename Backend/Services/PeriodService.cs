using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domain.DTO;
using Backend.Domain.Exceptions;
using Backend.Domain.Models;
using Backend.Helper;
using Backend.Repositories.Implementations;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class PeriodService
{
    private readonly PeriodRepository _periodRepository;

    public PeriodService(PeriodRepository periodRepository)
    {
        _periodRepository = periodRepository;
    }

    public async Task<(IEnumerable<Period> Periods, int TotalCount)> GetPeriodsPaginatedAsync(
        int pageNumber,
        int pageSize,
        string searchString,
        string? sortColumn,
        string? sortDirection
    )
    {
        if (pageNumber <= 0)
            pageNumber = 1;
        if (pageSize <= 0)
            pageSize = 10;

        var query = _periodRepository.Query();

        if (!string.IsNullOrEmpty(searchString))
        {
            query = query.Where(e => EF.Functions.Like(e.Title, $"%{searchString}%"));
        }

        var totalCount = await query.CountAsync();

        query = SortingHelper.ApplySorting(
            query,
            sortColumn,
            sortDirection,
            PeriodAllowedSortColumns
        );

        if (string.IsNullOrEmpty(sortColumn) || !PeriodAllowedSortColumns.Contains(sortColumn))
        {
            query = query.OrderBy(e => e.Title);
        }

        var periods = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return (periods, totalCount);
    }

    public async Task<IEnumerable<Period>> GetPeriodsByDateRangeAndLevelAsync(
        int startYear,
        int? startMonth,
        int? startDay,
        int endYear,
        int? endMonth,
        int? endDay,
        int level
    )
    {
        var query = _periodRepository.Query();

        query = query.Where(e => e.Level == level);

        query = query.Where(e =>
            (e.StartYear * 10000 + (e.StartMonth ?? 1) * 100 + (e.StartDay ?? 1))
                <= (endYear * 10000 + (endMonth ?? 12) * 100 + (endDay ?? 31))
            && (e.EndYear * 10000 + (e.EndMonth ?? 12) * 100 + (e.EndDay ?? 31))
                >= (startYear * 10000 + (startMonth ?? 1) * 100 + (startDay ?? 1))
        );

        return await query.ToListAsync();
    }

    public async Task<Period?> GetPeriodByIdAsync(Guid id)
    {
        return await _periodRepository.GetByIdAsync(id);
    }

    public async Task<Period?> GetPeriodByTitleAsync(string title)
    {
        var periods = await _periodRepository.FindAsync(e => e.Title == title);
        return periods.SingleOrDefault();
    }

    public async Task<Period> CreatePeriodAsync(Period period)
    {
        var existingPeriod = await GetPeriodByTitleAsync(period.Title);
        if (existingPeriod != null)
        {
            throw new ConflictingDataException("Period with given title already exists!");
        }
        var createdPeriod = _periodRepository.Create(period);
        await _periodRepository.SaveAsync();
        return createdPeriod;
    }

    public async Task DeletePeriodAsync(Guid periodId)
    {
        var existingPeriod = await GetPeriodByIdAsync(periodId);
        if (existingPeriod == null)
        {
            throw new Exception("Period with given id not found!");
        }

        _periodRepository.Delete(existingPeriod);
        await _periodRepository.SaveAsync();
    }

    public async Task<Period> UpdatePeriodAsync(Guid id, UpdatePeriodDTO period)
    {
        var existingPeriod = await _periodRepository.GetByIdAsync(id);
        if (existingPeriod == null)
        {
            throw new Exception("Period with given id not found!");
        }
        var periodWithSameTitle = await GetPeriodByTitleAsync(period.Title);
        if (periodWithSameTitle != null && periodWithSameTitle.Id != id)
        {
            throw new ConflictingDataException("Period with given title already exists!");
        }
        existingPeriod.Title = period.Title;
        existingPeriod.Level = period.Level;

        existingPeriod.StartYear = period.StartYear;
        existingPeriod.StartMonth = period.StartMonth;
        existingPeriod.StartMonth = period.StartMonth;

        existingPeriod.EndYear = period.EndYear;
        existingPeriod.EndMonth = period.EndMonth;
        existingPeriod.EndMonth = period.EndMonth;

        var updatedPeriod = _periodRepository.Update(existingPeriod);
        await _periodRepository.SaveAsync();
        return updatedPeriod;
    }

    private static readonly HashSet<string> PeriodAllowedSortColumns = new HashSet<string>(
        StringComparer.OrdinalIgnoreCase
    )
    {
        "Title",
        "Level",
        "StartYear",
        "StartMonth",
        "StartDay",
        "EndYear",
        "EndMonth",
        "EndDay",
    };
}
