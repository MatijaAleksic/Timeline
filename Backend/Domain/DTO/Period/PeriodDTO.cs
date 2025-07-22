using System.ComponentModel.DataAnnotations;
using Backend.Domain.DTO;

namespace Backend.Domain.DTO;

public class PeriodDTO
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    public string Title { get; set; } = "Default Title";

    [Required]
    public int Level { get; set; }

    [Range(1, 31, ErrorMessage = "StartDay must be between 1 and 31")]
    public int? StartDay { get; set; }

    [Range(1, 12, ErrorMessage = "StartMonth must be between 1 and 12")]
    public int? StartMonth { get; set; }

    [Required]
    public int StartYear { get; set; }

    [Range(1, 31, ErrorMessage = "EndDay must be between 1 and 31")]
    public int? EndDay { get; set; }

    [Range(1, 12, ErrorMessage = "EndMonth must be between 1 and 12")]
    public int? EndMonth { get; set; }

    [Required]
    public int EndYear { get; set; }
}
