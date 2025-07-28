"use client";

import HorizontalVirtualScroll from "@/components/VirtualScroll/HorizontalVirtualScoll/HorizontalVirtualScroll";
import { useLayoutEffect, useState } from "react";

interface IProps {}

const VirtualScrollWrapper: React.FunctionComponent<IProps> = () => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => {
        setScreenWidth(window.innerWidth);
      };
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  if (screenWidth === 0) return null;

  return <HorizontalVirtualScroll screenWidth={screenWidth} />;
};
export default VirtualScrollWrapper;
