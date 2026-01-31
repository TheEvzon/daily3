import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export interface ContextMenuItem {
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  onSelect: () => void;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number } | null;
  onClose: () => void;
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!position) return;

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [position, onClose]);

  // Adjust position to stay within viewport
  useEffect(() => {
    if (!position || !menuRef.current) return;
    const el = menuRef.current;
    const rect = el.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      el.style.left = `${window.innerWidth - rect.width - 8}px`;
    }
    if (rect.bottom > window.innerHeight) {
      el.style.top = `${window.innerHeight - rect.height - 8}px`;
    }
  }, [position]);

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[160px] overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in zoom-in-95"
      style={{ top: position.y, left: position.x }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            item.onSelect();
            onClose();
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
            item.destructive && "text-destructive hover:text-destructive",
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
