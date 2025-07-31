"use client";

import HorizontalVirtualScroll from "@/components/VirtualScroll/HorizontalVirtualScoll/HorizontalVirtualScroll";
import { useLayoutEffect, useState } from "react";
import styles from "./VirtualScrollWrapper.module.scss";


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
    setScreenWidth(window.innerWidth);
  }, []);

  if (screenWidth === 0) return null;
  console.log(window.innerWidth)

  return (
    <div className={styles.timelineWrapper}>
      <HorizontalVirtualScroll screenWidth={screenWidth} />;
    </div>
  );
};
export default VirtualScrollWrapper;
