import { addMonths } from "date-fns";
import { EventDTO } from "../dto/EventDTO";

export default class DummyDataService {
  public static getDataForLevel = (level: number) => {
    switch (level) {
      case 1:
        return [];
      case 2:
        return Array.from({ length: 1 }, (_, index) => {
          return {
            startDate: addMonths(new Date(-2999, 3, 1), index * 4) as Date,
            endDate: addMonths(new Date(-2999, 8, 1), index * 4) as Date,
            label: `World War ${index}`,
            level: level,
          } as EventDTO;
        });
      default: {
        const start = -2999;
        return Array.from({ length: 30 }, (_, index) => {
          return {
            startDate: start + index * 0.2,
            endDate: start + index * 0.2 + 0.2,
            label: `World War ${index}`,
            level: level,
          } as EventDTO;
        });
      }
    }
  };
}
