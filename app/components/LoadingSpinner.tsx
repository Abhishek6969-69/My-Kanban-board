
import React from 'react';

export default function LoadingSpinner({ size = 20 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="inline-block animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden
    />
  );
}
