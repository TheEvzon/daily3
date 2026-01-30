import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { ValueBadge } from "@/shared/ui/value-badge";
import {
  useBacklogGroupedByGoal,
  createBacklogItem,
  updateBacklogItem,
  deleteBacklogItem,
} from "./useBacklog";
import type { BacklogItemWithCascade } from "./useBacklog";
import { BacklogCard } from "./BacklogCard";
import { BacklogFormDialog } from "./BacklogFormDialog";
import { addToDaily3 } from "@/features/daily3/useDaily3";

export function BacklogPage() {
  const groups = useBacklogGroupedByGoal();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BacklogItemWithCascade | undefined>();

  function handleAdd() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function handleEdit(item: BacklogItemWithCascade) {
    setEditing(item);
    setDialogOpen(true);
  }

  async function handleSubmit(data: {
    title: string;
    notes: string | null;
    goalId: string | null;
    dueDate: Date | null;
  }) {
    if (editing) {
      await updateBacklogItem(editing.id, data);
    } else {
      await createBacklogItem(data);
    }
    setDialogOpen(false);
  }

  return (
    <div className="mx-auto max-w-lg pb-6">
      <PageHeader
        title="Backlog"
        description="Actions that move you toward your goals."
      >
        <Button size="sm" onClick={handleAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </PageHeader>

      <div className="mt-4 space-y-6 px-4">
        {groups.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No backlog items yet. Add actions to work toward your goals.
          </p>
        )}
        {groups.map((group) => (
          <div key={group.goalId ?? "unaligned"}>
            {group.goal ? (
              <div className="mb-2">
                <p className="text-sm font-semibold">{group.goal.title}</p>
                {group.dream && (
                  <p className="text-xs text-muted-foreground">
                    Dream: {group.dream.title}
                  </p>
                )}
                {group.values.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {group.values.map((v) => (
                      <ValueBadge key={v.id} value={v} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                Unaligned
              </p>
            )}
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <BacklogCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={deleteBacklogItem}
                  onAddToDaily3={addToDaily3}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <BacklogFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
