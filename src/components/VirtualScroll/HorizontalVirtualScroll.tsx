"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./HorizontalVirtualScroll.module.scss";
import MeterConstants from "@/util/constants/MeterConstants";
import useDebouncedWheel from "@/util/hooks/useDebounceWheel";
import DummyData from "@/util/data/DummyData";
import { VirtualItem } from "./VirtualScrollDTO/VirtualItem";
import { Range } from "./VirtualScrollDTO/Range";
import MeterContent from "../Meter/MeterContent";
import MeterService from "@/util/service/MeterService";

const CustomVirtualScroll = () => {
  // States
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastDragTime, setLastDragTime] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [elementWidth, setElementWidth] = useState<number>(0);

  const [level, setLevel] = useState<number>(MeterConstants.startLevel);
  const [zoomValue, setZoomValue] = useState<number>(
    MeterConstants.startZoomValue
  ); //default 100

  const [virtualItems, setVirtualItems] = useState<VirtualItem[]>([]);
  const [range, setRange] = useState<Range>();

  // References
  const meterComponentRef = useRef<HTMLDivElement>(null);
  const lastRangeRef = useRef<Range | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const updateVirtualItemsDebounced = useRef<NodeJS.Timeout | null>(null);

  // Data
  const overScan: number = useMemo(
    () => Math.ceil(Math.ceil(screenWidth / elementWidth) * 4),
    [screenWidth, elementWidth]
  );
  const virtualIndexes = useMemo(
    () => virtualItems.map((item) => item.index),
    [virtualItems]
  );
  const dummyData = useMemo(() => DummyData.getData(level), [level]);

  // Effects
  // Triggers on resize of the window so that screen width and element width are set correctly
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
  // On screen resize recalculate range and virtual items
  useEffect(() => {
    setRange(
      MeterService.getRange(
        meterComponentRef,
        dummyData,
        scrollOffset,
        elementWidth
      )
    );
    safeUpdateVirtualItems(true);
  }, [screenWidth]);
  // On level change update virtual items
  useEffect(() => {
    safeUpdateVirtualItems(true);
  }, [level]);

  //Methods
  const updateVirtualItems = (forceUpdate: boolean = false) => {
    if (!meterComponentRef.current) return;

    const centralIndex = MeterService.calculateCentralIndex(
      meterComponentRef,
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

    const newRange = MeterService.getRange(
      meterComponentRef,
      dummyData,
      scrollOffset,
      elementWidth
    );

    // skip when gliding animation is called and the states are frozen then it tracks if the last range ref changes
    if (
      newRange &&
      lastRangeRef.current &&
      newRange.start === lastRangeRef.current.start &&
      newRange.end === lastRangeRef.current.end
    )
      return;

    if (newRange) {
      lastRangeRef.current = newRange;

      let overScanStart = Math.max(0, newRange.start - overScan);
      const overScanEnd = Math.min(
        dummyData.length - 1,
        newRange.end + overScan
      );

      setRange({ start: newRange.start, end: newRange.end } as Range);
      setVirtualItems(
        MeterService.generateVirtualIndexes(
          overScanStart,
          overScanEnd,
          elementWidth
        )
      );
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
  const centerMeterToOffset = (newScrollOffset: number) => {
    setScrollOffset(newScrollOffset);
    requestAnimationFrame(() => {
      meterComponentRef.current!.scrollLeft = newScrollOffset;
      updateVirtualItems(true);
    });
  };
  const transitionLevels = (newZoomValue: number) => {
    if (!meterComponentRef.current) return;
    const currentYear = MeterService.calculateCenterYearForLevel(
      meterComponentRef!,
      screenWidth,
      elementWidth,
      level
    );

    console.log("currentYear", currentYear);

    // ZOOM IN
    if (
      newZoomValue === MeterConstants.maxZoomValue &&
      level !== MeterConstants.minLevel
    ) {
      const newLevel = level - 1;
      const newWidth =
        elementWidth *
        (MeterConstants.minZoomValue / MeterConstants.maxZoomValue);
      const earliestYearForNewLevel =
        MeterService.getEarliestYearForLevel(newLevel);
      const yearMultiplier =
        newLevel > 2
          ? MeterService.getYearMultiplier(newLevel)
          : 1 / MeterService.getYearMultiplier(newLevel);
      const newScrollOffset = MeterService.calculateOffsetForLevelTransition(
        earliestYearForNewLevel,
        currentYear,
        newWidth,
        yearMultiplier,
        screenWidth
      );
      console.log("yearMultiplier", yearMultiplier);
      console.log("newScrollOffset", newScrollOffset);
      console.log("newWidth", newWidth);

      setLevel(newLevel);
      setZoomValue(MeterConstants.minZoomValue);
      setElementWidth(newWidth);
      centerMeterToOffset(newScrollOffset);
    }

    // ZOOM OUT
    if (
      newZoomValue === MeterConstants.minZoomValue &&
      level !== MeterConstants.maxLevel
    ) {
      const newLevel = level + 1;
      const newWidth =
        MeterService.calculateNewWidthForLevelTransition(elementWidth);
      const earliestYearForNewLevel =
        MeterService.getEarliestYearForLevel(newLevel);
      const yearMultiplier =
        newLevel > 2
          ? MeterService.getYearMultiplier(newLevel)
          : 1 / MeterService.getYearMultiplier(newLevel);
      const newScrollOffset = MeterService.calculateOffsetForLevelTransition(
        earliestYearForNewLevel,
        currentYear,
        newWidth,
        yearMultiplier,
        screenWidth
      );
      console.log("yearMultiplier", yearMultiplier);
      console.log("newScrollOffset", newScrollOffset);
      console.log("newWidth", newWidth);
      setLevel(newLevel);
      setZoomValue(MeterConstants.maxZoomValue);
      setElementWidth(newWidth);
      setScrollOffset(newScrollOffset);
      centerMeterToOffset(newScrollOffset);
    }
  };

  // Handles dragging the meter so you dont have to use scroll wheel
  // ===============================================================
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(event.pageX - (meterComponentRef.current?.offsetLeft || 0));
    setScrollOffset(meterComponentRef.current?.scrollLeft || 0);
    setLastDragTime(Date.now());
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const moveX = event.pageX - startX;
    if (meterComponentRef.current) {
      meterComponentRef.current.scrollLeft = scrollOffset - moveX;
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

  // Handles ZOOM
  // ===============================================================
  const handleZoom = (event: any) => {
    if (!meterComponentRef.current || isDragging) return;

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

    if (
      (zoomDirection > 0 && zoomValue === MeterConstants.maxZoomValue) ||
      (zoomDirection < 0 && zoomValue === MeterConstants.minZoomValue)
    ) {
      transitionLevels(newZoomValue);
      return;
    }

    const scaleFactor = newZoomValue / zoomValue;
    const currentScrollLeft = meterComponentRef.current.scrollLeft;
    const newElementWidth = screenWidth * (newZoomValue / 100);
    const newScrollOffset =
      (currentScrollLeft + offsetX) * scaleFactor - offsetX;

    setZoomValue(newZoomValue);
    setElementWidth(newElementWidth);
    setScrollOffset(newScrollOffset);

    requestAnimationFrame(() => {
      if (meterComponentRef.current) {
        meterComponentRef.current.scrollLeft = newScrollOffset;
      }
      updateVirtualItems(true);
    });
  };
  const debouncedHandleZoom = useDebouncedWheel(
    handleZoom,
    MeterConstants.debounceWheelMilliseconds
  );
  // ===============================================================
  // console.log("================");
  // console.log("range", range);
  // console.log("elementWidth", elementWidth);
  // console.log("scrollOffset", scrollOffset);
  // console.log("virtualIndexes", virtualIndexes);
  // console.log(
  //   "centerOfScreenIndex",
  //   (scrollOffset + screenWidth / 2) / elementWidth
  // );
  console.log("zoomValue", zoomValue);
  console.log("level", level);
  // console.log("multiplier", MeterService.getYearMultiplier(level));
  // console.log("dummyData", dummyData);
  // console.log("elementWidth", elementWidth);

  return (
    <div className={styles.meterWrapper}>
      <div
        style={{
          border: "1px solid lightgreen",
          width: "0px",
          height: "100%",
          position: "fixed",
        }}
      ></div>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVirtualScroll;
