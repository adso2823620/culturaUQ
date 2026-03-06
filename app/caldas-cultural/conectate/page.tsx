'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import EventoModal, { type EventoDetalle } from '@/components/EventoModal';
import { supabase } from '@/lib/supabase';
import { ExternalLink, RefreshCw, Calendar, MapPin, Rss } from 'lucide-react';
import type { NoticiaItem } from '@/app/api/noticias/route';

// ─────────────────────────────────────────────────────────────────────────────
// SISTEMA DE DISEÑO POR CATEGORÍA
// Cada categoría tiene: gradiente, patrón SVG decorativo y color de badge
// ─────────────────────────────────────────────────────────────────────────────

type CatConfig = {
  gradiente: string;       // clases Tailwind para bg-gradient
  badge: string;           // clases para el chip de categoría
  acento: string;          // color hex para SVG y detalles
  patron: 'circulos' | 'lineas' | 'hexagonos' | 'ondas' | 'puntos' | 'cruces' | 'triangulos' | 'rombos' | 'espiral';
};

const CATEGORIAS_CONFIG: Record<string, CatConfig> = {
  'Cultura':        { gradiente: 'from-[#1E2B5C] to-[#2d3f8a]',  badge: 'bg-blue-100 text-blue-800',    acento: '#3B82F6', patron: 'circulos'   },
  'Arte':           { gradiente: 'from-[#F47920] to-[#b85c18]',   badge: 'bg-orange-100 text-orange-800', acento: '#fbbf24', patron: 'ondas'      },
  'Patrimonio':     { gradiente: 'from-[#065F46] to-[#1E2B5C]',   badge: 'bg-emerald-100 text-emerald-800',acento: '#34d399', patron: 'hexagonos'  },
  'Música y Danza': { gradiente: 'from-[#6D28D9] to-[#1E2B5C]',   badge: 'bg-purple-100 text-purple-800', acento: '#a78bfa', patron: 'ondas'      },
  'Convocatorias':  { gradiente: 'from-[#BE185D] to-[#1E2B5C]',   badge: 'bg-pink-100 text-pink-800',     acento: '#f9a8d4', patron: 'puntos'     },
  'Escénicas':      { gradiente: 'from-[#B45309] to-[#1E2B5C]',   badge: 'bg-amber-100 text-amber-800',   acento: '#fcd34d', patron: 'lineas'     },
  'Artesanías':     { gradiente: 'from-[#0F766E] to-[#1E2B5C]',   badge: 'bg-teal-100 text-teal-800',     acento: '#5eead4', patron: 'rombos'     },
  'Festivales':     { gradiente: 'from-[#DC2626] to-[#7C3AED]',   badge: 'bg-red-100 text-red-800',       acento: '#fca5a5', patron: 'cruces'     },
  'Nacional':       { gradiente: 'from-[#374151] to-[#1E2B5C]',   badge: 'bg-gray-100 text-gray-700',     acento: '#9CA3AF', patron: 'triangulos' },
  'evento':         { gradiente: 'from-[#065F46] to-[#1E3a2a]',   badge: 'bg-emerald-100 text-emerald-800',acento: '#34d399', patron: 'circulos'   },
};

const DEFAULT_CONFIG: CatConfig = {
  gradiente: 'from-[#1E2B5C] to-[#374151]',
  badge: 'bg-gray-100 text-gray-700',
  acento: '#6B7280',
  patron: 'puntos',
};

function getConfig(cat: string): CatConfig {
  return CATEGORIAS_CONFIG[cat] ?? DEFAULT_CONFIG;
}

// ─────────────────────────────────────────────────────────────────────────────
// PATRONES SVG DECORATIVOS
// Se generan como SVG inline — cero dependencias externas
// ─────────────────────────────────────────────────────────────────────────────
function PatronSVG({ tipo, color }: { tipo: CatConfig['patron']; color: string }) {
  const op = '0.15'; // opacidad base

  const patrones: Record<CatConfig['patron'], JSX.Element> = {
    circulos: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4].map(i => [0,1,2,3].map(j => (
          <circle key={`${i}-${j}`} cx={i*60-20} cy={j*50-10} r="20"
            fill="none" stroke={color} strokeWidth="1.5" opacity={op} />
        )))}
        <circle cx="180" cy="60" r="50" fill="none" stroke={color} strokeWidth="1" opacity="0.08" />
      </svg>
    ),
    ondas: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4,5].map(i => (
          <path key={i}
            d={`M-20 ${i*22} Q60 ${i*22-15} 140 ${i*22} T300 ${i*22}`}
            fill="none" stroke={color} strokeWidth="1.5" opacity={op} />
        ))}
      </svg>
    ),
    hexagonos: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3].map(i => [0,1,2].map(j => {
          const x = i * 55 + (j % 2) * 27 - 10;
          const y = j * 48 - 10;
          const r = 20;
          const pts = Array.from({length:6}, (_,k) => {
            const a = Math.PI/180 * (60*k - 30);
            return `${x + r*Math.cos(a)},${y + r*Math.sin(a)}`;
          }).join(' ');
          return <polygon key={`${i}-${j}`} points={pts} fill="none" stroke={color} strokeWidth="1.5" opacity={op} />;
        }))}
      </svg>
    ),
    puntos: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4,5].map(i => [0,1,2,3,4].map(j => (
          <circle key={`${i}-${j}`} cx={i*45+10} cy={j*35+10} r="2.5" fill={color} opacity={op} />
        )))}
      </svg>
    ),
    lineas: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={i} x1={i*40-20} y1="0" x2={i*40+60} y2="200"
            stroke={color} strokeWidth="1.5" opacity={op} />
        ))}
      </svg>
    ),
    cruces: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4].map(i => [0,1,2,3].map(j => (
          <g key={`${i}-${j}`} transform={`translate(${i*55+15},${j*45+15})`}>
            <line x1="-8" y1="0" x2="8" y2="0" stroke={color} strokeWidth="1.5" opacity={op} />
            <line x1="0" y1="-8" x2="0" y2="8" stroke={color} strokeWidth="1.5" opacity={op} />
          </g>
        )))}
      </svg>
    ),
    triangulos: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4].map(i => [0,1,2,3].map(j => {
          const x = i*55 + (j%2)*22 - 5;
          const y = j*45 - 5;
          return (
            <polygon key={`${i}-${j}`}
              points={`${x},${y+24} ${x+14},${y} ${x+28},${y+24}`}
              fill="none" stroke={color} strokeWidth="1.5" opacity={op} />
          );
        }))}
      </svg>
    ),
    rombos: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4].map(i => [0,1,2,3].map(j => {
          const x = i*55 + (j%2)*25 + 5;
          const y = j*45 + 10;
          return (
            <polygon key={`${i}-${j}`}
              points={`${x},${y-14} ${x+10},${y} ${x},${y+14} ${x-10},${y}`}
              fill="none" stroke={color} strokeWidth="1.5" opacity={op} />
          );
        }))}
      </svg>
    ),
    espiral: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[30,55,80,105].map(r => (
          <circle key={r} cx="150" cy="80" r={r}
            fill="none" stroke={color} strokeWidth="1" opacity={op} strokeDasharray="4 6" />
        ))}
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
// LETRA GIGANTE DECORATIVA (inicial del título)
// ─────────────────────────────────────────────────────────────────────────────
function LetraGigante({ texto, color }: { texto: string; color: string }) {
  const letra = texto.charAt(0).toUpperCase();
  return (
    <div
      className="absolute -right-4 -bottom-6 text-[120px] font-black leading-none select-none pointer-events-none"
      style={{ color, opacity: 0.12 }}
    >
      {letra}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD DE NOTICIA — diseño editorial sin imagen
// ─────────────────────────────────────────────────────────────────────────────
function NoticiaCard({ noticia, size = 'normal' }: { noticia: NoticiaItem; size?: 'normal' | 'grande' }) {
  const cfg = getConfig(noticia.categoria);
  const esGrande = size === 'grande';

  return (
    <a
      href={noticia.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${esGrande ? 'min-h-[320px]' : ''}`}
    >
      {/* Cabecera con gradiente + patrón */}
      <div className={`relative bg-gradient-to-br ${cfg.gradiente} overflow-hidden ${esGrande ? 'h-52' : 'h-36'}`}>
        <PatronSVG tipo={cfg.patron} color={cfg.acento} />
        <LetraGigante texto={noticia.titulo} color={cfg.acento} />

        {/* Fuente arriba izquierda */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5">
          <Rss className="w-3 h-3" style={{ color: cfg.acento }} />
          <span className="text-white/70 text-xs font-medium tracking-wide">
            {noticia.fuente}
          </span>
        </div>

        {/* Fecha abajo derecha */}
        <div className="absolute bottom-4 right-4">
          <span className="text-white/50 text-xs">{noticia.fechaLegible}</span>
        </div>

        {/* Ícono externo hover */}
        <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm
          flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ExternalLink className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Cuerpo */}
      <div className="bg-white border border-t-0 border-gray-100 group-hover:border-gray-200
        transition-colors duration-300 p-5 rounded-b-2xl flex flex-col gap-3">

        {/* Badge categoría */}
        <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
          {noticia.categoria}
        </span>

        {/* Título */}
        <h3 className={`font-semibold text-[#1E2B5C] leading-snug line-clamp-2
          group-hover:text-[#F47920] transition-colors duration-200
          ${esGrande ? 'text-lg' : 'text-sm'}`}>
          {noticia.titulo}
        </h3>

        {/* Extracto — solo en cards grandes o si hay espacio */}
        {(esGrande || noticia.extracto.length > 20) && (
          <p className={`text-[#6B7280] leading-relaxed ${esGrande ? 'line-clamp-3 text-sm' : 'line-clamp-2 text-xs'}`}>
            {noticia.extracto}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-1 text-xs flex items-center gap-1"
          style={{ color: cfg.acento, opacity: 0 }}
          // Tailwind no soporta opacity condicional en group-hover para colores custom,
          // así que usamos style + clase adicional vía JS
        >
        </div>
        <span className={`text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
          style={{ color: cfg.acento }}>
          Leer nota completa →
        </span>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD DE EVENTO PRÓXIMO
// ─────────────────────────────────────────────────────────────────────────────
const MESES_CORTO = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

function EventoCard({ evento, onOpen }: { evento: EventoDetalle; onOpen: () => void }) {
  const cfg = getConfig('evento');
  const [y, m, d] = evento.fecha_inicio.split('-');
  const fechaLeg = `${parseInt(d)} ${MESES_CORTO[parseInt(m)-1]} ${y}`;

  return (
    <button onClick={onOpen} className="group block text-left w-full h-full rounded-2xl overflow-hidden
      transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* Cabecera */}
      <div className={`relative bg-gradient-to-br ${cfg.gradiente} overflow-hidden h-36`}>
        <PatronSVG tipo={cfg.patron} color={cfg.acento} />
        <LetraGigante texto={evento.titulo} color={cfg.acento} />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs text-white bg-emerald-500 font-semibold">
            Evento próximo
          </span>
          {evento.tipo_acceso === 'gratuito' && (
            <span className="px-2.5 py-1 rounded-full text-xs text-white bg-white/15 border border-white/25 backdrop-blur-sm">
              Gratis
            </span>
          )}
        </div>

        <div className="absolute bottom-4 right-4">
          <span className="text-white/50 text-xs">{fechaLeg}</span>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="bg-white border border-t-0 border-emerald-100 group-hover:border-emerald-200
        transition-colors duration-300 p-5 rounded-b-2xl flex flex-col gap-3">

        <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
          {evento.area_artistica ?? 'Evento cultural'}
        </span>

        <h3 className="text-sm font-semibold text-[#1E2B5C] line-clamp-2 leading-snug
          group-hover:text-emerald-700 transition-colors duration-200">
          {evento.titulo}
        </h3>

        {evento.descripcion && (
          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
            {evento.descripcion}
          </p>
        )}

        <div className="space-y-1 text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            {fechaLeg}
          </div>
          {evento.municipio && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              {evento.lugar_nombre ? `${evento.lugar_nombre}, ` : ''}{evento.municipio}
            </div>
          )}
        </div>

        <span className="text-xs font-medium text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Ver detalles →
        </span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function Skeleton({ grande = false }: { grande?: boolean }) {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse">
      <div className={`bg-gray-200 ${grande ? 'h-52' : 'h-36'}`} />
      <div className="bg-white border border-t-0 border-gray-100 p-5 space-y-3">
        <div className="h-3 bg-gray-100 rounded-full w-1/4" />
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
const FILTROS_DISPONIBLES = [
  'Todas', 'Cultura', 'Arte', 'Patrimonio', 'Música y Danza',
  'Convocatorias', 'Escénicas', 'Artesanías', 'Festivales', 'Nacional', 'Eventos',
];

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function ConectatePage() {
  const [noticias,    setNoticias]    = useState<NoticiaItem[]>([]);
  const [eventos,     setEventos]     = useState<EventoDetalle[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const [actualizado, setActualizado] = useState<string | null>(null);
  const [filtro,      setFiltro]      = useState('Todas');
  const [eventoModal, setEventoModal] = useState<EventoDetalle | null>(null);

  async function cargar() {
    setLoading(true);
    setError(false);
    try {
      const [resN, resE] = await Promise.allSettled([
        fetch('/api/noticias').then(r => r.json()),
        supabase
          .from('eventos_culturales')
          .select(`id, titulo, tipo_evento, area_artistica, descripcion,
            fecha_inicio, hora_inicio, fecha_fin, fecha_limite_inscripcion,
            modalidad, municipio, lugar_nombre, direccion, enlace_acceso,
            tipo_acceso, valor_entrada, num_cupos, medios_pago, publicos,
            nombre_organizacion, tipo_organizacion_evento, responsable_evento,
            redes_sociales, aliados, texto_invitacion, imagen_url,
            nombre_contacto, telefono_contacto, whatsapp_contacto, correo_contacto`)
          .eq('estado', 'aprobado')
          .eq('activo', true)
          .gte('fecha_inicio', new Date().toISOString().split('T')[0])
          .order('fecha_inicio', { ascending: true })
          .limit(4),
      ]);

      if (resN.status === 'fulfilled') {
        setNoticias(resN.value.noticias ?? []);
        setActualizado(resN.value.actualizadoEn ?? null);
      } else { setError(true); }

      if (resE.status === 'fulfilled' && !resE.value.error) {
        setEventos((resE.value.data ?? []) as EventoDetalle[]);
      }
    } catch { setError(true); }
    finally   { setLoading(false); }
  }

  useEffect(() => { cargar(); }, []);

  // ── Filtrado ──────────────────────────────────────────────────────────────
  const notsFiltradas = filtro === 'Todas'   ? noticias
    : filtro === 'Eventos'                   ? []
    : noticias.filter(n => n.categoria === filtro);

  const evsFiltrados = (filtro === 'Todas' || filtro === 'Eventos') ? eventos : [];

  // ── Layout en mosaico: primera noticia grande, resto normales, eventos intercalados ──
  type ItemGrilla =
    | { tipo: 'noticia'; data: NoticiaItem; size: 'grande' | 'normal' }
    | { tipo: 'evento';  data: EventoDetalle };

  const grilla: ItemGrilla[] = [];
  notsFiltradas.forEach((n, i) => {
    grilla.push({ tipo: 'noticia', data: n, size: i === 0 && filtro === 'Todas' ? 'grande' : 'normal' });
    // intercalar un evento cada 5 noticias
    if ((i + 1) % 5 === 0 && evsFiltrados[Math.floor(i / 5)]) {
      grilla.push({ tipo: 'evento', data: evsFiltrados[Math.floor(i / 5)] });
    }
  });
  evsFiltrados.slice(Math.ceil(notsFiltradas.length / 5)).forEach(e => {
    grilla.push({ tipo: 'evento', data: e });
  });

  // ── Timestamp ─────────────────────────────────────────────────────────────
  const horaActualizado = actualizado
    ? (() => { const d = new Date(actualizado); return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`; })()
    : null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <PageLayout letter="C" letterPosition="top-right">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="inline-block px-6 py-2 bg-[#3B82F6]/10 rounded-full mb-5">
            <span className="text-[#3B82F6] text-sm tracking-widest">CALDAS CULTURAL</span>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl mb-3 text-[#1E2B5C]">Conéctate</h1>
              <p className="text-lg text-[#6B7280] max-w-2xl leading-relaxed">
                Lo que está pasando en el sector cultural de Caldas y Colombia, actualizado cada hora.
              </p>
            </div>
            {/* Indicador live */}
            <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {horaActualizado ? `Actualizado ${horaActualizado}` : 'En vivo'}
              <button
                onClick={cargar}
                disabled={loading}
                className="ml-1 p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
                title="Actualizar"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#6B7280] ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Barra de filtros con scroll horizontal en mobile ── */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {FILTROS_DISPONIBLES.map(cat => {
            const isActive = filtro === cat;
            const cfg = cat !== 'Todas' && cat !== 'Eventos' ? getConfig(cat) : null;
            return (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'border border-gray-200 text-[#6B7280] hover:border-[#1E2B5C]/40 hover:text-[#1E2B5C] bg-white'
                }`}
                style={isActive && cfg ? { background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` } : undefined}
              >
                <span className={isActive ? '' : ''}>
                  {/* Para los activos con gradiente usamos clases directas */}
                  {isActive && cfg ? (
                    <span className={`bg-gradient-to-r ${cfg.gradiente} bg-clip-text`}
                      style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: isActive ? 'white' : 'initial' }}>
                      {cat}
                    </span>
                  ) : (
                    <>
                      {cat}
                      {cat === 'Eventos' && eventos.length > 0 && (
                        <span className="ml-1.5 bg-emerald-500 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                          {eventos.length}
                        </span>
                      )}
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Contenido ── */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="md:col-span-2 lg:col-span-1"><Skeleton grande /></div>
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
          </div>

        ) : error ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Rss className="w-9 h-9 text-red-400" />
            </div>
            <h3 className="text-xl text-[#1E2B5C] mb-2">No se pudo cargar el contenido</h3>
            <p className="text-[#6B7280] text-sm mb-5">Hubo un problema al obtener las noticias.</p>
            <button onClick={cargar}
              className="px-5 py-2 bg-[#1E2B5C] text-white rounded-full text-sm hover:bg-[#1E2B5C]/90 transition-colors">
              Reintentar
            </button>
          </div>

        ) : grilla.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-[#3B82F6]/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <Rss className="w-9 h-9 text-[#3B82F6]" />
            </div>
            <h3 className="text-xl text-[#1E2B5C] mb-2">Sin resultados en esta categoría</h3>
            <button onClick={() => setFiltro('Todas')}
              className="mt-3 px-5 py-2 bg-[#3B82F6] text-white rounded-full text-sm hover:bg-[#3B82F6]/90 transition-colors">
              Ver todo
            </button>
          </div>

        ) : (
          // ── Grilla dinámica ──
          // La primera noticia ocupa 2 columnas en md si es "grande"
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {grilla.map((item, i) => {
              const esGrandeCard = item.tipo === 'noticia' && item.size === 'grande';
              return (
                <div key={i} className={esGrandeCard ? 'lg:col-span-2' : ''}>
                  {item.tipo === 'noticia'
                    ? <NoticiaCard noticia={item.data} size={item.size} />
                    : <EventoCard evento={item.data} onOpen={() => setEventoModal(item.data)} />
                  }
                </div>
              );
            })}
          </div>
        )}

        {/* ── Footer informativo ── */}
        {!loading && !error && noticias.length > 0 && (
          <div className="mt-14 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
              <Rss className="w-3.5 h-3.5" />
              <span>Contenido agregado automáticamente desde Google News y Radio Nacional · Se actualiza cada hora</span>
            </div>
            <p className="text-xs text-[#C4C9D4]">
              Las noticias son de medios externos. Haz clic para leer la nota completa en su fuente original.
            </p>
          </div>
        )}
      </div>

      {/* ── Modal evento ── */}
      {eventoModal && (
        <EventoModal evento={eventoModal} onClose={() => setEventoModal(null)} />
      )}
    </PageLayout>
  );
}