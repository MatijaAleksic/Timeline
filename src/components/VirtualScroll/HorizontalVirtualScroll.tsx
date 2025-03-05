"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useVirtualizer from "./useVirtualizer"; // adjust the import path as needed
import { VirtualItem } from "./VirtualScrollDTO/VirtualItem";
import styles from "./HorizontalVirtualScroll.module.scss";
import MeterConstants from "@/util/constants/MeterConstants";
import useDebouncedWheel from "@/util/hooks/useDebounceWheel";
import DummyData from "@/util/data/DummyData";
import MeterMonth from "../Meter/MeterMonth";

const CustomVirtualScroll = () => {
  const [date, setDate] = useState<Date>(new Date(2025, 0, 1, 10));
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastDragTime, setLastDragTime] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [scrollValue, setScrollValue] = useState<number>(100);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [elementWidth, setElementWidth] = useState<number>(0);

  const dummyData = DummyData.getMonths(new Date(2025, 0, 1, 10));

  const virtualizer = useVirtualizer({
    count: dummyData.length,
    getScrollElement: () => meterComponentRef.current,
    estimateSize: () => 1000,
    horizontal: true,
    overscan: 2, // How many extra items to render on each side of the visible range
    onChange: (event) => {
      // You can log or perform any action based on the event details here
    },
  });

  const meterComponentRef = useRef<HTMLDivElement>(null);

  // get dummy data
  const monthData = DummyData.getMonths(date);

  const calculateOverScan = (): number => {
    if (screenWidth && elementWidth)
      return Math.ceil(screenWidth / elementWidth) * 3;
    return 2;
  };

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => {
        const newWidth = window.innerWidth;
        setScreenWidth(newWidth);
        setElementWidth(newWidth);
      };
      updateWidth(); // Initial width set
      window.addEventListener("resize", updateWidth); // Update on resize

      return () => window.removeEventListener("resize", updateWidth); // Cleanup on unmount
    }
  }, []);

  useEffect(() => {
    if (screenWidth > 0) {
      requestAnimationFrame(() => {
        virtualizer.measure();
      });
    }
  }, [screenWidth]);

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
    requestAnimationFrame(() => {
      virtualizer.measure();
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
    applyInertia(velocity * MeterConstants.velocityMultiplier);
  };
  const applyInertia = (vel: number) => {
    let velocity = vel;
    const inertiaScroll = () => {
      if (Math.abs(velocity) < MeterConstants.slidingCutoff) {
        return;
      }
      virtualizer.scrollBy(velocity);

      // requestAnimationFrame(() => {
      //   virtualizer.measure();
      // });

      velocity *= MeterConstants.slidingInertiaDumping;
      requestAnimationFrame(inertiaScroll);
    };
    inertiaScroll();
  };
  // ===============================================================

  // Handles ZOOM
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
      (virtualizer.scrollOffset! + offsetX) * scaleFactor - offsetX;

    requestAnimationFrame(() => {
      virtualizer.measure();
    });

    virtualizer.scrollToOffset(newScrollOffset);
  };
  const debouncedHandleZoom = useDebouncedWheel(
    handleZoom,
    MeterConstants.debounceWheelMilliseconds
  );

  return (
    <div className={styles.meterWrapper}>
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
            // width: `${virtualizer.getTotalSize() * (scrollValue / 100)}px`,
            width: `${monthData.length * elementWidth}px`,
          }}
        >
          <div className={styles.meterCenterLine} />
          {virtualizer.getVirtualItems().map((virtualItem, index) => (
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
};

export default CustomVirtualScroll;
