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
  <body className="min-h-screen" style={{ background: 'linear-gradient(135deg,var(--bg),rgba(255,255,255,0.02))' }}>
        {/* Top navigation bar wrapper for SaaS look */}
        <ThemeProvider>
          <SearchProvider>
            <div className="shadow-sm border-b px-6 py-4 rounded-b-xl" style={{ background: 'var(--column-bg)', borderColor: 'var(--border)' }}>
              <div className="max-w-7xl mx-auto">
                <Header />
              </div>
            </div>

            <main className="max-w-7xl mx-auto p-6 md:p-10">
              {children}
            </main>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
