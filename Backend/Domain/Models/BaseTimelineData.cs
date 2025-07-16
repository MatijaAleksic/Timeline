namespace Backend.Domain.Models;


public abstract class BaseTimelineData {

    public int Id { get; set; }
    public int Level {get; set;}
    public string Title {get; set;}

}

