import type { Metadata } from 'next';
import { GalleryGrid } from '@/components/sections/photography/GalleryGrid';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Wini Studio — Fotografia',
  description: 'Portfolio fotograficzne — portrety, pejzaże, reportaż.',
};

export const revalidate = 60;

async function getPhotos() {
  try {
    return await prisma.portfolioItem.findMany({
      where: { category: 'PHOTOGRAPHY', published: true },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch {
    return [];
  }
}

export default async function FotografiaPage() {
  const items = await getPhotos();
  return <GalleryGrid items={items} />;
}
