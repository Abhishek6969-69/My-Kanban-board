"use client";
import React from 'react';
import { useSearch } from './SearchProvider';
import { useTheme } from './ThemeProvider';
import PriorityLegend from './PriorityLegend';

export default function Header() {
  const { query, setQuery } = useSearch();
  const { theme, toggleTheme } = useTheme();
  // UI: theme toggle included in header (fixed at top) - enhanced glassmorphism
  const headerTextColor = theme === 'light' ? '#000000' : 'var(--text)';
  return (
    <header className="fixed inset-x-0 top-0 z-40 backdrop-blur-md backdrop-saturate-125 bg-white/55 dark:bg-slate-900/55 border-b border-gray-100/60 dark:border-slate-800/60">
      <div className="max-w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/2">
          <h1 className="text-lg font-semibold" style={{ color: headerTextColor }}>
            My Kanban Board
          </h1>

          <div className="flex-1">
            <input
              aria-label="Search"
              placeholder="Search tasks, cards, or boards…"
              className="w-full rounded-full px-4 py-2 border placeholder:text-gray-500 dark:placeholder:text-slate-400"
              style={{ background: 'transparent', color: headerTextColor, borderColor: 'var(--border)' }}
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
            className="w-9 h-9 rounded-md flex items-center justify-center border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            style={{ borderColor: 'var(--border)', background: 'var(--muted-bg)', color: headerTextColor }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M4.93 4.93l1.41 1.41" />
                <path d="M17.66 17.66l1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="M4.93 19.07l1.41-1.41" />
                <path d="M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <PriorityLegend />

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-medium"
            style={{ background: 'var(--muted-bg)', color: headerTextColor, border: '1px solid var(--border)' }}
          >
            AB
          </div>
        </div>
      </div>
    </header>
  );
}
