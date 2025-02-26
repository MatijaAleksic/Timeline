"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";
import styles from "./ReactVirtual.module.scss";

function ReactVirtual() {
  // The scrollable element for your list
  const parentRef = React.useRef<HTMLDivElement>(null); // Specify type HTMLDivElement

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // Adjust the width of each item (e.g., 150px)
    horizontal: true, // Enable horizontal scrolling
  });

  // Handle the wheel event for horizontal scrolling
  const handleWheel = (event: React.WheelEvent) => {
    if (parentRef.current) {
      const scrollAmount = event.deltaY > 0 ? 150 : -150; // Adjust scroll amount
      parentRef.current.scrollLeft += scrollAmount; // Now TypeScript knows scrollLeft exists
    }
    event.preventDefault(); // Prevent the default vertical scrolling
  };

  return (
    <>
      {/* The scrollable element for your list */}
      <div
        ref={parentRef}
        className={styles.parent}
        style={{
          width: "100%", // You can set a fixed width here or let it be flexible
          height: "100px", // The height of the scrollable container
          overflowX: "auto", // Allow horizontal scrolling
          overflowY: "hidden", // Hide vertical scrollbar
        }}
        onWheel={handleWheel} // Add wheel handler
      >
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            width: `${rowVirtualizer.getTotalSize()}px`, // Total width of the items
            height: "100%", // Full height of the container
            position: "relative",
            display: "flex", // Use flexbox to align the items horizontally
          }}
        >
          {/* Only the visible items in the virtualizer, manually positioned to be in view */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: virtualItem.start, // Horizontal position
                width: `${virtualItem.size}px`, // Item width
                height: "100%", // Full height of the container
              }}
            >
              Row {virtualItem.index}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ReactVirtual;
