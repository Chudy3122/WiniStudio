import { HeroReel } from '@/components/sections/home/HeroReel';
import { ServiceCards } from '@/components/sections/home/ServiceCards';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wini Studio — Strona Główna',
};

export default function HomePage() {
  return (
    <>
      <HeroReel />
      <ServiceCards />
    </>
  );
}
