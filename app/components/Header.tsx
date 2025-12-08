"use client";
import React from 'react';
import { useSearch } from './SearchProvider';
import { useTheme } from './ThemeProvider';
import PriorityLegend from './PriorityLegend';

export default function Header() {
  const { query, setQuery } = useSearch();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40">
      <div
        className="max-w-7xl mx-auto p-4 md:p-6 rounded-xl shadow-sm border"
        style={{ background: 'var(--column-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
            My Kanban Board
          </h1>

          <div className="flex-1">
            <input
              aria-label="Search"
              placeholder="Search tasks, cards, or boards…"
              className="w-full rounded-full px-6 py-3 border"
              style={{ background: 'transparent', color: 'var(--text)', borderColor: 'var(--border)' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle theme"
              onClick={() => toggleTheme()}
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
      </div>
    </header>
  );
}
