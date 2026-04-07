import type { Metadata } from 'next';
import { ThreeDGrid } from '@/components/sections/threed/ThreeDGrid';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Wini Studio — Projekty 3D',
  description: 'Wizualizacje architektoniczne, modele produktów i animacje 3D.',
};

export const revalidate = 60;

async function getThreeD() {
  try {
    return await prisma.portfolioItem.findMany({
      where: { category: 'THREE_D', published: true },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch {
    return [];
  }
}

export default async function ThreeDPage() {
  const items = await getThreeD();
  return <ThreeDGrid items={items} />;
}
