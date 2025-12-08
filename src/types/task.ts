export type Task = {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  createdAt: string; // ISO string
  priority?: 'low' | 'medium' | 'high';
};

export type Column = {
  id: string;
  title: string;
};

export type BoardState = {
  columns: Column[];
  tasks: Task[];
};
