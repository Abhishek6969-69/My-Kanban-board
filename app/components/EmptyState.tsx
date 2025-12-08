
import React from 'react';

export default function EmptyState({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="py-8 px-4 text-center text-sm text-white/80">
      <div className="mb-2 font-medium text-white/90">{title ?? 'No tasks'}</div>
      {subtitle && <div className="text-xs">{subtitle}</div>}
    </div>
  );
}
