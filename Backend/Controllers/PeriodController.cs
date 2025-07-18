using AutoMapper;
using Backend.Data;
using Backend.Domain.DTO;
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
    public async Task<ActionResult<IEnumerable<PeriodDTO>>> GetPeriods()
    {
        var periods = await _periodService.GetPeriodsAsync();
        if (!periods.Any())
            return NoContent();
        return Ok(_mapper.Map<IEnumerable<Period>, IEnumerable<PeriodDTO>>(periods));
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
        catch (Exception e)
        {
            return BadRequest(e.Message);
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
        catch (Exception)
        {
            return BadRequest();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePeriod(Guid id)
    {
        try
        {
            await _periodService.DeletePeriodAsync(id);
            return Ok();
        }
        catch (Exception)
        {
            return NotFound();
        }
    }
}
