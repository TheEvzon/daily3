import { Calendar, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ValueBadge } from "@/shared/ui/value-badge";
import type { BacklogItemWithCascade } from "./useBacklog";

interface BacklogCardProps {
  item: BacklogItemWithCascade;
  onEdit: (item: BacklogItemWithCascade) => void;
  onDelete: (id: string) => void;
  onAddToDaily3?: (id: string) => void;
}

export function BacklogCard({
  item,
  onEdit,
  onDelete,
  onAddToDaily3,
}: BacklogCardProps) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-card p-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{item.title}</p>
        {item.notes && (
          <p className="mt-0.5 text-xs text-muted-foreground">{item.notes}</p>
        )}
        {item.dueDate && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Due{" "}
            {new Date(item.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
        {item.values.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {item.values.map((v) => (
              <ValueBadge key={v.id} value={v} />
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        {onAddToDaily3 && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onAddToDaily3(item.id)}
          >
            + Today
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onEdit(item)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
