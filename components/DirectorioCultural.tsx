'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, type Organizacion } from '@/lib/supabase';
import { Search, MapPin, Instagram, Facebook, Youtube, ExternalLink } from 'lucide-react';

// Sectores para el filtro — extraídos de los datos reales
const SECTORES = [
  'Todos',
  'Cultural – música',
  'Cultural – artes escénicas (teatro)',
  'Cultural – artes escénicas (danza)',
  'Cultural – artesanías y oficios tradicionales',
  'Cultural y social',
  'Cultural y educativo',
  'Cultural y comunitario',
  'Cultural y patrimonial',
  'Sector audiovisual y cinematográfico',
];

const MUNICIPIOS = [
  'Todos',
  'Manizales', 'Riosucio', 'La Dorada', 'Santa Rosa de Cabal',
  'Quinchia', 'Chinchiná', 'Villamaria', 'Pensilvania', 'Salamina',
  'Supía', 'Norcasia', 'Palestina', 'Victoria',
];

const POR_PAGINA = 12;

export default function DirectorioCultural() {
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [total, setTotal]                   = useState(0);
  const [pagina, setPagina]                 = useState(0);
  const [cargando, setCargando]             = useState(true);

  const [busqueda, setBusqueda]             = useState('');
  const [municipio, setMunicipio]           = useState('Todos');
  const [sector, setSector]                 = useState('Todos');

  const fetchData = useCallback(async () => {
    setCargando(true);

    let query = supabase
      .from('organizaciones_culturales')
      .select('id, razon_social, municipio, sector_cultural, tipo_organizacion, tipologia, correo, telefono_1, instagram, youtube, facebook, latitud, longitud, activa, verificada', { count: 'exact' })
      .eq('activa', true)
      .order('razon_social')
      .range(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA - 1);

    if (busqueda.trim()) {
      query = query.ilike('razon_social', `%${busqueda.trim()}%`);
    }
    if (municipio !== 'Todos') {
      query = query.ilike('municipio', `%${municipio}%`);
    }
    if (sector !== 'Todos') {
      query = query.ilike('sector_cultural', `%${sector}%`);
    }

    const { data, count, error } = await query;

    if (!error && data) {
      setOrganizaciones(data as Organizacion[]);
      setTotal(count ?? 0);
    }
    setCargando(false);
  }, [busqueda, municipio, sector, pagina]);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setPagina(0);
  }, [busqueda, municipio, sector]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      {/* Encabezado */}
      <div className="text-center mb-10">
        <div className="inline-block px-5 py-1.5 bg-[#F47920]/10 rounded-full mb-4">
          <span className="text-[#F47920] text-sm tracking-widest">DIRECTORIO CULTURAL</span>
        </div>
        <h2 className="text-4xl text-[#1E2B5C] mb-3">
          Organizaciones Culturales de Caldas
        </h2>
        <p className="text-[#6B7280]">
          <span className="text-[#F47920] font-semibold">{total}</span> organizaciones registradas en el departamento
        </p>
      </div>

      {/* Buscador + Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#F47920]/20 p-5 mb-8">
        <div className="grid md:grid-cols-3 gap-4">

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Buscar organización..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/40"
            />
          </div>

          {/* Filtro municipio */}
          <select
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/40 text-[#374151]"
          >
            {MUNICIPIOS.map((m) => (
              <option key={m} value={m}>{m === 'Todos' ? '📍 Todos los municipios' : m}</option>
            ))}
          </select>

          {/* Filtro sector */}
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/40 text-[#374151]"
          >
            {SECTORES.map((s) => (
              <option key={s} value={s}>{s === 'Todos' ? '🎨 Todos los sectores' : s}</option>
            ))}
          </select>
        </div>

        {/* Limpiar filtros */}
        {(busqueda || municipio !== 'Todos' || sector !== 'Todos') && (
          <button
            onClick={() => { setBusqueda(''); setMunicipio('Todos'); setSector('Todos'); }}
            className="mt-3 text-xs text-[#F47920] hover:underline"
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* Estado de carga */}
      {cargando && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-40 animate-pulse" />
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {!cargando && organizaciones.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-[#6B7280]">No encontramos organizaciones con esos filtros.</p>
          <button
            onClick={() => { setBusqueda(''); setMunicipio('Todos'); setSector('Todos'); }}
            className="mt-4 text-sm text-[#F47920] hover:underline"
          >
            Ver todas las organizaciones
          </button>
        </div>
      )}

      {/* Grid de cards */}
      {!cargando && organizaciones.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {organizaciones.map((org) => (
              <OrgCard key={org.id} org={org} />
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPagina((p) => Math.max(0, p - 1))}
                disabled={pagina === 0}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#F47920] hover:text-[#F47920] transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-sm text-[#6B7280] px-3">
                Página {pagina + 1} de {totalPaginas}
              </span>
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
                disabled={pagina >= totalPaginas - 1}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#F47920] hover:text-[#F47920] transition-colors"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

// ── Tarjeta individual ────────────────────────────────────────────
function OrgCard({ org }: { org: Organizacion }) {
  const tieneRedes = org.instagram || org.facebook || org.youtube;

  return (
    <div className="bg-white border border-[#F47920]/15 rounded-2xl p-5 hover:shadow-lg hover:border-[#F47920]/40 transition-all duration-300 group flex flex-col">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#F47920]/10 flex items-center justify-center flex-shrink-0">
          <span className="text-[#F47920] text-sm font-bold">
            {org.razon_social.charAt(0)}
          </span>
        </div>
        {org.verificada && (
          <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 flex-shrink-0">
            ✓ Verificada
          </span>
        )}
      </div>

      {/* Nombre */}
      <h3 className="text-sm font-semibold text-[#1E2B5C] group-hover:text-[#F47920] transition-colors mb-2 line-clamp-2 flex-1">
        {org.razon_social}
      </h3>

      {/* Municipio + Sector */}
      <div className="space-y-1 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
          <MapPin className="w-3.5 h-3.5 text-[#F47920] flex-shrink-0" />
          <span>{org.municipio}</span>
        </div>
        {org.sector_cultural && (
          <div className="text-xs text-[#3B82F6] bg-[#3B82F6]/8 rounded-md px-2 py-1 line-clamp-1">
            {org.sector_cultural.replace('Cultural – ', '').replace('Cultural y ', '')}
          </div>
        )}
      </div>

      {/* Tipo */}
      {org.tipologia && (
        <div className="text-xs text-[#9CA3AF] mb-3">{org.tipologia}</div>
      )}

      {/* Redes sociales */}
      {tieneRedes && (
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          {org.instagram && (
            <a href={org.instagram} target="_blank" rel="noopener noreferrer"
              className="text-[#E1306C] hover:scale-110 transition-transform">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {org.facebook && (
            <a href={org.facebook} target="_blank" rel="noopener noreferrer"
              className="text-[#1877F2] hover:scale-110 transition-transform">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {org.youtube && (
            <a href={org.youtube} target="_blank" rel="noopener noreferrer"
              className="text-[#FF0000] hover:scale-110 transition-transform">
              <Youtube className="w-4 h-4" />
            </a>
          )}
          {org.correo && (
            <a href={`mailto:${org.correo}`}
              className="ml-auto text-xs text-[#6B7280] hover:text-[#F47920] flex items-center gap-1 transition-colors">
              <ExternalLink className="w-3 h-3" /> Contacto
            </a>
          )}
        </div>
      )}
    </div>
  );
}