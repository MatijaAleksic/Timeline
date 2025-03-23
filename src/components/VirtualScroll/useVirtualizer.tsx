"use client";

import { useEffect, useState } from "react";
import { VirtualItem } from "./VirtualScrollDTO/VirtualItem";
import { VirtualizerEvent } from "./VirtualScrollDTO/VirtualizerEvent";

export interface VirtualizerOptions {
  count: number;
  getScrollElement: () => HTMLElement | null;
  elementWidth: number;
  horizontal?: boolean;
  overscan?: number;
  onChange?: (event: VirtualizerEvent) => void;
}

function useVirtualizer(options: VirtualizerOptions) {
  const {
    count,
    getScrollElement,
    elementWidth,
    horizontal = false,
    overscan = 0,
    onChange,
  } = options;
  const [virtualItems, setVirtualItems] = useState<VirtualItem[]>([]);
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const totalSize = count * elementWidth;

  const getVirtualIndexes = () => virtualItems.map((item) => item.index);

  const getVirtualItems = (): VirtualItem[] => virtualItems;

  useEffect(() => {
    updateVirtualItems(); // Recalculate virtual items when element width changes
  }, [elementWidth]);

  const getRange = () => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;
    const scrollPos = horizontal
      ? scrollElement.scrollLeft
      : scrollElement.scrollTop;
    const containerSize = horizontal
      ? scrollElement.clientWidth
      : scrollElement.clientHeight;
    const startIndex = Math.floor(scrollPos / elementWidth);
    const endIndex = Math.min(
      count - 1,
      Math.floor((scrollPos + containerSize) / elementWidth)
    );

    return { start: startIndex, end: endIndex };
  };

  const updateVirtualItems = (newElementWidth?: number) => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    const scrollPosition = horizontal
      ? scrollElement.scrollLeft
      : scrollElement.scrollTop;
    const containerSize = horizontal
      ? scrollElement.clientWidth
      : scrollElement.clientHeight;
    const numVisibleItems = Math.ceil(
      containerSize / (newElementWidth ? newElementWidth : elementWidth)
    );

    const startIndex = Math.max(
      0,
      Math.floor(
        scrollPosition / (newElementWidth ? newElementWidth : elementWidth)
      )
    );
    const endIndex = Math.min(count - 1, startIndex + numVisibleItems - 1);

    let overScanStart = Math.max(0, startIndex - overscan);
    const overScanEnd = Math.min(count - 1, endIndex + overscan);

    if (overScanStart > 0 && startIndex < overscan) {
      overScanStart = 0;
    }

    const items: VirtualItem[] = [];
    for (let i = overScanStart; i <= overScanEnd; i++) {
      items.push({
        index: i,
        start: i * (newElementWidth ? newElementWidth : elementWidth),
        end: (i + 1) * (newElementWidth ? newElementWidth : elementWidth),
        key: `virtual-item-${i}`,
        size: newElementWidth ? newElementWidth : elementWidth,
      });
    }

    setVirtualItems(items);
    setScrollOffset(scrollPosition);

    if (onChange) {
      const event: VirtualizerEvent = {
        range: { startIndex: overScanStart, endIndex: overScanEnd }, // Updated to use overscan
        getVirtualItems,
        getVirtualIndexes,
        options,
        scrollOffset: scrollPosition,
        getTotalSize: () => totalSize,
        getSize: () => elementWidth,
        calculateRange: () => ({
          startIndex: overScanStart,
          endIndex: overScanEnd,
        }),
        getScrollOffset: () => scrollPosition,
      };
      onChange(event);
    }
  };

  const scrollToIndex = (index: number) => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;
    const newOffset = index * elementWidth;
    if (horizontal) {
      scrollElement.scrollLeft = newOffset;
    } else {
      scrollElement.scrollTop = newOffset;
    }
  };

  const scrollToOffset = (offset: number, elementWidth?: number) => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    if (horizontal) {
      scrollElement.scrollLeft = offset;
    } else {
      scrollElement.scrollTop = offset;
    }
    updateVirtualItems(elementWidth);
  };

  const scrollBy = (delta: number) => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    const virtualIndexes = getVirtualIndexes();
    if (virtualIndexes.length === 0) return;

    if (horizontal) {
      scrollElement.scrollLeft += delta;
    } else {
      scrollElement.scrollTop += delta;
    }
    updateVirtualItems();
  };

  return {
    virtualItems,
    totalSize,
    scrollOffset,
    getRange,
    updateVirtualItems,
    scrollToIndex,
    scrollToOffset,
    scrollBy,
    measure: updateVirtualItems,
    getVirtualItems: () => virtualItems,
    getVirtualIndexes,
  };
}

export default useVirtualizer;
