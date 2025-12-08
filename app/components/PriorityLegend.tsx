"use client";
import React from 'react';

export default function PriorityLegend() {
  return (
    <div className="priority-legend ml-2">
      <button
        aria-label="Priority legend"
        title="Priority legend"
        className="text-xs px-2 py-1 rounded-md border border-transparent bg-[transparent] text-slate-500"
      >
        Priorities
      </button>
      <div className="tooltip" style={{ background: 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--border)' }}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <span className="priority-dot" style={{ background: '#FCA5A5' }} />
            <div>
              <div className="font-semibold">High</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Use for urgent or blocking tasks</div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="priority-dot" style={{ background: '#FDE68A' }} />
            <div>
              <div className="font-semibold">Medium</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Important but not immediate</div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="priority-dot" style={{ background: '#BFDBFE' }} />
            <div>
              <div className="font-semibold">Low</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Nice-to-have or backlog items</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
