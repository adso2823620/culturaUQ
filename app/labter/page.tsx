import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import Breadcrumb from '@/components/Breadcrumb';
import {
  BookOpen, Video, FileText,
  Book, ClipboardList,
} from 'lucide-react';

const categorias = [
  {
    slug: 'capacitaciones',
    title: 'Capacitaciones',
    description: 'Grabaciones completas de las sesiones de formación del sector cultural de Caldas.',
    icon: <Video className="w-8 h-8" />,
    accent: '#e63947',
    bg: 'from-orange-500/10 to-orange-300/5',
    border: 'border-orange-200',
  },
  {
    slug: 'presentaciones',
    title: 'Presentaciones',
    description: 'Diapositivas y slides utilizados en cada sesión de formación.',
    icon: <FileText className="w-8 h-8" />,
    accent: '#0f4c75',
    bg: 'from-blue-500/10 to-blue-300/5',
    border: 'border-blue-200',
  },
  {
    slug: 'material-apoyo',
    title: 'Material de Apoyo',
    description: 'Guías, lecturas y recursos complementarios de las capacitaciones.',
    icon: <BookOpen className="w-8 h-8" />,
    accent: '#e63947',
    bg: 'from-orange-400/10 to-orange-200/5',
    border: 'border-orange-200',
  },
  {
    slug: 'bibliografia',
    title: 'Bibliografía',
    description: 'Fuentes bibliográficas y lecturas recomendadas del programa.',
    icon: <Book className="w-8 h-8" />,
    accent: '#0f4c75',
    bg: 'from-blue-400/10 to-blue-200/5',
    border: 'border-blue-200',
  },
  {
    slug: 'propuestas',
    title: 'Propuestas',
    description: 'Propuestas de proyectos culturales desarrolladas durante el programa.',
    icon: <ClipboardList className="w-8 h-8" />,
    accent: '#e63947',
    bg: 'from-orange-500/10 to-orange-300/5',
    border: 'border-orange-200',
  },
];

const TABS = [
  { slug: 'capacitaciones', label: 'Capacitaciones' },
  { slug: 'presentaciones', label: 'Presentaciones' },
  { slug: 'material-apoyo', label: 'Material de Apoyo' },
  { slug: 'bibliografia', label: 'Bibliografía' },
  { slug: 'propuestas', label: 'Propuestas' },
]

export default function LabterPage() {
  return (
    <PageLayout letter="L" letterPosition="top-right">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Breadcrumb */}
        <Breadcrumb crumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Labter Cultural' },
        ]} />

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 p-1 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
          {TABS.map(tab => (
            <Link
              key={tab.slug}
              href={`/labter/${tab.slug}`}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-gray-500 hover:text-[#2a9d8f] hover:bg-white"
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Hero */}
        <div className="mb-16 text-center">
          <span className="inline-block bg-[#e63947]/10 text-[#e63947] text-xs tracking-widest px-4 py-1.5 rounded-full mb-4">
            MÓDULO DE FORMACIÓN
          </span>
          <h1 className="text-5xl font-bold text-[#2a9d8f] mb-5">Labter Cultural</h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto leading-relaxed">
            Fortalece tus habilidades en el sector cultural con recursos de formación
            especializados: videos, documentos, referencias y mucho más.
          </p>
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/labter/${cat.slug}`}
              className={`group relative block rounded-2xl border ${cat.border} bg-white overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="h-1 w-full transition-all duration-300 group-hover:h-1.5" style={{ backgroundColor: cat.accent }} />
              <div className="relative p-7">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${cat.accent}15`, color: cat.accent }}
                >
                  {cat.icon}
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  <span className="group-hover:text-[#e63947] transition-colors duration-300 text-[#2a9d8f]">
                    {cat.title}
                  </span>
                </h2>
                <p className="text-[#6B7280] text-sm leading-relaxed">{cat.description}</p>
                <div
                  className="mt-5 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                  style={{ color: cat.accent }}
                >
                  Ver recursos <span className="text-base">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </PageLayout>
  );
}