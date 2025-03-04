"use client";

import { useEffect, useRef, useState } from "react";

const ITEM_HEIGHT = 50; // Fixed height for each item
const VISIBLE_COUNT = 10; // Number of items to show at once (this depends on container size)

const DummyData = Array.from(
  { length: 1000 },
  (_, index) => `Item ${index + 1}`
);

const CustomVirtualScroll = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  const updateVisibleItems = () => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const scrollTop = containerRef.current.scrollTop;

      const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
      const endIndex = Math.min(
        DummyData.length - 1,
        Math.floor((scrollTop + containerHeight) / ITEM_HEIGHT)
      );

      const newVisibleItems = [];
      for (let i = startIndex; i <= endIndex; i++) {
        newVisibleItems.push(i);
      }

      setVisibleItems(newVisibleItems);
    }
  };

  // Update the visible items whenever the container is scrolled
  useEffect(() => {
    const handleScroll = () => {
      updateVisibleItems();
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);

    // Initial update
    updateVisibleItems();

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Create a virtualized list: only render items in the visible range
  return (
    <div
      ref={containerRef}
      style={{
        height: `${VISIBLE_COUNT * ITEM_HEIGHT}px`,
        overflowY: "auto",
        border: "1px solid #ddd",
        position: "relative",
      }}
    >
      <div
        style={{
          height: `${DummyData.length * ITEM_HEIGHT}px`, // Total height of the list
          position: "relative",
        }}
      >
        {visibleItems.map((index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${index * ITEM_HEIGHT}px`, // Place items in the correct position
              height: `${ITEM_HEIGHT}px`,
              width: "100%",
              boxSizing: "border-box",
              borderBottom: "1px solid #eee",
              padding: "10px",
            }}
          >
            {DummyData[index]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomVirtualScroll;
