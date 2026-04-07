'use client';

import { useTheme } from '@/context/ThemeContext';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <p
        className="font-cormorant"
        style={{ fontSize: 'clamp(6rem, 20vw, 16rem)', lineHeight: 1, color: 'var(--color-border)', fontWeight: 300 }}
      >
        404
      </p>
      <p
        className="text-sm tracking-widest uppercase mt-4"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Strona nie istnieje
      </p>
      <a
        href="/"
        className="mt-8 px-6 py-2 text-xs tracking-widest uppercase border transition-all duration-300 hover:scale-105"
        style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
      >
        Wróć do strony głównej
      </a>
    </div>
  );
}
