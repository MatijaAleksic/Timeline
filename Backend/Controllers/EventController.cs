using AutoMapper;
using Backend.Data;
using Backend.Domain.DTO;
using Backend.Domain.Exceptions;
using Backend.Domain.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly EventService _eventService;
    private readonly IMapper _mapper;

    public EventsController(IMapper mapper, EventService eventService)
    {
        _mapper = mapper;
        _eventService = eventService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventDTO>>> GetEvents()
    {
        var events = await _eventService.GetEventsAsync();
        if (!events.Any())
            return NoContent();
        return Ok(_mapper.Map<IEnumerable<Event>, IEnumerable<EventDTO>>(events));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDTO>> GetEvent(Guid id)
    {
        var foundEvent = await _eventService.GetEventByIdAsync(id);
        if (foundEvent == null)
            return NotFound();
        return Ok(_mapper.Map<Event, EventDTO>(foundEvent));
    }

    [HttpPost]
    public async Task<ActionResult<EventDTO>> CreateEvent(CreateEventDTO ev)
    {
        try
        {
            var resultEvent = await _eventService.CreateEventAsync(
                _mapper.Map<CreateEventDTO, Event>(ev)
            );
            return Ok(_mapper.Map<Event, EventDTO>(resultEvent));
        }
        catch (ConflictingDataException e)
        {
            return Conflict(new { message = e.Message });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvent(Guid id, UpdateEventDTO updatedEvent)
    {
        try
        {
            var resultEvent = await _eventService.UpdateEventAsync(id, updatedEvent);
            return Ok(_mapper.Map<Event, EventDTO>(resultEvent));
        }
        catch (ConflictingDataException e)
        {
            return Conflict(new { message = e.Message });
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        try
        {
            await _eventService.DeleteEventAsync(id);
            return Ok(new { message = "Event deleted successfully" });
        }
        catch (Exception e)
        {
            return NotFound(new { message = e.Message });
        }
    }
}
