import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import {
  useHabits,
  createHabit,
  updateHabit,
  toggleHabitActive,
  deleteHabit,
} from "./useHabits";
import type { HabitWithValues } from "./useHabits";
import { HabitCard } from "./HabitCard";
import { HabitFormDialog } from "./HabitFormDialog";

export function HabitsPage() {
  const habits = useHabits();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HabitWithValues | undefined>();

  const activeHabits = habits.filter((h) => h.active);
  const inactiveHabits = habits.filter((h) => !h.active);

  function handleAdd() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function handleEdit(habit: HabitWithValues) {
    setEditing(habit);
    setDialogOpen(true);
  }

  async function handleSubmit(data: { title: string; valueIds: string[] }) {
    if (editing) {
      await updateHabit(editing.id, { title: data.title }, data.valueIds);
    } else {
      await createHabit({ title: data.title }, data.valueIds);
    }
    setDialogOpen(false);
  }

  return (
    <div className="mx-auto max-w-lg pb-6">
      <PageHeader
        title="Habits"
        description="Identity statements — who you are becoming."
      >
        <Button size="sm" onClick={handleAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </PageHeader>

      <div className="mt-4 space-y-2 px-4">
        {activeHabits.length === 0 && inactiveHabits.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No habits yet. Define who you are becoming.
          </p>
        )}
        {activeHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={handleEdit}
            onToggleActive={toggleHabitActive}
            onDelete={deleteHabit}
          />
        ))}
        {inactiveHabits.length > 0 && (
          <>
            <p className="pt-4 text-xs font-medium text-muted-foreground uppercase">
              Inactive
            </p>
            {inactiveHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={handleEdit}
                onToggleActive={toggleHabitActive}
                onDelete={deleteHabit}
              />
            ))}
          </>
        )}
      </div>

      <HabitFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
