import { addMonths } from "date-fns";
import { EventDTO } from "../dto/EventDTO";

export default class DummyDataService {
  public static getDataForLevel = (level: number) => {
    switch (level) {
      case 1:
        return [];
      case 2:
        return [];
      case 3: {
        return Array.from({ length: 1 }, (_, index) => {
          return {
            date: addMonths(new Date(-3000, 3, 1), index * 4) as Date,
            label: `World War ${index}`,
            level: 2,
          } as EventDTO;
        });
      }
      default:
        return [];
    }
  };
}
