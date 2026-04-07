import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { LangProvider } from '@/context/LangContext';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Wini Studio — Fotografia, Wideo, 3D',
  description: 'Portfolio fotograficzne, filmowe i projekty 3D. Profesjonalne usługi wizualne.',
  keywords: ['fotografia', 'wideo', 'projekty 3D', 'portfolio', 'wizualizacje'],
  openGraph: {
    title: 'Wini Studio',
    description: 'Fotografia · Wideo · Projekty 3D',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
