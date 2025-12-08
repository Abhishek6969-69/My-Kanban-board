"use client";
import React from 'react';

export default function AddTaskForm({ onSave, onCancel }: { onSave: (title: string, description?: string) => void; onCancel: () => void; }) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onSave(t, description.trim());
    setTitle('');
    setDescription('');
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className="w-full px-3 py-2 rounded border" style={{ borderColor: 'var(--border)' }} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" rows={3} className="w-full px-3 py-2 rounded border" style={{ borderColor: 'var(--border)' }} />

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1 rounded" style={{ background: 'transparent', color: 'var(--text-muted)' }}>Cancel</button>
        <button type="submit" className="px-3 py-1 rounded" style={{ background: 'var(--primary)', color: '#fff' }}>Add</button>
      </div>
    </form>
  );
}
