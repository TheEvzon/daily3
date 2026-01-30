import { Archive, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ValueBadge } from "@/shared/ui/value-badge";
import type { DreamWithValues } from "./useDreams";

interface DreamCardProps {
  dream: DreamWithValues;
  onEdit: (dream: DreamWithValues) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DreamCard({
  dream,
  onEdit,
  onArchive,
  onDelete,
}: DreamCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{dream.title}</p>
          {dream.description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {dream.description}
            </p>
          )}
          {dream.values.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {dream.values.map((v) => (
                <ValueBadge key={v.id} value={v} />
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(dream)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onArchive(dream.id)}
            title="Archive"
          >
            <Archive className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(dream.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
