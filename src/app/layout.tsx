import './globals.css';
import React from 'react';
import Header from '../components/Header';

export const metadata = {
  title: 'My Kanban Board',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Header />
        <main className="max-w-7xl mx-auto p-6 md:p-10">
          {children}
        </main>
      </body>
    </html>
  );
}
