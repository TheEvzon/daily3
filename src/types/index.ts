export interface Value {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
}

export interface Dream {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  archived: boolean;
}

export interface DreamValue {
  dreamId: string;
  valueId: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  dreamId: string;
  targetDate: Date;
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
}

export interface BacklogItem {
  id: string;
  title: string;
  notes: string | null;
  goalId: string | null;
  dueDate: Date | null;
  createdAt: Date;
  completed: boolean;
  completedAt: Date | null;
}

export interface Daily3Entry {
  id: string;
  backlogItemId: string;
  date: string; // ISO date string YYYY-MM-DD for easy indexing
  position: number;
  completed: boolean;
  completedAt: Date | null;
}

export interface Habit {
  id: string;
  title: string;
  active: boolean;
  order: number;
}

export interface HabitValue {
  habitId: string;
  valueId: string;
}
