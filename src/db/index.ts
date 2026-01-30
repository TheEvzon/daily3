import Dexie, { type Table } from "dexie";
import type {
  Value,
  Dream,
  DreamValue,
  Goal,
  BacklogItem,
  Daily3Entry,
  Habit,
  HabitValue,
} from "@/types";

export class Daily3Database extends Dexie {
  values!: Table<Value, string>;
  dreams!: Table<Dream, string>;
  dreamValues!: Table<DreamValue, [string, string]>;
  goals!: Table<Goal, string>;
  backlogItems!: Table<BacklogItem, string>;
  daily3Entries!: Table<Daily3Entry, string>;
  habits!: Table<Habit, string>;
  habitValues!: Table<HabitValue, [string, string]>;

  constructor() {
    super("daily3");

    this.version(1).stores({
      values: "id, order",
      dreams: "id, archived, createdAt",
      dreamValues: "[dreamId+valueId], dreamId, valueId",
      goals: "id, dreamId, targetDate, completed, createdAt",
      backlogItems: "id, goalId, dueDate, completed, createdAt",
      daily3Entries: "id, backlogItemId, date, [date+position]",
      habits: "id, active, order",
      habitValues: "[habitId+valueId], habitId, valueId",
    });
  }
}

export const db = new Daily3Database();
