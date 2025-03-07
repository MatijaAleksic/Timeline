"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useVirtualizer from "./useVirtualizer"; // adjust the import path as needed
import styles from "./HorizontalVirtualScroll.module.scss";
import MeterConstants from "@/util/constants/MeterConstants";
import useDebouncedWheel from "@/util/hooks/useDebounceWheel";
import DummyData from "@/util/data/DummyData";
import MeterMonth from "../Meter/MeterMonth";

const CustomVirtualScroll = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastDragTime, setLastDragTime] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [startVirtualElementIndex, setStartVirtualElementIndex] =
    useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [scrollValue, setScrollValue] = useState<number>(100);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [elementWidth, setElementWidth] = useState<number>(0);

  const dummyData = DummyData.getMonths(new Date(2025, 0, 1, 10), 120);
  const meterComponentRef = useRef<HTMLDivElement>(null);

  const calculateOverScan = (): number => {
    if (screenWidth && elementWidth)
      return Math.ceil(Math.ceil(screenWidth / elementWidth) * 2);
    return 2;
  };

  const virtualizer = useVirtualizer({
    count: dummyData.length,
    getScrollElement: () => meterComponentRef.current,
    elementWidth: elementWidth,
    horizontal: true,
    overscan: calculateOverScan(),
  });
  console.log("==============================");
  console.log("overscan", calculateOverScan());
  console.log("elementWidth", elementWidth);
  console.log("totalSize", elementWidth * dummyData.length);
  console.log("virtualIndexes", virtualizer.getVirtualIndexes());
  console.log("range", virtualizer.getRange());
  console.log("scrollLeft", virtualizer.scrollOffset);

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
    const virtualIndexes = virtualizer.getVirtualIndexes();
    if (virtualIndexes.length > 0) {
      setStartVirtualElementIndex(virtualIndexes[0]);
    }
    setScrollLeft(meterComponentRef.current?.scrollLeft || 0);
    setLastDragTime(Date.now());
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const moveX = event.pageX - startX;
    virtualizer!.scrollToOffset(scrollLeft - moveX, startVirtualElementIndex);
  };
  const handleMouseUp = (event: React.MouseEvent) => {
    setIsDragging(false);
    const endTime = Date.now();
    const deltaTime = endTime - lastDragTime;

    //If dragging lasts more than 0.5 seconds dont apply slide effect
    if (deltaTime > MeterConstants.minTimeElapsedForSlidingEffect) return;

    const moveX = event.pageX - startX;
    const velocity = deltaTime === 0 ? 0 : -(moveX / deltaTime);

    applyInertia(
      velocity * MeterConstants.velocityMultiplier,
      startVirtualElementIndex
    );
  };
  const applyInertia = (vel: number, startVirtualIndex: number) => {
    let velocity = vel;
    const inertiaScroll = () => {
      if (Math.abs(velocity) < MeterConstants.slidingCutoff) {
        return;
      }
      virtualizer.scrollBy(velocity, startVirtualIndex);
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

    virtualizer.scrollToOffset(newScrollOffset, startVirtualElementIndex);
  };
  const debouncedHandleZoom = useDebouncedWheel(
    handleZoom,
    MeterConstants.debounceWheelMilliseconds
  );
  // ===============================================================

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
            width: `${dummyData.length * elementWidth}px`,
          }}
        >
          <div className={styles.meterCenterLine} />
          <div
            className={styles.virtualizerOffset}
            style={{
              left: `${virtualizer.getVirtualIndexes()[0] * elementWidth}px`,
            }}
          >
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
                  date={dummyData[virtualItem.index]}
                  width={elementWidth}
                  zoomValue={scrollValue}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVirtualScroll;
