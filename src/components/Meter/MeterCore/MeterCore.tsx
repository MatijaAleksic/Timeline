"use client";

import { addMonths } from "date-fns";
import styles from "./MeterCore.module.scss";
import { useState, useRef } from "react";
import MeterHeader from "../MeterHeader/MeterHeader";
import MeterMonth from "../MeterMonth/MeterMonth";
// import useDebounce from "@/util/useDebounce";

//FOR VIRTUAL SCROLL PURPOSES USE NEXT LIBRARIES:
// React Window
// React Virtual
// React Infinite Scroller
// React Lazyload

function MeterCore() {
  // console.log("RENDER");

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
    console.log("--------------------");
    const mouseX = event.clientX;

    const element = meterComponentRef.current;
    if (!element) return;

    const boundingRect = element.getBoundingClientRect();
    const offsetX = mouseX - boundingRect.left;
    console.log("offsetX:", offsetX);

    // Determine the direction of zoom (in or out)
    const zoomDirection = event.deltaY > 0 ? -1 : 1;
    // Gets new zoom value from min to max zoom percentage value
    const newZoom = Math.max(
      minZoomPercentageValue,
      Math.min(maxZoomPercentageValue, scrollValue + zoomDirection * zoomStep)
    );
    const prevZoomValue = scrollValue;
    setScrollValue(newZoom);
    console.log("prevZoomValue:", scrollValue);
    console.log("newZoomValue:", newZoom);

    // Adjust scroll position based on zoom factor
    const zoomRatio = newZoom / prevZoomValue;
    const newScrollLeft = offsetX * zoomRatio;
    console.log("zoomRatio", zoomRatio);
    console.log("newScrollLeft", newScrollLeft);

    if (element) {
      element.scrollLeft = newScrollLeft * (newZoom / 100);
    }
    console.log("--------------------");
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
        onWheel={handleZoom}
        ref={meterComponentRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.meterCenterLine} />
        <MeterMonth widthPercentage={scrollValue} date={date}></MeterMonth>
        <MeterMonth
          widthPercentage={scrollValue}
          date={addMonths(date, 1)}
        ></MeterMonth>
        <MeterMonth
          widthPercentage={scrollValue}
          date={addMonths(date, 2)}
        ></MeterMonth>
        <MeterMonth
          widthPercentage={scrollValue}
          date={addMonths(date, 3)}
        ></MeterMonth>
        <MeterMonth
          widthPercentage={scrollValue}
          date={addMonths(date, 4)}
        ></MeterMonth>
        <MeterMonth
          widthPercentage={scrollValue}
          date={addMonths(date, 5)}
        ></MeterMonth>
      </div>
    </div>
  );
}

export default MeterCore;
