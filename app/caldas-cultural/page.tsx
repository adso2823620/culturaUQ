import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import Breadcrumb from '@/components/Breadcrumb';

const TABS = [
  { slug: 'agenda', label: 'Agenda Cultural' },
  { slug: 'conectate', label: 'Conéctate' },
  { slug: 'asociate', label: 'Asóciate' },
]

const secciones = [
  {
    slug: 'agenda',
    title: 'Agenda Cultural',
    description: 'Consulta los eventos culturales programados en Manizales y Caldas. Mantente al día con la programación cultural del departamento.',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&h=400&fit=crop',
    accent: '#e63947',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    slug: 'conectate',
    title: 'Conéctate',
    description: 'Descubre qué está pasando en el sector cultural de Caldas. Noticias, historias y novedades de artistas y colectivos.',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=400&fit=crop',
    accent: '#2a9d8f',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    slug: 'asociate',
    title: 'Asóciate',
    description: 'Inscribe tus eventos, actualiza tu información y conecta tu organización con la comunidad cultural de Caldas.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
    accent: '#0f4c75',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
];

export default function CaldasCulturalPage() {
  return (
    <PageLayout letter="CC" letterPosition="top-right" bgImage="imgfondo.png">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Breadcrumb */}
        <Breadcrumb crumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Caldas Cultural' },
        ]} />

        {/* Tabs de submodulos */}
        <div className="flex flex-wrap gap-2 mb-10 p-1 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
          {TABS.map(tab => (
            <Link
              key={tab.slug}
              href={`/caldas-cultural/${tab.slug}`}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-gray-500 hover:text-[#2a9d8f] hover:bg-white"
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Hero */}
        <div className="mb-16 text-center">
          <span className="inline-block bg-[#e63947]/10 text-[#e63947] text-xs tracking-widest px-4 py-1.5 rounded-full mb-4">
            CALENDARIO COLABORATIVO
          </span>
          <h1 className="text-5xl font-bold text-[#2a9d8f] mb-5">Caldas Cultural</h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto leading-relaxed">
            La plataforma colaborativa para descubrir, conectar y participar en la vida cultural
            de Caldas. Un espacio dinámico donde la comunidad comparte su programación.
          </p>
        </div>

        {/* Grid de secciones */}
        <div className="grid md:grid-cols-3 gap-6">
          {secciones.map((sec) => (
            <Link
              key={sec.slug}
              href={`/caldas-cultural/${sec.slug}`}
              className="group relative block rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
                style={{ backgroundColor: sec.accent }}
              />
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={sec.image}
                  alt={sec.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${sec.accent}cc 0%, ${sec.accent}44 50%, transparent 100%)` }}
                />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center text-white border border-white/30 bg-white/15 backdrop-blur-sm">
                  {sec.icon}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-[#2a9d8f] mb-2">
                  <span className="group-hover:text-[#e63947] transition-colors duration-300">
                    {sec.title}
                  </span>
                </h2>
                <p className="text-[#6B7280] text-sm leading-relaxed">{sec.description}</p>
                <div
                  className="mt-4 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                  style={{ color: sec.accent }}
                >
                  Ir a {sec.title} <span className="text-base">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </PageLayout>
  );
}