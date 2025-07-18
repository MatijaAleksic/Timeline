namespace Backend.Domain.Models;

public abstract class BaseTimelineData
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public int Level { get; set; }

    public BaseTimelineData(string title, int level)
    {
        Title = title;
        Level = level;
    }
}
