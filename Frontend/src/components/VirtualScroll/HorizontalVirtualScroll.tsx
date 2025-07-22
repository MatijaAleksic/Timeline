"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./HorizontalVirtualScroll.module.scss";
import MeterConstants from "@/util/constants/MeterConstants";
import useDebouncedWheel from "@/util/hooks/useDebounceWheel";
import { VirtualItem } from "./VirtualScrollDTO/VirtualItem";
import { Range } from "./VirtualScrollDTO/Range";
import MeterContent from "../Meter/MeterContent";
import MeterService from "@/util/service/MeterService";
import MeterLevelsService from "@/util/service/MeterLevelsService";
import EventPresentationLayer from "./PresentationLayer/EventPresentationLayer";

interface VirtualScrollState {
  scrollOffset: number;
  screenWidth: number;
  elementWidth: number;
  zoomValue: number;
  level: number;
}

const HorizontalVirtualScroll = () => {
  // States
  const [virtualMeterState, setVirtualMeterState] =
    useState<VirtualScrollState>({
      scrollOffset: 0,
      elementWidth: 0,
      screenWidth: 0,
      zoomValue: MeterConstants.startZoomValue,
      level: MeterConstants.startLevel,
    });
  const [virtualItems, setVirtualItems] = useState<VirtualItem[]>([]);
  const [range, setRange] = useState<Range>();

  // References
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const lastDragTimeRef = useRef<number>(0);
  const meterComponentRef = useRef<HTMLDivElement>(null);
  const presentationLayerComponentRef = useRef<HTMLDivElement>(null);
  const lastRangeRef = useRef<Range | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const updateVirtualItemsDebounced = useRef<number | null>(null);

  const scrollOffsetRef = useRef(virtualMeterState.scrollOffset);
  useLayoutEffect(() => {
    scrollOffsetRef.current = virtualMeterState.scrollOffset;
  }, [virtualMeterState.scrollOffset]);
  const elementWidthRef = useRef(virtualMeterState.elementWidth);
  useLayoutEffect(() => {
    elementWidthRef.current = virtualMeterState.elementWidth;
  }, [virtualMeterState.elementWidth]);
  // Data
  const overScan: number = useMemo(
    () =>
      Math.ceil(
        Math.ceil(
          virtualMeterState.screenWidth / virtualMeterState.elementWidth
        ) * 4
      ),
    [virtualMeterState.screenWidth, virtualMeterState.elementWidth]
  );
  const virtualIndexes = useMemo(
    () => virtualItems.map((item) => item.index),
    [virtualItems]
  );
  const levelElements = useMemo(
    () => MeterLevelsService.getLevelElements(virtualMeterState.level),
    [virtualMeterState.level]
  );

  // Effects
  // Triggers on resize of the window so that screen width and element width are set correctly
  //USEEFFECT - happens after paint
  //USELAYOUTEFFECT - happens before paint
  useLayoutEffect(() => {
    if (meterComponentRef.current) {
      meterComponentRef.current.scrollLeft = virtualMeterState.scrollOffset;
    }
  }, [virtualMeterState.scrollOffset]);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => {
        const newWidth = window.innerWidth;
        setVirtualMeterState((prev) => ({
          ...prev,
          elementWidth: newWidth,
          screenWidth: newWidth,
        }));
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
        levelElements.length,
        virtualMeterState.scrollOffset,
        virtualMeterState.elementWidth
      )
    );
    safeUpdateVirtualItems(true);
  }, [virtualMeterState.screenWidth]);

  // On level change update virtual items
  useLayoutEffect(() => {
    safeUpdateVirtualItems(true);
  }, [virtualMeterState.level]);

  //Methods
  const updateVirtualItems = (forceUpdate: boolean = false) => {
    if (!meterComponentRef.current) return;

    const centralIndex = MeterService.calculateCentralIndex(
      meterComponentRef,
      virtualMeterState.elementWidth
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
      levelElements.length,
      scrollOffsetRef.current,
      elementWidthRef.current
    );

    // skip when gliding animation is called and the states are frozen then it tracks if the last range ref changes
    if (
      !forceUpdate &&
      newRange &&
      lastRangeRef.current &&
      newRange.start === lastRangeRef.current.start &&
      newRange.end === lastRangeRef.current.end
    ) {
      // console.("BLOCK1");
      return;
    }

    if (
      newRange &&
      !Number.isNaN(newRange.start) &&
      !Number.isNaN(newRange.end)
    ) {
      lastRangeRef.current = newRange;
      const overScanStart = Math.max(0, newRange.start - overScan);
      const overScanEnd = Math.min(
        levelElements.length - 1,
        newRange.end + overScan
      );
      setRange({ start: newRange.start, end: newRange.end } as Range);
      setVirtualItems(
        MeterService.generateVirtualItems(
          overScanStart,
          overScanEnd,
          virtualMeterState.elementWidth
        )
      );
    }
  };

  const safeUpdateVirtualItems = (forceUpdate = false) => {
    if (updateVirtualItemsDebounced.current) {
      clearTimeout(updateVirtualItemsDebounced.current);
    }
    updateVirtualItemsDebounced.current = requestAnimationFrame(() => {
      updateVirtualItems(forceUpdate);
    });
  };

  const updateStatesOnLevelChange = (
    newLevel: number,
    newZoomValue: number,
    newWidth: number,
    newScrollOffset: number
  ) => {
    setVirtualMeterState((prev) => ({
      ...prev,
      level: newLevel,
      zoomValue: newZoomValue,
      elementWidth: newWidth,
      scrollOffset: newScrollOffset,
    }));

    scrollOffsetRef.current = newScrollOffset;
    elementWidthRef.current = newWidth;
    updateVirtualItems(true);
    // requestAnimationFrame(() => {
    //   // meterComponentRef.current!.scrollLeft = newScrollOffset;
    //   updateVirtualItems(true);
    // });
  };
  const transitionLevels = (newZoomValue: number) => {
    if (!meterComponentRef.current) return;

    // ZOOM IN
    if (
      newZoomValue === MeterConstants.maxZoomValue &&
      virtualMeterState.level !== MeterConstants.minLevel
    ) {
      const newLevel = virtualMeterState.level - 1;
      const newWidth =
        virtualMeterState.elementWidth *
        (MeterConstants.minZoomValue / MeterConstants.maxZoomValue);

      console.log("level", virtualMeterState.level);
      console.log("newLevel", newLevel);
      console.log("scrollOffset", virtualMeterState.scrollOffset);
      console.log("elementWidth", virtualMeterState.elementWidth);
      console.log("newWidth", newWidth);
      console.log("screenWidth", virtualMeterState.screenWidth);

      const newScrollOffset = MeterService.calculateOffsetForLevelTransition(
        virtualMeterState.level,
        newLevel,
        virtualMeterState.scrollOffset,
        virtualMeterState.elementWidth,
        newWidth,
        virtualMeterState.screenWidth
      );
      console.log("newScrollOffset", newScrollOffset);

      updateStatesOnLevelChange(
        newLevel,
        MeterConstants.minZoomValue,
        newWidth,
        newScrollOffset
      );
    }

    // ZOOM OUT
    if (
      newZoomValue === MeterConstants.minZoomValue &&
      virtualMeterState.level !== MeterConstants.maxLevel
    ) {
      const newLevel = virtualMeterState.level + 1;
      const newWidth =
        virtualMeterState.elementWidth *
        (MeterConstants.maxZoomValue / MeterConstants.minZoomValue);

      console.log("level", virtualMeterState.level);
      console.log("newLevel", newLevel);
      console.log("scrollOffset", virtualMeterState.scrollOffset);
      console.log("elementWidth", virtualMeterState.elementWidth);
      console.log("newWidth", newWidth);
      console.log("screenWidth", virtualMeterState.screenWidth);

      const newScrollOffset = MeterService.calculateOffsetForLevelTransition(
        virtualMeterState.level,
        newLevel,
        virtualMeterState.scrollOffset,
        virtualMeterState.elementWidth,
        newWidth,
        virtualMeterState.screenWidth
      );

      console.log("newScrollOffset", newScrollOffset);
      updateStatesOnLevelChange(
        newLevel,
        MeterConstants.maxZoomValue,
        newWidth,
        newScrollOffset
      );
    }
  };

  // Handles dragging the meter so you dont have to use scroll wheel
  // ===============================================================
  const handleMouseDown = (event: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current =
      event.pageX - (meterComponentRef.current?.offsetLeft || 0);
    setVirtualMeterState((prev) => ({
      ...prev,
      scrollOffset: meterComponentRef.current?.scrollLeft || 0,
    }));
    lastDragTimeRef.current = Date.now();
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const moveX = event.pageX - startXRef.current;
    if (meterComponentRef.current) {
      meterComponentRef.current.scrollLeft =
        virtualMeterState.scrollOffset - moveX;
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
    event.preventDefault();
    if (!meterComponentRef.current || isDraggingRef.current) return;

    // disables the sliding effect when wheen event fired
    if (inertiaFrameRef.current) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }

    const boundingRect = meterComponentRef.current.getBoundingClientRect();
    const offsetX = event.clientX - boundingRect.left;
    const zoomDirection = event.deltaY > 0 ? -1 : 1;
    const newZoomValue = MeterService.calculateNewZoomValue(
      virtualMeterState.zoomValue,
      zoomDirection
    );

    if (
      (zoomDirection > 0 &&
        virtualMeterState.zoomValue === MeterConstants.maxZoomValue) ||
      (zoomDirection < 0 &&
        virtualMeterState.zoomValue === MeterConstants.minZoomValue)
    ) {
      transitionLevels(newZoomValue);
      return;
    }

    const scaleFactor = newZoomValue / virtualMeterState.zoomValue;
    const currentScrollLeft = meterComponentRef.current.scrollLeft;
    const newElementWidth =
      virtualMeterState.screenWidth * (newZoomValue / 100);
    const newScrollOffset = Math.max(
      0,
      (currentScrollLeft + offsetX) * scaleFactor - offsetX
    );

    setVirtualMeterState((prev) => ({
      ...prev,
      zoomValue: newZoomValue,
      elementWidth: newElementWidth,
      scrollOffset: newScrollOffset,
    }));
    // meterComponentRef.current.scrollLeft = newScrollOffset;
    updateVirtualItems(true);
  };
  const debouncedHandleWheel = useDebouncedWheel(
    handleWheel,
    MeterConstants.debounceWheelMilliseconds
  );
  const handleRepresentationLayerWheel = (
    event: React.WheelEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    const target = event.currentTarget;

    const isScrollable =
      target.scrollHeight > target.clientHeight &&
      (event.deltaY < 0
        ? target.scrollTop > 0
        : target.scrollTop + target.clientHeight < target.scrollHeight);

    if (!isScrollable) {
      debouncedHandleWheel(event); // Call horizontal zoom scroll
    }
  };

  console.log("zoomValue", virtualMeterState.zoomValue);

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
            width: `${levelElements.length * virtualMeterState.elementWidth}px`,
          }}
        >
          <div
            className={styles.virtualizerOffset}
            style={{
              transform: `translateX(${
                virtualIndexes[0] * virtualMeterState.elementWidth
              }px)`,
            }}
          >
            {virtualItems.map((virtualItem, index) => (
              <div
                className={styles.virtualizerContainer}
                key={virtualItem.key}
                style={{
                  transform: `translateX(${
                    index * virtualMeterState.elementWidth
                  }px)`,
                  width: `${virtualMeterState.elementWidth}px`,
                }}
              >
                <div className={styles.meterCenterLine} />

                <MeterContent
                  key={virtualItem.key}
                  element={levelElements[virtualItem.index]}
                  elementWidth={virtualMeterState.elementWidth}
                  zoomValue={virtualMeterState.zoomValue}
                  level={virtualMeterState.level}
                />
              </div>
            ))}
          </div>

          <div
            className={styles.presentationLayerWrapper}
            onWheel={handleRepresentationLayerWheel}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => handleMouseLeave()}
            ref={presentationLayerComponentRef}
          >
            <EventPresentationLayer
              elementWidth={virtualMeterState.elementWidth}
              level={virtualMeterState.level}
              virtualItems={virtualItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalVirtualScroll;
