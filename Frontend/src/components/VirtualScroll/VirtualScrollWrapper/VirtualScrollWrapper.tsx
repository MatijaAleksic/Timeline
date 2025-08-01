"use client";

import HorizontalVirtualScroll from "@/components/VirtualScroll/HorizontalVirtualScoll/HorizontalVirtualScroll";
import { useLayoutEffect, useState } from "react";
import styles from "./VirtualScrollWrapper.module.scss";
import ScreenDimensionsConstants from "@/util/constants/ScreenDimentionsConstants";

const VirtualScrollWrapper: React.FunctionComponent = () => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useLayoutEffect(() => {
    // if (typeof window !== "undefined") {
    //   const updateWidth = () => {
    //     setScreenWidth(window.innerWidth);
    //   };
    //   updateWidth();
    //   window.addEventListener("resize", updateWidth);
    //   return () => window.removeEventListener("resize", updateWidth);
    // }
    if (window.innerWidth > ScreenDimensionsConstants.maxLaptopWidth) {
      setScreenWidth(ScreenDimensionsConstants.maxLaptopWidth);
      return;
    }
    if (window.innerWidth < ScreenDimensionsConstants.minLaptopWidth) {
      setScreenWidth(ScreenDimensionsConstants.minLaptopWidth);
      return;
    }
    setScreenWidth(window.innerWidth);
  }, []);

  if (screenWidth === 0) return null;

  return (
    <div className={styles.timelineWrapper}>
      <HorizontalVirtualScroll screenWidth={screenWidth} />;
    </div>
  );
};
export default VirtualScrollWrapper;
