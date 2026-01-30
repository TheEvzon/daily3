import { Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ValueBadge } from "@/shared/ui/value-badge";
import { cn } from "@/shared/lib/utils";
import type { GoalWithCascade } from "./useGoals";

interface GoalCardProps {
  goal: GoalWithCascade;
  onEdit: (goal: GoalWithCascade) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function GoalCard({
  goal,
  onEdit,
  onToggleComplete,
  onDelete,
}: GoalCardProps) {
  const isOverdue =
    !goal.completed && new Date(goal.targetDate) < new Date();

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3",
        goal.completed
          ? "border-border/50 opacity-60"
          : isOverdue
            ? "border-destructive/50"
            : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-medium",
              goal.completed && "line-through",
            )}
          >
            {goal.title}
          </p>
          {goal.dream && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Dream: {goal.dream.title}
            </p>
          )}
          <p
            className={cn(
              "mt-0.5 text-xs",
              isOverdue ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {isOverdue ? "Overdue: " : "Target: "}
            {formatDate(goal.targetDate)}
          </p>
          {goal.values.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {goal.values.map((v) => (
                <ValueBadge key={v.id} value={v} />
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              goal.completed && "text-green-600",
            )}
            onClick={() => onToggleComplete(goal.id)}
            title={goal.completed ? "Mark incomplete" : "Mark complete"}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(goal)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(goal.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
