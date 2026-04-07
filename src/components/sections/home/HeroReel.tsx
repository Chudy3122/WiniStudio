'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useLang } from '@/context/LangContext';
import { ArrowDown } from 'lucide-react';

export function HeroReel() {
  const { navigateWithTransition } = useTheme();
  const { t } = useLang();

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, var(--color-surface) 0%, var(--color-bg) 70%)',
        }}
      />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="font-cormorant font-light leading-none tracking-[0.2em] uppercase select-none"
            style={{ fontSize: 'clamp(4rem, 15vw, 14rem)', color: 'var(--color-text)' }}
          >
            WINI
          </h1>
          <h2
            className="font-cormorant font-light leading-none uppercase select-none"
            style={{
              fontSize: 'clamp(1.2rem, 4vw, 4rem)',
              color: 'var(--color-accent)',
              letterSpacing: '0.6em',
            }}
          >
            STUDIO
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-8 text-sm tracking-widest uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {t('home.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigateWithTransition('/fotografia', 'fotografia')}
            className="px-8 py-3 text-sm tracking-widest uppercase border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.backgroundColor = 'var(--color-accent)';
              btn.style.color = 'var(--color-bg)';
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.backgroundColor = 'transparent';
              btn.style.color = 'var(--color-accent)';
            }}
          >
            {t('home.ctaPortfolio')}
          </button>
          <button
            onClick={() => navigateWithTransition('/kontakt', 'home')}
            className="px-8 py-3 text-sm tracking-widest uppercase border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.borderColor = 'var(--color-text-muted)';
              btn.style.color = 'var(--color-text)';
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.borderColor = 'var(--color-border)';
              btn.style.color = 'var(--color-text-muted)';
            }}
          >
            {t('home.ctaContact')}
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
