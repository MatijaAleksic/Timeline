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
  const minZoomPercentageValue = 50;
  const maxZoomPercentageValue = 200;
  const zoomStep = 5;

  const [date, setDate] = useState<Date>(new Date());

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const meterComponentRef = useRef<HTMLDivElement>(null);

  const [lastVelocity, setLastVelocity] = useState(0);
  const [lastDragTime, setLastDragTime] = useState(0); // Track last drag time

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
    setLastDragTime(Date.now());
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const moveX = event.pageX - startX;
    if (meterComponentRef.current) {
      meterComponentRef.current.scrollLeft = scrollLeft - moveX;
    }
  };
  const handleMouseUp = (event: React.MouseEvent) => {
    console.log("event", event);

    setIsDragging(false);
    const endTime = Date.now();
    const deltaTime = endTime - lastDragTime;
    const moveX = event.pageX - startX;

    // Calculate velocity (distance / time)
    const velocity = deltaTime === 0 ? 0 : moveX / deltaTime;
    setLastVelocity(velocity); // Store velocity for inertia
    applyInertia(); // Apply inertia after release
  };

  // Inertia application after mouse release
  const applyInertia = () => {
    const inertiaDamping = 0.95; // Damping factor to slow down
    let velocity = lastVelocity;

    const inertiaScroll = () => {
      if (!meterComponentRef.current || Math.abs(velocity) < 0.1) return; // Stop when velocity is too small

      const element = meterComponentRef.current;
      element.scrollLeft += velocity; // Apply the current velocity to scroll
      velocity *= inertiaDamping; // Gradually decrease velocity (damping)

      requestAnimationFrame(inertiaScroll); // Continue inertia scrolling
    };

    inertiaScroll();
  };
  // ===============================================================

  const handleZoom = (event: any) => {
    const mouseX = event.clientX;
    const element = meterComponentRef.current;
    if (!element) return;
    const boundingRect = element.getBoundingClientRect();
    const offsetX = mouseX - boundingRect.left;
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
    // Adjust scroll position based on zoom factor
    const zoomRatio = newZoom / prevZoomValue;
    const newScrollLeft = offsetX * zoomRatio;
    if (element) {
      element.scrollLeft = newScrollLeft * (newZoom / 100);
    }
    rowVirtualizer.measure();
  };

  // =============
  // VIRTUALIZER
  // =============
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [elementWidth, setElementWidth] = useState<number>(screenWidth);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => setScreenWidth(window.innerWidth);
      updateWidth();

      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  const monthData = DummyData.getMonths(date);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: monthData.length,
    getScrollElement: () => meterComponentRef.current,
    estimateSize: () => elementWidth, // Adjust the width of each item (e.g., 150px)
    // estimateSize: () => screenWidth * (scrollValue / 100),
    horizontal: true, // Enable horizontal scrolling
  });

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
        onMouseLeave={handleMouseUp}
      >
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            width: `${rowVirtualizer.getTotalSize() * (scrollValue / 100)}px`,
            height: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className={styles.meterCenterLine} />
          {rowVirtualizer.getVirtualItems().map((virtualItem, index) => (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: index * elementWidth,
                width: `${elementWidth}px`,
                height: "100%",
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
