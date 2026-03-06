import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';

const secciones = [
  {
    slug: 'agenda',
    title: 'Agenda Cultural',
    description: 'Consulta los eventos culturales programados en Manizales y Caldas. Mantente al día con la programación cultural del departamento.',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&h=400&fit=crop',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    slug: 'conectate',
    title: 'Conéctate',
    description: 'Descubre qué está pasando en el sector cultural de Caldas. Noticias, historias y novedades de artistas y colectivos.',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=400&fit=crop',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    slug: 'asociate',
    title: 'Asóciate',
    description: 'Inscribe tus eventos y actividades culturales. Comparte tu programación con la comunidad y haz parte de la agenda cultural de Caldas.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
];

export default function CaldasCulturalPage() {
  return (
    <PageLayout letter="CC" letterPosition="top-right">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block px-6 py-2 bg-[#F47920]/10 rounded-full mb-6">
            <span className="text-[#F47920] text-sm tracking-widest">CALENDARIO COLABORATIVO</span>
          </div>
          <h1 className="text-5xl md:text-6xl text-[#1E2B5C] mb-6">CALDAS CULTURAL</h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            La plataforma colaborativa para descubrir, conectar y participar en la vida cultural de
            Caldas. Un espacio dinámico donde la comunidad comparte su programación cultural.
          </p>
        </div>

        {/* Cards de subsecciones */}
        <div className="grid md:grid-cols-3 gap-6">
          {secciones.map((sec) => (
            <Link
              key={sec.slug}
              href={`/caldas-cultural/${sec.slug}`}
              className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Imagen con overlay */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={sec.image}
                  alt={sec.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Overlay degradado */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2B5C]/80 via-[#1E2B5C]/30 to-transparent" />

                {/* Ícono arriba derecha */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30">
                  {sec.icon}
                </div>

                {/* Título sobre la imagen */}
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-xl text-white font-medium">{sec.title}</h2>
                </div>
              </div>

              {/* Descripción debajo */}
              <div className="bg-white p-5 border border-t-0 border-[#F47920]/20 group-hover:border-[#F47920]/50 transition-colors duration-300">
                <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">
                  {sec.description}
                </p>
                <div className="mt-3 text-[#F47920] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ir a {sec.title} →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}