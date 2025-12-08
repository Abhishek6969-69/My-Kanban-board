import './globals.css';
import React from 'react';
import Header from './components/Header';
import SearchProvider from './components/SearchProvider';
import ThemeProvider from './components/ThemeProvider';

export const metadata = {
  title: 'My Kanban Board',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* UI: full-screen layout */}
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-800">
        <ThemeProvider>
          <SearchProvider>
            {/* Header is fixed at top (see Header.tsx). The board/app content lives in the full-viewport main below. */}
            <Header />

            <main className="w-full">
              {children}
            </main>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
