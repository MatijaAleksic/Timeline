"use client";

import HorizontalVirtualScroll, {
  VirtualScrollState,
} from "@/components/VirtualScroll/HorizontalVirtualScoll/HorizontalVirtualScroll";
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

  const startState = {
    cachedOffsetChunks: 404999,
    elementWidth: 270,
    level: 4,
    scrollOffset: 999343,
    virtualItems: [
      {
        index: 1499999967,
        start: 404999991090,
        end: 404999991360,
        key: "virtual-item-1499999967",
        size: 270,
      },
      {
        index: 1499999968,
        start: 404999991360,
        end: 404999991630,
        key: "virtual-item-1499999968",
        size: 270,
      },
      {
        index: 1499999969,
        start: 404999991630,
        end: 404999991900,
        key: "virtual-item-1499999969",
        size: 270,
      },
      {
        index: 1499999970,
        start: 404999991900,
        end: 404999992170,
        key: "virtual-item-1499999970",
        size: 270,
      },
      {
        index: 1499999971,
        start: 404999992170,
        end: 404999992440,
        key: "virtual-item-1499999971",
        size: 270,
      },
      {
        index: 1499999972,
        start: 404999992440,
        end: 404999992710,
        key: "virtual-item-1499999972",
        size: 270,
      },
      {
        index: 1499999973,
        start: 404999992710,
        end: 404999992980,
        key: "virtual-item-1499999973",
        size: 270,
      },
      {
        index: 1499999974,
        start: 404999992980,
        end: 404999993250,
        key: "virtual-item-1499999974",
        size: 270,
      },
      {
        index: 1499999975,
        start: 404999993250,
        end: 404999993520,
        key: "virtual-item-1499999975",
        size: 270,
      },
      {
        index: 1499999976,
        start: 404999993520,
        end: 404999993790,
        key: "virtual-item-1499999976",
        size: 270,
      },
      {
        index: 1499999977,
        start: 404999993790,
        end: 404999994060,
        key: "virtual-item-1499999977",
        size: 270,
      },
      {
        index: 1499999978,
        start: 404999994060,
        end: 404999994330,
        key: "virtual-item-1499999978",
        size: 270,
      },
      {
        index: 1499999979,
        start: 404999994330,
        end: 404999994600,
        key: "virtual-item-1499999979",
        size: 270,
      },
      {
        index: 1499999980,
        start: 404999994600,
        end: 404999994870,
        key: "virtual-item-1499999980",
        size: 270,
      },
      {
        index: 1499999981,
        start: 404999994870,
        end: 404999995140,
        key: "virtual-item-1499999981",
        size: 270,
      },
      {
        index: 1499999982,
        start: 404999995140,
        end: 404999995410,
        key: "virtual-item-1499999982",
        size: 270,
      },
      {
        index: 1499999983,
        start: 404999995410,
        end: 404999995680,
        key: "virtual-item-1499999983",
        size: 270,
      },
      {
        index: 1499999984,
        start: 404999995680,
        end: 404999995950,
        key: "virtual-item-1499999984",
        size: 270,
      },
      {
        index: 1499999985,
        start: 404999995950,
        end: 404999996220,
        key: "virtual-item-1499999985",
        size: 270,
      },
      {
        index: 1499999986,
        start: 404999996220,
        end: 404999996490,
        key: "virtual-item-1499999986",
        size: 270,
      },
      {
        index: 1499999987,
        start: 404999996490,
        end: 404999996760,
        key: "virtual-item-1499999987",
        size: 270,
      },
      {
        index: 1499999988,
        start: 404999996760,
        end: 404999997030,
        key: "virtual-item-1499999988",
        size: 270,
      },
      {
        index: 1499999989,
        start: 404999997030,
        end: 404999997300,
        key: "virtual-item-1499999989",
        size: 270,
      },
      {
        index: 1499999990,
        start: 404999997300,
        end: 404999997570,
        key: "virtual-item-1499999990",
        size: 270,
      },
      {
        index: 1499999991,
        start: 404999997570,
        end: 404999997840,
        key: "virtual-item-1499999991",
        size: 270,
      },
      {
        index: 1499999992,
        start: 404999997840,
        end: 404999998110,
        key: "virtual-item-1499999992",
        size: 270,
      },
      {
        index: 1499999993,
        start: 404999998110,
        end: 404999998380,
        key: "virtual-item-1499999993",
        size: 270,
      },
      {
        index: 1499999994,
        start: 404999998380,
        end: 404999998650,
        key: "virtual-item-1499999994",
        size: 270,
      },
      {
        index: 1499999995,
        start: 404999998650,
        end: 404999998920,
        key: "virtual-item-1499999995",
        size: 270,
      },
      {
        index: 1499999996,
        start: 404999998920,
        end: 404999999190,
        key: "virtual-item-1499999996",
        size: 270,
      },
      {
        index: 1499999997,
        start: 404999999190,
        end: 404999999460,
        key: "virtual-item-1499999997",
        size: 270,
      },
      {
        index: 1499999998,
        start: 404999999460,
        end: 404999999730,
        key: "virtual-item-1499999998",
        size: 270,
      },
      {
        index: 1499999999,
        start: 404999999730,
        end: 405000000000,
        key: "virtual-item-1499999999",
        size: 270,
      },
      {
        index: 1500000000,
        start: 405000000000,
        end: 405000000270,
        key: "virtual-item-1500000000",
        size: 270,
      },
      {
        index: 1500000001,
        start: 405000000270,
        end: 405000000540,
        key: "virtual-item-1500000001",
        size: 270,
      },
      {
        index: 1500000002,
        start: 405000000540,
        end: 405000000810,
        key: "virtual-item-1500000002",
        size: 270,
      },
      {
        index: 1500000003,
        start: 405000000810,
        end: 405000001080,
        key: "virtual-item-1500000003",
        size: 270,
      },
      {
        index: 1500000004,
        start: 405000001080,
        end: 405000001350,
        key: "virtual-item-1500000004",
        size: 270,
      },
      {
        index: 1500000005,
        start: 405000001350,
        end: 405000001620,
        key: "virtual-item-1500000005",
        size: 270,
      },
      {
        index: 1500000006,
        start: 405000001620,
        end: 405000001890,
        key: "virtual-item-1500000006",
        size: 270,
      },
      {
        index: 1500000007,
        start: 405000001890,
        end: 405000002160,
        key: "virtual-item-1500000007",
        size: 270,
      },
      {
        index: 1500000008,
        start: 405000002160,
        end: 405000002430,
        key: "virtual-item-1500000008",
        size: 270,
      },
      {
        index: 1500000009,
        start: 405000002430,
        end: 405000002700,
        key: "virtual-item-1500000009",
        size: 270,
      },
      {
        index: 1500000010,
        start: 405000002700,
        end: 405000002970,
        key: "virtual-item-1500000010",
        size: 270,
      },
      {
        index: 1500000011,
        start: 405000002970,
        end: 405000003240,
        key: "virtual-item-1500000011",
        size: 270,
      },
      {
        index: 1500000012,
        start: 405000003240,
        end: 405000003510,
        key: "virtual-item-1500000012",
        size: 270,
      },
      {
        index: 1500000013,
        start: 405000003510,
        end: 405000003780,
        key: "virtual-item-1500000013",
        size: 270,
      },
      {
        index: 1500000014,
        start: 405000003780,
        end: 405000004050,
        key: "virtual-item-1500000014",
        size: 270,
      },
      {
        index: 1500000015,
        start: 405000004050,
        end: 405000004320,
        key: "virtual-item-1500000015",
        size: 270,
      },
      {
        index: 1500000016,
        start: 405000004320,
        end: 405000004590,
        key: "virtual-item-1500000016",
        size: 270,
      },
      {
        index: 1500000017,
        start: 405000004590,
        end: 405000004860,
        key: "virtual-item-1500000017",
        size: 270,
      },
      {
        index: 1500000018,
        start: 405000004860,
        end: 405000005130,
        key: "virtual-item-1500000018",
        size: 270,
      },
      {
        index: 1500000019,
        start: 405000005130,
        end: 405000005400,
        key: "virtual-item-1500000019",
        size: 270,
      },
      {
        index: 1500000020,
        start: 405000005400,
        end: 405000005670,
        key: "virtual-item-1500000020",
        size: 270,
      },
      {
        index: 1500000021,
        start: 405000005670,
        end: 405000005940,
        key: "virtual-item-1500000021",
        size: 270,
      },
      {
        index: 1500000022,
        start: 405000005940,
        end: 405000006210,
        key: "virtual-item-1500000022",
        size: 270,
      },
      {
        index: 1500000023,
        start: 405000006210,
        end: 405000006480,
        key: "virtual-item-1500000023",
        size: 270,
      },
      {
        index: 1500000024,
        start: 405000006480,
        end: 405000006750,
        key: "virtual-item-1500000024",
        size: 270,
      },
      {
        index: 1500000025,
        start: 405000006750,
        end: 405000007020,
        key: "virtual-item-1500000025",
        size: 270,
      },
      {
        index: 1500000026,
        start: 405000007020,
        end: 405000007290,
        key: "virtual-item-1500000026",
        size: 270,
      },
      {
        index: 1500000027,
        start: 405000007290,
        end: 405000007560,
        key: "virtual-item-1500000027",
        size: 270,
      },
      {
        index: 1500000028,
        start: 405000007560,
        end: 405000007830,
        key: "virtual-item-1500000028",
        size: 270,
      },
      {
        index: 1500000029,
        start: 405000007830,
        end: 405000008100,
        key: "virtual-item-1500000029",
        size: 270,
      },
      {
        index: 1500000030,
        start: 405000008100,
        end: 405000008370,
        key: "virtual-item-1500000030",
        size: 270,
      },
      {
        index: 1500000031,
        start: 405000008370,
        end: 405000008640,
        key: "virtual-item-1500000031",
        size: 270,
      },
      {
        index: 1500000032,
        start: 405000008640,
        end: 405000008910,
        key: "virtual-item-1500000032",
        size: 270,
      },
    ],
    zoomValue: 20,
  } as VirtualScrollState;

  return (
    <div className={styles.timelineWrapper}>
      <HorizontalVirtualScroll
        screenWidth={screenWidth}
        startState={startState}
      />
      ;
    </div>
  );
};
export default VirtualScrollWrapper;
