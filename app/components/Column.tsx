// src/components/Column.tsx
'use client';
import React from 'react';
import TaskCard, { Task } from './TaskCard';
// EmptyState component removed from this column view (not used here)
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function Column({
  id,
  title,
  tasks,
  onAddClick,
  onEdit,
  onDelete,
  onColorChange,
  onDeleteColumn,
}: {
  id: string;
  title: string;
  tasks: Task[];
  onAddClick: (columnId: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  onDeleteColumn: (columnId: string) => void;
}) {
  // register droppable so we can detect drops on empty columns
  const { setNodeRef } = useDroppable({ id: `column-${id}` });

  return (
  <section ref={setNodeRef} id={`column-${id}`} className="w-[360px] md:w-[420px] shrink-0">
    <div className="rounded-2xl p-5 md:p-7 shadow-md" style={{ background: 'var(--column-bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center px-3 py-2 rounded-lg" style={{ background: 'var(--muted-bg)', color: 'var(--text)', fontWeight: 600, fontSize: '1.06rem' }}>
              {title}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* simple inline delete icon/button */}
            <button
              onClick={() => onDeleteColumn(id)}
              title="Delete list"
              className="ml-1 text-sm px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-all"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="min-h-[220px]">
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.length === 0 ? (
              <div className="py-8 text-center" style={{ color: 'var(--text-muted)' }}>No tasks — add a new card</div>
            ) : (
              <div className="flex flex-col space-y-4">
                {tasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onColorChange={onColorChange}
                  />
                ))}
              </div>
            )}
          </SortableContext>

          <div className="mt-4">
            <button
              onClick={() => onAddClick(id)}
              className="text-sm w-full text-left px-3 py-2 rounded-md hover:shadow-lg transition-all duration-200"
              style={{ color: 'var(--text)', background: 'transparent', border: '1px dashed var(--border)' }}
            >
              + Add a card
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
