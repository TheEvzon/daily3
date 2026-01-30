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
import { VALUE_COLORS } from "@/shared/lib/colors";
import { cn } from "@/shared/lib/utils";
import type { Value } from "@/types";

interface ValueFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; description: string; color: string }) => void;
  initial?: Value;
}

export function ValueFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
}: ValueFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <ValueForm
            initial={initial}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ValueFormProps {
  initial?: Value;
  onSubmit: (data: { name: string; description: string; color: string }) => void;
  onCancel: () => void;
}

function ValueForm({ initial, onSubmit, onCancel }: ValueFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [color, setColor] = useState<string>(initial?.color ?? VALUE_COLORS[0].hex);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), color });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit Value" : "Add Value"}</DialogTitle>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="value-name">
            Name
          </label>
          <Input
            id="value-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Freedom, Health, Growth"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="value-desc">
            Description
          </label>
          <Input
            id="value-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional — what this value means to you"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Color</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {VALUE_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                className={cn(
                  "h-8 w-8 rounded-full transition-all",
                  color === c.hex
                    ? "ring-2 ring-offset-2 ring-offset-background"
                    : "hover:scale-110",
                )}
                style={{
                  backgroundColor: c.hex,
                  outlineColor: color === c.hex ? c.hex : undefined,
                }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          {initial ? "Save" : "Add Value"}
        </Button>
      </DialogFooter>
    </form>
  );
}
