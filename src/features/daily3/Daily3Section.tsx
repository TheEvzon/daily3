import { Check, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ValueBadge } from "@/shared/ui/value-badge";
import { cn } from "@/shared/lib/utils";
import {
  useDaily3,
  toggleDaily3Complete,
  removeFromDaily3,
} from "./useDaily3";
import type { Daily3EntryWithCascade } from "./useDaily3";

interface Daily3SectionProps {
  onPickFromBacklog: () => void;
}

export function Daily3Section({ onPickFromBacklog }: Daily3SectionProps) {
  const entries = useDaily3();
  const completedCount = entries.filter((e) => e.completed).length;

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-medium text-primary uppercase tracking-wide">
          Daily 3
        </h2>
        {entries.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {completedCount}/{entries.length} complete
          </span>
        )}
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <Daily3Card key={entry.id} entry={entry} />
        ))}

        {entries.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Pick your Daily 3 to get started.
          </p>
        )}

        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={onPickFromBacklog}
        >
          + Pick from backlog
        </Button>
      </div>
    </section>
  );
}

function Daily3Card({ entry }: { entry: Daily3EntryWithCascade }) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 transition-opacity",
        entry.completed && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleDaily3Complete(entry.id)}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            entry.completed
              ? "border-green-500 bg-green-500 text-white"
              : "border-muted-foreground/40 hover:border-primary",
          )}
        >
          {entry.completed && <Check className="h-3 w-3" />}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-medium",
              entry.completed && "line-through",
            )}
          >
            {entry.backlogItem.title}
          </p>

          {/* Alignment cascade */}
          {entry.goal && (
            <div className="mt-1 text-xs text-muted-foreground">
              <span>Goal: {entry.goal.title}</span>
              {entry.dream && (
                <>
                  <span className="mx-1">→</span>
                  <span>Dream: {entry.dream.title}</span>
                </>
              )}
            </div>
          )}

          {entry.values.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {entry.values.map((v) => (
                <ValueBadge key={v.id} value={v} />
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => removeFromDaily3(entry.id)}
          title="Remove from today"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
