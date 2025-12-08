"use client";
import React from 'react';
import type { Task } from '../types/task';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskCard({ task, onEdit, onDelete }: { task: Task; onEdit: (data: Partial<Task>) => void; onDelete: () => void; }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition } as React.CSSProperties;

  return (
    <article ref={setNodeRef} style={style} {...attributes} {...listeners} className="rounded-xl p-4 card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold" style={{ color: 'var(--text)' }}>{task.title}</h4>
          {task.description ? <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{task.description}</p> : null}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button onClick={() => onEdit({})} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--primary)' }}>Edit</button>
            <button onClick={onDelete} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--danger)' }}>Delete</button>
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{new Date(task.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </article>
  );
}
