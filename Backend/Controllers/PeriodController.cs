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
[Route("api/periods")]
public class PeriodsController : ControllerBase
{
    private readonly PeriodService _periodService;
    private readonly IMapper _mapper;

    public PeriodsController(IMapper mapper, PeriodService periodService)
    {
        _mapper = mapper;
        _periodService = periodService;
    }

    [HttpGet]
    public async Task<ActionResult<PeriodTableDTO>> GetPeriods(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string searchString = "",
        [FromQuery] string? sortColumn = null,
        [FromQuery] string? sortDirection = null
    )
    {
        var (periods, totalCount) = await _periodService.GetPeriodsPaginatedAsync(
            pageNumber,
            pageSize,
            searchString,
            sortColumn,
            sortDirection
        );

        var periodDTOs = _mapper.Map<IEnumerable<Period>, IEnumerable<PeriodDTO>>(periods);
        var periodTableDTO = new PeriodTableDTO
        {
            periods = periodDTOs.ToList(),
            totalCount = totalCount,
        };
        return Ok(periodTableDTO);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PeriodDTO>> GetPeriod(Guid id)
    {
        var foundPeriod = await _periodService.GetPeriodByIdAsync(id);
        if (foundPeriod == null)
            return NotFound();
        return Ok(_mapper.Map<Period, PeriodDTO>(foundPeriod));
    }

    [HttpPost]
    public async Task<ActionResult<PeriodDTO>> CreatePeriod(CreatePeriodDTO ev)
    {
        try
        {
            var resultPeriod = await _periodService.CreatePeriodAsync(
                _mapper.Map<CreatePeriodDTO, Period>(ev)
            );
            return Ok(_mapper.Map<Period, PeriodDTO>(resultPeriod));
        }
        catch (ConflictingDataException e)
        {
            return Conflict(new { message = e.Message });
        }
        catch (Exception)
        {
            return StatusCode(500);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePeriod(Guid id, UpdatePeriodDTO updatedPeriod)
    {
        try
        {
            var resultPeriod = await _periodService.UpdatePeriodAsync(id, updatedPeriod);
            return Ok(_mapper.Map<Period, PeriodDTO>(resultPeriod));
        }
        catch (ConflictingDataException e)
        {
            return Conflict(new { message = e.Message });
        }
        catch (Exception)
        {
            return StatusCode(500);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePeriod(Guid id)
    {
        try
        {
            await _periodService.DeletePeriodAsync(id);
            return Ok(new { message = "Period deleted successfully" });
        }
        catch (Exception e)
        {
            return NotFound(new { message = e.Message });
        }
    }
}
