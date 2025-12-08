"use client";
import React from 'react';
import { useSearch } from './SearchProvider';
import { useTheme } from './ThemeProvider';
import PriorityLegend from './PriorityLegend';

export default function Header() {
  const { query, setQuery } = useSearch();
  const { theme, toggleTheme } = useTheme();

  // UI: theme toggle included in header (fixed at top)
  return (
    <header className="fixed inset-x-0 top-0 z-40 backdrop-blur-sm bg-white/60 dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/2">
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
            My Kanban Board
          </h1>

          <div className="flex-1">
            <input
              aria-label="Search"
              placeholder="Search tasks, cards, or boards…"
              className="w-full rounded-full px-4 py-2 border"
              style={{ background: 'transparent', color: 'var(--text)', borderColor: 'var(--border)' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* UI: theme toggle */}
          <button
            role="button"
            aria-pressed={theme === 'dark'}
            aria-label="Toggle theme"
            onClick={() => toggleTheme()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
              }
            }}
            className="w-9 h-9 rounded-md flex items-center justify-center border"
            style={{ borderColor: 'var(--border)', background: 'var(--muted-bg)', color: 'var(--text)' }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <PriorityLegend />

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-medium"
            style={{ background: 'var(--muted-bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            AB
          </div>
        </div>
      </div>
    </header>
  );
}
