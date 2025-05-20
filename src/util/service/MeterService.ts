import { VirtualItem } from "@/components/VirtualScroll/VirtualScrollDTO/VirtualItem";
import MeterConstants from "../constants/MeterConstants";
import { RefObject } from "react";
import { EventDTO } from "../dto/EventDTO";
import { format } from "date-fns";

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

  public static getYearMultiplier = (level: number): number => {
    if (level === 1) return 30;
    else if (level === 2) return 12;
    else if (level === 3) return 1;
    return 10 ** (level - 3);
  };

  public static getEarliestYearForLevel = (level: number): number => {
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

  public static getRange = (
    meterComponentRef: RefObject<HTMLDivElement | null>,
    dummyData: any[],
    scrollOffset: number,
    elementWidth: number
  ) => {
    if (!meterComponentRef.current) {
      return;
    }
    const containerSize = meterComponentRef.current.clientWidth;
    const startIndex = Math.floor(scrollOffset / elementWidth);
    const endIndex = Math.min(
      dummyData.length - 1,
      Math.floor((scrollOffset + containerSize) / elementWidth)
    );
    return { start: startIndex, end: endIndex };
  };

  public static calculateCentralIndex = (
    meterComponentRef: RefObject<HTMLDivElement | null>,
    elementWidth: number
  ): number => {
    return Math.floor(
      (meterComponentRef.current!.scrollLeft +
        meterComponentRef.current!.clientWidth / 2) /
      elementWidth
    );
  };

  public static calculateOffsetForLevelTransition = (
    earliestYearForNewLevel: number,
    currentYear: number,
    newWidth: number,
    yearMultiplier: number,
    screenWidth: number
  ): number => {
    return (
      ((earliestYearForNewLevel -
        Math.min(earliestYearForNewLevel, currentYear)) *
        newWidth) /
      yearMultiplier -
      screenWidth / 2
    );
  };

  public static calculateCenterYearForLevel = (
    scrollOffset: number,
    screenWidth: number,
    elementWidth: number,
    level: number
  ): number => {
    const centerOffset = scrollOffset + screenWidth / 2;
    const currentIndex = centerOffset / elementWidth;
    return (
      this.getEarliestYearForLevel(level) -
      currentIndex *
      (level > 2
        ? this.getYearMultiplier(level)
        : 1 / this.getYearMultiplier(level))
    );
  };

  public static calculateNewZoomValue = (
    zoomValue: number,
    zoomDirection: number
  ): number => {
    return Math.max(
      MeterConstants.minZoomValue,
      Math.min(
        MeterConstants.maxZoomValue,
        zoomValue + zoomDirection * MeterConstants.zoomStep
      )
    );
  };

  public static calculateEventOffsetPosition = (date: Date | number, elementWidth: number, virtualItems: VirtualItem[], level: number) => {

    // TODO: Need to implement logic to caluclate Offset out of date and virtual indexes and levels somehow

    // console.log('virtualItems', virtualItems);

    // console.log(
    //   "event.startDate",
    //   event.startDate instanceof Date
    //     ? event.startDate.getFullYear() < 0
    //       ? format(event.startDate, "-yyyy - MM - dd")
    //       : format(event.startDate, "yyyy - MM - dd")
    //     : event.startDate
    // );

    // console.log(
    //   "event.endDate",
    //   event.endDate instanceof Date
    //     ? event.endDate.getFullYear() < 0
    //       ? format(event.endDate, "-yyyy - MM - dd")
    //       : format(event.endDate, "yyyy - MM - dd")
    //     : event.endDate
    // );

    return 0;
  };


  private static extractYearOutOfMeterElement = (element: number | Date) => {
    if (element instanceof Date) {
      return element.getFullYear()
    }
    return element;
  }

  private static calculateYearForLevelAndOffset = (offset: number, elementWith: number, level: number) => {
    const yearMultiplier = this.getYearMultiplier(level);
    if (level < 3) return ((offset / elementWith) / yearMultiplier) - this.getEarliestYearForLevel(level);
    return ((offset / elementWith) * yearMultiplier) - this.getEarliestYearForLevel(level)
  }

  private static extractEventAndVirtualItemEndStartYear = (event: EventDTO, virtualItems: VirtualItem[], elementWith: number, level: number) => {
    const eventStartYear = this.extractYearOutOfMeterElement(event.startDate);
    const eventEndYear = this.extractYearOutOfMeterElement(event.endDate);

    const startVirtualItem = virtualItems[0];
    const endVirtualItem = virtualItems[virtualItems.length - 1];

    const virtualItemStartOffset = this.extractYearOutOfMeterElement(startVirtualItem.start);
    const virtualItemEndOffset = this.extractYearOutOfMeterElement(endVirtualItem.end)
    const virtualItemStartYear = this.calculateYearForLevelAndOffset(virtualItemStartOffset, elementWith, level);
    const virtualItemEndYear = this.calculateYearForLevelAndOffset(virtualItemEndOffset, elementWith, level);

    return { eventStartYear: eventStartYear, eventEndYear: eventEndYear, virtualItemStartYear: virtualItemStartYear, virtualItemEndYear: virtualItemEndYear, virtualItemStartOffset: virtualItemStartOffset, virtualItemEndOffset: virtualItemEndOffset }
  }

  public static checkIfEventYearSpanInRange = (event: EventDTO, virtualItems: VirtualItem[], elementWith: number, level: number) => {
    if (virtualItems.length === 0) return false;

    const { eventStartYear, eventEndYear, virtualItemStartYear, virtualItemEndYear } = this.extractEventAndVirtualItemEndStartYear(event, virtualItems, elementWith, level);

    if (eventStartYear < virtualItemStartYear && eventEndYear < virtualItemStartYear) return false;
    if (eventStartYear > virtualItemEndYear && eventEndYear > virtualItemEndYear) return false;
    return true;
  }
}
