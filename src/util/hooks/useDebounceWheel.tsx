import { useCallback, useEffect, useRef } from "react";

function useDebouncedWheel(
  callback: (event: WheelEvent) => void,
  delay: number = 200
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEventRef = useRef<WheelEvent | null>(null);

  const debouncedCallback = useCallback(
    (event: WheelEvent) => {
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

  return debouncedCallback;
}

export default useDebouncedWheel;
