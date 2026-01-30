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
import { ValuePicker } from "@/shared/ui/value-picker";
import type { HabitWithValues } from "./useHabits";

interface HabitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; valueIds: string[] }) => void;
  initial?: HabitWithValues;
}

export function HabitFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
}: HabitFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <HabitForm
            initial={initial}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface HabitFormProps {
  initial?: HabitWithValues;
  onSubmit: (data: { title: string; valueIds: string[] }) => void;
  onCancel: () => void;
}

function HabitForm({ initial, onSubmit, onCancel }: HabitFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [valueIds, setValueIds] = useState<string[]>(
    initial?.values.map((v) => v.id) ?? [],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), valueIds });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit Habit" : "Add Habit"}</DialogTitle>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="habit-title">
            Identity Statement
          </label>
          <Input
            id="habit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g. "I move my body daily"'
            autoFocus
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Write it as who you are, not what you do.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Values</label>
          <p className="mb-1.5 text-xs text-muted-foreground">
            Which values does this habit embody?
          </p>
          <ValuePicker selected={valueIds} onChange={setValueIds} />
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          {initial ? "Save" : "Add Habit"}
        </Button>
      </DialogFooter>
    </form>
  );
}
