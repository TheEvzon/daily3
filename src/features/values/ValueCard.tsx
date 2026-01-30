import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { Value } from "@/types";

interface ValueCardProps {
  value: Value;
  onEdit: (value: Value) => void;
  onDelete: (id: string) => void;
}

export function ValueCard({ value, onEdit, onDelete }: ValueCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div
        className="h-4 w-4 shrink-0 rounded-full"
        style={{ backgroundColor: value.color }}
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{value.name}</p>
        {value.description && (
          <p className="truncate text-sm text-muted-foreground">
            {value.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(value)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(value.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
