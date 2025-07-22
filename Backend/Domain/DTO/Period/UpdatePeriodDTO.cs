using System.ComponentModel.DataAnnotations;
using Backend.Domain.DTO;

namespace Backend.Domain.DTO;

public class UpdatePeriodDTO
{
    [Required]
    public string Title { get; set; } = "Default Title";

    [Required]
    public int Level { get; set; }

    public int StartDay { get; set; }
    public int StartMonth { get; set; }

    [Required]
    public int StartYear { get; set; }

    public int EndDay { get; set; }
    public int EndMonth { get; set; }

    [Required]
    public int EndYear { get; set; }
}
