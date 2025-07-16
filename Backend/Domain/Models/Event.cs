namespace Backend.Domain.Models; 

public class Event : BaseTimelineData {
    public int Day {get; set;}
    public int Month {get; set;}
    public int Year {get; set; }

    public Event (int day, int month, int year, string title, int level){
        Day = day;
        Month = month;
        Year = year;

        Title = title;
        Level = level;
    } 
}