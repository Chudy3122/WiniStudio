import type { Metadata } from 'next';
import { VideoGrid } from '@/components/sections/video/VideoGrid';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Wini Studio — Wideo',
  description: 'Realizacje filmowe — reklamy, teledyski, filmy korporacyjne.',
};

export const revalidate = 60;

async function getVideos() {
  try {
    return await prisma.portfolioItem.findMany({
      where: { category: 'VIDEO', published: true },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch {
    return [];
  }
}

export default async function WideoPage() {
  const items = await getVideos();
  return <VideoGrid items={items} />;
}
