import { useLiveQuery } from "dexie-react-hooks";
import { v4 as uuid } from "uuid";
import { db } from "@/db";
import type { BacklogItem, Goal, Dream, Value } from "@/types";

export interface BacklogItemWithCascade extends BacklogItem {
  goal?: Goal;
  dream?: Dream;
  values: Value[];
}

export function useBacklog() {
  return (
    useLiveQuery(async () => {
      const items = await db.backlogItems
        .where("completed")
        .equals(0)
        .toArray();
      return enrichBacklogItems(items);
    }) ?? []
  );
}

export function useBacklogGroupedByGoal() {
  return (
    useLiveQuery(async () => {
      const items = await db.backlogItems
        .where("completed")
        .equals(0)
        .toArray();
      const enriched = await enrichBacklogItems(items);

      const groups: {
        goalId: string | null;
        goal?: Goal;
        dream?: Dream;
        values: Value[];
        items: BacklogItemWithCascade[];
      }[] = [];

      const goalMap = new Map<string | null, BacklogItemWithCascade[]>();
      for (const item of enriched) {
        const key = item.goalId ?? null;
        if (!goalMap.has(key)) goalMap.set(key, []);
        goalMap.get(key)!.push(item);
      }

      for (const [goalId, groupItems] of goalMap) {
        const first = groupItems[0];
        groups.push({
          goalId,
          goal: first.goal,
          dream: first.dream,
          values: first.values,
          items: groupItems,
        });
      }

      // Aligned groups first, then unaligned
      groups.sort((a, b) => {
        if (a.goalId && !b.goalId) return -1;
        if (!a.goalId && b.goalId) return 1;
        return 0;
      });

      return groups;
    }) ?? []
  );
}

export function useDeadlines() {
  return (
    useLiveQuery(async () => {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const items = await db.backlogItems
        .where("completed")
        .equals(0)
        .toArray();

      return items
        .filter(
          (item) =>
            item.dueDate !== null &&
            item.goalId === null &&
            new Date(item.dueDate) <= threeDaysFromNow,
        )
        .sort(
          (a, b) =>
            new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
        );
    }) ?? []
  );
}

export interface DeadlineWithDays extends BacklogItem {
  daysUntil: number;
}

export function useDeadlinesWithDays(): DeadlineWithDays[] {
  return (
    useLiveQuery(async () => {
      const now = Date.now();
      const threeDaysFromNow = new Date(now);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const items = await db.backlogItems
        .where("completed")
        .equals(0)
        .toArray();

      return items
        .filter(
          (item) =>
            item.dueDate !== null &&
            item.goalId === null &&
            new Date(item.dueDate) <= threeDaysFromNow,
        )
        .map((item) => ({
          ...item,
          daysUntil: Math.ceil(
            (new Date(item.dueDate!).getTime() - now) / (1000 * 60 * 60 * 24),
          ),
        }))
        .sort((a, b) => a.daysUntil - b.daysUntil);
    }) ?? []
  );
}

async function enrichBacklogItems(
  items: BacklogItem[],
): Promise<BacklogItemWithCascade[]> {
  const goals = await db.goals.toArray();
  const goalMap = new Map(goals.map((g) => [g.id, g]));
  const dreams = await db.dreams.toArray();
  const dreamMap = new Map(dreams.map((d) => [d.id, d]));
  const dreamLinks = await db.dreamValues.toArray();
  const allValues = await db.values.toArray();
  const valueMap = new Map(allValues.map((v) => [v.id, v]));

  return items.map((item) => {
    const goal = item.goalId ? goalMap.get(item.goalId) : undefined;
    const dream = goal ? dreamMap.get(goal.dreamId) : undefined;
    const links = dream
      ? dreamLinks.filter((l) => l.dreamId === dream.id)
      : [];
    const values = links
      .map((l) => valueMap.get(l.valueId))
      .filter((v): v is Value => v !== undefined);
    return { ...item, goal, dream, values };
  });
}

export async function createBacklogItem(
  data: Omit<BacklogItem, "id" | "createdAt" | "completed" | "completedAt">,
): Promise<string> {
  const id = uuid();
  await db.backlogItems.add({
    ...data,
    id,
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  });
  return id;
}

export async function updateBacklogItem(
  id: string,
  data: Partial<Omit<BacklogItem, "id">>,
): Promise<void> {
  await db.backlogItems.update(id, data);
}

export async function toggleBacklogItemComplete(id: string): Promise<void> {
  const item = await db.backlogItems.get(id);
  if (!item) return;
  await db.backlogItems.update(id, {
    completed: !item.completed,
    completedAt: item.completed ? null : new Date(),
  });
}

export async function deleteBacklogItem(id: string): Promise<void> {
  await db.transaction(
    "rw",
    [db.backlogItems, db.daily3Entries],
    async () => {
      await db.daily3Entries
        .where("backlogItemId")
        .equals(id)
        .delete();
      await db.backlogItems.delete(id);
    },
  );
}
