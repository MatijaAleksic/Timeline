using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domain.DTO;
using Backend.Domain.Models;
using Backend.Repositories.Implementations;

namespace Backend.Services;

public class EventService : IEventService
{
    private readonly EventRepository _eventRepository;

    public EventService(EventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<IEnumerable<Event>> GetEventsAsync()
    {
        return await _eventRepository.GetAllAsync();
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
            throw new Exception("Event with given title already exists!");
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

        existingEvent.Day = ev.Day;
        existingEvent.Month = ev.Month;
        existingEvent.Year = ev.Year;
        existingEvent.Title = ev.Title;
        existingEvent.Level = ev.Level;

        var updatedEvent = _eventRepository.Update(existingEvent);
        await _eventRepository.SaveAsync();
        return updatedEvent;
    }
}
