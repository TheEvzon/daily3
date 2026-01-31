import { db } from "./index";
import type {
  Value,
  Dream,
  DreamValue,
  Goal,
  BacklogItem,
  Habit,
  HabitValue,
} from "@/types";

const seedValues: Value[] = [
  {
    id: "v1",
    name: "Freedom",
    description: "Financial and time independence",
    color: "#3B82F6",
    order: 1,
  },
  {
    id: "v2",
    name: "Health",
    description: "Physical and mental wellbeing",
    color: "#10B981",
    order: 2,
  },
  {
    id: "v3",
    name: "Family",
    description: "Deep connections with loved ones",
    color: "#F59E0B",
    order: 3,
  },
  {
    id: "v4",
    name: "Growth",
    description: "Continuous learning and improvement",
    color: "#8B5CF6",
    order: 4,
  },
  {
    id: "v5",
    name: "Impact",
    description: "Making a difference in the world",
    color: "#EF4444",
    order: 5,
  },
];

const seedDreams: Dream[] = [
  {
    id: "d1",
    title: "Be financially independent by 50",
    description: "",
    createdAt: new Date(),
    archived: false,
  },
  {
    id: "d2",
    title: "Travel to every continent",
    description: "",
    createdAt: new Date(),
    archived: false,
  },
  {
    id: "d3",
    title: "Run a marathon",
    description: "",
    createdAt: new Date(),
    archived: false,
  },
  {
    id: "d4",
    title: "Build a successful side business",
    description: "",
    createdAt: new Date(),
    archived: false,
  },
  {
    id: "d5",
    title: "Write a book",
    description: "",
    createdAt: new Date(),
    archived: false,
  },
];

const seedDreamValues: DreamValue[] = [
  { dreamId: "d1", valueId: "v1" },
  { dreamId: "d2", valueId: "v1" },
  { dreamId: "d2", valueId: "v4" },
  { dreamId: "d3", valueId: "v2" },
  { dreamId: "d4", valueId: "v1" },
  { dreamId: "d4", valueId: "v5" },
  { dreamId: "d5", valueId: "v4" },
  { dreamId: "d5", valueId: "v5" },
];

const seedGoals: Goal[] = [
  {
    id: "g1",
    title: "Pay off all debt by Dec 2026",
    description: "",
    dreamId: "d1",
    targetDate: new Date("2026-12-31"),
    completed: false,
    completedAt: null,
    createdAt: new Date(),
  },
  {
    id: "g2",
    title: "Plan and book Europe trip",
    description: "",
    dreamId: "d2",
    targetDate: new Date("2026-06-01"),
    completed: false,
    completedAt: null,
    createdAt: new Date(),
  },
  {
    id: "g3",
    title: "Complete Couch to 5K program",
    description: "",
    dreamId: "d3",
    targetDate: new Date("2026-04-01"),
    completed: false,
    completedAt: null,
    createdAt: new Date(),
  },
  {
    id: "g4",
    title: "Launch MVP of Daily 3 app",
    description: "",
    dreamId: "d4",
    targetDate: new Date("2026-03-01"),
    completed: false,
    completedAt: null,
    createdAt: new Date(),
  },
];

const seedBacklogItems: BacklogItem[] = [
  {
    id: "b1",
    title: "Research refinancing options",
    notes: null,
    goalId: "g1",
    dueDate: null,
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
  {
    id: "b2",
    title: "Cancel unused subscriptions",
    notes: "Check bank statement",
    goalId: "g1",
    dueDate: null,
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
  {
    id: "b3",
    title: "Research flight prices to Paris",
    notes: null,
    goalId: "g2",
    dueDate: null,
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
  {
    id: "b4",
    title: "List must-see destinations",
    notes: null,
    goalId: "g2",
    dueDate: null,
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
  {
    id: "b5",
    title: "Download Couch to 5K app",
    notes: null,
    goalId: "g3",
    dueDate: null,
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
  {
    id: "b6",
    title: "Buy running shoes",
    notes: null,
    goalId: "g3",
    dueDate: null,
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
  {
    id: "b7",
    title: "Finalize PRD for Daily 3",
    notes: null,
    goalId: "g4",
    dueDate: null,
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
  {
    id: "b8",
    title: "Set up development environment",
    notes: null,
    goalId: "g4",
    dueDate: null,
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
  // Deadlines (no goal, has due date)
  {
    id: "b9",
    title: "Submit tax forms",
    notes: null,
    goalId: null,
    dueDate: new Date("2026-02-03"),
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
  {
    id: "b10",
    title: "Renew car registration",
    notes: null,
    goalId: null,
    dueDate: new Date("2026-02-01"),
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
  // Orphans (no goal, no due date)
  {
    id: "b11",
    title: "Call Sean Santos",
    notes: null,
    goalId: null,
    dueDate: null,
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
  {
    id: "b12",
    title: "Organize garage",
    notes: null,
    goalId: null,
    dueDate: null,
    createdAt: new Date(),
    completed: false,
    completedAt: null,
  },
];

const seedHabits: Habit[] = [
  { id: "h1", title: "I move my body daily", active: true, order: 1 },
  { id: "h2", title: "I read for growth", active: true, order: 2 },
  { id: "h3", title: "I connect with family", active: true, order: 3 },
  { id: "h4", title: "I protect my financial future", active: true, order: 4 },
];

const seedHabitValues: HabitValue[] = [
  { habitId: "h1", valueId: "v2" },
  { habitId: "h2", valueId: "v4" },
  { habitId: "h3", valueId: "v3" },
  { habitId: "h4", valueId: "v1" },
];

export async function seedDatabase(): Promise<void> {
  const valueCount = await db.values.count();
  if (valueCount > 0) return; // Already seeded

  await db.transaction(
    "rw",
    [
      db.values,
      db.dreams,
      db.dreamValues,
      db.goals,
      db.backlogItems,
      db.habits,
      db.habitValues,
    ],
    async () => {
      await db.values.bulkAdd(seedValues);
      await db.dreams.bulkAdd(seedDreams);
      await db.dreamValues.bulkAdd(seedDreamValues);
      await db.goals.bulkAdd(seedGoals);
      await db.backlogItems.bulkAdd(seedBacklogItems);
      await db.habits.bulkAdd(seedHabits);
      await db.habitValues.bulkAdd(seedHabitValues);
    },
  );
}
