using Backend.Domain.DTO;
using Backend.Domain.Models;

public interface IEventService
{
    Task<(IEnumerable<Event> Events, int TotalCount)> GetEventsPaginatedAsync(
        int pageNumber,
        int pageSize
    );
    Task<Event?> GetEventByIdAsync(Guid id);
    Task<Event> CreateEventAsync(Event ev);
    Task DeleteEventAsync(Guid eventId);
    Task<Event> UpdateEventAsync(Guid id, UpdateEventDTO ev);
}
