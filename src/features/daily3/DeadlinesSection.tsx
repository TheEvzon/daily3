import { AlertTriangle, Check } from "lucide-react";
import {
  useDeadlinesWithDays,
  toggleBacklogItemComplete,
} from "@/features/backlog/useBacklog";
import { cn } from "@/shared/lib/utils";

export function DeadlinesSection() {
  const deadlines = useDeadlinesWithDays();

  if (deadlines.length === 0) return null;

  return (
    <section>
      <h2 className="mb-2 flex items-center gap-1.5 text-xs font-medium text-amber-600 uppercase tracking-wide">
        <AlertTriangle className="h-3.5 w-3.5" />
        Deadlines
      </h2>
      <div className="space-y-1.5">
        {deadlines.map((item) => {
          const isOverdue = item.daysUntil < 0;
          const isToday = item.daysUntil === 0;

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-2",
                isOverdue
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-amber-500/30 bg-amber-500/5",
              )}
            >
              <button
                onClick={() => toggleBacklogItemComplete(item.id)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-muted-foreground/40 transition-colors hover:border-primary hover:bg-primary/10"
              >
                {item.completed && <Check className="h-3 w-3" />}
              </button>
              <span className="flex-1 text-sm">{item.title}</span>
              <span
                className={cn(
                  "shrink-0 text-xs font-medium",
                  isOverdue
                    ? "text-destructive"
                    : isToday
                      ? "text-amber-600"
                      : "text-muted-foreground",
                )}
              >
                {isOverdue
                  ? `${Math.abs(item.daysUntil)}d overdue`
                  : isToday
                    ? "Today"
                    : item.daysUntil === 1
                      ? "Tomorrow"
                      : `${item.daysUntil}d`}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
