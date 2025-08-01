"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./HorizontalVirtualScroll.module.scss";
import MeterConstants from "@/util/constants/MeterConstants";
import MeterContent from "../../Meter/MeterContent";
import MeterService from "@/util/service/MeterService";
import MeterLevelsService from "@/util/service/MeterLevelsService";
import EventPresentationLayer from "../PresentationLayer/EventPresentationLayer";
import { VirtualItem } from "@/util/dto/VirtualScrollDTO/VirtualItem";
import { MeterRange } from "@/util/dto/VirtualScrollDTO/MeterRange";

interface VirtualScrollState {
  scrollOffset: number;
  elementWidth: number;
  zoomValue: number;
  level: number;
  virtualItems: VirtualItem[];
  range: MeterRange;
}

interface IProps {
  screenWidth: number;
}
const HorizontalVirtualScroll: React.FunctionComponent<IProps> = ({
  screenWidth,
}) => {
  // TODO: 6000000px /(1920px (big screen) *2(on two max monitors))=1562.5 elements can be present so it doesnt break any browser/mobile
  // TODO: Make a state that will hold cachedOffsetChunks = [ChunkSize from const] * numberOfPerviousCachedChunks
  // Example: max chunk size can be ~1500 for calculation so if we need to render 2100 element we will do
  // newOffset = {elementIndex = (2100)} * {elementWidth (max = 1920 * 2)} - {ChunkSize} * {cachedOffsetChunks} * {elementWidth}
  // and get newOffset that will not exceed 6mil and still do the same job
  // and whenever you need to calculate offset or width of elements that can hold up to 6mil values just scale them down by the number of chunks
  // that way we will be able to simulate the virtual scrolling of the offset part of the app

  // Virtual Scroll State
  const [virtualMeterState, setVirtualMeterState] =
    useState<VirtualScrollState>({
      scrollOffset: 0, // for level 4, scrollOffset:4481250 to be on 0 centered
      elementWidth: screenWidth / 2,
      zoomValue: MeterConstants.maxZoomValue / 2,
      level: MeterConstants.startLevel,
      virtualItems: [],
      range: { start: 0, end: 0 } as MeterRange,
    });

  // References
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const lastDragTimeRef = useRef<number>(0);
  const meterComponentRef = useRef<HTMLDivElement>(null);
  const presentationLayerComponentRef = useRef<HTMLDivElement>(null);
  const inertiaFrameRef = useRef<number | null>(null);

  // Data
  const overScan: number = useMemo(
    () =>
      Math.ceil(Math.ceil(screenWidth / virtualMeterState.elementWidth) * 4),
    [screenWidth, virtualMeterState.elementWidth]
  );
  const virtualIndexes = useMemo(
    () => virtualMeterState.virtualItems.map((item) => item.index),
    [virtualMeterState.virtualItems]
  );
  const levelElements = useMemo(
    () => MeterLevelsService.getLevelElements(virtualMeterState.level),
    [virtualMeterState.level]
  );

  // Effects
  // useLayoutEffect - happens before paint
  useLayoutEffect(() => {
    if (meterComponentRef.current) {
      meterComponentRef.current.scrollLeft = virtualMeterState.scrollOffset;
    }
  }, [virtualMeterState.scrollOffset]);

  // On level change update virtual items
  useLayoutEffect(() => {
    updateVirtualItems();
  }, [virtualMeterState.level]);

  //Methods
  const slidingUpdateVirtualItems = () => {
    const centralIndex = MeterService.calculateCentralIndex(
      meterComponentRef,
      virtualMeterState.elementWidth
    );

    // if calculated CentralIndex falls between the range skip update virtual index
    if (
      virtualMeterState.range &&
      centralIndex >= virtualMeterState.range.start &&
      centralIndex <= virtualMeterState.range.end
    )
      return;

    updateVirtualItems();
  };
  const updateVirtualItems = useCallback(() => {
    if (!meterComponentRef.current) return;

    const newRange = MeterService.getRange(
      meterComponentRef,
      levelElements.length,
      virtualMeterState.scrollOffset,
      virtualMeterState.elementWidth
    );

    if (
      newRange &&
      !Number.isNaN(newRange.start) &&
      !Number.isNaN(newRange.end)
    ) {
      const overScanStart = Math.max(0, newRange.start - overScan);
      const overScanEnd = Math.min(
        levelElements.length - 1,
        newRange.end + overScan
      );
      setVirtualMeterState((prev) => ({
        ...prev,
        range: { start: newRange.start, end: newRange.end },
        virtualItems: MeterService.generateVirtualItems(
          overScanStart,
          overScanEnd,
          prev.elementWidth
        ),
      }));
    }
  }, [
    levelElements.length,
    overScan,
    virtualMeterState.elementWidth,
    virtualMeterState.scrollOffset,
  ]);
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

      const newScrollOffset = MeterService.calculateOffsetForLevelTransition(
        virtualMeterState.level,
        newLevel,
        virtualMeterState.scrollOffset,
        virtualMeterState.elementWidth,
        newWidth,
        screenWidth
      );
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

      const newScrollOffset = MeterService.calculateOffsetForLevelTransition(
        virtualMeterState.level,
        newLevel,
        virtualMeterState.scrollOffset,
        virtualMeterState.elementWidth,
        newWidth,
        screenWidth
      );

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
      slidingUpdateVirtualItems();
    };

    if (inertiaFrameRef.current) {
      cancelAnimationFrame(inertiaFrameRef.current);
    }
    inertiaScroll();
  };
  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      slidingUpdateVirtualItems();
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
    //TODO: this needs to be optimized and Mozila depends on this / MeterConstants.maxZoomValue
    // used to be 100 and was making not elements not render becuase of huge values such as for translateX(>16mil px)
    const newElementWidth =
      screenWidth * (newZoomValue / MeterConstants.maxZoomValue);
    const newScrollOffset = Math.max(
      0,
      (currentScrollLeft + offsetX) * scaleFactor - offsetX
    );

    // Calculate new range and virtualItems here *before* setState
    const newRange = MeterService.getRange(
      meterComponentRef,
      levelElements.length,
      newScrollOffset,
      newElementWidth
    );

    let newVirtualItems: VirtualItem[] = [];

    if (
      newRange &&
      !Number.isNaN(newRange.start) &&
      !Number.isNaN(newRange.end)
    ) {
      const overScanStart = Math.max(0, newRange.start - overScan);
      const overScanEnd = Math.min(
        levelElements.length - 1,
        newRange.end + overScan
      );
      newVirtualItems = MeterService.generateVirtualItems(
        overScanStart,
        overScanEnd,
        newElementWidth
      );
    }

    setVirtualMeterState((prev) => ({
      ...prev,
      zoomValue: newZoomValue,
      elementWidth: newElementWidth,
      scrollOffset: newScrollOffset,
      range: newRange ?? prev.range,
      virtualItems: newVirtualItems.length
        ? newVirtualItems
        : prev.virtualItems,
    }));
  };
  const handleRepresentationLayerWheel = (
    event: React.WheelEvent<HTMLDivElement>
  ) => {
    // event.preventDefault();
    const target = event.currentTarget;

    const isScrollable =
      target.scrollHeight > target.clientHeight &&
      (event.deltaY < 0
        ? target.scrollTop > 0
        : target.scrollTop + target.clientHeight < target.scrollHeight);

    if (!isScrollable) {
      handleWheel(event);
      // debouncedHandleWheel(event);
    }
  };

  console.log(virtualMeterState.range);

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
        onWheel={handleWheel}
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
            // (levelElements.length % MeterConstants.cacheElementLength) *
            //   virtualMeterState.elementWidth
            // width: `0%`,
          }}
        >
          <div
            className={styles.virtualizerOffset}
            style={{
              transform: `translateX(${
                virtualIndexes[0] * virtualMeterState.elementWidth
                // (virtualIndexes[0] % MeterConstants.cacheElementLength) *
                // virtualMeterState.elementWidth
              }px)`,
            }}
          >
            {virtualMeterState.virtualItems.map((virtualItem, index) => (
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
                  screenWidth={screenWidth}
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
              virtualItems={virtualMeterState.virtualItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalVirtualScroll;
