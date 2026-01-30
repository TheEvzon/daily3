import type { Value } from "@/types";

interface ValueBadgeProps {
  value: Value;
}

export function ValueBadge({ value }: ValueBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `${value.color}20`,
        color: value.color,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: value.color }}
      />
      {value.name}
    </span>
  );
}
