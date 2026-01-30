import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import {
  useGoals,
  createGoal,
  updateGoal,
  toggleGoalComplete,
  deleteGoal,
} from "./useGoals";
import type { GoalWithCascade } from "./useGoals";
import { GoalCard } from "./GoalCard";
import { GoalFormDialog } from "./GoalFormDialog";
import { useDreams } from "@/features/dreams/useDreams";

export function GoalsPage() {
  const [filterDreamId, setFilterDreamId] = useState<string | undefined>();
  const goals = useGoals(filterDreamId);
  const dreams = useDreams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GoalWithCascade | undefined>();

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  function handleAdd() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function handleEdit(goal: GoalWithCascade) {
    setEditing(goal);
    setDialogOpen(true);
  }

  async function handleSubmit(data: {
    title: string;
    description: string;
    dreamId: string;
    targetDate: Date;
  }) {
    if (editing) {
      await updateGoal(editing.id, data);
    } else {
      await createGoal(data);
    }
    setDialogOpen(false);
  }

  return (
    <div className="mx-auto max-w-lg pb-6">
      <PageHeader
        title="Goals"
        description="Dated milestones that advance your dreams."
      >
        <Button size="sm" onClick={handleAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </PageHeader>

      {dreams.length > 0 && (
        <div className="mt-3 flex gap-1.5 overflow-x-auto px-4 pb-1">
          <button
            onClick={() => setFilterDreamId(undefined)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !filterDreamId
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            All
          </button>
          {dreams.map((d) => (
            <button
              key={d.id}
              onClick={() =>
                setFilterDreamId(filterDreamId === d.id ? undefined : d.id)
              }
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filterDreamId === d.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {d.title.length > 25 ? d.title.slice(0, 25) + "..." : d.title}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 space-y-2 px-4">
        {activeGoals.length === 0 && completedGoals.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {filterDreamId
              ? "No goals for this dream."
              : "No goals yet. Set your first milestone."}
          </p>
        )}
        {activeGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={handleEdit}
            onToggleComplete={toggleGoalComplete}
            onDelete={deleteGoal}
          />
        ))}
        {completedGoals.length > 0 && (
          <>
            <p className="pt-4 text-xs font-medium text-muted-foreground uppercase">
              Completed
            </p>
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEdit}
                onToggleComplete={toggleGoalComplete}
                onDelete={deleteGoal}
              />
            ))}
          </>
        )}
      </div>

      <GoalFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
