export type Task = {
  id: string;
  title: string;
  completed: boolean;
  goalId: string;
  order: number;
};

export type Goal = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  order: number;
  progress: number;
  tasks: Task[];
};

export type ArchivedGoal = Goal & {
  archived: boolean;
  archivedAt: string | null;
};

export type ArchivedTask = {
  id: string;
  title: string;
  completed: boolean;
  goalId: string;
}

export type SortOption = 
  | "archived-newest"
  | "archived-oldest"
  | "title-asc"
  | "title-desc"
  | "progress-high"
  | "progress-low";