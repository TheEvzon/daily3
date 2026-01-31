import { useLiveQuery } from "dexie-react-hooks";
import { v4 as uuid } from "uuid";
import { db } from "@/db";
import type { Goal, Dream, Value } from "@/types";

export interface GoalWithCascade extends Goal {
  dream?: Dream;
  values: Value[];
}

export function useGoals(filterDreamId?: string) {
  return (
    useLiveQuery(async () => {
      let goals: Goal[];
      if (filterDreamId) {
        goals = await db.goals.where("dreamId").equals(filterDreamId).toArray();
      } else {
        goals = await db.goals.toArray();
      }

      const dreams = await db.dreams.toArray();
      const dreamMap = new Map(dreams.map((d) => [d.id, d]));
      const dreamLinks = await db.dreamValues.toArray();
      const allValues = await db.values.toArray();
      const valueMap = new Map(allValues.map((v) => [v.id, v]));

      return goals.map((goal) => {
        const dream = dreamMap.get(goal.dreamId);
        const links = dreamLinks.filter((l) => l.dreamId === goal.dreamId);
        const values = links
          .map((l) => valueMap.get(l.valueId))
          .filter((v): v is Value => v !== undefined);
        return { ...goal, dream, values } as GoalWithCascade;
      });
    }, [filterDreamId]) ?? []
  );
}

export function useGoal(id: string | undefined) {
  return useLiveQuery(async () => {
    if (!id) return undefined;
    const goal = await db.goals.get(id);
    if (!goal) return undefined;
    const dream = await db.dreams.get(goal.dreamId);
    const links = dream
      ? await db.dreamValues.where("dreamId").equals(dream.id).toArray()
      : [];
    const values = await db.values
      .where("id")
      .anyOf(links.map((l) => l.valueId))
      .toArray();
    return { ...goal, dream, values } as GoalWithCascade;
  }, [id]);
}

export async function createGoal(
  data: Omit<Goal, "id" | "completed" | "completedAt" | "createdAt">,
): Promise<string> {
  const id = uuid();
  await db.goals.add({
    ...data,
    id,
    completed: false,
    completedAt: null,
    createdAt: new Date(),
  });
  return id;
}

export async function updateGoal(
  id: string,
  data: Partial<Omit<Goal, "id">>,
): Promise<void> {
  await db.goals.update(id, data);
}

export async function toggleGoalComplete(id: string): Promise<void> {
  const goal = await db.goals.get(id);
  if (!goal) return;
  await db.goals.update(id, {
    completed: !goal.completed,
    completedAt: goal.completed ? null : new Date(),
  });
}

export async function deleteGoal(id: string): Promise<void> {
  await db.transaction("rw", [db.goals, db.backlogItems], async () => {
    // Orphan backlog items so user can reassign
    await db.backlogItems.where("goalId").equals(id).modify({ goalId: null });
    await db.goals.delete(id);
  });
}
