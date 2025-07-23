using System.ComponentModel.DataAnnotations;
using Backend.Domain.DTO;

namespace Backend.Domain.DTO;

public class EventTableDTO
{
    [Required]
    public List<EventDTO> events { get; set; } = new List<EventDTO>();

    [Required]
    public int totalCount { get; set; } = 0;
}
