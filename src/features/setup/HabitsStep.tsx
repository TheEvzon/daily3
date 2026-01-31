import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ValuePicker } from "@/shared/ui/value-picker";
import { ValueBadge } from "@/shared/ui/value-badge";
import {
  useHabits,
  createHabit,
  deleteHabit,
} from "@/features/habits/useHabits";

export function HabitsStep() {
  const habits = useHabits();
  const [title, setTitle] = useState("");
  const [valueIds, setValueIds] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await createHabit({ title: title.trim() }, valueIds);
    setTitle("");
    setValueIds([]);
    setShowForm(false);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Write habits as identity statements — &quot;I am...&quot; or &quot;I
        do...&quot; — not tasks.
      </p>

      {habits.map((habit) => (
        <div
          key={habit.id}
          className="flex items-start gap-2 rounded-lg border border-border p-3"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{habit.title}</p>
            {habit.values.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {habit.values.map((v) => (
                  <ValueBadge key={v.id} value={v} />
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => deleteHabit(habit.id)}
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
            placeholder='e.g. "I move my body daily"'
            autoFocus
          />
          <ValuePicker selected={valueIds} onChange={setValueIds} />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={!title.trim()}>
              Add Habit
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setTitle("");
                setValueIds([]);
              }}
            >
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
          Add a habit
        </button>
      )}

      <p className="text-xs text-muted-foreground">
        {habits.length} habit{habits.length !== 1 ? "s" : ""} created
      </p>
    </div>
  );
}
