using System.ComponentModel.DataAnnotations;
using Backend.Domain.DTO;

namespace Backend.Domain.DTO;

public class PeriodTableDTO
{
    [Required]
    public List<PeriodDTO> periods { get; set; } = new List<PeriodDTO>();

    [Required]
    public int totalCount { get; set; } = 0;
}
