import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ValueBadge } from "@/shared/ui/value-badge";
import { useDreams } from "@/features/dreams/useDreams";
import { useGoals, createGoal, deleteGoal } from "@/features/goals/useGoals";

export function GoalsStep() {
  const dreams = useDreams();
  const goals = useGoals();
  const [title, setTitle] = useState("");
  const [dreamId, setDreamId] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !dreamId || !targetDate) return;
    await createGoal({
      title: title.trim(),
      description: "",
      dreamId,
      targetDate: new Date(targetDate),
    });
    setTitle("");
    setDreamId("");
    setTargetDate("");
    setShowForm(false);
  }

  function resetForm() {
    setShowForm(false);
    setTitle("");
    setDreamId("");
    setTargetDate("");
  }

  return (
    <div className="space-y-3">
      {goals.map((goal) => (
        <div
          key={goal.id}
          className="flex items-start gap-2 rounded-lg border border-border p-3"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{goal.title}</p>
            {goal.dream && (
              <p className="text-xs text-muted-foreground">
                {goal.dream.title}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Target:{" "}
              {new Date(goal.targetDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            {goal.values.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {goal.values.map((v) => (
                  <ValueBadge key={v.id} value={v} />
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => deleteGoal(goal.id)}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}

      {showForm ? (
        <form
          onSubmit={handleAdd}
          className="space-y-3 rounded-lg border border-dashed border-border p-3"
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Save $10,000 for Europe trip"
            autoFocus
          />
          <select
            value={dreamId}
            onChange={(e) => setDreamId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a dream...</option>
            {dreams.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
          <Input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={!title.trim() || !dreamId || !targetDate}
            >
              Add Goal
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Add a goal
        </button>
      )}

      {dreams.length === 0 && (
        <p className="text-xs text-amber-600">
          Add dreams first (go back one step).
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        {goals.length} goal{goals.length !== 1 ? "s" : ""} set
        {goals.length < 3 && " — start with 3-5 goals"}
      </p>
    </div>
  );
}
