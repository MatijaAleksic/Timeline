"use client";

import { addMonths } from "date-fns";
import styles from "./MeterCoreReactWindow.module.scss";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import MeterHeader from "../MeterHeader/MeterHeader";
import MeterMonth from "../MeterMonth/MeterMonth";
import DummyData from "@/util/data/DummyData";
import MeterConstants from "@/util/constants/MeterConstants";
import useDebouncedWheel from "@/util/hooks/useDebounceWheel";
import { FixedSizeList as List } from "react-window";

function MeterCoreReactWindow() {
  const [date, setDate] = useState<Date>(new Date(2025, 0, 1, 10));
  const [scrollValue, setScrollValue] = useState<number>(100);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastDragTime, setLastDragTime] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const listRef = useRef<List>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const monthData = DummyData.getMonths(date);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => {
        const newWidth = window.innerWidth;
        setScreenWidth(newWidth);
        setElementWidth(newWidth);
      };
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  // Scroll handlers
  const handlePreviousMonth = () => setDate(addMonths(date, -1));
  const handleNextMonth = () => setDate(addMonths(date, 1));

  // Handles ZOOM
  // ===============================================================
  const handleZoom = (event: any) => {
    const zoomDirection = event.deltaY > 0 ? -1 : 1;
    const newZoom = Math.max(
      MeterConstants.minZoomPercentageValue,
      Math.min(
        MeterConstants.maxZoomPercentageValue,
        scrollValue + zoomDirection * MeterConstants.zoomStep
      )
    );

    setScrollValue(newZoom);
    setElementWidth(screenWidth * (newZoom / 100));
    listRef.current?.scrollTo(0);
  };
  const debouncedHandleZoom = useDebouncedWheel(
    handleZoom,
    MeterConstants.debounceWheelMilliseconds
  );
  // ===============================================================

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(event.pageX);
    setScrollLeft(containerRef.current?.scrollLeft || 0);
    setLastDragTime(Date.now());
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const moveX = event.pageX - startX;
    if (listRef.current) {
      listRef.current.scrollTo(scrollLeft - moveX);
    }
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    setIsDragging(false);
    const endTime = Date.now();
    const deltaTime = endTime - lastDragTime;

    if (deltaTime > 500) return;

    const moveX = event.pageX - startX;
    const velocity = deltaTime === 0 ? 0 : -(moveX / deltaTime);

    applyInertia(velocity * 20);
  };

  const applyInertia = (velocity: number) => {
    let currentVelocity = velocity;
    let currentScrollPosition = containerRef.current?.scrollLeft || 0;

    const inertiaScroll = () => {
      if (!containerRef.current || Math.abs(currentVelocity) < 0.5) return;

      currentScrollPosition += currentVelocity;
      containerRef.current.scrollLeft = currentScrollPosition;
      if (listRef.current) {
        listRef.current.scrollTo(currentScrollPosition);
      }
      currentVelocity *= 0.9;
      requestAnimationFrame(inertiaScroll);
    };
    inertiaScroll();
  };

  return (
    <div className={styles.meterWrapper}>
      <MeterHeader
        handleNextMonth={handleNextMonth}
        handlePreviousMonth={handlePreviousMonth}
        date={date}
      />
      <div
        className={styles.meterComponent}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
        onWheel={debouncedHandleZoom}
      >
        <List
          ref={listRef}
          height={elementWidth}
          direction="horizontal"
          itemCount={monthData.length}
          itemSize={elementWidth}
          width={elementWidth * monthData.length}
          layout="horizontal"
        >
          {({ index, style }) => (
            <div style={style} className={styles.virtualizerContainer}>
              <MeterMonth
                date={monthData[index]}
                width={elementWidth}
                zoomValue={scrollValue}
              />
            </div>
          )}
        </List>
      </div>
    </div>
  );
}

export default MeterCoreReactWindow;
