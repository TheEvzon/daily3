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
import { useDreams } from "@/features/dreams/useDreams";
import type { GoalWithCascade } from "./useGoals";

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    dreamId: string;
    targetDate: Date;
  }) => void;
  initial?: GoalWithCascade;
}

export function GoalFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
}: GoalFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <GoalForm
            initial={initial}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface GoalFormProps {
  initial?: GoalWithCascade;
  onSubmit: (data: {
    title: string;
    description: string;
    dreamId: string;
    targetDate: Date;
  }) => void;
  onCancel: () => void;
}

function GoalForm({ initial, onSubmit, onCancel }: GoalFormProps) {
  const dreams = useDreams();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dreamId, setDreamId] = useState(initial?.dreamId ?? "");
  const [targetDate, setTargetDate] = useState(
    initial?.targetDate
      ? new Date(initial.targetDate).toISOString().split("T")[0]
      : "",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !dreamId || !targetDate) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dreamId,
      targetDate: new Date(targetDate),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit Goal" : "Add Goal"}</DialogTitle>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="goal-title">
            Goal
          </label>
          <Input
            id="goal-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Save $10,000 for Europe trip"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="goal-desc">
            Description
          </label>
          <Input
            id="goal-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details"
          />
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="goal-dream">
            Dream
          </label>
          <select
            id="goal-dream"
            value={dreamId}
            onChange={(e) => setDreamId(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a dream...</option>
            {dreams.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="goal-date">
            Target Date
          </label>
          <Input
            id="goal-date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!title.trim() || !dreamId || !targetDate}
        >
          {initial ? "Save" : "Add Goal"}
        </Button>
      </DialogFooter>
    </form>
  );
}
