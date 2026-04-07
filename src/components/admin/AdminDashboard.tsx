'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  photography: number;
  video: number;
  threed: number;
  messages: number;
  unreadMessages: number;
}

export function AdminDashboard({ stats }: { stats: Stats }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/wini-admin');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
          borderBottom: '1px solid #2a2a3a',
          paddingBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.2em', color: '#e0e0f0' }}>
          WINI{' '}
          <span style={{ color: '#9090c0' }}>STUDIO</span>
          <span
            style={{
              fontSize: '0.7rem',
              color: '#6868a0',
              marginLeft: '1rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              verticalAlign: 'middle',
            }}
          >
            Panel
          </span>
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: '1px solid #3a3a5a',
            color: '#6868a0',
            cursor: 'pointer',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Wyloguj
        </button>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem',
        }}
      >
        {[
          {
            label: 'Zdjęcia',
            value: stats.photography,
            href: '/wini-admin/portfolio?category=PHOTOGRAPHY',
            color: '#888888',
          },
          {
            label: 'Filmy',
            value: stats.video,
            href: '/wini-admin/portfolio?category=VIDEO',
            color: '#cc3333',
          },
          {
            label: 'Projekty 3D',
            value: stats.threed,
            href: '/wini-admin/portfolio?category=THREE_D',
            color: '#00cccc',
          },
          {
            label: 'Wiadomości',
            value: stats.messages,
            href: '/wini-admin/messages',
            color: '#9090c0',
            badge: stats.unreadMessages,
          },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            style={{
              display: 'block',
              padding: '1.5rem',
              backgroundColor: '#141420',
              border: '1px solid #2a2a3a',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = card.color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a3a')}
          >
            <div style={{ fontSize: '2.5rem', fontWeight: 300, color: card.color, lineHeight: 1 }}>
              {card.value}
              {'badge' in card && card.badge && card.badge > 0 ? (
                <span style={{ fontSize: '0.7rem', marginLeft: '0.5rem', color: '#cc3333' }}>
                  ({card.badge} nowych)
                </span>
              ) : null}
            </div>
            <div
              style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                color: '#6868a0',
                textTransform: 'uppercase',
              }}
            >
              {card.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            color: '#6868a0',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          Szybkie akcje
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
            + Dodaj pozycję
          </Link>
          <Link
            href="/wini-admin/portfolio"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#9090c0',
              border: '1px solid #9090c0',
              textDecoration: 'none',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Zarządzaj portfolio
          </Link>
          <Link
            href="/wini-admin/messages"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: stats.unreadMessages > 0 ? '#cc3333' : '#9090c0',
              border: `1px solid ${stats.unreadMessages > 0 ? '#cc3333' : '#9090c0'}`,
              textDecoration: 'none',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Wiadomości{stats.unreadMessages > 0 ? ` (${stats.unreadMessages})` : ''}
          </Link>
        </div>
      </div>

      {/* Back to site */}
      <div style={{ borderTop: '1px solid #2a2a3a', paddingTop: '1.5rem', marginTop: '2rem' }}>
        <Link
          href="/"
          style={{
            fontSize: '0.75rem',
            color: '#6868a0',
            textDecoration: 'none',
            letterSpacing: '0.1em',
          }}
        >
          ← Wróć do strony
        </Link>
      </div>
    </div>
  );
}
