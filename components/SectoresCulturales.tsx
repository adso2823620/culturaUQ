'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Sectores consolidados con su keyword de búsqueda en Supabase,
// ícono, color y slug para la URL
const SECTORES = [
  {
    slug: 'musica',
    label: 'Música',
    keyword: 'música',
    emoji: '🎵',
    gradient: 'from-amber-500 to-orange-500',
    light: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
  },
  {
    slug: 'teatro',
    label: 'Teatro',
    keyword: 'teatro',
    emoji: '🎭',
    gradient: 'from-red-500 to-rose-600',
    light: 'bg-red-50 border-red-200',
    text: 'text-red-700',
  },
  {
    slug: 'danza',
    label: 'Danza',
    keyword: 'danza',
    emoji: '💃',
    gradient: 'from-pink-500 to-fuchsia-600',
    light: 'bg-pink-50 border-pink-200',
    text: 'text-pink-700',
  },
  {
    slug: 'artesanias',
    label: 'Artesanías',
    keyword: 'artesanías',
    emoji: '🏺',
    gradient: 'from-yellow-500 to-amber-600',
    light: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-700',
  },
  {
    slug: 'patrimonio',
    label: 'Patrimonio',
    keyword: 'patrimon',
    emoji: '🏛️',
    gradient: 'from-stone-500 to-stone-700',
    light: 'bg-stone-50 border-stone-200',
    text: 'text-stone-700',
  },
  {
    slug: 'audiovisual',
    label: 'Audiovisual',
    keyword: 'audiovisual',
    emoji: '🎬',
    gradient: 'from-violet-500 to-purple-700',
    light: 'bg-violet-50 border-violet-200',
    text: 'text-violet-700',
  },
  {
    slug: 'artes',
    label: 'Artes Visuales',
    keyword: 'artes',
    emoji: '🎨',
    gradient: 'from-blue-500 to-indigo-600',
    light: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
  },
  {
    slug: 'social',
    label: 'Cultural y Social',
    keyword: 'social',
    emoji: '🤝',
    gradient: 'from-emerald-500 to-teal-600',
    light: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
  },
  {
    slug: 'educativo',
    label: 'Educativo',
    keyword: 'educativ',
    emoji: '📚',
    gradient: 'from-cyan-500 to-blue-600',
    light: 'bg-cyan-50 border-cyan-200',
    text: 'text-cyan-700',
  },
  {
    slug: 'comunitario',
    label: 'Comunitario',
    keyword: 'comunitari',
    emoji: '🌱',
    gradient: 'from-lime-500 to-green-600',
    light: 'bg-lime-50 border-lime-200',
    text: 'text-lime-700',
  },
];

type ConteoMap = Record<string, number>;

export default function SectoresCulturales() {
  const [conteos, setConteos] = useState<ConteoMap>({});
  const [total, setTotal]     = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchConteos() {
      // Trae sector_cultural de todas las orgs activas (solo ese campo)
      const { data, error } = await supabase
        .from('organizaciones_culturales')
        .select('sector_cultural')
        .eq('activa', true);

      if (error || !data) return;

      setTotal(data.length);

      // Cuenta cuántas orgs caen en cada sector por keyword
      const map: ConteoMap = {};
      for (const sector of SECTORES) {
        map[sector.slug] = data.filter(
          (d) => d.sector_cultural?.toLowerCase().includes(sector.keyword.toLowerCase())
        ).length;
      }
      setConteos(map);
      setCargando(false);
    }
    fetchConteos();
  }, []);

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Encabezado */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-[#F47920]/10 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-[#F47920] animate-pulse" />
            <span className="text-[#F47920] text-sm tracking-widest font-medium">ORGANIZACIONES CULTURALES</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-[#1E2B5C] mb-4">
            El ecosistema cultural de Caldas
          </h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            {cargando ? (
              <span className="inline-block w-32 h-5 bg-gray-200 rounded animate-pulse" />
            ) : (
              <><span className="text-[#F47920] font-bold">{total}</span> organizaciones activas en todo el departamento</>
            )}
          </p>
        </div>

        {/* Grid de sectores */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {SECTORES.map((sector) => (
            <Link
              key={sector.slug}
              href={`/organizaciones?sector=${sector.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Barra de color arriba */}
              <div className={`h-1.5 bg-gradient-to-r ${sector.gradient}`} />

              <div className="p-5">
                {/* Emoji */}
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {sector.emoji}
                </div>

                {/* Nombre */}
                <h3 className="text-sm font-semibold text-[#1E2B5C] mb-2 leading-tight">
                  {sector.label}
                </h3>

                {/* Conteo */}
                <div className="flex items-end justify-between">
                  {cargando ? (
                    <div className="w-10 h-7 bg-gray-100 rounded animate-pulse" />
                  ) : (
                    <span className={`text-2xl font-bold ${sector.text}`}>
                      {conteos[sector.slug] ?? 0}
                    </span>
                  )}
                  <span className="text-xs text-[#9CA3AF]">orgs.</span>
                </div>

                {/* Hover arrow */}
                <div className="mt-3 text-xs text-[#9CA3AF] group-hover:text-[#F47920] transition-colors flex items-center gap-1">
                  Ver listado
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA ver todas */}
        <div className="text-center">
          <Link
            href="/organizaciones"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#1E2B5C] text-white rounded-full hover:bg-[#F47920] transition-colors duration-300 text-sm font-medium"
          >
            Ver todas las organizaciones
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}