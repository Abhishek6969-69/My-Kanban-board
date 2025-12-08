export type Task = {
  id: string;
  title: string;
  description?: string;
  columnId: string;   
  priority?: 'high'|'medium'|'low';
  createdAt: string;
  updatedAt?: string;
}
