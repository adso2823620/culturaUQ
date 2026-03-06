import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  // Letra decorativa de fondo (ej: "L" para Labter, "C" para Caldas)
  letter?: string;
  letterPosition?: 'top-left' | 'top-right' | 'center';
}

export default function PageLayout({
  children,
  letter,
  letterPosition = 'top-right',
}: PageLayoutProps) {
  const letterPos = {
    'top-left':  'top-24 left-8',
    'top-right': 'top-24 right-8',
    'center':    'top-32 left-1/2 -translate-x-1/2',
  }[letterPosition];

  return (
    <div className="relative min-h-screen">
      <Navigation />

      <main className="relative pt-20">
        {/* Patrón de puntos decorativo de fondo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
          <svg width="60" height="60" className="w-full h-full">
            <defs>
              <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="#1E2B5C" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Letra decorativa 3D (opcional) */}
        {letter && (
          <div className={`absolute ${letterPos} z-10 pointer-events-none select-none`} aria-hidden="true">
            <span
              className="text-8xl md:text-9xl font-bold text-[#F47920]/10"
              style={{ textShadow: '4px 4px 8px rgba(244,121,32,0.15)' }}
            >
              {letter}
            </span>
          </div>
        )}

        {/* Contenido de la página */}
        <div className="relative z-20">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}