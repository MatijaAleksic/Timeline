import { useCallback, useEffect, useRef } from "react";

function useDebouncedWheel(
  callback: (event: React.WheelEvent<HTMLDivElement>) => void,
  delay: number = 40
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEventRef = useRef<React.WheelEvent<HTMLDivElement> | null>(null);

  const debouncedCallback = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      lastEventRef.current = event;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (lastEventRef.current) {
          callback(lastEventRef.current);
        }
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  //DEBOUNCED WHEEL IF NEEDED (In HorizontalVirtualScroll.tsx)
  // ========================================================
  // const debouncedHandleWheel = useDebouncedWheel(
  //   handleWheel,
  //   MeterConstants.debounceWheelMilliseconds
  // );
  // const onWheelHandler = useCallback(
  //   (event: React.WheelEvent<HTMLDivElement>) => {
  //     debouncedHandleWheel(event);
  //   },
  //   [debouncedHandleWheel]
  // );
  // ========================================================

  return debouncedCallback;
}

export default useDebouncedWheel;
