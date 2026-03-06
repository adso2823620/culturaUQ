'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import PageLayout from '@/components/PageLayout';
import EventoModal, { type EventoDetalle } from '@/components/EventoModal';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, MapPin, Link2, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────
const MESES_LARGO = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const MESES_CORTO = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

function formatFechaCorta(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${parseInt(d)} ${MESES_CORTO[parseInt(m) - 1]} ${y}`;
}

function formatHora(time: string | null) {
  if (!time) return null;
  const [h, min] = time.split(':');
  const hora = parseInt(h);
  return `${hora % 12 || 12}:${min} ${hora >= 12 ? 'PM' : 'AM'}`;
}

function labelAcceso(tipo: string) {
  const map: Record<string, string> = {
    gratuito: 'Gratuito',
    con_costo: 'Con costo',
    aporte_voluntario: 'Aporte',
    solo_inscripcion: 'Con inscripción',
  };
  return map[tipo] ?? tipo;
}

function colorAcceso(tipo: string) {
  if (tipo === 'gratuito') return 'bg-green-500';
  if (tipo === 'con_costo') return 'bg-[#F47920]';
  return 'bg-[#3B82F6]';
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="w-full h-44 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

// ── Contenido principal ───────────────────────────────────────────────────────
function AgendaContent() {
  const searchParams = useSearchParams();

  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());       // 0-indexed
  const [anio, setAnio] = useState(hoy.getFullYear());

  const [eventos, setEventos] = useState<EventoDetalle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroArea, setFiltroArea] = useState(searchParams.get('area') ?? 'todos');
  const [filtroMunicipio, setFiltroMunicipio] = useState('todos');
  const [filtroModalidad, setFiltroModalidad] = useState('todos');
  const [soloGratis, setSoloGratis] = useState(false);

  // Modal
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoDetalle | null>(null);

  // Listas dinámicas para filtros
  const [areas, setAreas] = useState<string[]>([]);
  const [municipios, setMunicipios] = useState<string[]>([]);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchEventos() {
      setLoading(true);

      // Rango del mes seleccionado
      const primerDia = `${anio}-${String(mes + 1).padStart(2, '0')}-01`;
      const ultimoDia = new Date(anio, mes + 1, 0);
      const ultimoDiaStr = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(ultimoDia.getDate()).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('eventos_culturales')
        .select(`
          id, titulo, tipo_evento, area_artistica, descripcion,
          fecha_inicio, hora_inicio, fecha_fin, fecha_limite_inscripcion,
          modalidad, municipio, lugar_nombre, direccion, enlace_acceso,
          tipo_acceso, valor_entrada, num_cupos, medios_pago, publicos,
          nombre_organizacion, tipo_organizacion_evento, responsable_evento,
          redes_sociales, aliados, texto_invitacion, imagen_url,
          nombre_contacto, telefono_contacto, whatsapp_contacto, correo_contacto
        `)
        .eq('estado', 'aprobado')
        .eq('activo', true)
        .gte('fecha_inicio', primerDia)
        .lte('fecha_inicio', ultimoDiaStr)
        .order('fecha_inicio', { ascending: true });

      if (error) {
        console.error('Error cargando eventos:', error.message);
        setEventos([]);
      } else {
        const lista = (data ?? []) as EventoDetalle[];
        setEventos(lista);

        // Construir listas únicas para los filtros
        const areasUnicas = [...new Set(lista.map(e => e.area_artistica).filter(Boolean))] as string[];
        const municipiosUnicos = [...new Set(lista.map(e => e.municipio).filter(Boolean))] as string[];
        setAreas(areasUnicas.sort());
        setMunicipios(municipiosUnicos.sort());
      }

      setLoading(false);
    }

    fetchEventos();
  }, [mes, anio]);

  // ── Filtrado local ─────────────────────────────────────────────────────────
  const eventosFiltrados = eventos.filter(e => {
    if (filtroArea !== 'todos' && e.area_artistica !== filtroArea) return false;
    if (filtroMunicipio !== 'todos' && e.municipio !== filtroMunicipio) return false;
    if (filtroModalidad !== 'todos' && e.modalidad !== filtroModalidad) return false;
    if (soloGratis && e.tipo_acceso !== 'gratuito') return false;
    return true;
  });

  // ── Navegación de mes ──────────────────────────────────────────────────────
  function mesAnterior() {
    if (mes === 0) { setMes(11); setAnio(a => a - 1); }
    else setMes(m => m - 1);
  }
  function mesSiguiente() {
    if (mes === 11) { setMes(0); setAnio(a => a + 1); }
    else setMes(m => m + 1);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* ── Header ── */}
      <div className="mb-10">
        <div className="inline-block px-6 py-2 bg-[#F47920]/10 rounded-full mb-5">
          <span className="text-[#F47920] text-sm tracking-widest">CALDAS CULTURAL</span>
        </div>
        <h1 className="text-5xl mb-4 text-[#1E2B5C]">Agenda Cultural</h1>
        <p className="text-lg text-[#6B7280] max-w-2xl leading-relaxed">
          Eventos culturales aprobados en Caldas. Haz clic en cualquier evento para ver los detalles completos.
        </p>
      </div>

      {/* ── Barra de filtros ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#F47920]/20 p-5 mb-8">
        {/* Navegación de mes */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={mesAnterior}
            className="flex items-center gap-1 text-sm text-[#1E2B5C] hover:text-[#F47920] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F47920]/5"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <h2 className="text-xl text-[#1E2B5C] font-medium">
            {MESES_LARGO[mes]} {anio}
          </h2>
          <button
            onClick={mesSiguiente}
            className="flex items-center gap-1 text-sm text-[#1E2B5C] hover:text-[#F47920] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F47920]/5"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filtros en fila */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Área artística */}
          {areas.length > 0 && (
            <select
              value={filtroArea}
              onChange={e => setFiltroArea(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-[#1E2B5C] focus:outline-none focus:border-[#F47920] bg-white"
            >
              <option value="todos">Todas las áreas</option>
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )}

          {/* Municipio */}
          {municipios.length > 0 && (
            <select
              value={filtroMunicipio}
              onChange={e => setFiltroMunicipio(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-[#1E2B5C] focus:outline-none focus:border-[#F47920] bg-white"
            >
              <option value="todos">Todos los municipios</option>
              {municipios.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          )}

          {/* Modalidad */}
          <select
            value={filtroModalidad}
            onChange={e => setFiltroModalidad(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-[#1E2B5C] focus:outline-none focus:border-[#F47920] bg-white"
          >
            <option value="todos">Todas las modalidades</option>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
            <option value="hibrido">Híbrido</option>
          </select>

          {/* Solo gratuitos */}
          <label className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer select-none ml-auto">
            <input
              type="checkbox"
              checked={soloGratis}
              onChange={e => setSoloGratis(e.target.checked)}
              className="w-4 h-4 accent-[#F47920]"
            />
            Solo gratuitos
          </label>
        </div>
      </div>

      {/* ── Contador ── */}
      {!loading && (
        <p className="text-sm text-[#6B7280] mb-6">
          {eventosFiltrados.length === 0
            ? 'No hay eventos que coincidan con los filtros'
            : `${eventosFiltrados.length} evento${eventosFiltrados.length !== 1 ? 's' : ''} encontrado${eventosFiltrados.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* ── Grid de cards ── */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : eventosFiltrados.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map((evento) => (
            <Card
              key={evento.id}
              onClick={() => setEventoSeleccionado(evento)}
              className="border-[#F47920]/20 hover:shadow-xl hover:border-[#F47920]/40 transition-all duration-300 overflow-hidden group cursor-pointer rounded-2xl"
            >
              {/* Imagen */}
              <div className="relative h-44 overflow-hidden">
                {evento.imagen_url ? (
                  <Image
                    src={evento.imagen_url}
                    alt={evento.titulo}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1E2B5C] flex items-center justify-center">
                    <span className="text-white/20 text-6xl font-bold select-none">
                      {evento.titulo.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Badge acceso */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs text-white font-medium ${colorAcceso(evento.tipo_acceso)}`}>
                    {labelAcceso(evento.tipo_acceso)}
                  </span>
                </div>

                {/* Badge modalidad */}
                {evento.modalidad !== 'presencial' && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs text-white bg-white/20 backdrop-blur-sm border border-white/30 capitalize">
                      {evento.modalidad === 'hibrido' ? 'Híbrido' : 'Virtual'}
                    </span>
                  </div>
                )}
              </div>

              {/* Contenido */}
              <CardContent className="p-5">
                {/* Chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {evento.area_artistica && (
                    <span className="px-2 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] rounded-md text-xs">
                      {evento.area_artistica}
                    </span>
                  )}
                  {evento.tipo_evento && (
                    <span className="px-2 py-0.5 bg-[#F47920]/10 text-[#F47920] rounded-md text-xs capitalize">
                      {evento.tipo_evento.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                {/* Título */}
                <h3 className="text-base font-semibold text-[#1E2B5C] mb-2 group-hover:text-[#F47920] transition-colors line-clamp-2 leading-snug">
                  {evento.titulo}
                </h3>

                {/* Descripción */}
                {evento.descripcion && (
                  <p className="text-xs text-[#6B7280] mb-3 line-clamp-2 leading-relaxed">
                    {evento.descripcion}
                  </p>
                )}

                {/* Meta */}
                <div className="space-y-1.5 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#F47920] flex-shrink-0" />
                    {formatFechaCorta(evento.fecha_inicio)}
                    {evento.hora_inicio && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#F47920]" />
                        {formatHora(evento.hora_inicio)}
                      </span>
                    )}
                  </div>
                  {evento.modalidad !== 'virtual' && evento.municipio && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#F47920] flex-shrink-0" />
                      <span className="line-clamp-1">
                        {evento.lugar_nombre ? `${evento.lugar_nombre}, ` : ''}{evento.municipio}
                      </span>
                    </div>
                  )}
                  {evento.modalidad === 'virtual' && (
                    <div className="flex items-center gap-2">
                      <Link2 className="w-3.5 h-3.5 text-[#F47920] flex-shrink-0" />
                      <span>Evento virtual</span>
                    </div>
                  )}
                </div>

                {/* Ver más */}
                <div className="mt-4 text-[#F47920] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ver detalles completos →
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Estado vacío */
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[#F47920]/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-10 h-10 text-[#F47920]" />
          </div>
          <h3 className="text-2xl text-[#1E2B5C] mb-2">
            No hay eventos programados
          </h3>
          <p className="text-[#6B7280] mb-5">
            {eventos.length > 0
              ? 'Intenta con otros filtros.'
              : `Aún no hay eventos publicados para ${MESES_LARGO[mes]} ${anio}.`}
          </p>
          {eventos.length > 0 && (
            <button
              onClick={() => {
                setFiltroArea('todos');
                setFiltroMunicipio('todos');
                setFiltroModalidad('todos');
                setSoloGratis(false);
              }}
              className="px-5 py-2 bg-[#F47920] text-white rounded-full text-sm hover:bg-[#F47920]/90 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* ── Modal de detalle ── */}
      {eventoSeleccionado && (
        <EventoModal
          evento={eventoSeleccionado}
          onClose={() => setEventoSeleccionado(null)}
        />
      )}
    </div>
  );
}

// ── Página exportada con Suspense (requerido por useSearchParams) ─────────────
export default function AgendaCulturalPage() {
  return (
    <PageLayout letter="C" letterPosition="top-right">
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="w-full h-44 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }>
        <AgendaContent />
      </Suspense>
    </PageLayout>
  );
}