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
[Route("api/timeline")]
public class TimelineController : ControllerBase
{
    private readonly EventService _eventService;
    private readonly PeriodService _periodService;
    private readonly IMapper _mapper;

    public TimelineController(
        IMapper mapper,
        EventService eventService,
        PeriodService periodService
    )
    {
        _mapper = mapper;
        _eventService = eventService;
        _periodService = periodService;
    }

    [HttpGet]
    public async Task<ActionResult<TimelinePresentationLayerDTO>> GetEventsPeriods(
        [FromQuery] int startYear,
        [FromQuery] int? startMonth,
        [FromQuery] int? startDay,
        [FromQuery] int endYear,
        [FromQuery] int? endMonth,
        [FromQuery] int? endDay,
        [FromQuery] int level
    )
    {
        var events = await _eventService.GetEventsByDateRangeAndLevelAsync(
            startYear,
            startMonth,
            startDay,
            endYear,
            endMonth,
            endDay,
            level
        );
        var periods = await _periodService.GetPeriodsByDateRangeAndLevelAsync(
            startYear,
            startMonth,
            startDay,
            endYear,
            endMonth,
            endDay,
            level
        );
        var eventDTOs = _mapper.Map<IEnumerable<EventTimelineDTO>>(events);
        var periodsDTOs = _mapper.Map<IEnumerable<PeriodTimelineDTO>>(periods);

        var result = new TimelinePresentationLayerDTO
        {
            events = eventDTOs.ToList(),
            periods = periodsDTOs.ToList(),
        };

        return Ok(result);
    }
}
