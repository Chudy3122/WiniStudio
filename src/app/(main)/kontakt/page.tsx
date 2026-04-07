import type { Metadata } from 'next';
import { ContactForm } from '@/components/sections/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Wini Studio — Kontakt',
  description: 'Skontaktuj się z Wini Studio. Fotografia, wideo, projekty 3D.',
};

export default function KontaktPage() {
  return <ContactForm />;
}
