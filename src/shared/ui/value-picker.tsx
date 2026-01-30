import { useValues } from "@/features/values/useValues";
import { cn } from "@/shared/lib/utils";

interface ValuePickerProps {
  selected: string[];
  onChange: (valueIds: string[]) => void;
}

export function ValuePicker({ selected, onChange }: ValuePickerProps) {
  const values = useValues();

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((v) => v !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  if (values.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No values defined yet. Add values first.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => {
        const isSelected = selected.includes(value.id);
        return (
          <button
            key={value.id}
            type="button"
            onClick={() => toggle(value.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
              isSelected
                ? "border-transparent font-medium text-white"
                : "border-border text-muted-foreground hover:border-foreground/30",
            )}
            style={
              isSelected
                ? { backgroundColor: value.color }
                : undefined
            }
          >
            <span
              className={cn("h-2 w-2 rounded-full", !isSelected && "opacity-50")}
              style={{ backgroundColor: isSelected ? "white" : value.color }}
            />
            {value.name}
          </button>
        );
      })}
    </div>
  );
}
