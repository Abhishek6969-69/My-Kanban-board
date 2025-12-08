"use client";
import React from 'react';
import TaskCard from './TaskCard';
import type { Column as ColType, Task } from '../types/task';
import AddTaskForm from './AddTaskForm';
import { useDroppable } from '@dnd-kit/core';

export default function Column({
  column,
  tasks,
  onAdd,
  onEdit,
  onDelete,
}: {
  column: ColType;
  tasks: Task[];
  onAdd: (title: string, description?: string) => void;
  onEdit: (id: string, data: Partial<Task>) => void;
  onDelete: (id: string) => void;
}) {
  const { setNodeRef } = useDroppable({ id: `column-${column.id}` });
  const [showForm, setShowForm] = React.useState(false);

  return (
  <section ref={setNodeRef} className="w-72 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{column.title}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{tasks.length} tasks</div>
        </div>

        <div>
          <button className="text-xs px-2 py-1 rounded" onClick={() => setShowForm((s) => !s)} style={{ color: 'var(--primary)' }}>
            + Add
          </button>
        </div>
      </div>

      <div className="card soft-shadow p-3 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No tasks yet. Add one to get started.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((t) => (
              <TaskCard key={t.id} task={t} onEdit={(data: Partial<Task>) => onEdit(t.id, data)} onDelete={() => onDelete(t.id)} />
            ))}
          </div>
        )}

        {showForm && (
          <div className="mt-3">
            <AddTaskForm
              onCancel={() => setShowForm(false)}
              onSave={(title: string, description?: string) => {
                onAdd(title, description);
                setShowForm(false);
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
