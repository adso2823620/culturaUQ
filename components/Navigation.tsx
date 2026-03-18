'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: '/',                  label: 'Inicio' },
    { href: '/labter',            label: 'Labter Cultural' },
    { href: '/caldas-cultural',   label: 'Caldas Cultural' },
    { href: '/convocatorias',     label: 'Participa y Postula' },
    { href: '/conexion-cultural', label: 'Conexión Cultural' },

  ];

  // FAQ sigue disponible en /faq pero no aparece en el navbar principal

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#e63947]/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="text-2xl text-[#2a9d8f] hover:text-[#e63947] transition-colors duration-300">
            <span className="text-[#e63947]">Conexión</span> Cultural
          </Link>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`transition-colors duration-300 hover:text-[#e63947] text-sm ${
                    isActive(item.href)
                      ? 'text-[#e63947] border-b-2 border-[#e63947] pb-0.5'
                      : 'text-[#6B7280]'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <div className="w-6 flex flex-col justify-center space-y-1.5">
              <span className={`block h-0.5 bg-[#2a9d8f] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-[#2a9d8f] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-[#2a9d8f] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <ul className="md:hidden mt-4 pb-4 flex flex-col space-y-3 border-t border-[#e63947]/20 pt-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block transition-colors duration-300 hover:text-[#e63947] ${
                    isActive(item.href) ? 'text-[#e63947]' : 'text-[#6B7280]'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}