import MeterConstants from "../constants/MeterConstants";
import { RefObject } from "react";
import { VirtualItem } from "../dto/VirtualScrollDTO/VirtualItem";
import TimelineQueryDTO from "../dto/VirtualScrollDTO/QueryTimelineDTO";

export default class MeterService {
  public static generateVirtualItems = (
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
      case 2:
        return MeterConstants.earliestYearLevel1And2;
      default:
        return MeterConstants.earliestYearRestLevels;
    }
  };

  public static isInMiddlePercentage(
    centralIndex: number,
    virtualIndexes: number[],
    middlePercent: number
  ): boolean {
    if (
      virtualIndexes.length === 0 ||
      middlePercent <= 0 ||
      middlePercent >= 100
    )
      return false;

    const startFraction = (1 - middlePercent / 100) / 2;
    const endFraction = 1 - startFraction;

    const startIndex = Math.floor(virtualIndexes.length * startFraction);
    const endIndex = Math.ceil(virtualIndexes.length * endFraction);

    const pos = virtualIndexes.indexOf(centralIndex);
    return pos !== -1 && pos >= startIndex && pos < endIndex;
  }

  public static getRange = (
    clientWidth: number,
    levelElementsLength: number,
    scrollOffset: number,
    elementWidth: number
  ) => {
    const startIndex = Math.max(0, Math.floor(scrollOffset / elementWidth));
    const endIndex = Math.min(
      levelElementsLength - 1,
      Math.floor((scrollOffset + clientWidth) / elementWidth)
    );
    return { start: startIndex, end: endIndex };
  };

  public static calculateCentralIndex = (
    scrollLeft: number,
    clientWidth: number,
    elementWidth: number
  ): number => {
    return Math.floor((scrollLeft + clientWidth / 2) / elementWidth);
  };

  public static calculateOffsetForLevelTransition = (
    previousLevel: number,
    newLevel: number,
    currentScrollOffset: number,
    previousElementWidth: number,
    newElementWidth: number,
    screenWidth: number
  ): number => {
    const currentYearMultiplier = this.getYearMultiplier(previousLevel);
    const newYearMultiplier = this.getYearMultiplier(newLevel);

    const earliestYearPrevious = this.getEarliestYearForLevel(previousLevel);
    const earliestYearNew = this.getEarliestYearForLevel(newLevel);

    // 1. Calculate center year in previous level
    const centerOffset = currentScrollOffset + screenWidth / 2;
    const indexAtCenter = centerOffset / previousElementWidth;
    const centerYear =
      previousLevel < 3
        ? earliestYearPrevious - indexAtCenter / currentYearMultiplier
        : earliestYearPrevious - indexAtCenter * currentYearMultiplier;

    // 3. Convert center year to offset in new level
    const offsetInNewLevel =
      newLevel < 3
        ? (earliestYearNew - centerYear) * newYearMultiplier * newElementWidth
        : ((earliestYearNew - centerYear) / newYearMultiplier) *
          newElementWidth;

    // 4. Adjust so center year appears at screen center
    const scrollOffset = Math.max(0, offsetInNewLevel - screenWidth / 2);
    return scrollOffset;
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

  public static calculateEventWidth = (
    startDate: Date | number,
    endDate: Date | number,
    level: number,
    elementWidth: number
  ) => {
    return (
      this.calculateOffsetForLevelAndDate(endDate, level, elementWidth) -
      this.calculateOffsetForLevelAndDate(startDate, level, elementWidth)
    );
  };

  public static calculateOffsetForLevelAndDate = (
    date: Date | number,
    level: number,
    elementWidth: number
  ) => {
    let calculatedOffset: number = 0;
    const yearMultiplier = this.getYearMultiplier(level);

    // Days
    if (level === 1) {
      // If days implemented, logic here has to be implemented
    }
    //Months
    else if (level === 2) {
    }
    // 1, 10, 100, ...
    else {
      calculatedOffset =
        (this.getEarliestYearForLevel(level) / yearMultiplier +
          (date as number)) *
        elementWidth;
    }

    return calculatedOffset;
  };

  public static calculateYearFromVirtualItemIndex = (
    level: number,
    startVirtualIndex: number,
    endVirtualIndex: number
  ) => {
    const yearMultiplier = this.getYearMultiplier(level);
    const yearsInThePast = this.getEarliestYearForLevel(level);

    switch (level) {
      case 1: {
        // TODO: Not implemented
      }
      case 2: {
        const startYear = Math.floor(
          -yearsInThePast + startVirtualIndex / yearMultiplier
        );
        const endYear = Math.ceil(
          -yearsInThePast + endVirtualIndex / yearMultiplier
        );
        const startMonth = Math.ceil(startVirtualIndex % yearMultiplier);
        const endMonth = Math.floor(endVirtualIndex % yearMultiplier);
        return {
          level: level,
          startYear: startYear,
          endYear: endYear,
          startMonth: startMonth,
          endMonth: endMonth,
        } as TimelineQueryDTO;
      }
      default: {
        const startYear = -yearsInThePast + startVirtualIndex * yearMultiplier;
        const endYear = -yearsInThePast + endVirtualIndex * yearMultiplier;
        return {
          level: level,
          startYear: startYear,
          endYear: endYear,
        } as TimelineQueryDTO;
      }
    }
  };

  // public static checkIfEventYearSpanInRange = (
  //   event: EventDTO,
  //   virtualItems: VirtualItem[],
  //   elementWidth: number,
  //   level: number
  // ) => {
  //   if (virtualItems.length === 0) return false;

  //   const eventStartOffset = this.calculateOffsetForLevelAndDate(
  //     event.startDate,
  //     level,
  //     elementWidth
  //   );
  //   const eventEndOffset = this.calculateOffsetForLevelAndDate(
  //     event.endDate,
  //     level,
  //     elementWidth
  //   );
  //   const startVirtualItem = virtualItems[0];
  //   const endVirtualItem = virtualItems[virtualItems.length - 1];
  //   const virtualItemStartOffset = startVirtualItem.start;
  //   const virtualItemEndOffset = endVirtualItem.end;

  //   if (
  //     (eventStartOffset < virtualItemStartOffset &&
  //       eventEndOffset < virtualItemStartOffset) ||
  //     (eventStartOffset > virtualItemEndOffset &&
  //       eventEndOffset > virtualItemEndOffset)
  //   )
  //     return false;

  //   return true;
  // };
}
