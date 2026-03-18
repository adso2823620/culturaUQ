import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  letter?: string;
  letterPosition?: 'top-left' | 'top-right' | 'center';
  bgImage?: string;  // nombre del archivo en /public/, ej: "imgfondo.png"
}

export default function PageLayout({
  children,
  letter,
  letterPosition = 'top-right',
  bgImage = 'imgfondo.png',
}: PageLayoutProps) {
  const letterPos = {
    'top-left':  'top-24 left-8',
    'top-right': 'top-24 right-8',
    'center':    'top-32 left-1/2 -translate-x-1/2',
  }[letterPosition];

  return (
    <div className="relative min-h-screen bg-white">

      {/* Imagen de fondo — en el div raíz para que funcione en Client y Server Components */}
      {bgImage && (
        <div
          className="fixed pointer-events-none"
          aria-hidden="true"
          style={{
            top:                '30px',   // altura del navbar
            left:               0,
            right:              0,
            bottom:             0,
            backgroundImage:    `url('/${bgImage}')`,
            backgroundSize:     'contain',
            backgroundPosition: 'left top',
            backgroundRepeat:   'no-repeat',
            opacity:            0.09,
            zIndex:             0,
          }}
        />
      )}

      <Navigation />

      <main className="relative pt-20" style={{ zIndex: 1 }}>

        {/* Patrón de puntos decorativo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
          <svg width="60" height="60" className="w-full h-full">
            <defs>
              <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="#2a9d8f" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Letra decorativa */}
        {letter && (
          <div
            className={`absolute ${letterPos} z-10 pointer-events-none select-none`}
            aria-hidden="true"
          >
            <span
              className="text-8xl md:text-9xl font-bold text-[#e63947]/10"
              style={{ textShadow: '4px 4px 8px rgba(230,57,71,0.15)' }}
            >
              {letter}
            </span>
          </div>
        )}

        {/* Contenido */}
        <div className="relative z-20">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}