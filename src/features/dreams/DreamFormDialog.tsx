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
import type { DreamWithValues } from "./useDreams";

interface DreamFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string; valueIds: string[] }) => void;
  initial?: DreamWithValues;
}

export function DreamFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
}: DreamFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <DreamForm
            initial={initial}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DreamFormProps {
  initial?: DreamWithValues;
  onSubmit: (data: { title: string; description: string; valueIds: string[] }) => void;
  onCancel: () => void;
}

function DreamForm({ initial, onSubmit, onCancel }: DreamFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [valueIds, setValueIds] = useState<string[]>(
    initial?.values.map((v) => v.id) ?? [],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      valueIds,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit Dream" : "Add Dream"}</DialogTitle>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="dream-title">
            Dream
          </label>
          <Input
            id="dream-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Travel to every continent"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="dream-desc">
            Description
          </label>
          <Input
            id="dream-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Values</label>
          <p className="mb-1.5 text-xs text-muted-foreground">
            Which values does this dream fulfill?
          </p>
          <ValuePicker selected={valueIds} onChange={setValueIds} />
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          {initial ? "Save" : "Add Dream"}
        </Button>
      </DialogFooter>
    </form>
  );
}
