import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ValuePicker } from "@/shared/ui/value-picker";
import { ValueBadge } from "@/shared/ui/value-badge";
import {
  useDreams,
  createDream,
  deleteDream,
} from "@/features/dreams/useDreams";

export function DreamsStep() {
  const dreams = useDreams();
  const [title, setTitle] = useState("");
  const [valueIds, setValueIds] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await createDream({ title: title.trim(), description: "" }, valueIds);
    setTitle("");
    setValueIds([]);
    setShowForm(false);
  }

  return (
    <div className="space-y-3">
      {dreams.map((dream) => (
        <div
          key={dream.id}
          className="flex items-start gap-2 rounded-lg border border-border p-3"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{dream.title}</p>
            {dream.values.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {dream.values.map((v) => (
                  <ValueBadge key={v.id} value={v} />
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => deleteDream(dream.id)}
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
            placeholder="e.g. Travel to every continent"
            autoFocus
          />
          <ValuePicker selected={valueIds} onChange={setValueIds} />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={!title.trim()}>
              Add Dream
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
          Add a dream
        </button>
      )}

      <p className="text-xs text-muted-foreground">
        {dreams.length} dream{dreams.length !== 1 ? "s" : ""} added
        {dreams.length < 5 && " — aim for at least 5"}
      </p>
    </div>
  );
}
