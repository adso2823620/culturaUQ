import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Cultura Caldas — Plataforma Cultural',
  description: 'Conectando la cultura de Caldas con su comunidad. Información, formación y participación cultural al alcance de todos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Navigation />
        {children}
       
      </body>
    </html>
  );
}