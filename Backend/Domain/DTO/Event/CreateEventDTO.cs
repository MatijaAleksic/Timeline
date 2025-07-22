using System.ComponentModel.DataAnnotations;
using Backend.Domain.DTO;

namespace Backend.Domain.DTO;

public class CreateEventDTO
{
    [Required]
    public string Title { get; set; } = "Default Title";

    [Required]
    public int Level { get; set; }

    public int Day { get; set; }
    public int Month { get; set; }

    [Required]
    public int Year { get; set; }
}
