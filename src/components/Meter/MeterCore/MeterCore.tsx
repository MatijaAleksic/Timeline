"use client";

import { addMonths } from "date-fns";
import styles from "./MeterCore.module.scss";
import { useState, useRef, useEffect } from "react";
import MeterHeader from "../MeterHeader/MeterHeader";
import MeterMonth from "../MeterMonth/MeterMonth";
import { useVirtualizer } from "@tanstack/react-virtual";
import DummyData from "@/util/data/DummyData";
import MeterConstants from "@/util/constants/MeterConstants";
import useDebouncedWheel from "@/util/hooks/useDebounceWheel";

//FOR VIRTUAL SCROLL PURPOSES USE NEXT LIBRARIES:
// React Window
// React Virtual
// React Infinite Scroller
// React Lazyload

function MeterCore() {
  const [date, setDate] = useState<Date>(new Date(2025, 0, 1, 10));

  const [isDragging, setIsDragging] = useState(false);
  const [lastDragTime, setLastDragTime] = useState(0);
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
    setLastDragTime(Date.now());
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const moveX = event.pageX - startX;
    rowVirtualizer!.scrollToOffset(scrollLeft - moveX);
    requestAnimationFrame(() => {
      rowVirtualizer.measure();
    });
  };
  const handleMouseUp = (event: React.MouseEvent) => {
    setIsDragging(false);
    const endTime = Date.now();
    const deltaTime = endTime - lastDragTime;

    //If dragging lasts more than 0.5 seconds dont apply slide effect
    if (deltaTime > MeterConstants.minTimeElapsedForSlidingEffect) return;

    const moveX = event.pageX - startX;
    const velocity = deltaTime === 0 ? 0 : -(moveX / deltaTime);
    applyInertia(velocity * 10);
  };
  const applyInertia = (vel: number) => {
    let velocity = vel;
    const inertiaScroll = () => {
      if (
        !meterComponentRef.current ||
        Math.abs(velocity) < MeterConstants.slidingCutoff
      )
        return;
      meterComponentRef.current.scrollLeft += velocity;
      velocity *= MeterConstants.slidingInertiaDumping;
      requestAnimationFrame(inertiaScroll);
    };
    inertiaScroll();
  };
  // ===============================================================

  const handleZoom = (event: any) => {
    const element = meterComponentRef.current;
    if (!element) return;

    const boundingRect = element.getBoundingClientRect();
    const offsetX = event.clientX - boundingRect.left;

    const zoomDirection = event.deltaY > 0 ? -1 : 1;

    const newZoom = Math.max(
      MeterConstants.minZoomPercentageValue,
      Math.min(
        MeterConstants.maxZoomPercentageValue,
        scrollValue + zoomDirection * MeterConstants.zoomStep
      )
    );

    const scaleFactor = newZoom / scrollValue;

    setScrollValue(newZoom);
    setElementWidth(screenWidth * (newZoom / 100));

    const newScrollOffset =
      (rowVirtualizer.scrollOffset! + offsetX) * scaleFactor - offsetX;

    requestAnimationFrame(() => {
      rowVirtualizer.measure();
    });

    rowVirtualizer.scrollToOffset(newScrollOffset);
  };

  // =============
  // VIRTUALIZER
  // =============
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [elementWidth, setElementWidth] = useState<number>(screenWidth);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => setScreenWidth(window.innerWidth);
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  useEffect(() => {
    setElementWidth(screenWidth); // Update element width after screenWidth is set
  }, [screenWidth]);

  const monthData = DummyData.getMonths(date);

  const rowVirtualizer = useVirtualizer({
    count: monthData.length,
    getScrollElement: () => meterComponentRef.current,
    estimateSize: () => elementWidth,
    horizontal: true,
    overscan: 20, // how many items to prerender on each side of virtual scroll
  });

  const debouncedHandleZoom = useDebouncedWheel(handleZoom, 25);

  return (
    <div className={styles.meterWrapper}>
      <MeterHeader
        handleNextMonth={handleNextMonth}
        handlePreviousMonth={handlePreviousMonth}
        date={date}
      />
      <div
        className={styles.meterComponent}
        onWheel={debouncedHandleZoom}
        ref={meterComponentRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsDragging(false)}
      >
        <div
          className={styles.virtualizerWrapper}
          style={{
            width: `${rowVirtualizer.getTotalSize() * (scrollValue / 100)}px`,
          }}
        >
          <div className={styles.meterCenterLine} />
          {rowVirtualizer.getVirtualItems().map((virtualItem, index) => (
            <div
              className={styles.virtualizerContainer}
              key={virtualItem.key}
              style={{
                left: index * elementWidth,
                width: `${elementWidth}px`,
              }}
            >
              <MeterMonth
                key={virtualItem.key}
                date={monthData[virtualItem.index]}
                width={elementWidth}
                zoomValue={scrollValue}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MeterCore;
