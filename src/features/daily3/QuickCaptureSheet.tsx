import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useGoals } from "@/features/goals/useGoals";
import { createBacklogItem } from "@/features/backlog/useBacklog";

interface QuickCaptureSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickCaptureSheet({
  open,
  onOpenChange,
}: QuickCaptureSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        {open && <QuickCaptureForm onClose={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  );
}

function QuickCaptureForm({ onClose }: { onClose: () => void }) {
  const goals = useGoals();
  const activeGoals = goals.filter((g) => !g.completed);

  const [title, setTitle] = useState("");
  const [goalId, setGoalId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await createBacklogItem({
      title: title.trim(),
      notes: null,
      goalId: goalId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    });
    setTitle("");
    setGoalId("");
    setDueDate("");
    setShowOptions(false);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <SheetHeader>
        <SheetTitle>Quick Capture</SheetTitle>
      </SheetHeader>

      <div className="mt-4 space-y-3 pb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />

        {!showOptions && (
          <button
            type="button"
            onClick={() => setShowOptions(true)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            + Add goal or due date
          </button>
        )}

        {showOptions && (
          <div className="space-y-3">
            <select
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">No goal</option>
              {activeGoals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>

            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="Due date"
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={!title.trim()}>
          Add to Backlog
        </Button>
      </div>
    </form>
  );
}
