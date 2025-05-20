"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./HorizontalVirtualScroll.module.scss";
import MeterConstants from "@/util/constants/MeterConstants";
import useDebouncedWheel from "@/util/hooks/useDebounceWheel";
import { VirtualItem } from "./VirtualScrollDTO/VirtualItem";
import { Range } from "./VirtualScrollDTO/Range";
import MeterContent from "../Meter/MeterContent";
import MeterService from "@/util/service/MeterService";
import { EventDTO } from "@/util/dto/EventDTO";

import _ from "lodash";
import { addMonths } from "date-fns";
import MeterLevelsService from "@/util/service/MeterLevelsService";
import DummyDataService from "@/util/data/DummyData";

const CustomVirtualScroll = () => {
  // States
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
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const lastDragTimeRef = useRef<number>(0);
  const meterComponentRef = useRef<HTMLDivElement>(null);
  const representationComponentRef = useRef<HTMLDivElement>(null);

  const lastRangeRef = useRef<Range | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  // const updateVirtualItemsDebounced = useRef<NodeJS.Timeout | null>(null);
  const updateVirtualItemsDebounced = useRef<number | null>(null);

  // Data
  const overScan: number = useMemo(
    () => Math.ceil(Math.ceil(screenWidth / elementWidth) * 4),
    [screenWidth, elementWidth]
  );
  const virtualIndexes = useMemo(
    () => virtualItems.map((item) => item.index),
    [virtualItems]
  );
  const levelElements = useMemo(
    () => MeterLevelsService.getLevelElements(level),
    [level]
  );
  const dummyEvents = useMemo(
    () => DummyDataService.getDataForLevel(level),
    [level]
  );

  // Effects
  // Triggers on resize of the window so that screen width and element width are set correctly
  //USEEFFECT - happens after paint
  //USELAYOUTEFFECT - happens before paint
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
  useLayoutEffect(() => {
    setRange(
      MeterService.getRange(
        meterComponentRef,
        levelElements,
        scrollOffset,
        elementWidth
      )
    );
    safeUpdateVirtualItems(true);
  }, [screenWidth]);
  // On level change update virtual items
  useLayoutEffect(() => {
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
      levelElements,
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

      const overScanStart = Math.max(0, newRange.start - overScan);
      const overScanEnd = Math.min(
        levelElements.length - 1,
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
    // updateVirtualItemsDebounced.current = setTimeout(() => {
    //   updateVirtualItems(forceUpdate);
    // }, 16); // ~1 animation frame
    updateVirtualItemsDebounced.current = requestAnimationFrame(() => {
      updateVirtualItems(forceUpdate);
    });
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
      meterComponentRef.current.scrollLeft,
      screenWidth,
      elementWidth,
      level
    );

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
      setLevel(newLevel);
      setZoomValue(MeterConstants.minZoomValue);
      setElementWidth(newWidth);
      setScrollOffset(newScrollOffset);
      centerMeterToOffset(newScrollOffset);
      requestAnimationFrame(() => {
        meterComponentRef.current!.scrollLeft = newScrollOffset;
        updateVirtualItems(true);
      });
    }

    // ZOOM OUT
    if (
      newZoomValue === MeterConstants.minZoomValue &&
      level !== MeterConstants.maxLevel
    ) {
      const newLevel = level + 1;
      const newWidth =
        elementWidth *
        (MeterConstants.maxZoomValue / MeterConstants.minZoomValue);
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
      setLevel(newLevel);
      setZoomValue(MeterConstants.maxZoomValue);
      setElementWidth(newWidth);
      setScrollOffset(newScrollOffset);
      centerMeterToOffset(newScrollOffset);
      requestAnimationFrame(() => {
        meterComponentRef.current!.scrollLeft = newScrollOffset;
        updateVirtualItems(true);
      });
    }
  };

  // Handles dragging the meter so you dont have to use scroll wheel
  // ===============================================================
  const handleMouseDown = (event: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current =
      event.pageX - (meterComponentRef.current?.offsetLeft || 0);
    setScrollOffset(meterComponentRef.current?.scrollLeft || 0);
    lastDragTimeRef.current = Date.now();
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const moveX = event.pageX - startXRef.current;
    if (meterComponentRef.current) {
      meterComponentRef.current.scrollLeft = scrollOffset - moveX;
    }
  };
  const handleMouseUp = (event: React.MouseEvent) => {
    isDraggingRef.current = false;
    const endTime = Date.now();
    const deltaTime = endTime - lastDragTimeRef.current;

    //If dragging lasts more than 0.5 seconds dont apply slide effect
    if (deltaTime > MeterConstants.minTimeElapsedForSlidingEffect) {
      return;
    }

    const moveX = event.pageX - startXRef.current;
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
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      safeUpdateVirtualItems();
    }
  };

  // ===============================================================

  // Handles ZOOM
  // ===============================================================
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!meterComponentRef.current || isDraggingRef.current) return;

    if (inertiaFrameRef.current) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }

    const boundingRect = meterComponentRef.current.getBoundingClientRect();
    const offsetX = event.clientX - boundingRect.left;
    const zoomDirection = event.deltaY > 0 ? -1 : 1;
    const newZoomValue = MeterService.calculateNewZoomValue(
      zoomValue,
      zoomDirection
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
  const debouncedHandleWheel = useDebouncedWheel(
    handleWheel,
    MeterConstants.debounceWheelMilliseconds
  );
  const handleRepresentationLayerWheel = (
    event: React.WheelEvent<HTMLDivElement>
  ) => {
    const target = event.currentTarget;

    const isScrollable =
      target.scrollHeight > target.clientHeight &&
      (event.deltaY < 0
        ? target.scrollTop > 0
        : target.scrollTop + target.clientHeight < target.scrollHeight);

    if (!isScrollable) {
      // event.preventDefault(); // Prevent vertical scroll from doing nothing
      debouncedHandleWheel(event); // Call horizontal zoom scroll
    }
  };

  return (
    <div className={styles.meterWrapper}>
      <div
        style={{
          border: "1px solid lightgreen",
          width: "0px",
          height: "100%",
          position: "fixed",
          zIndex: "1",
        }}
      ></div>
      <div
        className={styles.meterComponent}
        onWheel={(event: React.WheelEvent<HTMLDivElement>) => {
          debouncedHandleWheel(event);
        }}
        ref={meterComponentRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => handleMouseLeave()}
      >
        <div
          className={styles.virtualizerWrapper}
          style={{
            width: `${levelElements.length * elementWidth}px`,
          }}
        >
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
                <div className={styles.meterCenterLine} />

                <MeterContent
                  key={virtualItem.key}
                  element={levelElements[virtualItem.index]}
                  elementWidth={elementWidth}
                  zoomValue={zoomValue}
                  level={level}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={styles.presentationWrapper}
        onWheel={handleRepresentationLayerWheel}
        ref={representationComponentRef}
      >
        <>
          {dummyEvents.map((eventObject: EventDTO, index: number) => {
            return (
              <div
                key={index}
                className={styles.eventContainer}
                onClick={(event: any) => {
                  console.log(`${eventObject.label} CLICKED!`);
                }}
                style={{
                  left: MeterService.calculateEventPosition(eventObject), // Offset eventa na presentation layeru
                  top: 0 * MeterConstants.eventWidth, // Top Margina sa vrha presentation layera
                }}
              >
                <div
                  className={styles.periodContent}
                >{`${eventObject.label}`}</div>
              </div>
            );
          })}
        </>
      </div>
    </div>
  );
};

export default CustomVirtualScroll;
