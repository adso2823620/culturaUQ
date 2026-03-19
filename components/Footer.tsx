import Link from 'next/link';

const MODULOS = [
  { label: 'Labter Cultural',   href: '/labter' },
  { label: 'Caldas Cultural',   href: '/caldas-cultural' },
  { label: 'Convocatorias',     href: '/convocatorias' },
  { label: 'Conexión Cultural', href: '/conexion-cultural' },
  { label: 'Organizaciones',    href: '/organizaciones' },
];

const INSTITUCIONAL = [
  { label: 'Contacto', href: '/contacto' },
  { label: 'FAQ',      href: '/faq' },
  { label: 'Política de Privacidad', href: '#' },
  { label: 'Términos de Servicio',   href: '#' },
];

const SOCIALES = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#2a9d8f] text-white">

      {/* ── Franja superior — brand + columnas ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 24 L10 14 L16 18 L22 10 L28 24 Z" fill="white" fillOpacity="0.9" />
                  <circle cx="16" cy="7" r="3" fill="#e63947" />
                  <path d="M13 7 Q16 4 19 7" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.7" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-base leading-none">
                  <span className="text-[#e63947]">Cultura</span> Caldas
                </p>
                <p className="text-white/60 text-xs mt-0.5">Fundación de Caldas</p>
              </div>
            </div>
            <p className="text-white/65 text-sm leading-relaxed mb-5 max-w-xs">
              Conectando la cultura de Caldas con su comunidad. Formación, participación y patrimonio al alcance de todos.
            </p>
            {/* Redes */}
            <div className="flex gap-2">
              {SOCIALES.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#e63947] flex items-center justify-center transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Módulos */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">Módulos</p>
            <ul className="space-y-2.5">
              {MODULOS.map(l => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">Institucional</p>
            <ul className="space-y-2.5">
              {INSTITUCIONAL.map(l => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto rápido */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">Contacto</p>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[#e63947]">📍</span>
                <span>Manizales, Caldas<br />Colombia</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#e63947]">✉</span>
                <a href="mailto:cultura@fundacioncaldas.org"
                  className="hover:text-white transition-colors duration-200 break-all">
                  cultura@fundacioncaldas.org
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Franja inferior — copyright + acceso admin ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/45 text-xs">
            © {new Date().getFullYear()} Cultura Caldas · Fundación de Caldas
          </p>
          <div className="flex items-center gap-4">
            <p className="text-white/45 text-xs">
              Manizales, Colombia
            </p>
            {/* Acceso admin discreto */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-white/25 hover:text-white/60 transition-colors duration-200 group"
              title="Acceso administrador"
            >
              <svg
                className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Admin
              </span>
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}