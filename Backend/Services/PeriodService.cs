using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domain.DTO;
using Backend.Domain.Models;
using Backend.Repositories.Implementations;

namespace Backend.Services;

public class PeriodService
{
    private readonly PeriodRepository _periodRepository;

    public PeriodService(PeriodRepository periodRepository)
    {
        _periodRepository = periodRepository;
    }

    public async Task<IEnumerable<Period>> GetPeriodsAsync()
    {
        return await _periodRepository.GetAllAsync();
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

    public async Task<Period> CreatePeriodAsync(Period ev)
    {
        var existingPeriod = await GetPeriodByTitleAsync(ev.Title);
        if (existingPeriod != null)
        {
            throw new Exception("Period with given title already exists!");
        }
        var createdPeriod = _periodRepository.Create(ev);
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

    public async Task<Period> UpdatePeriodAsync(Guid id, UpdatePeriodDTO ev)
    {
        var existingPeriod = await _periodRepository.GetByIdAsync(id);
        if (existingPeriod == null)
        {
            throw new Exception("Period with given id not found!");
        }

        existingPeriod.Title = ev.Title;
        existingPeriod.Level = ev.Level;

        existingPeriod.StartDay = ev.StartDay;
        existingPeriod.StartMonth = ev.StartMonth;
        existingPeriod.StartYear = ev.StartYear;

        existingPeriod.EndDay = ev.EndDay;
        existingPeriod.EndMonth = ev.EndMonth;
        existingPeriod.EndYear = ev.EndYear;

        var updatedPeriod = _periodRepository.Update(existingPeriod);
        await _periodRepository.SaveAsync();
        return updatedPeriod;
    }
}
