"use client";

import { addMonths } from "date-fns";
import styles from "./MeterCore.module.scss";
import { useState, useRef, useEffect } from "react";
import MeterHeader from "../MeterHeader/MeterHeader";
import MeterMonth from "../MeterMonth/MeterMonth";
import { useVirtualizer } from "@tanstack/react-virtual";
import DummyData from "@/util/DummyData";
// import useDebounce from "@/util/useDebounce";

//FOR VIRTUAL SCROLL PURPOSES USE NEXT LIBRARIES:
// React Window
// React Virtual
// React Infinite Scroller
// React Lazyload

function MeterCore() {
  const minZoomPercentageValue = 30;
  const maxZoomPercentageValue = 100;
  const zoomStep = 5;

  const [date, setDate] = useState<Date>(new Date());

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const meterComponentRef = useRef<HTMLDivElement>(null);

  const [scrollValue, setScrollValue] = useState<number>(100);

  // Meter Navigation
  // ===============================================================
  const handlePreviousMonth = () => {
    setDate(addMonths(date, -1));
  };
  const handleNextMonth = () => {
    setDate(addMonths(date, 1));
  };
  // ===============================================================

  // Handles dragging the meter so you dont have to use scroll wheel
  // ===============================================================
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(event.pageX - (meterComponentRef.current?.offsetLeft || 0));
    setScrollLeft(meterComponentRef.current?.scrollLeft || 0);
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const moveX = event.pageX - startX;
    if (meterComponentRef.current) {
      meterComponentRef.current.scrollLeft = scrollLeft - moveX;
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  // ===============================================================

  const handleZoom = (event: any) => {
    // console.log("--------------------");
    const mouseX = event.clientX;

    const element = meterComponentRef.current;
    if (!element) return;

    const boundingRect = element.getBoundingClientRect();
    const offsetX = mouseX - boundingRect.left;
    // console.log("offsetX:", offsetX);

    // Determine the direction of zoom (in or out)
    const zoomDirection = event.deltaY > 0 ? -1 : 1;
    // Gets new zoom value from min to max zoom percentage value
    const newZoom = Math.max(
      minZoomPercentageValue,
      Math.min(maxZoomPercentageValue, scrollValue + zoomDirection * zoomStep)
    );
    const prevZoomValue = scrollValue;
    setScrollValue(newZoom);
    setElementWidth(screenWidth * (newZoom / 100));
    // console.log("prevZoomValue:", scrollValue);
    // console.log("newZoomValue:", newZoom);

    // Adjust scroll position based on zoom factor
    const zoomRatio = newZoom / prevZoomValue;
    const newScrollLeft = offsetX * zoomRatio;
    // console.log("zoomRatio", zoomRatio);
    // console.log("newScrollLeft", newScrollLeft);

    if (element) {
      element.scrollLeft = newScrollLeft * (newZoom / 100);
    }

    // Trigger re-calculation of virtualizer's sizes
    // rowVirtualizer.update(); // Force re-calculation of sizes after zoom
    // console.log("--------------------");
  };

  // =============
  // VIRTUALIZER
  // =============

  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [elementWidth, setElementWidth] = useState<number>(screenWidth);

  console.log("screenWidth", screenWidth);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => setScreenWidth(window.innerWidth);
      updateWidth();

      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  const monthData = DummyData.getMonths();

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: monthData.length,
    getScrollElement: () => meterComponentRef.current,
    estimateSize: () => elementWidth, // Adjust the width of each item (e.g., 150px)
    horizontal: true, // Enable horizontal scrolling
  });

  console.log("elementWidth: ", elementWidth, " px");

  return (
    <div className={styles.meterWrapper}>
      <MeterHeader
        handleNextMonth={handleNextMonth}
        handlePreviousMonth={handlePreviousMonth}
        date={date}
      />
      <div
        className={styles.meterComponent}
        onWheel={handleZoom}
        ref={meterComponentRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            width: `${rowVirtualizer.getTotalSize() * (scrollValue / 100)}px`, // Total width of the items
            height: "100%", // Full height of the container
            position: "relative",
            display: "flex", // Use flexbox to align the items horizontally
          }}
        >
          <div className={styles.meterCenterLine} />
          {/* Only the visible items in the virtualizer, manually positioned to be in view */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: virtualItem.start * (scrollValue / 100), // Horizontal position
                width: `${virtualItem.size * (scrollValue / 100)}px`, // Item width
                height: "100%", // Full height of the container
              }}
            >
              <MeterMonth
                date={monthData[virtualItem.index]}
                width={elementWidth}
              ></MeterMonth>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MeterCore;
