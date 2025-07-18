using Backend.Domain.DTO;

namespace Backend.Domain.DTO;

public class CreatePeriodDTO
{
    public string Title { get; set; } = "Default Title";
    public int Level { get; set; }

    public int StartDay { get; set; }
    public int StartMonth { get; set; }
    public int StartYear { get; set; }

    public int EndDay { get; set; }
    public int EndMonth { get; set; }
    public int EndYear { get; set; }
}
