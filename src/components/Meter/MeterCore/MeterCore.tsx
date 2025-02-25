"use client";

import { addMonths } from "date-fns";
import styles from "./MeterCore.module.scss";
import { useState, useRef } from "react";
import MeterHeader from "../MeterHeader/MeterHeader";
import MeterMonth from "../MeterMonth/MeterMonth";

function MeterCore() {
  const minZoomPercentageValue = 30;
  const maxZoomPercentageValue = 100;
  const [date, setDate] = useState<Date>(new Date());
  const [scrollValue, setScrollValue] = useState<number>(100);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const meterComponentRef = useRef<HTMLDivElement>(null);

  const handlePreviousMonth = () => {
    setDate(addMonths(date, -1));
  };

  const handleNextMonth = () => {
    setDate(addMonths(date, 1));
  };

  const handleScroll = (event: any) => {
    setScrollValue((prev) => {
      const newValue = event.deltaY > 0 ? prev - 1 : prev + 1;
      return Math.max(
        minZoomPercentageValue,
        Math.min(maxZoomPercentageValue, newValue)
      );
    });
  };

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

  const handleZoom = (event: any) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const element = meterComponentRef.current;
    if (!element) return;

    const boundingRect = element.getBoundingClientRect();
    const offsetX = mouseX - boundingRect.left;
    const offsetY = mouseY - boundingRect.top;

    const prevScrollValue = scrollValue;
    const newZoom = Math.max(
      minZoomPercentageValue,
      Math.min(
        maxZoomPercentageValue,
        scrollValue + (event.deltaY > 0 ? -1 : 1)
      )
    );

    setScrollValue(newZoom);

    if (element) {
      const zoomRatio = newZoom / prevScrollValue;
      const newScrollLeft = (scrollLeft - offsetX) * zoomRatio + offsetX;
      const newScrollTop = (scrollTop - offsetY) * zoomRatio + offsetY;

      element.scrollLeft = newScrollLeft * (scrollValue / 100) - 15;
      element.scrollTop = newScrollTop * (scrollValue / 100);
    }
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
        <MeterMonth widthPercentage={scrollValue} date={date}></MeterMonth>
        <MeterMonth widthPercentage={scrollValue} date={date}></MeterMonth>
        <MeterMonth widthPercentage={scrollValue} date={date}></MeterMonth>
        <MeterMonth widthPercentage={scrollValue} date={date}></MeterMonth>
        <MeterMonth widthPercentage={scrollValue} date={date}></MeterMonth>
      </div>
    </div>
  );
}

export default MeterCore;
