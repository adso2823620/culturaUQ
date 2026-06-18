import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ConditionalNavigation from '@/components/ConditionalNavigation'


export const metadata = {
  title: {
    default: 'Conexión Cultural — Plataforma Cultural',
    template: '%s | Conexión Cultural',
  },
  description: 'Plataforma cultural del departamento de Caldas. Directorio de organizaciones, agenda de eventos, formación y convocatorias culturales.',
  metadataBase: new URL('https://cultura.fundacioncaldas.org'), // cambia cuando tengas el dominio
  openGraph: {
    siteName: 'Conexión Cultural',
    locale: 'es_CO',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ConditionalNavigation />
        {children}
       
      </body>
    </html>
  );
}
