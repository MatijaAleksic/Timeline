using Backend.Domain.DTO;

namespace Backend.Domain.DTO;

public class UpdateEventDTO
{
    public string Title { get; set; } = "Default Title";
    public int Level { get; set; }

    public int Day { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
}
