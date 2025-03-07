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

  const updateVirtualItems = () => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;
    const scrollPosition = horizontal
      ? scrollElement.scrollLeft
      : scrollElement.scrollTop;
    const containerSize = horizontal
      ? scrollElement.clientWidth
      : scrollElement.clientHeight;

    const startIndex = Math.floor(scrollPosition / elementWidth);
    const endIndex = Math.min(
      count - 1,
      Math.floor((scrollPosition + containerSize) / elementWidth)
    );

    const overScanStart = Math.max(0, startIndex - overscan);
    const overScanEnd = Math.min(count - 1, endIndex + overscan);

    const items: VirtualItem[] = [];
    for (let i = overScanStart; i <= overScanEnd; i++) {
      const start = i * elementWidth;
      const end = start + elementWidth;
      items.push({
        index: i,
        start,
        end,
        key: `virtual-item-${i}`,
        size: elementWidth,
      });
    }
    setVirtualItems(items);
    setScrollOffset(scrollPosition);

    if (onChange) {
      const event: VirtualizerEvent = {
        range: { startIndex, endIndex },
        getVirtualItems,
        getVirtualIndexes,
        options,
        scrollOffset: scrollPosition,
        getTotalSize: () => totalSize,
        getSize: () => elementWidth,
        calculateRange: () => ({ startIndex, endIndex }),
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
    // updateVirtualItems();
  };

  const scrollToOffset = (offset: number, startElementIndex: number) => {
    const virtualIndexes = getVirtualIndexes();
    let indexDelta = 0;

    if (
      virtualIndexes.length > 0 &&
      !virtualIndexes.includes(startElementIndex)
    ) {
      indexDelta = virtualIndexes[0] - startElementIndex;
    }

    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    if (horizontal) {
      scrollElement.scrollLeft = offset - indexDelta * elementWidth;
    } else {
      scrollElement.scrollTop = offset;
    }
    updateVirtualItems();
  };

  const scrollBy = (delta: number, startElementIndex: number) => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    const virtualIndexes = getVirtualIndexes();
    if (virtualIndexes.length === 0) return;

    let indexDelta = 0;
    if (
      virtualIndexes.length > 0 &&
      !virtualIndexes.includes(startElementIndex)
    ) {
      indexDelta = virtualIndexes[0] - startElementIndex;
    }

    if (horizontal) {
      scrollElement.scrollLeft += delta;
      // scrollElement.scrollLeft - indexDelta * elementWidth + delta;
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
