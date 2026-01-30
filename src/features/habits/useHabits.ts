import { useLiveQuery } from "dexie-react-hooks";
import { v4 as uuid } from "uuid";
import { db } from "@/db";
import type { Habit, Value } from "@/types";

export interface HabitWithValues extends Habit {
  values: Value[];
}

export function useHabits() {
  return (
    useLiveQuery(async () => {
      const habits = await db.habits.orderBy("order").toArray();
      const links = await db.habitValues.toArray();
      const allValues = await db.values.toArray();
      const valueMap = new Map(allValues.map((v) => [v.id, v]));

      return habits.map((habit) => {
        const habitLinks = links.filter((l) => l.habitId === habit.id);
        const values = habitLinks
          .map((l) => valueMap.get(l.valueId))
          .filter((v): v is Value => v !== undefined);
        return { ...habit, values } as HabitWithValues;
      });
    }) ?? []
  );
}

export async function createHabit(
  data: { title: string },
  valueIds: string[],
): Promise<string> {
  const id = uuid();
  const count = await db.habits.count();
  await db.transaction("rw", [db.habits, db.habitValues], async () => {
    await db.habits.add({
      id,
      title: data.title,
      active: true,
      order: count + 1,
    });
    await db.habitValues.bulkAdd(
      valueIds.map((valueId) => ({ habitId: id, valueId })),
    );
  });
  return id;
}

export async function updateHabit(
  id: string,
  data: { title: string },
  valueIds?: string[],
): Promise<void> {
  await db.transaction("rw", [db.habits, db.habitValues], async () => {
    await db.habits.update(id, { title: data.title });
    if (valueIds !== undefined) {
      await db.habitValues.where("habitId").equals(id).delete();
      await db.habitValues.bulkAdd(
        valueIds.map((valueId) => ({ habitId: id, valueId })),
      );
    }
  });
}

export async function toggleHabitActive(id: string): Promise<void> {
  const habit = await db.habits.get(id);
  if (!habit) return;
  await db.habits.update(id, { active: !habit.active });
}

export async function deleteHabit(id: string): Promise<void> {
  await db.transaction("rw", [db.habits, db.habitValues], async () => {
    await db.habitValues.where("habitId").equals(id).delete();
    await db.habits.delete(id);
  });
}

export async function reorderHabits(orderedIds: string[]): Promise<void> {
  await db.transaction("rw", db.habits, async () => {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.habits.update(orderedIds[i], { order: i + 1 });
    }
  });
}
