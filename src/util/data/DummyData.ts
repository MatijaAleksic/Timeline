import { addMonths } from "date-fns";

export default class DummyData {
  public static getMonths = (date: Date): Array<Date> => {
    return [
      date,
      addMonths(date, 1),
      addMonths(date, 2),
      addMonths(date, 3),
      addMonths(date, 4),
      addMonths(date, 5),
      addMonths(date, 6),
      addMonths(date, 7),
      addMonths(date, 8),
      addMonths(date, 9),
      addMonths(date, 10),
      addMonths(date, 11),
      addMonths(date, 12),
    ];
  };
}
