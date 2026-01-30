import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ValueBadge } from "@/shared/ui/value-badge";
import { cn } from "@/shared/lib/utils";
import type { HabitWithValues } from "./useHabits";

interface HabitCardProps {
  habit: HabitWithValues;
  onEdit: (habit: HabitWithValues) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitCard({
  habit,
  onEdit,
  onToggleActive,
  onDelete,
}: HabitCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-3",
        !habit.active && "opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{habit.title}</p>
          {habit.values.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {habit.values.map((v) => (
                <ValueBadge key={v.id} value={v} />
              ))}
            </div>
          )}
          {!habit.active && (
            <p className="mt-1 text-xs text-muted-foreground">Inactive</p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleActive(habit.id)}
            title={habit.active ? "Deactivate" : "Activate"}
          >
            {habit.active ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(habit)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(habit.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
