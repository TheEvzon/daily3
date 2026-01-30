import { useLiveQuery } from "dexie-react-hooks";
import { v4 as uuid } from "uuid";
import { db } from "@/db";
import type { Daily3Entry, BacklogItem, Goal, Dream, Value } from "@/types";

export interface Daily3EntryWithCascade extends Daily3Entry {
  backlogItem: BacklogItem;
  goal?: Goal;
  dream?: Dream;
  values: Value[];
}

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function useDaily3(date?: string) {
  const targetDate = date ?? todayString();
  return (
    useLiveQuery(async () => {
      const entries = await db.daily3Entries
        .where("date")
        .equals(targetDate)
        .sortBy("position");

      const goals = await db.goals.toArray();
      const goalMap = new Map(goals.map((g) => [g.id, g]));
      const dreams = await db.dreams.toArray();
      const dreamMap = new Map(dreams.map((d) => [d.id, d]));
      const dreamLinks = await db.dreamValues.toArray();
      const allValues = await db.values.toArray();
      const valueMap = new Map(allValues.map((v) => [v.id, v]));

      const result: Daily3EntryWithCascade[] = [];
      for (const entry of entries) {
        const backlogItem = await db.backlogItems.get(entry.backlogItemId);
        if (!backlogItem) continue;

        const goal = backlogItem.goalId
          ? goalMap.get(backlogItem.goalId)
          : undefined;
        const dream = goal ? dreamMap.get(goal.dreamId) : undefined;
        const links = dream
          ? dreamLinks.filter((l) => l.dreamId === dream.id)
          : [];
        const values = links
          .map((l) => valueMap.get(l.valueId))
          .filter((v): v is Value => v !== undefined);

        result.push({ ...entry, backlogItem, goal, dream, values });
      }
      return result;
    }, [targetDate]) ?? []
  );
}

export async function addToDaily3(backlogItemId: string): Promise<void> {
  const today = todayString();
  const existing = await db.daily3Entries
    .where("date")
    .equals(today)
    .toArray();

  // Check if already added today
  if (existing.some((e) => e.backlogItemId === backlogItemId)) return;

  const nextPosition = existing.length + 1;
  await db.daily3Entries.add({
    id: uuid(),
    backlogItemId,
    date: today,
    position: nextPosition,
    completed: false,
    completedAt: null,
  });
}

export async function removeFromDaily3(entryId: string): Promise<void> {
  await db.daily3Entries.delete(entryId);
}

export async function toggleDaily3Complete(entryId: string): Promise<void> {
  const entry = await db.daily3Entries.get(entryId);
  if (!entry) return;

  const nowCompleted = !entry.completed;
  await db.transaction(
    "rw",
    [db.daily3Entries, db.backlogItems],
    async () => {
      await db.daily3Entries.update(entryId, {
        completed: nowCompleted,
        completedAt: nowCompleted ? new Date() : null,
      });
      // Sync backlog item completion state
      await db.backlogItems.update(entry.backlogItemId, {
        completed: nowCompleted,
        completedAt: nowCompleted ? new Date() : null,
      });
    },
  );
}
