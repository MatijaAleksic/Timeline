import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMonths,
} from "date-fns";
import MeterConstants from "../constants/MeterConstants";
import MeterService from "./MeterService";

export default class MeterLevelsService {
  public static getLevelElements = (level: number) => {
    // const earliestDatePossible = new Date(-100_000_000 * 24 * 60 * 60 * 1000); // ~271,821 BCE
    switch (level) {
      case 1: {
        const startDate = new Date(new Date().getFullYear(), 0, 1);
        const endDate = new Date();
        startDate.setFullYear(-MeterConstants.earliestYearLevel1 + 1);
        return this.getDays(startDate, endDate);
      }
      case 2: {
        const startDate = new Date(new Date().getFullYear(), 0, 1);
        const endDate = new Date();
        startDate.setFullYear(-MeterConstants.earliestYearLevel2 + 1);
        return this.getMonths(startDate, endDate);
      }
      default: {
        const yearMultiplier: number = MeterService.getYearMultiplier(level);
        const startYear = MeterService.getEarliestYearForLevel(level);
        const endYear = new Date().getFullYear();
        return this.getYears(startYear, endYear, yearMultiplier);
      }
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

  public static getYears = (
    startYear: number,
    endYear: number,
    yearMultiplier: number
  ): Array<number> => {
    return Array.from(
      { length: Math.floor((endYear + startYear) / yearMultiplier) },
      (_, i) => -startYear + i * yearMultiplier
    );
  };
}
