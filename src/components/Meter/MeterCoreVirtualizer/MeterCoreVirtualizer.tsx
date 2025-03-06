"use client";

import { addMonths } from "date-fns";
import styles from "./MeterCoreVirtualizer.module.scss";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import MeterHeader from "../MeterHeader/MeterHeader";
import MeterMonth from "../MeterMonth/MeterMonth";
import { useVirtualizer } from "@tanstack/react-virtual";
import DummyData from "@/util/data/DummyData";
import MeterConstants from "@/util/constants/MeterConstants";
import useDebouncedWheel from "@/util/hooks/useDebounceWheel";

//FOR VIRTUAL SCROLL PURPOSES USE NEXT LIBRARIES:
// React Window
// React Virtual

function MeterCoreVirtualizer() {
  const [date, setDate] = useState<Date>(new Date(2025, 0, 1, 10));
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastDragTime, setLastDragTime] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [scrollValue, setScrollValue] = useState<number>(100);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [elementWidth, setElementWidth] = useState<number>(0);

  const meterComponentRef = useRef<HTMLDivElement>(null);

  // get dummy data
  const monthData = DummyData.getMonths(date);

  const calculateOverScan = (): number => {
    if (screenWidth && elementWidth)
      return Math.ceil(screenWidth / elementWidth) * 3;
    return 2;
  };

  const rowVirtualizer = useVirtualizer({
    count: monthData.length,
    getScrollElement: () => meterComponentRef.current,
    estimateSize: () => elementWidth,
    horizontal: true,
    overscan: calculateOverScan(), // how many items to prerender on each side of virtual scroll
    onChange: (event: any) => {
      // console.log("============");
      // console.log("range", event.range); // same as event.calculateRange but just read value
      // console.log("virtualIndexes", event.getVirtualIndexes()); // get all virtual indexes
      // console.log("overscan", event.options.overscan);
      // console.log("scrollOffset", event.scrollOffset); // same as .getScrollOffset() but reads

      // console.log("totalVirtualWidth", event.getTotalSize()); // get total size of the virtual width (totalWidth * oneElementWidth)
      // console.log("totalVirtualWidthCache", event.measurementsCache[0].size); // OVO SE NE UPDATUJE KAKO TREBA

      // console.log(event.getSize()); // get size of virtual window
      // console.log(event.calculateRange()); // { startIndex, endIndex}
      // console.log(event.getScrollOffset()); // gets virtual scroll offset
      // console.log(event.getMeasurements()); // all elements with their attributes { start(px), end(px), index, size, key, lane}
      // console.log(event.getVirtualItemForOffset(scrollLeft)); // get Virtual item object from offset
      // console.log(event.measure()); // remeasures
      // console.log(event.options); // get options that are set useVirtualizer hook
      // console.log(event.scrollBy(100, { behavior: "smooth" })); // scroll by value -inf to +inf can be { behavior: "auto" }
      // console.log(event.scrollElement); // get HTML element of virtual scroll
      // console.log(event.scrollRect); // get scroll rect height and width
      // console.log(event.scrollToIndex(1)); // scroll to index 1
      // console.log(event.scrollToOffset(1000)); // scroll to offset 1000
      // console.log(
      //   event.setOptions({
      //     count: monthData.length,
      //     getScrollElement: () => meterComponentRef.current,
      //     overscan: 5, // Increase how many items are rendered beyond the viewport
      //     estimateSize: () => elementWidth,
      //     horizontal: true,
      //   })
      // ); //set new set of options
      // console.log(event.targetWindow.innerWidth); // gets targeted window and could get its width
    },
  });

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
        rowVirtualizer.measure();
      });
    }
  }, [screenWidth]);

  // Meter Navigation
  // ===============================================================
  const handlePreviousMonth = () => {
    setDate(addMonths(date, -1));
  };
  const handleNextMonth = () => {
    setDate(addMonths(date, 1));
  };
  // ===============================================================

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
      rowVirtualizer.measure();
    });
    // rowVirtualizer!.scrollToOffset(scrollLeft - moveX);

    // const indexToScrollTo = Math.floor(scrollLeft / elementWidth);
    // const offsetWithinIndex = scrollLeft % elementWidth; // Remaining pixels
    // rowVirtualizer.scrollToIndex(indexToScrollTo); // Scroll to index
    // setTimeout(() => {
    //   rowVirtualizer.scrollToOffset(
    //     rowVirtualizer.scrollOffset! + offsetWithinIndex
    //   );
    // }, 0); // Small delay to let the first scroll settle
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
      // rowVirtualizer.scrollToOffset(rowVirtualizer!.scrollOffset! + velocity);
      // rowVirtualizer.scrollBy(velocity, { behavior: "smooth" });
      // rowVirtualizer.scrollBy(velocity, { behavior: "auto" });
      rowVirtualizer.scrollBy(velocity);

      // requestAnimationFrame(() => {
      //   rowVirtualizer.measure();
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
      (rowVirtualizer.scrollOffset! + offsetX) * scaleFactor - offsetX;

    requestAnimationFrame(() => {
      rowVirtualizer.measure();
    });

    rowVirtualizer.scrollToOffset(newScrollOffset);
  };
  const debouncedHandleZoom = useDebouncedWheel(
    handleZoom,
    MeterConstants.debounceWheelMilliseconds
  );
  // ===============================================================

  return (
    <div className={styles.meterWrapper}>
      <MeterHeader
        handleNextMonth={handleNextMonth}
        handlePreviousMonth={handlePreviousMonth}
        date={date}
      />
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
            // width: `${rowVirtualizer.getTotalSize() * (scrollValue / 100)}px`,
            width: `${monthData.length * elementWidth}px`,
          }}
        >
          <div className={styles.meterCenterLine} />
          {rowVirtualizer.getVirtualItems().map((virtualItem, index) => (
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
}

export default MeterCoreVirtualizer;
