import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useGoals } from "@/features/goals/useGoals";
import type { BacklogItemWithCascade } from "./useBacklog";

interface BacklogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    notes: string | null;
    goalId: string | null;
    dueDate: Date | null;
  }) => void;
  initial?: BacklogItemWithCascade;
}

export function BacklogFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
}: BacklogFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <BacklogForm
            initial={initial}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface BacklogFormProps {
  initial?: BacklogItemWithCascade;
  onSubmit: (data: {
    title: string;
    notes: string | null;
    goalId: string | null;
    dueDate: Date | null;
  }) => void;
  onCancel: () => void;
}

function BacklogForm({ initial, onSubmit, onCancel }: BacklogFormProps) {
  const goals = useGoals();
  const activeGoals = goals.filter((g) => !g.completed);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [goalId, setGoalId] = useState(initial?.goalId ?? "");
  const [dueDate, setDueDate] = useState(
    initial?.dueDate
      ? new Date(initial.dueDate).toISOString().split("T")[0]
      : "",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      notes: notes.trim() || null,
      goalId: goalId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {initial ? "Edit Backlog Item" : "Add to Backlog"}
        </DialogTitle>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="backlog-title">
            Action
          </label>
          <Input
            id="backlog-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Research flight prices to Paris"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="backlog-notes">
            Notes
          </label>
          <Input
            id="backlog-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional details"
          />
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="backlog-goal">
            Goal (optional)
          </label>
          <select
            id="backlog-goal"
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">No goal (unaligned)</option>
            {activeGoals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
                {g.dream ? ` — ${g.dream.title}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="backlog-due">
            Due Date (optional)
          </label>
          <Input
            id="backlog-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          {initial ? "Save" : "Add"}
        </Button>
      </DialogFooter>
    </form>
  );
}
