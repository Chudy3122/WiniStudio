import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/wini-admin');

  let stats = {
    photography: 0,
    video: 0,
    threed: 0,
    messages: 0,
    unreadMessages: 0,
  };

  try {
    const [photography, video, threed, unreadMessages, totalMessages] = await Promise.all([
      prisma.portfolioItem.count({ where: { category: 'PHOTOGRAPHY' } }),
      prisma.portfolioItem.count({ where: { category: 'VIDEO' } }),
      prisma.portfolioItem.count({ where: { category: 'THREE_D' } }),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.contactMessage.count(),
    ]);
    stats = { photography, video, threed, messages: totalMessages, unreadMessages };
  } catch {}

  return <AdminDashboard stats={stats} />;
}
