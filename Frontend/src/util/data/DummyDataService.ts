import { addMonths } from "date-fns";
import { EventDTO } from "../DTO/EventDTO";
import MeterService from "../service/MeterService";

export default class DummyDataService {
  public static getDataForLevel = (level: number) => {
    switch (level) {
      case 1:
        return [];
      case 2:
        return Array.from({ length: 10 }, (_, index) => {
          return {
            startDate: addMonths(new Date(-2999, 3, 1), index * 4) as Date,
            endDate: addMonths(new Date(-2999, 8, 1), index * 4) as Date,
            label: `World War ${index}`,
            level: level,
          } as EventDTO;
        });
      default: {
        const yearMultiplier = MeterService.getYearMultiplier(level);
        const start = -2999 / yearMultiplier;
        return Array.from({ length: 10 }, (_, index) => {
          return {
            startDate: start + index * yearMultiplier * 0.2,
            endDate: start + index * yearMultiplier * 0.2 + 0.2,
            label: `World War ${index}`,
            level: level,
          } as EventDTO;
        });
      }
    }
  };

  public static generateRandomColor = () => {
    const colorIndex = Math.floor(Math.random() * 10);
    switch (colorIndex) {
      case 1: {
        return "lightblue";
      }
      case 2: {
        return "lightblue";
      }
      case 3: {
        return "lightgreen";
      }
      case 4: {
        return "lightgrey";
      }
      case 5: {
        return "lightpink";
      }
      case 6: {
        return "lightyellow";
      }
      case 7: {
        return "lightsteelblue";
      }
      case 8: {
        return "lightcyan";
      }
      case 9: {
        return "lightcoral";
      }
      default: {
        return "lightskyblue";
      }
    }
  };
}
