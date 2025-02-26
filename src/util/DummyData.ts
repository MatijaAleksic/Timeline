import { addMonths } from "date-fns";

export default class DummyData {
  public static getMonths = (): Array<Date> => {
    return [
      new Date(),
      addMonths(new Date(), 1),
      addMonths(new Date(), 2),
      addMonths(new Date(), 3),
      addMonths(new Date(), 4),
      addMonths(new Date(), 5),
      addMonths(new Date(), 6),
      addMonths(new Date(), 7),
      addMonths(new Date(), 8),
      addMonths(new Date(), 9),
      addMonths(new Date(), 10),
      addMonths(new Date(), 11),
      addMonths(new Date(), 12),
      addMonths(new Date(), 13),
    ];
  };
}
