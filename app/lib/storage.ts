import { openDB } from 'idb';
import { Task } from '../types/task';

const DB_NAME = 'kanban-db';
const STORE = 'tasks';
async function db() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE, { keyPath: 'id' });
    }
  });
}

export async function getAllTasks(): Promise<Task[]> {
  const d = await db();
  return (await d.getAll(STORE)) as Task[];
}
export async function saveTask(task: Task) {
  const d = await db();
  await d.put(STORE, task);
}
export async function deleteTask(id: string) {
  const d = await db();
  await d.delete(STORE, id);
}
