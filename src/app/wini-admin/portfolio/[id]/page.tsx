import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { PortfolioForm } from '@/components/admin/PortfolioForm';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default async function EditPortfolioPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect('/wini-admin');

  let item = null;
  try {
    item = await prisma.portfolioItem.findUnique({ where: { id: params.id } });
  } catch {}

  if (!item) notFound();

  const categoryLabels: Record<string, string> = {
    PHOTOGRAPHY: 'Fotografia',
    VIDEO: 'Wideo',
    THREE_D: 'Projekty 3D',
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #2a2a3a', paddingBottom: '1.5rem' }}>
        <div>
          <Link href="/wini-admin/dashboard" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 300, letterSpacing: '0.2em', color: '#e0e0f0' }}>
              WINI <span style={{ color: '#9090c0' }}>STUDIO</span>
            </h1>
          </Link>
          <p style={{ fontSize: '0.7rem', color: '#6868a0', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.25rem' }}>
            Portfolio &rsaquo; {categoryLabels[item.category]} &rsaquo; Edytuj
          </p>
        </div>
        <Link href="/wini-admin/portfolio"
          style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '1px solid #3a3a5a', color: '#6868a0', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          ← Powrót
        </Link>
      </div>

      <PortfolioForm item={item} />
    </div>
  );
}
