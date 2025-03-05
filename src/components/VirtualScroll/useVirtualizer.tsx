"use client";

import { useEffect, useState } from "react";
import { VirtualItem } from "./VirtualScrollDTO/VirtualItem";
import { VirtualizerEvent } from "./VirtualScrollDTO/VirtualizerEvent";

export interface VirtualizerOptions {
  count: number;
  getScrollElement: () => HTMLElement | null;
  getScrollWrapper: () => HTMLElement | null;
  estimateSize: number;
  horizontal?: boolean;
  overscan?: number;
  onChange?: (event: VirtualizerEvent) => void;
}

function useVirtualizer(options: VirtualizerOptions) {
  const {
    count,
    getScrollElement,
    getScrollWrapper,
    estimateSize,
    horizontal = false,
    overscan = 0,
    onChange,
  } = options;
  const [virtualItems, setVirtualItems] = useState<VirtualItem[]>([]);
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const totalSize = count * estimateSize;

  const updateVirtualItems = () => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;
    const scrollPos = horizontal
      ? scrollElement.scrollLeft
      : scrollElement.scrollTop;
    const containerSize = horizontal
      ? scrollElement.clientWidth
      : scrollElement.clientHeight;
    const startIndex = Math.floor(scrollPos / estimateSize);
    const endIndex = Math.min(
      count - 1,
      Math.floor((scrollPos + containerSize) / estimateSize)
    );

    const overscanStart = Math.max(0, startIndex - overscan);
    const overscanEnd = Math.min(count - 1, endIndex + overscan);

    const items: VirtualItem[] = [];
    for (let i = overscanStart; i <= overscanEnd; i++) {
      const start = i * estimateSize;
      const end = start + estimateSize;
      items.push({
        index: i,
        start,
        end,
        key: `virtual-item-${i}`,
        size: estimateSize,
      });
    }
    setVirtualItems(items);
    setScrollOffset(scrollPos);

    if (onChange) {
      const event: VirtualizerEvent = {
        range: { startIndex, endIndex },
        getVirtualIndexes: () => items.map((item) => item.index),
        options,
        scrollOffset: scrollPos,
        getTotalSize: () => totalSize,
        getSize: () => estimateSize,
        calculateRange: () => ({ startIndex, endIndex }),
        getScrollOffset: () => scrollPos,
      };
      onChange(event);
    }
  };

  return {
    virtualItems,
    totalSize,
    scrollOffset,
    updateVirtualItems,
    scrollToIndex: (index: number) => {
      const scrollElement = getScrollElement();
      if (!scrollElement) return;
      const newOffset = index * estimateSize;
      if (horizontal) {
        scrollElement.scrollLeft = newOffset;
      } else {
        scrollElement.scrollTop = newOffset;
      }
      updateVirtualItems();
    },
    // scrollToOffset: (offset: number) => {
    //   const scrollElement = getScrollElement();
    //   if (!scrollElement) return;
    //   if (horizontal) {
    //     console.log(scrollElement);
    //     scrollElement.scrollLeft = offset;
    //   } else {
    //     scrollElement.scrollTop = offset;
    //   }
    //   updateVirtualItems();
    // },
    scrollToOffset: (offset: number) => {
      const scrollWrapper = getScrollElement();
      if (!scrollWrapper) return;

      // Ensure the offset is within valid bounds
      const newOffset = Math.max(0, Math.min(offset, totalSize));

      // Scroll the wrapper to move the viewport
      scrollWrapper.scrollTo({ left: newOffset, behavior: "smooth" });

      // Update virtual items after scrolling
      requestAnimationFrame(() => {
        updateVirtualItems();
      });
    },
    scrollBy: (delta: number) => {
      const scrollElement = getScrollElement();
      if (!scrollElement) return;
      if (horizontal) {
        scrollElement.scrollLeft += delta;
      } else {
        scrollElement.scrollTop += delta;
      }
      updateVirtualItems();
    },
    measure: updateVirtualItems,
    getVirtualItems: () => virtualItems,
  };
}

export default useVirtualizer;
