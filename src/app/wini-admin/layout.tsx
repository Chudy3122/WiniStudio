import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0c',
        color: '#e0e0f0',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
