import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div
        className="max-w-7xl mx-auto p-4 md:p-6 rounded-xl shadow-sm border"
        style={{ background: 'var(--column-bg)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
            My Kanban Board
          </h1>

          <div className="flex-1">
            <input
              aria-label="Search"
              placeholder="Search tasks, cards, or boards…"
              className="w-full rounded-md px-3 py-2 border"
              style={{ borderColor: 'var(--border)', background: 'transparent', color: 'var(--text)' }}
            />
          </div>

          <div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-medium"
              style={{ background: 'var(--muted-bg)', color: 'var(--text-muted)' }}
            >
              AB
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
