import { ThemeProvider } from '@/context/ThemeContext';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { TransitionOverlay } from '@/components/layout/TransitionOverlay';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TransitionOverlay />
      <Nav />
      <main className="min-h-screen pt-16" style={{ backgroundColor: 'var(--color-bg)' }}>
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
