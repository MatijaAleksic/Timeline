"use client";

import { addMonths } from "date-fns";
import styles from "./MeterCore.module.scss";
import { useState, useRef, useEffect } from "react";
import MeterHeader from "../MeterHeader/MeterHeader";
import MeterMonth from "../MeterMonth/MeterMonth";
import { useVirtualizer } from "@tanstack/react-virtual";
import DummyData from "@/util/data/DummyData";
import MeterConstants from "@/util/constants/MeterConstants";
import MeterRangeDTO from "@/util/dto/MeterRangeDTO";

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
  const [lastDragTime, setLastDragTime] = useState(0);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const meterComponentRef = useRef<HTMLDivElement>(null);

  const [dragStartElementIndex, setDragStartElementIndex] =
    useState<MeterRangeDTO>();
  const [dragStartElementIndex1, setDragStartElementIndex1] =
    useState<number>();

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

    if (rowVirtualizer.range) {
      setDragStartElementIndex({
        start: rowVirtualizer.range.startIndex,
        end: rowVirtualizer.range.endIndex,
      });

      const currentElementIndex = Math.floor(
        (rowVirtualizer.scrollOffset! + event.pageX) / elementWidth
      );

      setDragStartElementIndex1(currentElementIndex);
    }

    setLastDragTime(Date.now());
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const moveX = event.pageX - startX;

    // console.log("scrollLeft", scrollLeft);
    // console.log("scrollLeft - moveX", scrollLeft - moveX);

    // console.log(rowVirtualizer.scrollBy(scrollLeft - moveX));

    const currentElementIndex = Math.floor(
      (rowVirtualizer.scrollOffset! + event.pageX) / elementWidth
    );

    const range = rowVirtualizer.calculateRange();
    console.log("start", range?.startIndex, "end ", range?.endIndex);

    // console.log("currentDragElement", currentElementIndex);

    if (meterComponentRef.current) {
      rowVirtualizer!.scrollToOffset(scrollLeft - moveX);
      // meterComponentRef.current.scrollLeft = scrollLeft - moveX;
    }

    requestAnimationFrame(() => {
      rowVirtualizer.measure();
    });

    // console.log(rowVirtualizer.isScrolling);
    // rowVirtualizer.measure();
  };
  const handleMouseUp = (event: React.MouseEvent) => {
    setIsDragging(false);
    const endTime = Date.now();
    const deltaTime = endTime - lastDragTime;

    //If dragging lasts more than 0.5 seconds dont apply slide effect
    if (deltaTime > MeterConstants.minTimeElapsedForSlidingEffect) return;

    const moveX = event.pageX - startX;
    const velocity = deltaTime === 0 ? 0 : -(moveX / deltaTime);
    // applyInertia(velocity * 10);
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
    const mouseX = event.clientX;
    const element = meterComponentRef.current;
    if (!element) return;
    const boundingRect = element.getBoundingClientRect();
    const offsetX = mouseX - boundingRect.left;

    const zoomDirection = event.deltaY > 0 ? -1 : 1;

    const newZoom = Math.max(
      minZoomPercentageValue,
      Math.min(maxZoomPercentageValue, scrollValue + zoomDirection * zoomStep)
    );
    const prevZoomValue = scrollValue;
    setScrollValue(newZoom);
    setElementWidth(screenWidth * (scrollValue / 100));

    const currentElementIndex = Math.floor(
      (rowVirtualizer.scrollOffset! + offsetX) / elementWidth
    );
    // console.log("currentElementIndex", currentElementIndex);

    const currentElement =
      rowVirtualizer.getVirtualItems()[currentElementIndex];
    // console.log("currentElement", currentElement);

    rowVirtualizer.scrollToOffset(
      (currentElement.start + mouseX) * (scrollValue / 100)
    );

    // const zoomRatio = newZoom / prevZoomValue;
    // const newScrollLeft = offsetX * zoomRatio;
    // if (element) {
    //   element.scrollLeft = newScrollLeft * (scrollValue / 100);
    // }
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

  const rowVirtualizer = useVirtualizer({
    count: monthData.length,
    getScrollElement: () => meterComponentRef.current,
    estimateSize: () => elementWidth,
    horizontal: true,
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
                date={monthData[virtualItem.index]}
                width={elementWidth}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MeterCore;
