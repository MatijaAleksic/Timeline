import { VirtualItem } from "@/components/VirtualScroll/VirtualScrollDTO/VirtualItem";
import MeterConstants from "../constants/MeterConstants";

export default class MeterService {
  public static generateVirtualIndexes = (
    overScanStart: number,
    overScanEnd: number,
    elementWidth: number
  ): VirtualItem[] => {
    const items: VirtualItem[] = [];
    for (let i = overScanStart; i <= overScanEnd; i++) {
      items.push({
        index: i,
        start: i * elementWidth,
        end: (i + 1) * elementWidth,
        key: `virtual-item-${i}`,
        size: elementWidth,
      });
    }
    return items;
  };

  public static getYearMultiplier = (level: number) => {
    if (level === 1) return 30;
    else if (level === 2) return 12;
    else if (level === 3) return 1;
    return 10 ** (level - 3);
  };

  public static getEarliestYearForLevel = (level: number) => {
    switch (level) {
      case 1:
        return MeterConstants.earliestYearLevel1;
      case 2:
        return MeterConstants.earliestYearLevel2;
      case 3:
        return MeterConstants.earliestYearLevel3;
      case 4:
        return MeterConstants.earliestYearLevel4;
      case 5:
        return MeterConstants.earliestYearLevel5;
      case 6:
        return MeterConstants.earliestYearLevel6;
      case 7:
        return MeterConstants.earliestYearLevel7;
      case 8:
        return MeterConstants.earliestYearLevel8;
      case 9:
        return MeterConstants.earliestYearLevel9;
      case 10:
        return MeterConstants.earliestYearLevel10;
      case 11:
        return MeterConstants.earliestYearLevel11;
      case 12:
        return MeterConstants.earliestYearLevel12;
      default:
        return MeterConstants.earliestYearRestLevels;
    }
  };
}
