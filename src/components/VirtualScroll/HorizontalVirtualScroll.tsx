"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./HorizontalVirtualScroll.module.scss";
import MeterConstants from "@/util/constants/MeterConstants";
import useDebouncedWheel from "@/util/hooks/useDebounceWheel";
import DummyData from "@/util/data/DummyData";
import { VirtualItem } from "./VirtualScrollDTO/VirtualItem";
import { Range } from "./VirtualScrollDTO/Range";
import MeterContent from "../Meter/MeterContent";
import { addYears } from "date-fns";

const CustomVirtualScroll = () => {
  // States
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastDragTime, setLastDragTime] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [zoomValue, setZoomValue] = useState<number>(100);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [virtualItems, setVirtualItems] = useState<VirtualItem[]>([]);
  const [range, setRange] = useState<Range>();
  const [level, setLevel] = useState<number>(2);

  // References
  const meterComponentRef = useRef<HTMLDivElement>(null);
  const lastRangeRef = useRef<Range | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const updateVirtualItemsDebounced = useRef<NodeJS.Timeout | null>(null);

  // Data
  const currentDate = new Date();
  const dummyData = useMemo(
    () =>
      DummyData.getMonths(
        new Date(2025, 0, 1, 10),
        addYears(currentDate, 10000)
      ),
    [level]
  );
  // const dummyData = useMemo(() => DummyData.getData(level), [level]);

  const overScan: number = Math.ceil(Math.ceil(screenWidth / elementWidth) * 4);
  const virtualIndexes = virtualItems.map((item) => item.index);

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
    setRange(getRange());
    safeUpdateVirtualItems(true);

    // if (meterComponentRef.current) {
    //   // Calculate the index of the current month (or current year if needed)
    //   const currentDate = new Date();  // Current date (today)
    //   const currentIndex = differenceInMonths(currentDate, dummyData[0]);

    //   // Calculate the scroll position for the current year
    //   // Assuming each "element" represents one month, you multiply by the width of an element
    //   const newScrollLeft = currentIndex * elementWidth;

    //   // Set the scroll position (this will scroll to the current year)
    //   meterComponentRef.current.scrollLeft = newScrollLeft;
    // }
  }, [screenWidth]);

  const getRange = () => {
    if (!meterComponentRef.current) {
      return;
    }
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

    // Skips updating virtual indexes when the element on center on the screen falls between the range
    if (
      !forceUpdate &&
      range &&
      centralIndex >= range.start &&
      centralIndex <= range.end
    )
      return;

    const newRange = getRange();

    // skip when gliding animation is called and the states are frozen then it tracks if the last range ref changes
    if (
      newRange &&
      lastRangeRef.current &&
      newRange.start === lastRangeRef.current.start &&
      newRange.end === lastRangeRef.current.end
    )
      return;

    if (newRange) {
      //update last calculated value into ref
      lastRangeRef.current = newRange;

      let overScanStart = Math.max(0, newRange.start - overScan);
      const overScanEnd = Math.min(
        dummyData.length - 1,
        newRange.end + overScan
      );

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
      setRange({ start: newRange.start, end: newRange.end } as Range);
      setVirtualItems(items);
    }
  };
  const safeUpdateVirtualItems = (forceUpdate = false) => {
    if (updateVirtualItemsDebounced.current) {
      clearTimeout(updateVirtualItemsDebounced.current);
    }
    updateVirtualItemsDebounced.current = setTimeout(() => {
      updateVirtualItems(forceUpdate);
    }, 16); // ~1 animation frame
  };

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
        inertiaFrameRef.current = null;
        return;
      }
      if (meterComponentRef.current) {
        meterComponentRef.current.scrollLeft += velocity;
      }
      velocity *= MeterConstants.slidingInertiaDumping;
      inertiaFrameRef.current = requestAnimationFrame(inertiaScroll);
      safeUpdateVirtualItems();
    };

    if (inertiaFrameRef.current) {
      cancelAnimationFrame(inertiaFrameRef.current);
    }

    inertiaScroll();
  };
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      safeUpdateVirtualItems();
    }
  };
  // ===============================================================

  const defineLevel = (newZoomValue: number) => {
    console.log("newZoomValue", newZoomValue);
    console.log("zoomValue", zoomValue);

    if (newZoomValue === zoomValue && level !== 1) {
      if (newZoomValue === MeterConstants.maxZoomValue) {
        // setLevel(level - 1);
        // setZoomValue(MeterConstants.minZoomValue);
      }
      // setLevel(level + 1);
    }
  };

  // Handles ZOOM
  // ===============================================================
  const handleZoom = (event: any) => {
    if (!meterComponentRef.current || isDragging) return;

    // Cancels gliding effect
    if (inertiaFrameRef.current) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }

    const boundingRect = meterComponentRef.current.getBoundingClientRect();
    const offsetX = event.clientX - boundingRect.left;

    const zoomDirection = event.deltaY > 0 ? -1 : 1;

    const newZoomValue = Math.max(
      MeterConstants.minZoomValue,
      Math.min(
        MeterConstants.maxZoomValue,
        zoomValue + zoomDirection * MeterConstants.zoomStep
      )
    );

    const scaleFactor = newZoomValue / zoomValue;
    const newScrollOffset =
      (meterComponentRef.current.scrollLeft + offsetX) * scaleFactor - offsetX;
    meterComponentRef.current.scrollLeft = newScrollOffset;
    setZoomValue(newZoomValue);
    setElementWidth(screenWidth * (newZoomValue / 100));
    setScrollLeft(newScrollOffset);
    meterComponentRef.current.scrollLeft = newScrollOffset;
    updateVirtualItems();

    defineLevel(newZoomValue);
  };
  const debouncedHandleZoom = useDebouncedWheel(
    handleZoom,
    MeterConstants.debounceWheelMilliseconds
  );
  // ===============================================================

  // console.log("================");
  // console.log("range", range);
  // console.log("elementWidth", elementWidth);
  // console.log("scrollOffset", scrollLeft);
  // console.log("virtualIndexes", virtualIndexes);
  // console.log("centralElement", (scrollLeft + screenWidth / 2) / elementWidth);

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
                <MeterContent
                  key={virtualItem.key}
                  element={dummyData[virtualItem.index]}
                  elementWidth={elementWidth}
                  zoomValue={zoomValue}
                  level={level}
                />
                {/* <MeterMonth
                  key={virtualItem.key}
                  date={dummyData[virtualItem.index]}
                  width={elementWidth}
                  zoomValue={scrollValue}
                /> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVirtualScroll;
