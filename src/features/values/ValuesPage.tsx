import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { useValues, createValue, updateValue, deleteValue } from "./useValues";
import { ValueCard } from "./ValueCard";
import { ValueFormDialog } from "./ValueFormDialog";
import type { Value } from "@/types";

export function ValuesPage() {
  const values = useValues();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Value | undefined>();

  function handleAdd() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function handleEdit(value: Value) {
    setEditing(value);
    setDialogOpen(true);
  }

  async function handleSubmit(data: {
    name: string;
    description: string;
    color: string;
  }) {
    if (editing) {
      await updateValue(editing.id, data);
    } else {
      await createValue(data);
    }
    setDialogOpen(false);
  }

  async function handleDelete(id: string) {
    await deleteValue(id);
  }

  return (
    <div className="mx-auto max-w-lg pb-6">
      <PageHeader
        title="Values"
        description="Define who you are and what matters."
      >
        <Button size="sm" onClick={handleAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </PageHeader>

      <div className="mt-4 space-y-2 px-4">
        {values.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No values yet. Add your first value to get started.
          </p>
        )}
        {values.map((value) => (
          <ValueCard
            key={value.id}
            value={value}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <ValueFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
