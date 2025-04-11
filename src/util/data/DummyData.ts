import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMonths,
} from "date-fns";
import MeterConstants from "../constants/MeterConstants";

export default class DummyData {
  public static getData = (level: number) => {
    // const earliestDatePossible = new Date(-100_000_000 * 24 * 60 * 60 * 1000); // ~271,821 BCE
    switch (level) {
      case 1: {
        const startDate = new Date(new Date().getFullYear(), 0, 1);
        const endDate = new Date();
        startDate.setFullYear(
          startDate.getFullYear() -
            endDate.getFullYear() -
            MeterConstants.earliestYearLevel12 +
            1
        );
        return this.getDays(startDate, endDate);
      }
      case 2: {
        const startDate = new Date(new Date().getFullYear(), 0, 1);
        const endDate = new Date();
        startDate.setFullYear(
          startDate.getFullYear() -
            endDate.getFullYear() -
            MeterConstants.earliestYearLevel12 +
            1
        );
        return this.getMonths(startDate, endDate);
      }
      default:
        return [];
    }
  };

  public static getDummyData = (
    level: number,
    startDate: Date,
    endDate: Date
  ): Array<Date> => {
    switch (level) {
      case 1:
        return this.getDays(startDate, endDate);
      case 2:
        return this.getMonths(startDate, endDate);
      default:
        return [];
    }
  };

  public static getMonths = (startDate: Date, endDate: Date): Array<Date> => {
    const totalMonths = differenceInMonths(endDate, startDate);
    return Array.from({ length: totalMonths }, (_, i) => {
      return addMonths(startDate, i);
    });
  };

  public static getDays = (startDate: Date, endDate: Date): Array<Date> => {
    const totalDays = differenceInDays(endDate, startDate);
    return Array.from({ length: totalDays }, (_, i) => addDays(startDate, i));
  };
}
