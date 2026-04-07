import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import type { Category } from '@prisma/client';

interface Props {
  searchParams: { category?: string };
}

export default async function AdminPortfolioPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect('/wini-admin');

  const categoryFilter = searchParams.category as Category | undefined;

  let items: any[] = [];
  try {
    items = await prisma.portfolioItem.findMany({
      where: categoryFilter ? { category: categoryFilter } : undefined,
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch {}

  const categoryColors: Record<string, string> = {
    PHOTOGRAPHY: '#888888',
    VIDEO: '#cc3333',
    THREE_D: '#00cccc',
  };

  const categoryLabels: Record<string, string> = {
    PHOTOGRAPHY: 'Fotografia',
    VIDEO: 'Wideo',
    THREE_D: '3D',
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '1px solid #2a2a3a',
          paddingBottom: '1.5rem',
        }}
      >
        <div>
          <Link
            href="/wini-admin/dashboard"
            style={{ fontSize: '0.75rem', color: '#6868a0', textDecoration: 'none' }}
          >
            ← Dashboard
          </Link>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 300,
              letterSpacing: '0.2em',
              color: '#e0e0f0',
              marginTop: '0.5rem',
            }}
          >
            Portfolio
          </h1>
        </div>
        <Link
          href="/wini-admin/portfolio/new"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#9090c0',
            color: '#0a0a0c',
            textDecoration: 'none',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          + Nowa pozycja
        </Link>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link
          href="/wini-admin/portfolio"
          style={{
            padding: '0.4rem 1rem',
            border: `1px solid ${!categoryFilter ? '#9090c0' : '#2a2a3a'}`,
            color: !categoryFilter ? '#9090c0' : '#6868a0',
            textDecoration: 'none',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Wszystkie ({items.length})
        </Link>
        {(['PHOTOGRAPHY', 'VIDEO', 'THREE_D'] as const).map((cat) => {
          const count = items.filter((i) => i.category === cat).length;
          const isActive = categoryFilter === cat;
          return (
            <Link
              key={cat}
              href={`/wini-admin/portfolio?category=${cat}`}
              style={{
                padding: '0.4rem 1rem',
                border: `1px solid ${isActive ? categoryColors[cat] : '#2a2a3a'}`,
                color: isActive ? categoryColors[cat] : '#6868a0',
                textDecoration: 'none',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              {categoryLabels[cat]} ({count})
            </Link>
          );
        })}
      </div>

      {/* Items table */}
      {items.length === 0 ? (
        <p style={{ color: '#6868a0', textAlign: 'center', padding: '3rem 0' }}>
          Brak pozycji w portfolio.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/wini-admin/portfolio/${item.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                backgroundColor: '#141420',
                border: '1px solid #2a2a3a',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = categoryColors[item.category] || '#9090c0')
              }
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a3a')}
            >
              {/* Category dot */}
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: categoryColors[item.category] || '#888',
                  flexShrink: 0,
                }}
              />

              {/* Title */}
              <div style={{ flex: 1 }}>
                <span style={{ color: '#e0e0f0', fontSize: '0.875rem' }}>{item.title}</span>
                {item.titleEn && (
                  <span style={{ color: '#6868a0', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                    / {item.titleEn}
                  </span>
                )}
              </div>

              {/* Category label */}
              <span
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  color: categoryColors[item.category],
                  textTransform: 'uppercase',
                  flexShrink: 0,
                }}
              >
                {categoryLabels[item.category]}
              </span>

              {/* Published status */}
              <span
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  color: item.published ? '#4a9a4a' : '#6868a0',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                }}
              >
                {item.published ? 'Opublikowane' : 'Szkic'}
              </span>

              {/* Featured */}
              {item.featured && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    color: '#9090c0',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                  }}
                >
                  ★ Wyróżnione
                </span>
              )}

              {/* Edit arrow */}
              <span style={{ color: '#6868a0', fontSize: '0.75rem', flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
