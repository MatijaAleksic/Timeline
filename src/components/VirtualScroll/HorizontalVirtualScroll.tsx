"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import useVirtualizer from "./useVirtualizer"; // adjust the import path as needed
import styles from "./HorizontalVirtualScroll.module.scss";
import MeterConstants from "@/util/constants/MeterConstants";
import useDebouncedWheel from "@/util/hooks/useDebounceWheel";
import DummyData from "@/util/data/DummyData";
import MeterMonth from "../Meter/MeterMonth";
import { VirtualItem } from "./VirtualScrollDTO/VirtualItem";
import { Range } from "./VirtualScrollDTO/Range";

const CustomVirtualScroll = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastDragTime, setLastDragTime] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [scrollValue, setScrollValue] = useState<number>(100);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [virtualItems, setVirtualItems] = useState<VirtualItem[]>([]);
  const [range, setRange] = useState<Range>();

  const virtualIndexes = virtualItems.map((item) => item.index);

  const dummyData = useMemo(
    () => DummyData.getMonths(new Date(2025, 0, 1, 10), 120),
    []
  );
  const meterComponentRef = useRef<HTMLDivElement>(null);
  const overScan: number = Math.ceil(Math.ceil(screenWidth / elementWidth) * 4);

  const getRange = () => {
    if (!meterComponentRef.current) return;
    const containerSize = meterComponentRef.current.clientWidth;
    const startIndex = Math.floor(scrollLeft / elementWidth);
    const endIndex = Math.min(
      dummyData.length - 1,
      Math.floor((scrollLeft + containerSize) / elementWidth)
    );
    return { start: startIndex, end: endIndex };
  };

  const updateVirtualItems = (forceUpdate: boolean = false) => {
    if (!meterComponentRef.current) return;

    const centralIndex = Math.floor(
      (meterComponentRef.current.scrollLeft +
        meterComponentRef.current.clientWidth / 2) /
        elementWidth
    );

    if (range) {
      if (
        !forceUpdate &&
        centralIndex >= range.start &&
        centralIndex <= range.end
      )
        return;

      let overScanStart = Math.max(0, range.start - overScan);
      const overScanEnd = Math.min(dummyData.length - 1, range.end + overScan);

      const items: VirtualItem[] = [];
      for (let i = overScanStart; i <= overScanEnd; i++) {
        items.push({
          index: i,
          start: i * elementWidth,
          end: (i + 1) * elementWidth,
          key: `virtual-item-${i}`,
          size: elementWidth,
        });
      }

      const newRange = getRange();
      if (newRange)
        setRange({ start: newRange.start, end: newRange.end } as Range);
      setVirtualItems(items);
    }
  };

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
    updateVirtualItems(true);
  }, []);

  useEffect(() => {
    updateVirtualItems(true);
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
    if (meterComponentRef.current) {
      meterComponentRef.current.scrollLeft = scrollLeft - moveX;
    }
  };
  const handleMouseUp = (event: React.MouseEvent) => {
    setIsDragging(false);
    const endTime = Date.now();
    const deltaTime = endTime - lastDragTime;

    //If dragging lasts more than 0.5 seconds dont apply slide effect
    if (deltaTime > MeterConstants.minTimeElapsedForSlidingEffect) {
      return;
    }

    const moveX = event.pageX - startX;
    const velocity = deltaTime === 0 ? 0 : -(moveX / deltaTime);

    applyInertia(velocity * MeterConstants.velocityMultiplier);
  };

  const applyInertia = (vel: number) => {
    let velocity = vel;
    const inertiaScroll = () => {
      if (Math.abs(velocity) < MeterConstants.slidingCutoff) {
        updateVirtualItems();
        return;
      }
      if (meterComponentRef.current) {
        meterComponentRef.current.scrollLeft += velocity;
      }
      // virtualizer.scrollBy(velocity);
      velocity *= MeterConstants.slidingInertiaDumping;
      requestAnimationFrame(inertiaScroll);
      updateVirtualItems();
    };
    inertiaScroll();
  };

  const handleMouseLeave = () => {
    if (isDragging) setIsDragging(false);
  };
  // ===============================================================

  // Handles ZOOM
  // ===============================================================
  const handleZoom = (event: any) => {
    const element = meterComponentRef.current;
    if (!element || !meterComponentRef.current) return;

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
    const newScrollOffset =
      (meterComponentRef.current.scrollLeft! + offsetX) * scaleFactor - offsetX;
    meterComponentRef.current.scrollLeft = newScrollOffset;

    setScrollValue(newZoom);
    setElementWidth(screenWidth * (newZoom / 100));
    // updateVirtualItems();
    // virtualizer.scrollToOffset(newScrollOffset, screenWidth * (newZoom / 100));
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
        onMouseLeave={() => handleMouseLeave()}
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
              left: `${virtualIndexes[0] * elementWidth}px`,
            }}
          >
            {virtualItems.map((virtualItem, index) => (
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
