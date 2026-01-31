import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { VALUE_COLORS } from "@/shared/lib/colors";
import { cn } from "@/shared/lib/utils";
import {
  useValues,
  createValue,
  deleteValue,
} from "@/features/values/useValues";

const SUGGESTED_VALUES = [
  "Freedom",
  "Health",
  "Family",
  "Growth",
  "Impact",
  "Creativity",
  "Adventure",
  "Security",
  "Learning",
  "Connection",
];

export function ValuesStep() {
  const values = useValues();
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");

  const existingNames = new Set(values.map((v) => v.name));

  async function handleSuggestedClick(name: string) {
    if (existingNames.has(name)) {
      const value = values.find((v) => v.name === name);
      if (value) await deleteValue(value.id);
    } else {
      const colorIndex = values.length % VALUE_COLORS.length;
      await createValue({
        name,
        description: "",
        color: VALUE_COLORS[colorIndex].hex,
      });
    }
  }

  async function handleAddCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!customName.trim()) return;
    const colorIndex = values.length % VALUE_COLORS.length;
    await createValue({
      name: customName.trim(),
      description: "",
      color: VALUE_COLORS[colorIndex].hex,
    });
    setCustomName("");
    setShowCustom(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_VALUES.map((name) => {
          const selected = existingNames.has(name);
          return (
            <button
              key={name}
              onClick={() => handleSuggestedClick(name)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:bg-accent",
              )}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Already added custom values */}
      {values
        .filter((v) => !SUGGESTED_VALUES.includes(v.name))
        .map((v) => (
          <div
            key={v.id}
            className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary px-3 py-1 text-sm font-medium text-primary-foreground"
          >
            {v.name}
            <button onClick={() => deleteValue(v.id)}>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

      {showCustom ? (
        <form onSubmit={handleAddCustom} className="flex gap-2">
          <Input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Custom value..."
            autoFocus
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!customName.trim()}>
            Add
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowCustom(false)}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <button
          onClick={() => setShowCustom(true)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Add custom value
        </button>
      )}

      <p className="text-xs text-muted-foreground">
        {values.length} selected
        {values.length < 3 && " — try to pick at least 3"}
      </p>
    </div>
  );
}
