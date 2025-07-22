namespace Backend.Domain.Models;

public class Period : BaseTimelineData
{
    public int? StartDay { get; set; }
    public int? StartMonth { get; set; }
    public int StartYear { get; set; }

    public int? EndDay { get; set; }
    public int? EndMonth { get; set; }
    public int EndYear { get; set; }

    public Period(
        int? startDay,
        int? startMonth,
        int startYear,
        int? endDay,
        int? endMonth,
        int endYear,
        string title,
        int level
    )
        : base(title, level)
    {
        StartDay = startDay;
        StartMonth = startMonth;
        StartYear = startYear;

        EndDay = endDay;
        EndMonth = endMonth;
        EndYear = endYear;
    }
}
