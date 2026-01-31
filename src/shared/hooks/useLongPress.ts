import { useRef, useCallback, type PointerEvent } from "react";

const LONG_PRESS_MS = 500;

export function useLongPress(onLongPress: (e: PointerEvent) => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      activeRef.current = true;
      timerRef.current = setTimeout(() => {
        if (activeRef.current) {
          onLongPress(e);
        }
      }, LONG_PRESS_MS);
    },
    [onLongPress],
  );

  const cancel = useCallback(() => {
    activeRef.current = false;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onPointerDown,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
  };
}
