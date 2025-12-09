"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Column from './Column';
import AddTaskForm from './AddTaskForm';
import { DndContext, DragEndEvent, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import type { Task as TaskType } from './TaskCard';
import { useSearch } from './SearchProvider';

type ColumnType = { id: string; title: string };

const DEFAULT_COLUMNS: ColumnType[] = [
  { id: 'col-today', title: 'Today' },
  { id: 'col-week', title: 'This Week' },
  { id: 'col-done', title: 'Done' },
];

const STORAGE_TASKS = 'kanban_tasks_v4';
const STORAGE_COLS = 'kanban_columns_v4';

export default function Board() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [columns, setColumns] = useState<ColumnType[]>(DEFAULT_COLUMNS);
  const [loading, setLoading] = useState(true);

  const [showAddTask, setShowAddTask] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [pendingColumn, setPendingColumn] = useState<string | null>(null);

  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOption, setDeleteOption] = useState<'delete_tasks' | 'move_tasks'>('delete_tasks');
  const [moveTargetColumn, setMoveTargetColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    const rawTasks = localStorage.getItem(STORAGE_TASKS);
    const rawCols = localStorage.getItem(STORAGE_COLS);

    let parsedCols: ColumnType[] = DEFAULT_COLUMNS;
    if (rawCols) {
      try {
        parsedCols = JSON.parse(rawCols);
      } catch {
        parsedCols = DEFAULT_COLUMNS;
      }
    }

    let parsedTasks: TaskType[] = [];
    if (rawTasks) {
      try {
        parsedTasks = JSON.parse(rawTasks);
      } catch {
        parsedTasks = [];
      }
    } else {
      parsedTasks = [
        {
          id: nanoid(),
          title: 'try drag & drop',
          description: 'This is a sample task. You can drag me between lists.',
          columnId: 'col-today',
          createdAt: new Date().toISOString(),
          color: '#FFFFFF',
        },
      ];
    }

    const t = setTimeout(() => {
      setColumns(parsedCols);
      setTasks(parsedTasks);
      setLoading(false);
    }, 0);

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_COLS, JSON.stringify(columns));
    }
  }, [tasks, columns, loading]);

  const { query } = useSearch();
  const tasksByColumn = useMemo(() => {
    const q = query.trim().toLowerCase();
    return columns.reduce<Record<string, TaskType[]>>((acc, col) => {
      const list = tasks.filter((t) => t.columnId === col.id);
      acc[col.id] = q ? list.filter((t) => t.title.toLowerCase().includes(q)) : list;
      return acc;
    }, {} as Record<string, TaskType[]>);
  }, [tasks, columns, query]);

  function handleAddTask(title: string, column: string, color: string, description?: string, priority: 'high'|'medium'|'low' = 'medium') {
    setSaving(true);
    const newTask: TaskType = {
      id: nanoid(),
      title,
      description,
      columnId: column,
      createdAt: new Date().toISOString(),
      color,
      priority,
    };
    setTasks((prev) => [newTask, ...prev]);
    setSaving(false);
    setShowAddTask(false);
    setEditId(null);
    setPendingColumn(null);
  }

  function handleEditSave(title: string, column: string, color: string, description?: string, priority: 'high'|'medium'|'low' = 'medium') {
    if (!editId) return;
    setSaving(true);
    setTasks((prev) => prev.map((t) => (t.id === editId ? { ...t, title, columnId: column, color, description, priority } : t)));
    setSaving(false);
    setShowAddTask(false);
    setEditId(null);
    setPendingColumn(null);
  }

  function handleDeleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleColorChange(id: string, color: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, color } : t)));
  }

  function addColumn(title: string) {
    const id = `col-${nanoid()}`;
    setColumns((prev) => [...prev, { id, title }]);
    setAddingColumn(false);
    setNewColumnTitle('');
  }

  function requestDeleteColumn(columnId: string) {
    setDeleteColumnId(columnId);
    setShowDeleteModal(true);
    setDeleteOption('delete_tasks');
    setMoveTargetColumn(null);
  }

  function cancelDeleteColumn() {
    setDeleteColumnId(null);
    setShowDeleteModal(false);
    setDeleteOption('delete_tasks');
    setMoveTargetColumn(null);
  }

  function confirmDeleteColumn() {
    if (!deleteColumnId) return;
    if (deleteOption === 'delete_tasks') {
      setTasks((prev) => prev.filter((t) => t.columnId !== deleteColumnId));
    } else if (moveTargetColumn) {
      setTasks((prev) => prev.map((t) => (t.columnId === deleteColumnId ? { ...t, columnId: moveTargetColumn } : t)));
    }

    setColumns((prev) => prev.filter((c) => c.id !== deleteColumnId));
    cancelDeleteColumn();
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (overId.startsWith('column-')) {
      const destCol = overId.replace('column-', '');
      setTasks((prev) => prev.map((t) => (t.id === activeId ? { ...t, columnId: destCol } : t)));
      return;
    }

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);
    if (!activeTask || !overTask) return;

    if (activeTask.columnId === overTask.columnId) {
      setTasks((prev) => {
        const col = activeTask.columnId;
        const list = prev.filter((t) => t.columnId === col);
        const activeIndex = list.findIndex((x) => x.id === activeId);
        const overIndex = list.findIndex((x) => x.id === overId);
        if (activeIndex === -1 || overIndex === -1) return prev;
        const newList = arrayMove(list, activeIndex, overIndex);
        const others = prev.filter((t) => t.columnId !== col);
        return [...others, ...newList];
      });
    } else {
      setTasks((prev) => {
        const dest = overTask.columnId;
        const newPrev = prev.filter((t) => t.id !== activeId);
        const destTasks = newPrev.filter((t) => t.columnId === dest);
        const destIndex = destTasks.findIndex((x) => x.id === overId);
        const movingTask = { ...activeTask, columnId: dest };
        const updatedDest = [...destTasks.slice(0, destIndex), movingTask, ...destTasks.slice(destIndex)];
        const others = newPrev.filter((t) => t.columnId !== dest);
        return [...others, ...updatedDest];
      });
    }
  }

  const activeEditTask = editId ? tasks.find((t) => t.id === editId) : null;

  return (
    // UI: full-screen layout — leave space for fixed header (approx 72px)
    <main className="min-h-[calc(100vh-72px)] w-full pt-20 mt-10 p-8 md:p-14" style={{ background: 'var(--bg)' }}>
      <div className="mb-10 flex items-center justify-between gap-6">
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>My Kanban board</h2>

        <div className="flex items-center gap-2">
            <button
            onClick={() => {
              setEditId(null);
              setPendingColumn(columns[0]?.id ?? null);
              setShowAddTask(true);
            }}
              className="rounded-md px-4 py-2 shadow-md hover:brightness-95 transition-all"
              style={{ background: 'var(--primary)', color: '#fff' }}
          >
            + Add Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2" style={{ color: 'var(--text)' }}>Loading board…</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      {/* Columns area: full-width scrollable region */}
      <div className="w-full overflow-x-auto">
        <div className="w-full flex items-start gap-6 md:gap-10 py-10 min-w-[1200px]">
              {columns.map((col) => (
                <Column
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  tasks={tasksByColumn[col.id] || []}
                  onAddClick={(columnId) => {
                    setPendingColumn(columnId);
                    setEditId(null);
                    setShowAddTask(true);
                  }}
                  onEdit={(id) => {
                    setEditId(id);
                    setShowAddTask(true);
                  }}
                  onDelete={(id) => handleDeleteTask(id)}
                  onColorChange={(id, color) => handleColorChange(id, color)}
                  onDeleteColumn={(columnId) => requestDeleteColumn(columnId)}
                />
              ))}

              {/* Add another list UI */}
              <div className="w-[280px] shrink-0">
                {!addingColumn ? (
                  <div className="rounded-2xl p-4 h-full flex items-center justify-center" style={{ background: 'var(--column-bg)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(2,6,23,0.04)' }}>
                    <button
                      onClick={() => setAddingColumn(true)}
                      className="w-full text-left px-4 py-3 rounded-md hover:shadow-md transition-all"
                      style={{ background: 'transparent', color: 'var(--text)' }}
                    >
                      + Add another list
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl p-4" style={{ background: 'var(--column-bg)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(2,6,23,0.04)' }}>
                    <input
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      placeholder="List title (e.g. Important)"
                      className="w-full rounded-lg px-3 py-2 mb-2 text-sm"
                      style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)' }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (newColumnTitle.trim()) addColumn(newColumnTitle.trim());
                        }}
                        className="px-3 py-1 rounded-md text-white"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        Add list
                      </button>
                      <button
                        onClick={() => {
                          setAddingColumn(false);
                          setNewColumnTitle('');
                        }}
                        className="px-3 py-1 rounded-md"
                        style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DndContext>
      )}

      {/* Add/Edit Task modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowAddTask(false);
              setEditId(null);
              setPendingColumn(null);
            }}
            aria-hidden
          />

          <div role="dialog" aria-modal="true" aria-labelledby="task-modal-title" aria-describedby="task-modal-desc" className="relative w-full max-w-xl rounded-2xl shadow-lg z-10" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', maxHeight: '85vh', overflow: 'hidden', color: 'var(--text)' }}>
            <div className="sticky top-0 p-4 border-b" style={{ borderColor: 'var(--border)', background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)' }}>
              <div className="flex items-center justify-between gap-4">
                <h4 id="task-modal-title" className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{editId ? 'Edit task' : 'Add task'}</h4>
                <div className="flex items-center gap-2">
                  <button aria-label="Close dialog" onClick={() => { setShowAddTask(false); setEditId(null); setPendingColumn(null); }} className="rounded-md w-9 h-9 flex items-center justify-center" style={{ border: '1px solid var(--border)', background: 'var(--muted-bg)' }}>
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <div id="task-modal-desc" style={{ maxHeight: 'calc(85vh - 72px)', overflow: 'auto', padding: '20px' }}>
              <AddTaskForm
                columns={columns}
                initialTitle={activeEditTask?.title ?? ''}
                initialDescription={activeEditTask?.description ?? ''}
                initialColumn={editId ? activeEditTask?.columnId ?? columns[0]?.id : pendingColumn ?? columns[0]?.id}
                initialColor={activeEditTask?.color ?? '#FFFFFF'}
                initialPriority={activeEditTask?.priority ?? 'medium'}
                initialCreatedAt={activeEditTask?.createdAt}
                saving={saving}
                onCancel={() => {
                  setShowAddTask(false);
                  setEditId(null);
                  setPendingColumn(null);
                }}
                onSave={(title, column, color, description, priority) => {
                  if (editId) handleEditSave(title, column, color, description, priority);
                  else handleAddTask(title, column, color, description, priority);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete column modal */}
      {showDeleteModal && deleteColumnId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={() => cancelDeleteColumn()} />
          <div className="relative bg-white rounded-lg w-full max-w-lg p-6 z-70 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Delete list</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              You are about to delete the list <strong>{columns.find(c => c.id === deleteColumnId)?.title}</strong>.
            </p>

            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="delopt"
                  value="delete_tasks"
                  checked={deleteOption === 'delete_tasks'}
                  onChange={() => setDeleteOption('delete_tasks')}
                />
                <span className="text-sm">Delete the list and <strong>all its tasks</strong>.</span>
              </label>

              <label className="flex items-center gap-2 mt-3">
                <input
                  type="radio"
                  name="delopt"
                  value="move_tasks"
                  checked={deleteOption === 'move_tasks'}
                  onChange={() => setDeleteOption('move_tasks')}
                />
                <span className="text-sm">Move tasks to another list:</span>
              </label>

              {deleteOption === 'move_tasks' && (
                <div className="mt-2">
                  <select
                    className="w-full rounded-md px-3 py-2 border border-gray-200"
                    value={moveTargetColumn ?? ''}
                    onChange={(e) => setMoveTargetColumn(e.target.value)}
                  >
                    <option value="" disabled>Choose a destination list</option>
                    {columns.filter(c => c.id !== deleteColumnId).map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => cancelDeleteColumn()} className="px-3 py-1 rounded" style={{ background: 'var(--card-bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>Cancel</button>
              <button
                onClick={() => confirmDeleteColumn()}
                className="px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                disabled={deleteOption === 'move_tasks' && !moveTargetColumn}
              >
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
