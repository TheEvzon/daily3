import { useRef, type ReactNode } from "react";
import { useDrag } from "@use-gesture/react";
import { cn } from "@/shared/lib/utils";

interface SwipeAction {
  onSwipe: () => void;
  color: string;
  icon: ReactNode;
  label: string;
}

interface SwipeableCardProps {
  children: ReactNode;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  className?: string;
}

const THRESHOLD = 80;

export function SwipeableCard({
  children,
  leftAction,
  rightAction,
  className,
}: SwipeableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const bind = useDrag(
    ({ active, movement: [mx], cancel }) => {
      const el = cardRef.current;
      if (!el) return;

      // Clamp movement
      const clampedX = Math.max(
        rightAction ? -THRESHOLD * 1.5 : 0,
        Math.min(leftAction ? THRESHOLD * 1.5 : 0, mx),
      );

      if (active) {
        el.style.transform = `translateX(${clampedX}px)`;
        el.style.transition = "none";
      } else {
        // Released — check if past threshold
        if (leftAction && clampedX > THRESHOLD) {
          el.style.transform = `translateX(${THRESHOLD * 2}px)`;
          el.style.transition = "transform 200ms ease-out";
          setTimeout(() => {
            leftAction.onSwipe();
            el.style.transform = "translateX(0)";
            el.style.transition = "transform 200ms ease-out";
          }, 200);
        } else if (rightAction && clampedX < -THRESHOLD) {
          el.style.transform = `translateX(${-THRESHOLD * 2}px)`;
          el.style.transition = "transform 200ms ease-out";
          setTimeout(() => {
            rightAction.onSwipe();
            el.style.transform = "translateX(0)";
            el.style.transition = "transform 200ms ease-out";
          }, 200);
        } else {
          el.style.transform = "translateX(0)";
          el.style.transition = "transform 200ms ease-out";
        }
        cancel();
      }
    },
    { axis: "x", filterTaps: true },
  );

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {/* Left action reveal (swipe right) */}
      {leftAction && (
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-20 items-center justify-center",
            leftAction.color,
          )}
        >
          <div className="flex flex-col items-center gap-0.5 text-white">
            {leftAction.icon}
            <span className="text-[10px] font-medium">{leftAction.label}</span>
          </div>
        </div>
      )}

      {/* Right action reveal (swipe left) */}
      {rightAction && (
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-20 items-center justify-center",
            rightAction.color,
          )}
        >
          <div className="flex flex-col items-center gap-0.5 text-white">
            {rightAction.icon}
            <span className="text-[10px] font-medium">{rightAction.label}</span>
          </div>
        </div>
      )}

      {/* Card content */}
      <div ref={cardRef} {...bind()} className="relative touch-pan-y bg-card">
        {children}
      </div>
    </div>
  );
}
