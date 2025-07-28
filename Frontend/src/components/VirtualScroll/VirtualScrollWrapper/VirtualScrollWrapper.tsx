"use client";

import HorizontalVirtualScroll from "@/components/VirtualScroll/HorizontalVirtualScoll/HorizontalVirtualScroll";
import { useLayoutEffect, useState } from "react";

interface IProps {}

const VirtualScrollWrapper: React.FunctionComponent<IProps> = () => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => {
        const newWidth = window.innerWidth;
        setScreenWidth(newWidth);
      };
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  return <HorizontalVirtualScroll screenWidth={screenWidth} />;
};
export default VirtualScrollWrapper;
