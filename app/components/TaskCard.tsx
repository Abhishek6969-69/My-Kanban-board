// src/components/TaskCard.tsx
'use client';
import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type Task = {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  createdAt: string;
  color?: string;
  priority?: 'high' | 'medium' | 'low';
};

export const COLOR_OPTIONS = [
  '#FFFFFF',
  '#FFFBCC',
  '#DFF7E1',
  '#DFF3FF',
  '#FFE1E1',
  '#F1D7FF',
  '#FDE2FF',
  '#E6E6E6',
]; 

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onColorChange,
}: {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  } as React.CSSProperties;

  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useTheme();

  // UI: contrast helper to decide readable text color on top of a background
  function getContrastColor(hex: string) {
    // normalize
    const h = (hex || '#FFFFFF').replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const r = parseInt(full.substring(0, 2), 16) / 255;
    const g = parseInt(full.substring(2, 4), 16) / 255;
    const b = parseInt(full.substring(4, 6), 16) / 255;

    // convert to linear values
    const srgb = [r, g, b].map((c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    // relative luminance
    const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];

    // threshold per accessibility guidance (0.5 is simple heuristic)
    return L > 0.5 ? '#111827' : '#ffffff';
  }

  // Helper to darken a hex color by a percentage (0..1)
  function darkenHex(hex: string, amount = 0.35) {
    try {
      const h = hex.replace('#', '');
      const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      const darken = (v: number) => Math.max(0, Math.floor(v * (1 - amount)));
      const rr = darken(r);
      const gg = darken(g);
      const bb = darken(b);
      return `rgb(${rr}, ${gg}, ${bb})`;
    } catch {
      return hex;
    }
  }

  // UI: compute a safe text color depending on theme and chosen color
  // Treat '#ffffff' (or 'white') as no color chosen.
  // In light mode, when no explicit color is chosen we prefer a pure black token (--card-text).
  // In dark mode, always use the theme text token so content remains visible.
  const rawColor = (task.color || '').toString().trim();
  const normalized = rawColor.toLowerCase();
  const hasColor = normalized && normalized !== '' && normalized !== '#ffffff' && normalized !== 'white';
  let textColor: string;
  if (theme === 'dark') {
    textColor = 'var(--text)';
  } else {
    textColor = hasColor ? getContrastColor(rawColor || '#FFFFFF') : 'var(--card-text)';
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="transition w-full"
    >
      <div
        // UI: card body with padding, rounded corners, and min height
        className="rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 relative overflow-visible flex flex-col w-full min-h-[90px]"
          style={{
          background: theme === 'light' ? (task.color ?? '#FFFFFF') : 'var(--card-bg)',
          border: '1px solid var(--border)',
          color: textColor,
          width: '100%'
        }}
        tabIndex={0}
      >
        {/* Color accent: in dark mode show a thin left stripe; in light mode tint the whole card with chosen color */}
        {hasColor && theme === 'dark' && (
          <div
            aria-hidden
            className="absolute left-0 top-0 bottom-0"
            style={{ width: 6, background: darkenHex(rawColor || '#FFFFFF', 0.45), opacity: 0.98 }}
          />
        )}
        <div className={hasColor && theme === 'dark' ? 'pl-4' : ''}>{/* ensure content not under the stripe */}
          <div className="relative">
            {/* UI: action buttons in top-right corner */}
                <div className="absolute right-2 top-2 flex items-center gap-2">
                <button
                onClick={() => onEdit(task.id)}
                className="rounded-md px-2 py-1 text-sm transition-all duration-200 focus:outline-none bg-transparent border border-transparent hover:border-gray-200"
                  style={{ background: 'transparent', border: '1px solid var(--border)', color: 'inherit' }}
                aria-label="Edit task"
              >
                Edit
              </button>
                <button
                onClick={() => onDelete(task.id)}
                className="rounded-md px-2 py-1 text-sm transition-all duration-200 focus:outline-none"
                  style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--danger)' }}
                aria-label="Delete task"
              >
                Delete
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowPicker((s) => !s)}
                  aria-label="Change color"
                  className="w-6 h-6 rounded-md border"
                  style={{ background: rawColor || '#FFFFFF', border: '1px solid var(--border)' }}
                />
                {showPicker && (
                  <div className="absolute right-0 mt-2 p-2" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 6px 18px rgba(2,6,23,0.06)', zIndex: 50 }}>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            onColorChange(task.id, c);
                            setShowPicker(false);
                          }}
                          className="w-6 h-6 rounded-md border"
                          style={{ background: c }}
                          aria-label={`Set color ${c}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  {/* NEW FEATURE: Task Priority badge */}
                  {task.priority && (
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-yellow-300' : 'bg-blue-200'}`}
                      aria-hidden
                    />
                  )}
                  <h4 className="font-semibold text-base md:text-lg" style={{ color: textColor }}>{task.title}</h4>
                </div>
                <div className="mt-3 text-sm" style={{ color: textColor }}>
                  <p className="wrap-break-word whitespace-normal" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                    {task.description ? task.description : <em>No description</em>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="mt-auto text-sm flex items-center justify-between" style={{ color: 'var(--card-muted)' }}>
            <div>{new Date(task.createdAt).toLocaleDateString()}</div>
            <div className="flex items-center gap-2">{/* placeholder for badges */}</div>
          </div>
      </div>
    </article>
  );
}
