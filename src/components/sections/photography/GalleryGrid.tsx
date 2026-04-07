'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useLang } from '@/context/LangContext';
import type { PortfolioItem } from '@prisma/client';

interface Props {
  items: PortfolioItem[];
}

export function GalleryGrid({ items }: Props) {
  const { t } = useLang();
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const photoItems = items.filter((i) => i.imageUrl);
  const slides = photoItems.map((item) => ({
    src: item.imageUrl!,
    alt: item.title,
    title: item.title,
    description: item.description ?? undefined,
  }));

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-cormorant font-light tracking-wider"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: 'var(--color-text)' }}
        >
          {t('photography.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-sm tracking-wide max-w-lg"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {t('photography.description')}
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px mt-8 origin-left"
          style={{ backgroundColor: 'var(--color-border)' }}
        />
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {photoItems.length === 0 ? (
          <p className="text-center py-24" style={{ color: 'var(--color-text-muted)' }}>
            {t('photography.noItems')}
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {photoItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                className="group relative cursor-pointer overflow-hidden break-inside-avoid"
                style={{ backgroundColor: 'var(--color-surface)' }}
                onClick={() => setLightboxIndex(index)}
              >
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={item.imageUrl!}
                    alt={item.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ display: 'block' }}
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}
                  >
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    {item.description && (
                      <p className="text-white/70 text-xs mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
                {item.featured && (
                  <div
                    className="absolute top-3 left-3 text-xs px-2 py-0.5 tracking-widest uppercase"
                    style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    Featured
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.95)' } }}
      />
    </div>
  );
}
