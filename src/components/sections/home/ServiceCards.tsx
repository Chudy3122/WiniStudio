'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLang } from '@/context/LangContext';

const services = [
  {
    titleKey: 'home.photographyTitle',
    descKey: 'home.photographyDesc',
    href: '/fotografia',
    theme: 'fotografia' as const,
    accentColor: '#888888',
    number: '01',
  },
  {
    titleKey: 'home.videoTitle',
    descKey: 'home.videoDesc',
    href: '/wideo',
    theme: 'wideo' as const,
    accentColor: '#cc3333',
    number: '02',
  },
  {
    titleKey: 'home.threedTitle',
    descKey: 'home.threedDesc',
    href: '/3d',
    theme: 'threed' as const,
    accentColor: '#00cccc',
    number: '03',
  },
];

export function ServiceCards() {
  const { navigateWithTransition } = useTheme();
  const { t } = useLang();

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-px"
        style={{ backgroundColor: 'var(--color-border)' }}
      >
        {services.map((service, i) => (
          <motion.div
            key={service.href}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="group cursor-pointer relative overflow-hidden p-10 flex flex-col justify-between min-h-[300px]"
            style={{ backgroundColor: 'var(--color-surface)' }}
            onClick={() => navigateWithTransition(service.href, service.theme)}
          >
            {/* Hover background */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
              style={{ backgroundColor: service.accentColor }}
            />

            <div className="relative z-10">
              <span
                className="text-xs tracking-widest font-mono"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {service.number}
              </span>
              <h3
                className="font-cormorant font-light text-4xl mt-4 tracking-wide group-hover:tracking-wider transition-all duration-500"
                style={{ color: 'var(--color-text)' }}
              >
                {t(service.titleKey)}
              </h3>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {t(service.descKey)}
              </p>
            </div>

            <div
              className="relative z-10 flex items-center gap-2 text-xs tracking-widest uppercase mt-8 transition-all duration-300 group-hover:gap-4"
              style={{ color: service.accentColor }}
            >
              {t('home.viewAll')}
              <ArrowRight size={14} />
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
              style={{ backgroundColor: service.accentColor }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
