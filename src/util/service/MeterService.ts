import { VirtualItem } from "@/components/VirtualScroll/VirtualScrollDTO/VirtualItem";

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
    return 10 ** (level - 3);
  };
}
