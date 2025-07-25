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

public class EventService : IEventService
{
    private readonly EventRepository _eventRepository;

    public EventService(EventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<(IEnumerable<Event> Events, int TotalCount)> GetEventsPaginatedAsync(
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

        var query = _eventRepository.Query();

        if (!string.IsNullOrEmpty(searchString))
        {
            query = query.Where(e => EF.Functions.Like(e.Title, $"%{searchString}%"));
        }

        var totalCount = await query.CountAsync();

        query = SortingHelper.ApplySorting(
            query,
            sortColumn,
            sortDirection,
            EventAllowedSortColumns
        );

        if (string.IsNullOrEmpty(sortColumn) || !EventAllowedSortColumns.Contains(sortColumn))
        {
            query = query.OrderBy(e => e.Title);
        }

        var events = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return (events, totalCount);
    }

    public async Task<Event?> GetEventByIdAsync(Guid id)
    {
        return await _eventRepository.GetByIdAsync(id);
    }

    public async Task<Event?> GetEventByTitleAsync(string title)
    {
        var events = await _eventRepository.FindAsync(e => e.Title == title);
        return events.SingleOrDefault();
    }

    public async Task<Event> CreateEventAsync(Event ev)
    {
        var existingEvent = await GetEventByTitleAsync(ev.Title);
        if (existingEvent != null)
        {
            throw new ConflictingDataException("Event with given title already exists!");
        }
        var createdEvent = _eventRepository.Create(ev);
        await _eventRepository.SaveAsync();
        return createdEvent;
    }

    public async Task DeleteEventAsync(Guid eventId)
    {
        var existingEvent = await GetEventByIdAsync(eventId);
        if (existingEvent == null)
        {
            throw new Exception("Event with given id not found!");
        }

        _eventRepository.Delete(existingEvent);
        await _eventRepository.SaveAsync();
    }

    public async Task<Event> UpdateEventAsync(Guid id, UpdateEventDTO ev)
    {
        var existingEvent = await _eventRepository.GetByIdAsync(id);
        if (existingEvent == null)
        {
            throw new Exception("Event with given id not found!");
        }
        var eventWithSameTitle = await GetEventByTitleAsync(ev.Title);
        if (eventWithSameTitle != null && eventWithSameTitle.Id != id)
        {
            throw new ConflictingDataException("Event with given title already exists!");
        }
        existingEvent.Title = ev.Title;
        existingEvent.Level = ev.Level;
        existingEvent.Day = ev.Day;
        existingEvent.Month = ev.Month;
        existingEvent.Year = ev.Year;

        var updatedEvent = _eventRepository.Update(existingEvent);
        await _eventRepository.SaveAsync();
        return updatedEvent;
    }

    private static readonly HashSet<string> EventAllowedSortColumns = new HashSet<string>(
        StringComparer.OrdinalIgnoreCase
    )
    {
        "Title",
        "Level",
        "Year",
        "Month",
        "Day",
    };
}
