"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./HorizontalVirtualScroll.module.scss";
import MeterConstants from "@/util/constants/MeterConstants";
import useDebouncedWheel from "@/util/hooks/useDebounceWheel";
import DummyData from "@/util/data/DummyData";
import { VirtualItem } from "./VirtualScrollDTO/VirtualItem";
import { Range } from "./VirtualScrollDTO/Range";
import MeterContent from "../Meter/MeterContent";
import { addYears, differenceInDays } from "date-fns";
import MeterService from "@/util/service/MeterService";

const CustomVirtualScroll = () => {
  // States
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastDragTime, setLastDragTime] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const [zoomValue, setZoomValue] = useState<number>(100); //default 100
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
  const overScan: number = useMemo(
    () => Math.ceil(Math.ceil(screenWidth / elementWidth) * 4),
    [screenWidth, elementWidth]
  );
  const virtualIndexes = useMemo(
    () => virtualItems.map((item) => item.index),
    [virtualItems]
  );

  // const dummyData = useMemo(() => {
  //   return DummyData.getDummyData(
  //     level,
  //     new Date(2025, 0, 1),
  //     addYears(new Date(2025, 0, 1), 100)
  //   );
  // }, [level]);
  const dummyData = useMemo(() => DummyData.getData(level), [level]);

  // Effects
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
  }, [screenWidth]);

  useEffect(() => {
    safeUpdateVirtualItems(true);
  }, [level]);

  //Methods
  const getRange = () => {
    if (!meterComponentRef.current) {
      return;
    }
    const containerSize = meterComponentRef.current.clientWidth;
    const startIndex = Math.floor(scrollOffset / elementWidth);
    const endIndex = Math.min(
      dummyData.length - 1,
      Math.floor((scrollOffset + containerSize) / elementWidth)
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

  const calculateCenterOffsetOnLevelTransition = (
    centralOffset: number,
    newWidth: number,
    currentLevel: number,
    nextLevel: number
  ) => {
    // if (currentLevel === 2 && nextLevel === 1) {
    const centralIndex = Math.floor(centralOffset / elementWidth);
    const centraIndexModus = centralOffset % elementWidth;

    const totalDays = differenceInDays(dummyData[centralIndex], dummyData[0]);
    return totalDays * newWidth;
    // }
  };

  const defineLevel = (newZoomValue: number) => {
    if (!meterComponentRef.current) return;

    const centerOffset = meterComponentRef.current.scrollLeft + screenWidth / 2;

    if (
      newZoomValue === MeterConstants.maxZoomValue &&
      level !== MeterConstants.minLevel
    ) {
      const newLevel = level - 1;
      const newWidth = screenWidth * (MeterConstants.minZoomValue / 100);
      const scaleFactor = newWidth / elementWidth;

      console.log(
        "hello",
        calculateCenterOffsetOnLevelTransition(
          centerOffset,
          newWidth,
          level,
          newLevel
        ) *
          scaleFactor -
          screenWidth / 2
      );
      setLevel(newLevel);
      setZoomValue(MeterConstants.minZoomValue);
      setElementWidth(newWidth);
      setScrollOffset(
        calculateCenterOffsetOnLevelTransition(
          centerOffset,
          newWidth,
          level,
          newLevel
        ) *
          scaleFactor -
          screenWidth / 2
      );
      requestAnimationFrame(() => {
        meterComponentRef.current!.scrollLeft =
          calculateCenterOffsetOnLevelTransition(
            centerOffset,
            newWidth,
            level,
            newLevel
          ) *
            scaleFactor -
          screenWidth / 2;
        updateVirtualItems(true);
      });
    }

    if (
      newZoomValue === MeterConstants.minZoomValue &&
      level !== MeterConstants.maxLevel
    ) {
      const newLevel = level + 1;
      const newWidth = screenWidth * (MeterConstants.maxZoomValue / 100);
      const scaleFactor = newWidth / elementWidth;

      setLevel(newLevel);
      setZoomValue(MeterConstants.maxZoomValue);
      setElementWidth(newWidth);
      setScrollOffset(centerOffset * scaleFactor - screenWidth / 2);
      requestAnimationFrame(() => {
        meterComponentRef.current!.scrollLeft =
          centerOffset * scaleFactor - screenWidth / 2;
        updateVirtualItems(true);
      });
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
      newZoomValue === MeterConstants.maxZoomValue ||
      newZoomValue === MeterConstants.minZoomValue
    ) {
      defineLevel(newZoomValue);
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

    if (meterComponentRef.current) {
      meterComponentRef.current.scrollLeft = newScrollOffset;
    }
    requestAnimationFrame(() => {
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
  // console.log("zoomValue", zoomValue);

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
