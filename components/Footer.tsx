import Link from 'next/link';

export default function Footer() {
  const footerLinks = [
    {
      title: 'Módulos',
      links: [
        { label: 'Labter Cultural',     href: '/labter' },
        { label: 'Caldas Cultural',     href: '/caldas-cultural' },
        { label: 'Convocatorias',       href: '/convocatorias' },
        { label: 'Conexión Cultural',   href: '/conexion-cultural' },
      ],
    },
    {
      title: 'Acerca de',
      links: [
        { label: 'Nosotros',    href: '/sobre-nosotros' },
        { label: 'Blog',        href: '/blog' },
        { label: 'Contacto',    href: '/contacto' },
        { label: 'FAQ',         href: '/faq' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Política de Privacidad', href: '#' },
        { label: 'Términos de Servicio',   href: '#' },
      ],
    },
  ];

  const socialLinks = [
    {
      label: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.118 1.525 5.845L.057 23.273l5.565-1.459A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.032-1.387l-.361-.214-3.302.866.88-3.22-.235-.37A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-white border-t border-[#F47920]/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl mb-4 text-[#1E2B5C]">
              <span className="text-[#F47920]">Cultura</span> Caldas
            </h3>
            <p className="text-[#6B7280] mb-6 leading-relaxed max-w-md">
              Conectando la cultura de Caldas con su comunidad.
              Información, formación y participación cultural al alcance de todos.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-[#F47920]/10 hover:bg-[#F47920] text-[#F47920] hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-base font-semibold mb-4 text-[#1E2B5C]">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#6B7280] hover:text-[#F47920] transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#F47920]/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#6B7280] text-sm">
            © {new Date().getFullYear()} Cultura Caldas. Todos los derechos reservados.
          </p>
          <p className="text-[#6B7280] text-sm mt-2 md:mt-0">
            Fundación de Caldas — Manizales, Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}