'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import type { PortfolioItem } from '@prisma/client';

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function VideoCard({ item, index }: { item: PortfolioItem; index: number }) {
  const [playing, setPlaying] = useState(false);
  const ytId = item.videoUrl ? getYouTubeId(item.videoUrl) : null;
  const thumb = item.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* Video / Thumbnail area */}
      <div className="relative aspect-video">
        {playing && ytId ? (
          /* Inline YouTube embed */
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : playing && item.videoUrl && !ytId ? (
          /* Inline direct video */
          <video
            src={item.videoUrl}
            controls
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* Thumbnail with play button */
          <div
            className="group cursor-pointer w-full h-full"
            onClick={() => setPlaying(true)}
          >
            {thumb ? (
              <Image
                src={thumb}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-border)' }}
              >
                <Play size={40} style={{ color: 'var(--color-text-muted)' }} />
              </div>
            )}

            {/* Play overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)' }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  border: '2px solid var(--color-accent)',
                  boxShadow: '0 0 30px var(--color-accent)',
                }}
              >
                <Play
                  size={28}
                  fill="currentColor"
                  style={{ color: 'var(--color-accent)', marginLeft: '3px' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Title + description */}
      <div className="p-4">
        <h3 className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
            {item.description}
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ backgroundColor: 'var(--color-accent)' }}
      />
    </motion.div>
  );
}

interface Props {
  items: PortfolioItem[];
}

export function VideoGrid({ items }: Props) {
  const { t } = useLang();

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
          {t('video.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm tracking-wide max-w-lg"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {t('video.description')}
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
            {t('video.noItems')}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <VideoCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
