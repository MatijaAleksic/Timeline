using System.ComponentModel.DataAnnotations;
using Backend.Domain.DTO;

namespace Backend.Domain.DTO;

public class TimelinePresentationLayerDTO
{
    [Required]
    public List<EventTimelineDTO> events { get; set; } = new List<EventTimelineDTO>();

    [Required]
    public List<PeriodTimelineDTO> periods { get; set; } = new List<PeriodTimelineDTO>();
}
