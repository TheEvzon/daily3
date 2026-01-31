import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { ValueBadge } from "@/shared/ui/value-badge";
import type { Habit, Value } from "@/types";

interface HabitWithValues extends Habit {
  values: Value[];
}

export function HabitsSection() {
  const habits =
    useLiveQuery(async () => {
      const activeHabits = await db.habits
        .where("active")
        .equals(1)
        .sortBy("order");
      const links = await db.habitValues.toArray();
      const allValues = await db.values.toArray();
      const valueMap = new Map(allValues.map((v) => [v.id, v]));

      return activeHabits.map((habit) => {
        const habitLinks = links.filter((l) => l.habitId === habit.id);
        const values = habitLinks
          .map((l) => valueMap.get(l.valueId))
          .filter((v): v is Value => v !== undefined);
        return { ...habit, values } as HabitWithValues;
      });
    }) ?? [];

  if (habits.length === 0) return null;

  return (
    <section>
      <h2 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Habits
      </h2>
      <div className="space-y-1.5">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
          >
            <span className="text-sm text-muted-foreground">{habit.title}</span>
            <div className="flex gap-1">
              {habit.values.map((v) => (
                <ValueBadge key={v.id} value={v} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
