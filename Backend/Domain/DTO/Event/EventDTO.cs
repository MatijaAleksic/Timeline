using System.ComponentModel.DataAnnotations;
using Backend.Domain.DTO;

namespace Backend.Domain.DTO;

public class EventDTO
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    public string Title { get; set; } = "Default Title";

    [Required]
    public int Level { get; set; }

    [Range(1, 31, ErrorMessage = "Day must be between 1 and 31")]
    public int? Day { get; set; }

    [Range(1, 12, ErrorMessage = "Month must be between 1 and 12")]
    public int? Month { get; set; }

    [Required]
    public int Year { get; set; }
}
