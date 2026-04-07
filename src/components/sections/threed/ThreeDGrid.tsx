'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Maximize2 } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useLang } from '@/context/LangContext';
import type { PortfolioItem } from '@prisma/client';

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

interface Props {
  items: PortfolioItem[];
}

export function ThreeDGrid({ items }: Props) {
  const { t } = useLang();
  const [activeVideo, setActiveVideo] = useState<PortfolioItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const imageItems = items.filter((i) => i.imageUrl);
  const slides = imageItems.map((item) => ({
    src: item.imageUrl!,
    alt: item.title,
    title: item.title,
    description: item.description ?? undefined,
  }));

  const handleItemClick = (item: PortfolioItem, index: number) => {
    if (item.videoUrl) {
      setActiveVideo(item);
    } else if (item.imageUrl) {
      const imgIndex = imageItems.findIndex((i) => i.id === item.id);
      if (imgIndex >= 0) setLightboxIndex(imgIndex);
    }
  };

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
          {t('threed.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm tracking-wide max-w-lg"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {t('threed.description')}
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px mt-8 origin-left"
          style={{ backgroundColor: 'var(--color-border)' }}
        />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {items.length === 0 ? (
          <p className="text-center py-24" style={{ color: 'var(--color-text-muted)' }}>
            {t('threed.noItems')}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => {
              const hasVideo = Boolean(item.videoUrl);
              const ytId = item.videoUrl ? getYouTubeId(item.videoUrl) : null;
              const thumb =
                item.thumbnail ||
                (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null) ||
                item.imageUrl;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className="group cursor-pointer relative overflow-hidden"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                  onClick={() => handleItemClick(item, i)}
                >
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none z-10"
                    style={{
                      boxShadow: 'inset 0 0 30px var(--color-accent)',
                    }}
                  />

                  <div className="relative aspect-video overflow-hidden">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-border)' }}
                      >
                        <Maximize2 size={32} style={{ color: 'var(--color-text-muted)' }} />
                      </div>
                    )}

                    {/* Overlay */}
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center border-2"
                        style={{
                          borderColor: 'var(--color-accent)',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                        }}
                      >
                        {hasVideo ? (
                          <Play
                            size={24}
                            fill="currentColor"
                            style={{ color: 'var(--color-accent)', marginLeft: '2px' }}
                          />
                        ) : (
                          <Maximize2 size={20} style={{ color: 'var(--color-accent)' }} />
                        )}
                      </div>
                    </div>

                    {/* Featured badge */}
                    {item.featured && (
                      <div
                        className="absolute top-3 right-3 text-xs px-2 py-0.5 tracking-widest uppercase"
                        style={{
                          backgroundColor: 'var(--color-accent)',
                          color: 'var(--color-bg)',
                        }}
                      >
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-cormorant text-lg font-light" style={{ color: 'var(--color-text)' }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        className="text-xs mt-1 line-clamp-2"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {item.description}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 tracking-wider"
                            style={{
                              backgroundColor: 'var(--color-border)',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-10 right-0 transition-colors"
                style={{ color: 'rgba(255,255,255,0.7)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'white')}
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)')
                }
              >
                <X size={24} />
              </button>
              {activeVideo.videoUrl && getYouTubeId(activeVideo.videoUrl) ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(activeVideo.videoUrl!)}?autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeVideo.videoUrl ? (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.98)' } }}
      />
    </div>
  );
}
