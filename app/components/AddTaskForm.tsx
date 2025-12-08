
'use client';
import React, { useEffect, useState, useRef } from 'react';

export const COLOR_OPTIONS = [
  '#2C6B4F', // dark green
  '#A78200', // mustard yellow
  '#B86E00', // orange brown
  '#C6452F', // brick red
  '#8A3AB9', // purple

  '#2E62CE', // blue
  '#4A7F89', // teal
  '#708C2E', // olive green
  '#B04A78', // magenta/pink
  '#808080', // gray
];


export default function AddTaskForm({
  columns,
  initialTitle = '',
  initialColumn = '',
  initialColor = '#FFFFFF',
  initialPriority = 'medium',
  initialDescription = '',
  initialCreatedAt,
  onCancel,
  onSave,
  saving = false,
}: {
  columns: { id: string; title: string }[];
  initialTitle?: string;
  initialColumn?: string;
  initialColor?: string;
  initialPriority?: 'high' | 'medium' | 'low';
  initialDescription?: string;
  initialCreatedAt?: string;
  onCancel: () => void;
  // NEW FEATURE: Task Priority - onSave now includes priority as the fifth argument
  onSave: (title: string, column: string, color: string, description: string, priority: 'high' | 'medium' | 'low') => void;
  saving?: boolean;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [column, setColumn] = useState(initialColumn || (columns[0]?.id ?? ''));
  const [color, setColor] = useState(initialColor);
  const [priority, setPriority] = useState<'high'|'medium'|'low'>(initialPriority);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState('');
  const descLimit = 500;
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setTitle(initialTitle);
      setColumn(initialColumn || (columns[0]?.id ?? ''));
      setColor(initialColor);
      setPriority(initialPriority);
      setDescription(initialDescription);
    }, 0);

    return () => clearTimeout(t);
  }, [initialTitle, initialColumn, initialColor, initialDescription, initialPriority, columns]);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const t = title.trim();
    if (!t) {
      setError('Title is required');
      return;
    }
    setError('');
    onSave(t, column, color, description.trim(), priority);
    setTitle('');
    setDescription('');
  }

  // Accessibility: ESC closes; focus first input on mount
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    // focus title for quick entry
    titleRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <form onSubmit={submit} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: inputs */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="task-title">Title</label>
            <input
              id="task-title"
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full rounded-md px-3 py-2 text-sm border focus:outline-none focus:ring-2"
              style={{ border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }}
              aria-invalid={!!error}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)..."
              rows={5}
              className="w-full rounded-md px-3 py-2 text-sm border resize-vertical focus:outline-none focus:ring-2"
              style={{ border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }}
              maxLength={descLimit}
            />
            <div className="text-sm text-right mt-1" style={{ color: 'var(--text-muted)' }}>{description.length}/{descLimit}</div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">List</label>
              <select value={column} onChange={(e) => setColumn(e.target.value)} className="w-full rounded-md px-3 py-2 text-sm" style={{ border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }}>
                {columns.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <div className="flex items-center gap-2">
                <select value={priority} onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')} className="rounded-md px-3 py-2 text-sm" style={{ border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div aria-hidden className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: priority === 'high' ? '#FCA5A5' : priority === 'medium' ? '#FDE68A' : '#BFDBFE' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: color picker + metadata */}
        <aside className="md:col-span-1 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="grid grid-cols-4 gap-2">
              <button type="button" onClick={() => setColor('#FFFFFF')} className={`col-span-4 text-sm rounded-md px-2 py-1 border`} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>Clear color</button>
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-md border`} 
                  style={{ background: c, border: c === color ? '2px solid var(--primary)' : '1px solid var(--border)' }}
                  aria-label={`Pick color ${c}`}
                  aria-pressed={c === color}
                >
                  {c === color && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto my-auto" aria-hidden>
                      <path d="M20 6L9 17l-5-5" stroke="#0b1220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-md" style={{ background: 'var(--muted-bg)', border: '1px solid var(--border)' }}>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Created</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{initialCreatedAt ? new Date(initialCreatedAt).toLocaleString() : '—'}</div>
          </div>
        </aside>
      </div>

      {/* Sticky footer actions */}
      <div className="mt-6 sticky bottom-0 left-0 right-0 bg-transparent pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onCancel} className="px-3 py-2 rounded-md" style={{ background: 'var(--card-bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>Cancel</button>
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-md text-white shadow" style={{ background: 'var(--primary)' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
