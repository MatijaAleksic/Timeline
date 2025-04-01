import { addMonths, differenceInMonths } from "date-fns";
import MeterConstants from "../constants/MeterConstants";

export default class DummyData {
  public static getData = (level: number) => {
    // const earliestDatePossible = new Date(-100_000_000 * 24 * 60 * 60 * 1000); // ~271,821 BCE
    switch (level) {
      case 2: {
        const currentDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(
          startDate.getFullYear() -
            currentDate.getFullYear() -
            MeterConstants.earliestYearLevel2 +
            1
        );
        return this.getMonths(startDate, currentDate);
      }
      default:
        return [];
    }
  };

  public static getMonths = (
    earliestDate: Date,
    currentDate: Date
  ): Array<Date> => {
    const totalMonths = differenceInMonths(currentDate, earliestDate);
    return Array.from({ length: totalMonths }, (_, i) =>
      addMonths(earliestDate, i)
    );
  };
}
