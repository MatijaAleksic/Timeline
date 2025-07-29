export default interface TimelineQueryDTO {
  startYear: number;
  startMonth?: number;
  startDay?: number;
  endYear: number;
  endMonth: number;
  endDay?: number;
  level: number;
}
