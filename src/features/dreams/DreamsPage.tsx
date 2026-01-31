import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import {
  useDreams,
  createDream,
  updateDream,
  archiveDream,
  deleteDream,
} from "./useDreams";
import type { DreamWithValues } from "./useDreams";
import { DreamCard } from "./DreamCard";
import { DreamFormDialog } from "./DreamFormDialog";
import { useValues } from "@/features/values/useValues";

export function DreamsPage() {
  const [filterValueId, setFilterValueId] = useState<string | undefined>();
  const dreams = useDreams(filterValueId);
  const values = useValues();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DreamWithValues | undefined>();

  function handleAdd() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function handleEdit(dream: DreamWithValues) {
    setEditing(dream);
    setDialogOpen(true);
  }

  async function handleSubmit(data: {
    title: string;
    description: string;
    valueIds: string[];
  }) {
    if (editing) {
      await updateDream(
        editing.id,
        { title: data.title, description: data.description },
        data.valueIds,
      );
    } else {
      await createDream(
        { title: data.title, description: data.description },
        data.valueIds,
      );
    }
    setDialogOpen(false);
  }

  return (
    <div className="mx-auto max-w-lg pb-6">
      <PageHeader title="Dreams" description="Your life-level aspirations.">
        <Button size="sm" onClick={handleAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </PageHeader>

      {values.length > 0 && (
        <div className="mt-3 flex gap-1.5 overflow-x-auto px-4 pb-1">
          <button
            onClick={() => setFilterValueId(undefined)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !filterValueId
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            All
          </button>
          {values.map((v) => (
            <button
              key={v.id}
              onClick={() =>
                setFilterValueId(filterValueId === v.id ? undefined : v.id)
              }
              className="shrink-0 rounded-full px-3 py-1 text-xs font-medium text-white transition-opacity"
              style={{
                backgroundColor: v.color,
                opacity: filterValueId === v.id ? 1 : 0.5,
              }}
            >
              {v.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 space-y-2 px-4">
        {dreams.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {filterValueId
              ? "No dreams linked to this value."
              : "No dreams yet. Start dreaming big."}
          </p>
        )}
        {dreams.map((dream) => (
          <DreamCard
            key={dream.id}
            dream={dream}
            onEdit={handleEdit}
            onArchive={archiveDream}
            onDelete={deleteDream}
          />
        ))}
      </div>

      <DreamFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
