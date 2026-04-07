'use client';

import { useState } from 'react';
import type { ContactMessage } from '@prisma/client';

interface Props {
  initialMessages: ContactMessage[];
}

export function MessageList({ initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [expanded, setExpanded] = useState<string | null>(null);

  const markRead = async (id: string, read: boolean) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read }),
      });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read } : m));
    } catch {}
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Na pewno usunąć tę wiadomość?')) return;
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {}
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#e0e0f0', fontWeight: 300, letterSpacing: '0.1em' }}>
          Wiadomości
          {unreadCount > 0 && (
            <span style={{ marginLeft: '0.75rem', fontSize: '0.7rem', backgroundColor: '#cc3333', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '2px' }}>
              {unreadCount} nowych
            </span>
          )}
        </h2>
      </div>

      {messages.length === 0 ? (
        <p style={{ color: '#6868a0', padding: '2rem 0' }}>Brak wiadomości.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                backgroundColor: msg.read ? '#141420' : '#1a1a2e',
                border: `1px solid ${msg.read ? '#2a2a3a' : '#3a3a6a'}`,
                padding: '1rem 1.25rem',
              }}
            >
              {/* Header row */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                onClick={() => {
                  setExpanded(expanded === msg.id ? null : msg.id);
                  if (!msg.read) markRead(msg.id, true);
                }}
              >
                {!msg.read && (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9090c0', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                    <span style={{ color: '#e0e0f0', fontWeight: msg.read ? 400 : 600, fontSize: '0.9rem' }}>
                      {msg.name}
                    </span>
                    <span style={{ color: '#6868a0', fontSize: '0.8rem' }}>{msg.email}</span>
                    {msg.subject && (
                      <span style={{ color: '#9090c0', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        — {msg.subject}
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#6868a0', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {new Date(msg.createdAt).toLocaleString('pl-PL')}
                  </p>
                </div>
                <span style={{ color: '#6868a0', fontSize: '0.75rem', flexShrink: 0 }}>
                  {expanded === msg.id ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded content */}
              {expanded === msg.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #2a2a3a' }}>
                  <p style={{ color: '#c0c0d8', fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {msg.message}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Wini Studio'}`}
                      style={{ padding: '0.4rem 1rem', backgroundColor: '#9090c0', color: '#0a0a0c', textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                    >
                      Odpowiedz
                    </a>
                    <button
                      onClick={() => markRead(msg.id, !msg.read)}
                      style={{ padding: '0.4rem 1rem', backgroundColor: 'transparent', border: '1px solid #3a3a5a', color: '#9090c0', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                    >
                      {msg.read ? 'Oznacz jako nowe' : 'Oznacz jako przeczytane'}
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      style={{ padding: '0.4rem 1rem', backgroundColor: 'transparent', border: '1px solid #cc3333', color: '#cc3333', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
