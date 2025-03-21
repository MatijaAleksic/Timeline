import { useCallback, useEffect, useRef } from "react";

function useDebouncedWheel(
  callback: (event: React.WheelEvent) => void,
  delay: number = 40
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEventRef = useRef<React.WheelEvent | null>(null);

  const debouncedCallback = useCallback(
    (event: React.WheelEvent) => {
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
