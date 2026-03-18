'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import PageLayout from '@/components/PageLayout';
import { Search, MapPin, Phone, Instagram, Facebook, Youtube, Mail, ChevronLeft, ChevronRight, X } from 'lucide-react';

// ── Tipo local con foto_url ───────────────────────────────────────
// (incluye foto_url que agregamos con ALTER TABLE)
type Organizacion = {
  id: string;
  razon_social: string;
  municipio: string;
  sector_cultural: string | null;
  tipo_organizacion: string | null;
  tipologia: string | null;
  correo: string | null;
  telefono_1: string | null;
  instagram: string | null;
  youtube: string | null;
  facebook: string | null;
  latitud: number | null;
  longitud: number | null;
  activa: boolean;
  verificada: boolean;
  direccion: string | null;
  foto_url: string | null;   // ← campo nuevo
};

const SECTORES_OPCIONES = [
  { slug: 'todos',       label: 'Todos los sectores',   keyword: '' },
  { slug: 'musica',      label: 'Música',               keyword: 'música' },
  { slug: 'teatro',      label: 'Teatro',               keyword: 'teatro' },
  { slug: 'danza',       label: 'Danza',                keyword: 'danza' },
  { slug: 'artesanias',  label: 'Artesanías',           keyword: 'artesanías' },
  { slug: 'patrimonio',  label: 'Patrimonio',           keyword: 'patrimon' },
  { slug: 'audiovisual', label: 'Audiovisual',          keyword: 'audiovisual' },
  { slug: 'artes',       label: 'Artes Visuales',       keyword: 'artes' },
  { slug: 'social',      label: 'Cultural y Social',    keyword: 'social' },
  { slug: 'educativo',   label: 'Educativo',            keyword: 'educativ' },
  { slug: 'comunitario', label: 'Comunitario',          keyword: 'comunitari' },
];

const MUNICIPIOS = [
  'Todos', 'Manizales', 'Riosucio', 'La Dorada', 'Santa Rosa de Cabal',
  'Quinchia', 'Chinchiná', 'Villamaria', 'Pensilvania', 'Salamina',
  'Supía', 'Norcasia', 'Palestina', 'Victoria',
];

const POR_PAGINA = 15;

// ── OrgCard: con foto si existe, fallback con inicial si no ───────
function OrgCard({ org }: { org: Organizacion }) {
  const tieneRedes = org.instagram || org.facebook || org.youtube;
  const inicial    = org.razon_social.charAt(0).toUpperCase();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#e63947]/30 transition-all duration-300 group flex flex-col">

      {/* ── Zona de imagen (con foto o fallback) ── */}
      <div className="relative h-36 flex-shrink-0">
        {org.foto_url ? (
          // FOTO REAL: se usa cuando el admin la sube desde el panel
          <Image
            src={org.foto_url}
            alt={org.razon_social}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          // FALLBACK: fondo degradado navy-azul con la inicial grande
          <div className="w-full h-full bg-gradient-to-br from-[#2a9d8f] to-[#0f4c75] flex items-center justify-center">
            <span className="text-6xl font-bold text-white/20 select-none">{inicial}</span>
            {/* patrón de puntos decorativo */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`dots-${org.id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#dots-${org.id})`} />
            </svg>
          </div>
        )}

        {/* Badge verificada */}
        {org.verificada && (
          <span className="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full shadow-sm">
            ✓ Verificada
          </span>
        )}

        {/* Sector sobre la imagen */}
        {org.sector_cultural && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
            <span className="text-white/90 text-xs line-clamp-1">{org.sector_cultural}</span>
          </div>
        )}
      </div>

      {/* ── Contenido ── */}
      <div className="p-4 flex flex-col flex-1">
        {/* Nombre */}
        <h3 className="text-sm font-semibold text-[#2a9d8f] group-hover:text-[#e63947] transition-colors mb-2 line-clamp-2 leading-snug">
          {org.razon_social}
        </h3>

        {/* Municipio */}
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-1">
          <MapPin className="w-3.5 h-3.5 text-[#e63947] flex-shrink-0" />
          <span>{org.municipio}{org.direccion ? ` · ${org.direccion}` : ''}</span>
        </div>

        {/* Teléfono */}
        {org.telefono_1 && (
          <a href={`tel:${org.telefono_1}`}
            className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#e63947] transition-colors mb-2">
            <Phone className="w-3.5 h-3.5 text-[#e63947] flex-shrink-0" />
            {org.telefono_1}
          </a>
        )}

        {/* Tipología */}
        {org.tipologia && (
          <div className="text-xs text-[#9CA3AF] mb-3">{org.tipologia}</div>
        )}

        {/* Redes sociales */}
        {(tieneRedes || org.correo) && (
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100 mt-auto">
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
                className="ml-auto text-xs text-[#9CA3AF] hover:text-[#e63947] flex items-center gap-1 transition-colors">
                <Mail className="w-3.5 h-3.5" /> Contacto
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────
function OrganizacionesContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const sectorParam  = searchParams.get('sector') ?? 'todos';

  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [total, setTotal]                   = useState(0);
  const [pagina, setPagina]                 = useState(0);
  const [cargando, setCargando]             = useState(true);
  const [busqueda, setBusqueda]             = useState('');
  const [municipio, setMunicipio]           = useState('Todos');
  const [sector, setSector]                 = useState(sectorParam);

  useEffect(() => { setSector(sectorParam); setPagina(0); }, [sectorParam]);

  const fetchData = useCallback(async () => {
    setCargando(true);
    const sectorInfo = SECTORES_OPCIONES.find((s) => s.slug === sector);
    const keyword    = sectorInfo?.keyword ?? '';

    let query = supabase
      .from('organizaciones_culturales')
      .select(
        // ← foto_url incluido en el select
        'id, razon_social, municipio, sector_cultural, tipo_organizacion, tipologia, correo, telefono_1, instagram, youtube, facebook, latitud, longitud, activa, verificada, direccion, foto_url',
        { count: 'exact' }
      )
      .eq('activa', true)
      .order('razon_social')
      .range(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA - 1);

    if (busqueda.trim())       query = query.ilike('razon_social', `%${busqueda.trim()}%`);
    if (municipio !== 'Todos') query = query.ilike('municipio', `%${municipio}%`);
    if (keyword)               query = query.ilike('sector_cultural', `%${keyword}%`);

    const { data, count, error } = await query;
    if (!error && data) {
      setOrganizaciones(data as Organizacion[]);
      setTotal(count ?? 0);
    }
    setCargando(false);
  }, [busqueda, municipio, sector, pagina]);

  useEffect(() => { setPagina(0); }, [busqueda, municipio, sector]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPaginas = Math.ceil(total / POR_PAGINA);
  const sectorActual = SECTORES_OPCIONES.find((s) => s.slug === sector);
  const hasFiltros   = busqueda || municipio !== 'Todos' || sector !== 'todos';

  const limpiar = () => {
    setBusqueda(''); setMunicipio('Todos'); setSector('todos');
    router.push('/organizaciones');
  };

  return (
    <PageLayout letter="O" letterPosition="top-right">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#e63947] mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <div className="inline-block px-5 py-1.5 bg-[#e63947]/10 rounded-full mb-4">
            <span className="text-[#e63947] text-sm tracking-widest">DIRECTORIO CULTURAL</span>
          </div>
          <h1 className="text-4xl md:text-5xl text-[#2a9d8f] mb-3">
            {sector !== 'todos' ? sectorActual?.label : 'Organizaciones Culturales'}
          </h1>
          <p className="text-[#6B7280]">
            {cargando
              ? 'Cargando...'
              : <><span className="text-[#e63947] font-semibold">{total}</span> organizaciones encontradas</>
            }
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Buscar organización..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e63947]/30"
              />
            </div>
            <select value={municipio} onChange={(e) => setMunicipio(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e63947]/30 text-[#374151]">
              {MUNICIPIOS.map((m) => (
                <option key={m} value={m}>{m === 'Todos' ? '📍 Todos los municipios' : m}</option>
              ))}
            </select>
            <select value={sector}
              onChange={(e) => { setSector(e.target.value); router.push(`/organizaciones?sector=${e.target.value}`); }}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e63947]/30 text-[#374151]">
              {SECTORES_OPCIONES.map((s) => (
                <option key={s.slug} value={s.slug}>{s.label}</option>
              ))}
            </select>
          </div>
          {hasFiltros && (
            <button onClick={limpiar} className="mt-3 flex items-center gap-1 text-xs text-[#e63947] hover:underline">
              <X className="w-3 h-3" /> Limpiar filtros
            </button>
          )}
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SECTORES_OPCIONES.map((s) => (
            <button key={s.slug}
              onClick={() => { setSector(s.slug); router.push(`/organizaciones?sector=${s.slug}`); }}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                sector === s.slug
                  ? 'bg-[#e63947] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-[#6B7280] hover:border-[#e63947] hover:text-[#e63947]'
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Skeleton */}
        {cargando && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-56 animate-pulse" />
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!cargando && organizaciones.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl text-[#2a9d8f] mb-2">Sin resultados</h3>
            <p className="text-[#6B7280] mb-5">No encontramos organizaciones con esos filtros.</p>
            <button onClick={limpiar} className="text-sm text-[#e63947] hover:underline">Ver todas</button>
          </div>
        )}

        {/* Grid */}
        {!cargando && organizaciones.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {organizaciones.map((org) => <OrgCard key={org.id} org={org} />)}
            </div>

            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setPagina((p) => Math.max(0, p - 1))} disabled={pagina === 0}
                  className="flex items-center gap-1 px-4 py-2 text-sm rounded-xl border border-gray-200 disabled:opacity-40 hover:border-[#e63947] hover:text-[#e63947] transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPaginas, 5) }).map((_, i) => {
                    const p = pagina < 3 ? i : pagina - 2 + i;
                    if (p >= totalPaginas) return null;
                    return (
                      <button key={p} onClick={() => setPagina(p)}
                        className={`w-9 h-9 rounded-xl text-sm transition-colors ${
                          p === pagina ? 'bg-[#e63947] text-white' : 'border border-gray-200 text-[#6B7280] hover:border-[#e63947] hover:text-[#e63947]'
                        }`}>
                        {p + 1}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))} disabled={pagina >= totalPaginas - 1}
                  className="flex items-center gap-1 px-4 py-2 text-sm rounded-xl border border-gray-200 disabled:opacity-40 hover:border-[#e63947] hover:text-[#e63947] transition-colors">
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default function OrganizacionesPage() {
  return (
    <Suspense>
      <OrganizacionesContent />
    </Suspense>
  );
}
