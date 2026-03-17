'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { ExternalLink, RefreshCw, Search, AlertCircle } from 'lucide-react';
import type { ConvocatoriaItem, TipoConvocatoria } from '@/app/api/convocatorias/route';

// ─────────────────────────────────────────────────────────────────────────────
// SISTEMA DE DISEÑO POR TIPO — coherente con Conéctate
// ─────────────────────────────────────────────────────────────────────────────
type TipoConfig = {
  gradiente: string;
  badge: string;
  acento: string;
  patron: PatronTipo;
  icono: string;        // emoji representativo
};

type PatronTipo = 'circulos' | 'lineas' | 'hexagonos' | 'ondas' | 'puntos' | 'cruces' | 'triangulos' | 'rombos';

const TIPOS_CONFIG: Record<TipoConvocatoria | 'default', TipoConfig> = {
  'Beca':          { gradiente: 'from-[#1E2B5C] to-[#2d3f8a]', badge: 'bg-blue-100 text-blue-800',     acento: '#3B82F6', patron: 'hexagonos',  icono: '🎓' },
  'Estímulo':      { gradiente: 'from-[#F47920] to-[#b85c18]', badge: 'bg-orange-100 text-orange-800', acento: '#fbbf24', patron: 'ondas',      icono: '⭐' },
  'Formación':     { gradiente: 'from-[#065F46] to-[#1E2B5C]', badge: 'bg-emerald-100 text-emerald-800',acento: '#34d399', patron: 'puntos',     icono: '📚' },
  'Licitación':    { gradiente: 'from-[#374151] to-[#1E2B5C]', badge: 'bg-gray-100 text-gray-700',     acento: '#9CA3AF', patron: 'lineas',     icono: '📋' },
  'Residencia':    { gradiente: 'from-[#6D28D9] to-[#1E2B5C]', badge: 'bg-purple-100 text-purple-800', acento: '#a78bfa', patron: 'circulos',   icono: '🏡' },
  'Premio':        { gradiente: 'from-[#B45309] to-[#92400E]', badge: 'bg-amber-100 text-amber-800',   acento: '#fcd34d', patron: 'rombos',     icono: '🏆' },
  'Concertación':  { gradiente: 'from-[#BE185D] to-[#1E2B5C]', badge: 'bg-pink-100 text-pink-800',     acento: '#f9a8d4', patron: 'triangulos', icono: '🤝' },
  'Convocatoria':  { gradiente: 'from-[#0F766E] to-[#1E2B5C]', badge: 'bg-teal-100 text-teal-800',     acento: '#5eead4', patron: 'cruces',     icono: '📢' },
  'default':       { gradiente: 'from-[#1E2B5C] to-[#374151]', badge: 'bg-gray-100 text-gray-700',     acento: '#6B7280', patron: 'puntos',     icono: '📌' },
};

function getCfg(tipo: TipoConvocatoria): TipoConfig {
  return TIPOS_CONFIG[tipo] ?? TIPOS_CONFIG['default'];
}

// ─────────────────────────────────────────────────────────────────────────────
// BADGES DE ÁMBITO
// ─────────────────────────────────────────────────────────────────────────────
const AMBITO_STYLE: Record<string, string> = {
  'Local':          'bg-[#F47920]/10 text-[#F47920]',
  'Departamental':  'bg-[#1E2B5C]/10 text-[#1E2B5C]',
  'Nacional':       'bg-[#3B82F6]/10 text-[#3B82F6]',
};

// ─────────────────────────────────────────────────────────────────────────────
// PATRONES SVG (mismo sistema que Conéctate para coherencia visual)
// ─────────────────────────────────────────────────────────────────────────────
function PatronSVG({ tipo, color }: { tipo: PatronTipo; color: string }) {
  const op = '0.15';
  const patrones: Record<PatronTipo, React.ReactNode> = {
    circulos: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4].map(i => [0,1,2,3].map(j => (
          <circle key={`${i}-${j}`} cx={i*60-20} cy={j*50-10} r="20"
            fill="none" stroke={color} strokeWidth="1.5" opacity={op} />
        )))}
      </svg>
    ),
    ondas: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4,5].map(i => (
          <path key={i} d={`M-20 ${i*22} Q60 ${i*22-15} 140 ${i*22} T300 ${i*22}`}
            fill="none" stroke={color} strokeWidth="1.5" opacity={op} />
        ))}
      </svg>
    ),
    hexagonos: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3].map(i => [0,1,2].map(j => {
          const x = i*55+(j%2)*27-10; const y = j*48-10; const r = 20;
          const pts = Array.from({length:6},(_,k)=>{const a=Math.PI/180*(60*k-30);return `${x+r*Math.cos(a)},${y+r*Math.sin(a)}`;}).join(' ');
          return <polygon key={`${i}-${j}`} points={pts} fill="none" stroke={color} strokeWidth="1.5" opacity={op}/>;
        }))}
      </svg>
    ),
    puntos: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4,5].map(i => [0,1,2,3,4].map(j => (
          <circle key={`${i}-${j}`} cx={i*45+10} cy={j*35+10} r="2.5" fill={color} opacity={op}/>
        )))}
      </svg>
    ),
    lineas: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={i} x1={i*40-20} y1="0" x2={i*40+60} y2="200"
            stroke={color} strokeWidth="1.5" opacity={op}/>
        ))}
      </svg>
    ),
    cruces: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4].map(i => [0,1,2,3].map(j => (
          <g key={`${i}-${j}`} transform={`translate(${i*55+15},${j*45+15})`}>
            <line x1="-8" y1="0" x2="8" y2="0" stroke={color} strokeWidth="1.5" opacity={op}/>
            <line x1="0" y1="-8" x2="0" y2="8" stroke={color} strokeWidth="1.5" opacity={op}/>
          </g>
        )))}
      </svg>
    ),
    triangulos: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4].map(i => [0,1,2,3].map(j => {
          const x = i*55+(j%2)*22-5; const y = j*45-5;
          return <polygon key={`${i}-${j}`} points={`${x},${y+24} ${x+14},${y} ${x+28},${y+24}`}
            fill="none" stroke={color} strokeWidth="1.5" opacity={op}/>;
        }))}
      </svg>
    ),
    rombos: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4].map(i => [0,1,2,3].map(j => {
          const x = i*55+(j%2)*25+5; const y = j*45+10;
          return <polygon key={`${i}-${j}`} points={`${x},${y-14} ${x+10},${y} ${x},${y+14} ${x-10},${y}`}
            fill="none" stroke={color} strokeWidth="1.5" opacity={op}/>;
        }))}
      </svg>
    ),
  };
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {patrones[tipo]}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD DE CONVOCATORIA
// ─────────────────────────────────────────────────────────────────────────────
function ConvocatoriaCard({ item, grande = false }: { item: ConvocatoriaItem; grande?: boolean }) {
  const cfg = getCfg(item.tipo);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
    >
      {/* Cabecera con gradiente + patrón */}
      <div className={`relative bg-gradient-to-br ${cfg.gradiente} overflow-hidden ${grande ? 'h-48' : 'h-36'}`}>
        <PatronSVG tipo={cfg.patron} color={cfg.acento} />

        {/* Ícono grande decorativo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-7xl opacity-10 select-none">{cfg.icono}</span>
        </div>

        {/* Letra inicial */}
        <div className="absolute -right-3 -bottom-5 text-[100px] font-black leading-none select-none pointer-events-none"
          style={{ color: cfg.acento, opacity: 0.1 }}>
          {item.titulo.charAt(0).toUpperCase()}
        </div>

        {/* Entidad arriba izquierda */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5">
          <span className="text-white/70 text-xs font-medium tracking-wide truncate max-w-[160px]">
            {item.entidad}
          </span>
        </div>

        {/* Badge ámbito arriba derecha */}
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 rounded-full text-xs text-white bg-white/15 backdrop-blur-sm border border-white/20">
            {item.ambito}
          </span>
        </div>

        {/* Fecha publicación abajo derecha */}
        <div className="absolute bottom-4 right-4">
          <span className="text-white/50 text-xs">{item.fechaLegible}</span>
        </div>

        {/* ExternalLink hint */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ExternalLink className="w-3.5 h-3.5 text-white/60" />
        </div>
      </div>

      {/* Cuerpo */}
      <div className="bg-white border border-t-0 border-gray-100 group-hover:border-gray-200
        transition-colors duration-300 p-5 rounded-b-2xl flex flex-col gap-3">

        {/* Fila: tipo + ámbito */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
            {cfg.icono} {item.tipo}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs ${AMBITO_STYLE[item.ambito]}`}>
            {item.ambito}
          </span>
        </div>

        {/* Título */}
        <h3 className={`font-semibold text-[#1E2B5C] leading-snug line-clamp-2
          group-hover:text-[#F47920] transition-colors duration-200
          ${grande ? 'text-lg' : 'text-sm'}`}>
          {item.titulo}
        </h3>

        {/* Extracto */}
        {item.extracto && item.extracto !== item.titulo && (
          <p className={`text-[#6B7280] leading-relaxed ${grande ? 'line-clamp-3 text-sm' : 'line-clamp-2 text-xs'}`}>
            {item.extracto}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-1">
          <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: cfg.acento }}>
            Ver convocatoria completa →
          </span>
        </div>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function Skeleton({ grande = false }: { grande?: boolean }) {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse">
      <div className={`bg-gray-200 ${grande ? 'h-48' : 'h-36'}`} />
      <div className="bg-white border border-t-0 border-gray-100 p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 bg-gray-100 rounded-full w-20" />
          <div className="h-5 bg-gray-100 rounded-full w-16" />
        </div>
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTROS
// ─────────────────────────────────────────────────────────────────────────────
const TIPOS_FILTRO: { id: string; label: string; icono: string }[] = [
  { id: 'Todas',        label: 'Todas',        icono: '🔍' },
  { id: 'Beca',         label: 'Becas',        icono: '🎓' },
  { id: 'Estímulo',     label: 'Estímulos',    icono: '⭐' },
  { id: 'Formación',    label: 'Formación',    icono: '📚' },
  { id: 'Licitación',   label: 'Licitaciones', icono: '📋' },
  { id: 'Residencia',   label: 'Residencias',  icono: '🏡' },
  { id: 'Premio',       label: 'Premios',      icono: '🏆' },
  { id: 'Concertación', label: 'Concertación', icono: '🤝' },
  { id: 'Convocatoria', label: 'Convocatorias',icono: '📢' },
];

const AMBITOS_FILTRO = ['Todos', 'Local', 'Departamental', 'Nacional'];

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function ConvocatoriasPage() {
  const [items,       setItems]       = useState<ConvocatoriaItem[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const [actualizado, setActualizado] = useState<string | null>(null);

  const [tipoFiltro,   setTipoFiltro]   = useState('Todas');
  const [ambitoFiltro, setAmbitoFiltro] = useState('Todos');
  const [busqueda,     setBusqueda]     = useState('');

  async function cargar() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/convocatorias');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.convocatorias ?? []);
      setActualizado(data.actualizadoEn ?? null);
    } catch { setError(true); }
    finally   { setLoading(false); }
  }

  useEffect(() => { cargar(); }, []);

  // ── Filtrado ────────────────────────────────────────────────────────────────
  const filtrados = items.filter(item => {
    if (tipoFiltro !== 'Todas' && item.tipo !== tipoFiltro) return false;
    if (ambitoFiltro !== 'Todos' && item.ambito !== ambitoFiltro) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      if (!item.titulo.toLowerCase().includes(q) &&
          !item.extracto.toLowerCase().includes(q) &&
          !item.entidad.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // ── Timestamp ────────────────────────────────────────────────────────────────
  const horaActualizado = actualizado
    ? (() => { const d = new Date(actualizado); return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`; })()
    : null;

  // ── Contadores por tipo (para los badges) ────────────────────────────────────
  const conteoPorTipo = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.tipo] = (acc[item.tipo] ?? 0) + 1;
    return acc;
  }, {});

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <PageLayout letter="P" letterPosition="top-right">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="inline-block px-6 py-2 bg-[#F47920]/10 rounded-full mb-5">
            <span className="text-[#F47920] text-sm tracking-widest">PORTAL DE CONVOCATORIAS</span>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl mb-3 text-[#1E2B5C]">Participa y Postula</h1>
              <p className="text-lg text-[#6B7280] max-w-2xl leading-relaxed">
                Convocatorias culturales de Manizales, Caldas y Colombia. Becas, estímulos,
                formación, licitaciones artísticas y más — actualizadas cada 2 horas.
              </p>
            </div>
            {/* Indicador live */}
            <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F47920] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F47920]" />
              </span>
              {horaActualizado ? `Actualizado ${horaActualizado}` : 'En vivo'}
              <button onClick={cargar} disabled={loading}
                className="ml-1 p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
                title="Actualizar">
                <RefreshCw className={`w-3.5 h-3.5 text-[#6B7280] ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Buscador ── */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Buscar por nombre, entidad o palabra clave..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-[#1E2B5C]
              placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#F47920] bg-white
              transition-colors duration-200"
          />
        </div>

        {/* ── Filtros por tipo — scroll horizontal en mobile ── */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {TIPOS_FILTRO.map(f => {
            const activo = tipoFiltro === f.id;
            const cfg = f.id !== 'Todas' ? getCfg(f.id as TipoConvocatoria) : null;
            const count = f.id === 'Todas' ? items.length : (conteoPorTipo[f.id] ?? 0);
            return (
              <button
                key={f.id}
                onClick={() => setTipoFiltro(f.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm
                  transition-all duration-200 ${
                  activo
                    ? 'text-white shadow-md'
                    : 'border border-gray-200 text-[#6B7280] hover:border-[#F47920]/40 hover:text-[#1E2B5C] bg-white'
                }`}
                style={activo && cfg ? {
                  background: `linear-gradient(135deg, ${cfg.acento}33, ${cfg.acento}66)`,
                  borderColor: cfg.acento,
                  color: activo ? '#1E2B5C' : undefined,
                } : activo ? { background: '#1E2B5C' } : undefined}
              >
                <span>{f.icono}</span>
                <span>{f.label}</span>
                {count > 0 && !loading && (
                  <span className={`text-xs rounded-full w-5 h-5 inline-flex items-center justify-center
                    ${activo ? 'bg-white/30' : 'bg-gray-100 text-[#6B7280]'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Filtros por ámbito ── */}
        <div className="flex gap-2 mb-8">
          {AMBITOS_FILTRO.map(a => (
            <button
              key={a}
              onClick={() => setAmbitoFiltro(a)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
                ambitoFiltro === a
                  ? 'bg-[#1E2B5C] text-white'
                  : 'border border-gray-200 text-[#6B7280] hover:border-[#1E2B5C]/30 bg-white'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* ── Contador ── */}
        {!loading && !error && (
          <p className="text-sm text-[#9CA3AF] mb-6">
            {filtrados.length === 0
              ? 'No hay resultados para esta búsqueda'
              : `${filtrados.length} convocatoria${filtrados.length !== 1 ? 's' : ''} encontrada${filtrados.length !== 1 ? 's' : ''}`}
          </p>
        )}

        {/* ── Contenido ── */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2"><Skeleton grande /></div>
            {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} />)}
          </div>

        ) : error ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-9 h-9 text-red-400" />
            </div>
            <h3 className="text-xl text-[#1E2B5C] mb-2">No se pudo cargar las convocatorias</h3>
            <p className="text-[#6B7280] text-sm mb-5">Hubo un problema al obtener la información.</p>
            <button onClick={cargar}
              className="px-5 py-2 bg-[#1E2B5C] text-white rounded-full text-sm hover:bg-[#1E2B5C]/90 transition-colors">
              Reintentar
            </button>
          </div>

        ) : filtrados.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-[#F47920]/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <Search className="w-9 h-9 text-[#F47920]" />
            </div>
            <h3 className="text-xl text-[#1E2B5C] mb-2">Sin resultados</h3>
            <p className="text-[#6B7280] text-sm mb-5">
              {busqueda ? `No encontramos convocatorias para "${busqueda}"` : 'Intenta con otros filtros.'}
            </p>
            <button onClick={() => { setTipoFiltro('Todas'); setAmbitoFiltro('Todos'); setBusqueda(''); }}
              className="px-5 py-2 bg-[#F47920] text-white rounded-full text-sm hover:bg-[#F47920]/90 transition-colors">
              Limpiar filtros
            </button>
          </div>

        ) : (
          /* ── Grilla: primera card ocupa 2 columnas ── */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtrados.map((item, i) => (
              <div key={item.id ?? i} className={i === 0 ? 'lg:col-span-2' : ''}>
                <ConvocatoriaCard item={item} grande={i === 0} />
              </div>
            ))}
          </div>
        )}

        {/* ── Banner CTA — publicar convocatoria ── */}
        {!loading && !error && (
          <div className="mt-14 rounded-2xl bg-gradient-to-r from-[#1E2B5C] to-[#2d3f8a] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <PatronSVG tipo="hexagonos" color="#ffffff" />
            </div>
            <div className="relative text-center text-white">
              <p className="text-3xl mb-3">📢 ¿Tienes una convocatoria para difundir?</p>
              <p className="text-white/70 mb-6 max-w-xl mx-auto leading-relaxed">
                Si eres una entidad, institución o colectivo cultural y quieres que tu convocatoria
                llegue a toda la comunidad cultural de Caldas, contáctanos.
              </p>
              <a
                href="/contacto"
                className="inline-block px-7 py-3 border border-white/40 text-white rounded-full text-sm
                  hover:bg-white hover:text-[#1E2B5C] transition-all duration-200"
              >
                Publicar convocatoria gratuitamente
              </a>
            </div>
          </div>
        )}

        {/* ── Footer RSS ── */}
        {!loading && !error && items.length > 0 && (
          <div className="mt-8 text-center text-xs text-[#C4C9D4] space-y-1">
            <p>Convocatorias agregadas automáticamente desde Google News, Alcaldía de Manizales y Radio Nacional</p>
            <p>Se actualizan cada 2 horas · Haz clic en cada card para ir a la fuente original</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}