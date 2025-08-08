import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMonths,
} from "date-fns";
import MeterConstants from "../constants/MeterConstants";
import MeterService from "./MeterService";
import LevelElementDTO from "../dto/VirtualScrollDTO/LevelElementDTO";

export default class MeterLevelsService {
  public static getLevelElements = (
    level: number,
    virtualIndexes: number[]
  ): LevelElementDTO => {
    // const earliestDatePossible = new Date(-100_000_000 * 24 * 60 * 60 * 1000); // ~271,821 BCE
    switch (level) {
      //DAYS
      case 1:
      //MONTHS
      case 2: {
        const todaysDate: Date = new Date();
        const totalMonths =
          (MeterConstants.earliestYearLevel1And2 + todaysDate.getFullYear()) *
            12 +
          todaysDate.getMonth();
        const earliestYear = MeterConstants.earliestYearLevel1And2;

        let startDate: Date = new Date();
        let endDate: Date = new Date();

        startDate.setFullYear(
          Math.floor(-earliestYear + virtualIndexes[0] / 12)
        );
        startDate.setMonth(virtualIndexes[0] % 12);
        startDate.setDate(1);
        endDate.setFullYear(
          Math.floor(
            -earliestYear + virtualIndexes[virtualIndexes.length - 1] / 12
          )
        );
        endDate.setMonth(virtualIndexes[virtualIndexes.length - 1] % 12);
        endDate.setDate(1);
        return {
          levelElements: this.getMonths(startDate, endDate),
          totalLength: totalMonths,
        } as LevelElementDTO;
      }
      //YEARS
      default: {
        const yearMultiplier: number = MeterService.getYearMultiplier(level);
        const earliestYear = MeterService.getEarliestYearForLevel(level);
        const currentYear = new Date().getFullYear();
        const startYear = earliestYear - virtualIndexes[0] * yearMultiplier;
        const endYear =
          earliestYear -
          virtualIndexes[virtualIndexes.length - 1] * yearMultiplier;
        return {
          levelElements: this.getYears(startYear, endYear, yearMultiplier),
          totalLength: Math.floor(
            (earliestYear + currentYear) / yearMultiplier
          ),
        } as LevelElementDTO;
      }
    }
  };
  public static getYears = (
    startYear: number,
    endYear: number,
    yearMultiplier: number
  ): Array<number> => {
    return Array.from(
      {
        length: Math.floor(Math.abs(startYear - endYear) / yearMultiplier) + 1,
      },
      (_, i) => -startYear + i * yearMultiplier
    );
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
