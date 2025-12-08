import type { BoardState } from '../types/task';

const STORAGE_KEY = 'kanban_board_v1';

const DEFAULT: BoardState = {
  columns: [
    { id: 'col-todo', title: 'To Do' },
    { id: 'col-inprogress', title: 'In Progress' },
    { id: 'col-done', title: 'Done' },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Welcome to your board',
      description: 'This is a sample task. Drag me between columns.',
      columnId: 'col-todo',
      createdAt: new Date().toISOString(),
      priority: 'medium',
    },
  ],
};

export function loadBoard(): BoardState {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return JSON.parse(raw) as BoardState;
  } catch (e) {
    console.error('Failed to parse board from storage', e);
    return DEFAULT;
  }
}

export function saveBoard(state: BoardState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save board', e);
  }
}
