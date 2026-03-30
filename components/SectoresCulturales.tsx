'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const SECTORES = [
  { slug: 'musica', label: 'Música', emoji: '🎵', keyword: 'música' },
  { slug: 'teatro', label: 'Teatro', emoji: '🎭', keyword: 'teatro' },
  { slug: 'danza', label: 'Danza', emoji: '💃', keyword: 'danza' },
  { slug: 'artesanias', label: 'Artesanías', emoji: '🏺', keyword: 'artesanías' },
  { slug: 'patrimonio', label: 'Patrimonio', emoji: '🏛️', keyword: 'patrimon' },
  { slug: 'audiovisual', label: 'Audiovisual', emoji: '🎬', keyword: 'audiovisual' },
  { slug: 'artes', label: 'Artes Visuales', emoji: '🎨', keyword: 'artes' },
  { slug: 'social', label: 'Cultural y Social', emoji: '🤝', keyword: 'social' },
  { slug: 'educativo', label: 'Educativo', emoji: '📚', keyword: 'educativ' },
  { slug: 'comunitario', label: 'Comunitario', emoji: '🌱', keyword: 'comunitari' },
];

interface Org {
  id: string
  razon_social: string
  municipio: string
  sector_cultural: string
  foto_url: string | null
  tipologia: string | null
}

export default function SectoresCulturales() {
  const [total, setTotal] = useState(0)
  const [destacadas, setDestacadas] = useState<Org[]>([])
  const [cargando, setCargando] = useState(true)
  const [contador, setContador] = useState(0)

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('organizaciones_culturales')
        .select('id, razon_social, municipio, sector_cultural, foto_url, tipologia')
        .eq('activa', true)

      if (error || !data) return

      setTotal(data.length)

      const conFoto = data.filter(o => o.foto_url)
      const sinFoto = data.filter(o => !o.foto_url)
      const pool = conFoto.length >= 3 ? conFoto : [...conFoto, ...sinFoto]
      const shuffled = [...pool].sort(() => Math.random() - 0.5)
      setDestacadas(shuffled.slice(0, 3))
      setCargando(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (total === 0) return
    let start = 0
    const duration = 1500
    const step = total / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= total) {
        setContador(total)
        clearInterval(timer)
      } else {
        setContador(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [total])

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: '#f8fafb' }}
    >
      {/* Patrón de puntos suave */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Acentos decorativos suaves */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl"
        style={{ backgroundColor: '#2a9d8f' }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-[0.05] blur-3xl"
        style={{ backgroundColor: '#e63947' }}
      />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(42,157,143,0.08)', border: '1px solid rgba(42,157,143,0.2)' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#2a9d8f] animate-pulse" />
            <span className="text-[#2a9d8f] text-sm tracking-widest font-medium">DIRECTORIO CULTURAL</span>
          </div>

          {/* Número animado */}
          <div className="mb-4">
            {cargando ? (
              <div className="w-48 h-24 bg-gray-100 rounded-2xl animate-pulse mx-auto" />
            ) : (
              <div className="flex items-end justify-center gap-3">
                <span
                  className="text-8xl md:text-9xl font-black leading-none"
                  style={{ color: '#2a9d8f' }}
                >
                  {contador}
                </span>
                <span className="text-2xl font-light text-gray-400 mb-4">orgs.</span>
              </div>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0f4c75' }}>
            El ecosistema cultural de Caldas
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Organizaciones activas en todo el departamento, listas para conectar con su comunidad
          </p>
        </div>

        {/* Cards destacadas */}
        {!cargando && destacadas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {destacadas.map((org, i) => (
              <Link
                key={org.id}
                href="/organizaciones"
                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#2a9d8f]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Imagen */}
                <div
                  className="relative h-44 overflow-hidden"
                  style={{ backgroundColor: '#e8f4f3' }}
                >
                  {org.foto_url ? (
                    <Image
                      src={org.foto_url}
                      alt={org.razon_social}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl font-black" style={{ color: '#2a9d8f', opacity: 0.2 }}>
                        {org.razon_social.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  {/* Sector badge */}
                  {org.sector_cultural && (
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: 'rgba(42,157,143,0.85)' }}
                      >
                        {org.sector_cultural}
                      </span>
                    </div>
                  )}

                  {/* Número */}
                  <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3
                    className="font-semibold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-[#2a9d8f] transition-colors"
                    style={{ color: '#0f4c75' }}
                  >
                    {org.razon_social}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    📍 {org.municipio}
                    {org.tipologia && ` · ${org.tipologia}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Chips de sectores */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {SECTORES.map(s => (
            <Link
              key={s.slug}
              href={`/organizaciones?sector=${s.slug}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white border border-gray-200 text-gray-500 hover:border-[#2a9d8f]/40 hover:text-[#2a9d8f] hover:bg-[#2a9d8f]/5"
            >
              <span>{s.emoji}</span>
              {s.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/organizaciones"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: '#2a9d8f' }}
          >
            Explorar directorio completo
            <span className="text-xl">→</span>
          </Link>
          <p className="text-gray-400 text-sm mt-3">
            Busca por municipio, sector o nombre
          </p>
        </div>

      </div>
    </section>
  )
}