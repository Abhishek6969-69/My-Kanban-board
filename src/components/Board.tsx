"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { DndContext, DragEndEvent, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './Column';
import type { BoardState, Task } from '../types/task';
import { loadBoard, saveBoard } from '../lib/storage';
import { nanoid } from 'nanoid';

export default function Board() {
  const [board, setBoard] = useState<BoardState>(() => loadBoard());
  useEffect(() => {
    saveBoard(board);
  }, [board]);

  const tasksByColumn = useMemo(() => {
    return board.columns.reduce<Record<string, Task[]>>((acc, col) => {
      acc[col.id] = board.tasks.filter((t) => t.columnId === col.id);
      return acc;
    }, {});
  }, [board]);

  function addTask(title: string, columnId: string, description?: string) {
    const t: Task = { id: nanoid(), title, description, columnId, createdAt: new Date().toISOString(), priority: 'medium' };
    setBoard((b) => ({ ...b, tasks: [t, ...b.tasks] }));
  }

  function editTask(id: string, data: Partial<Task>) {
    setBoard((b) => ({ ...b, tasks: b.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)) }));
  }

  function deleteTask(id: string) {
    setBoard((b) => ({ ...b, tasks: b.tasks.filter((t) => t.id !== id) }));
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    // dropped on a column container
    if (overId.startsWith('column-')) {
      const dest = overId.replace('column-', '');
      setBoard((b) => ({ ...b, tasks: b.tasks.map((t) => (t.id === activeId ? { ...t, columnId: dest } : t)) }));
      return;
    }

    // otherwise reordering / cross-column insertion when dropping on another task
    const activeTask = board.tasks.find((t) => t.id === activeId);
    const overTask = board.tasks.find((t) => t.id === overId);
    if (!activeTask || !overTask) return;

    if (activeTask.columnId === overTask.columnId) {
      // reorder
      setBoard((b) => {
        const col = activeTask.columnId;
        const list = b.tasks.filter((t) => t.columnId === col);
        const aIndex = list.findIndex((x) => x.id === activeId);
        const oIndex = list.findIndex((x) => x.id === overId);
        if (aIndex === -1 || oIndex === -1) return b;
        const newList = arrayMove(list, aIndex, oIndex);
        const others = b.tasks.filter((t) => t.columnId !== col);
        return { ...b, tasks: [...others, ...newList] };
      });
    } else {
      // move across columns -> insert before overTask
      setBoard((b) => {
        const dest = overTask.columnId;
        const without = b.tasks.filter((t) => t.id !== activeId);
        const destTasks = without.filter((t) => t.columnId === dest);
        const destIndex = destTasks.findIndex((x) => x.id === overId);
        const moving = { ...activeTask, columnId: dest };
        const updatedDest = [...destTasks.slice(0, destIndex), moving, ...destTasks.slice(destIndex)];
        const others = without.filter((t) => t.columnId !== dest);
        return { ...b, tasks: [...others, ...updatedDest] };
      });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>Board</h2>
      </div>

  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="overflow-x-auto">
          <div className="flex gap-6 pb-8 min-w-[900px]">
            {board.columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                tasks={tasksByColumn[col.id] || []}
                onAdd={(title: string, description?: string) => addTask(title, col.id, description)}
                onEdit={editTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
