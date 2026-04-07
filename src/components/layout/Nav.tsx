'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLang } from '@/context/LangContext';
import { type ThemeKey } from '@/lib/themes';

const navLinks: { key: string; href: string; theme: ThemeKey }[] = [
  { key: 'nav.home', href: '/', theme: 'home' },
  { key: 'nav.photography', href: '/fotografia', theme: 'fotografia' },
  { key: 'nav.video', href: '/wideo', theme: 'wideo' },
  { key: 'nav.threed', href: '/3d', theme: 'threed' },
  { key: 'nav.contact', href: '/kontakt', theme: 'home' },
];

export function Nav() {
  const pathname = usePathname();
  const { navigateWithTransition } = useTheme();
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (href: string, theme: ThemeKey) => {
    setMobileOpen(false);
    if (pathname !== href) {
      navigateWithTransition(href, theme);
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-700"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
          borderColor: 'var(--color-border)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('/', 'home')}
            className="font-cormorant text-xl tracking-[0.3em] uppercase transition-colors duration-300"
            style={{ color: 'var(--color-text)' }}
          >
            WINI <span style={{ color: 'var(--color-accent)' }}>STUDIO</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ key, href, theme }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <button
                  key={href}
                  onClick={() => handleNavClick(href, theme)}
                  className="relative text-sm tracking-widest uppercase transition-colors duration-300 py-1"
                  style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                >
                  {t(key)}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'pl' ? 'en' : 'pl')}
              className="text-xs tracking-widest uppercase transition-colors duration-300 px-2 py-1 border rounded"
              style={{
                color: 'var(--color-text-muted)',
                borderColor: 'var(--color-border)',
              }}
              suppressHydrationWarning
            >
              {lang === 'pl' ? 'EN' : 'PL'}
            </button>

            <button
              className="md:hidden transition-colors duration-300"
              style={{ color: 'var(--color-text)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map(({ key, href, theme }) => {
                const isActive = pathname === href;
                return (
                  <button
                    key={href}
                    onClick={() => handleNavClick(href, theme)}
                    className="text-2xl font-cormorant tracking-widest uppercase transition-colors duration-300"
                    style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text)' }}
                  >
                    {t(key)}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
