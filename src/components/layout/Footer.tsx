'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LangContext';

export function Footer() {
  const { t } = useLang();
  const router = useRouter();
  const clickCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    clickCountRef.current += 1;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      router.push('/wini-admin');
      return;
    }

    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 3000);
  };

  return (
    <footer
      className="border-t py-8 mt-16 transition-colors duration-700"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p
          onClick={handleLogoClick}
          className="font-cormorant text-lg tracking-[0.3em] uppercase cursor-default select-none"
          style={{ color: 'var(--color-text)' }}
        >
          WINI <span style={{ color: 'var(--color-accent)' }}>STUDIO</span>
        </p>
        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
          {t('footer.tagline')}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} Wini Studio. {t('footer.rights')}.
        </p>
      </div>
    </footer>
  );
}
