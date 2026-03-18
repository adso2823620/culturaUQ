'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  Calendar, Clock, MapPin, Link2, Users, DollarSign,
  Building2, Phone, Instagram, Youtube, Facebook, X, ExternalLink
} from 'lucide-react';

// ── Tipo del evento (subset de eventos_culturales) ──────────────────────────
export type EventoDetalle = {
  id: string;
  titulo: string;
  tipo_evento: string | null;
  area_artistica: string | null;
  descripcion: string | null;
  fecha_inicio: string;          // 'YYYY-MM-DD'
  hora_inicio: string | null;    // 'HH:MM'
  fecha_fin: string | null;
  fecha_limite_inscripcion: string | null;
  modalidad: string;             // 'presencial' | 'virtual' | 'hibrido'
  municipio: string | null;
  lugar_nombre: string | null;
  direccion: string | null;
  enlace_acceso: string | null;
  tipo_acceso: string;           // 'gratuito' | 'con_costo' | 'aporte_voluntario' | 'solo_inscripcion'
  valor_entrada: string | null;
  num_cupos: number | null;
  medios_pago: string[] | null;
  publicos: string[] | null;
  nombre_organizacion: string;
  tipo_organizacion_evento: string | null;
  responsable_evento: string | null;
  redes_sociales: string | null;
  aliados: string | null;
  texto_invitacion: string | null;
  imagen_url: string | null;
  nombre_contacto: string | null;
  telefono_contacto: string | null;
  whatsapp_contacto: string | null;
  correo_contacto: string | null;
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
               'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatFecha(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${parseInt(d)} ${MESES[parseInt(m) - 1]} ${y}`;
}

function formatHora(time: string | null) {
  if (!time) return null;
  const [h, min] = time.split(':');
  const hora = parseInt(h);
  const ampm = hora >= 12 ? 'PM' : 'AM';
  const hora12 = hora % 12 || 12;
  return `${hora12}:${min} ${ampm}`;
}

function labelAcceso(tipo: string) {
  const map: Record<string, string> = {
    gratuito: 'Gratuito',
    con_costo: 'Con costo',
    aporte_voluntario: 'Aporte voluntario',
    solo_inscripcion: 'Solo inscripción',
  };
  return map[tipo] ?? tipo;
}

function labelModalidad(m: string) {
  const map: Record<string, string> = {
    presencial: 'Presencial',
    virtual: 'Virtual',
    hibrido: 'Híbrido',
  };
  return map[m] ?? m;
}

function labelPublico(p: string) {
  const map: Record<string, string> = {
    ninez: 'Niñez', juventudes: 'Juventudes', adultos: 'Adultos',
    adultos_mayores: 'Adultos mayores', familias: 'Familias',
    comunidades_indigenas: 'Comunidades indígenas',
    comunidades_afro: 'Comunidades afro', mujeres: 'Mujeres',
    lgbtiq: 'LGBTIQ+', personas_discapacidad: 'Personas con discapacidad',
    migrantes: 'Migrantes', victimas: 'Víctimas',
    todo_publico: 'Todo público',
  };
  return map[p] ?? p;
}

// ── Componente ───────────────────────────────────────────────────────────────
interface Props {
  evento: EventoDetalle;
  onClose: () => void;
}

export default function EventoModal({ evento, onClose }: Props) {
  // Cerrar con Escape + bloquear scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 999 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Imagen de portada ── */}
        <div className="relative h-56 w-full flex-shrink-0 overflow-hidden rounded-t-2xl">
          {evento.imagen_url ? (
            <Image
              src={evento.imagen_url}
              alt={evento.titulo}
              fill
              className="object-cover"
              sizes="672px"
            />
          ) : (
            <div className="w-full h-full bg-[#2a9d8f] flex items-center justify-center">
              <span className="text-white/20 text-8xl font-bold select-none">
                {evento.titulo.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Gradiente inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a9d8f]/80 via-transparent to-transparent" />

          {/* Badge acceso */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
              evento.tipo_acceso === 'gratuito' ? 'bg-green-500' :
              evento.tipo_acceso === 'con_costo' ? 'bg-[#e63947]' :
              'bg-[#0f4c75]'
            }`}>
              {labelAcceso(evento.tipo_acceso)}
            </span>
          </div>

          {/* Badge modalidad */}
          <div className="absolute top-4 right-12">
            <span className="px-3 py-1 rounded-full text-xs bg-white/20 backdrop-blur-sm text-white border border-white/30">
              {labelModalidad(evento.modalidad)}
            </span>
          </div>

          {/* Título sobre imagen */}
          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-white text-xl font-semibold leading-snug line-clamp-2">
              {evento.titulo}
            </h2>
          </div>
        </div>

        {/* ── Botón cerrar ── */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Cuerpo del modal ── */}
        <div className="p-6 space-y-6">

          {/* Chips: área artística + tipo evento */}
          {(evento.area_artistica || evento.tipo_evento) && (
            <div className="flex flex-wrap gap-2">
              {evento.area_artistica && (
                <span className="px-3 py-1 bg-[#0f4c75]/10 text-[#0f4c75] rounded-full text-xs">
                  {evento.area_artistica}
                </span>
              )}
              {evento.tipo_evento && (
                <span className="px-3 py-1 bg-[#e63947]/10 text-[#e63947] rounded-full text-xs capitalize">
                  {evento.tipo_evento.replace(/_/g, ' ')}
                </span>
              )}
            </div>
          )}

          {/* Descripción */}
          {evento.descripcion && (
            <p className="text-[#6B7280] leading-relaxed text-sm">{evento.descripcion}</p>
          )}

          {/* ── Fecha, hora, lugar ── */}
          <div className="bg-[#e63947]/5 border border-[#e63947]/15 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#e63947] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-[#2a9d8f] font-medium">
                  {formatFecha(evento.fecha_inicio)}
                  {evento.fecha_fin && evento.fecha_fin !== evento.fecha_inicio &&
                    ` — ${formatFecha(evento.fecha_fin)}`}
                </p>
                {evento.fecha_limite_inscripcion && (
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Inscripciones hasta: {formatFecha(evento.fecha_limite_inscripcion)}
                  </p>
                )}
              </div>
            </div>

            {evento.hora_inicio && (
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#e63947] flex-shrink-0" />
                <p className="text-sm text-[#2a9d8f]">{formatHora(evento.hora_inicio)}</p>
              </div>
            )}

            {(evento.modalidad !== 'virtual') && evento.municipio && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#e63947] mt-0.5 flex-shrink-0" />
                <div>
                  {evento.lugar_nombre && (
                    <p className="text-sm text-[#2a9d8f] font-medium">{evento.lugar_nombre}</p>
                  )}
                  {evento.direccion && (
                    <p className="text-xs text-[#6B7280]">{evento.direccion}</p>
                  )}
                  <p className="text-xs text-[#6B7280]">{evento.municipio}</p>
                </div>
              </div>
            )}

            {(evento.modalidad === 'virtual' || evento.modalidad === 'hibrido') &&
              evento.enlace_acceso && (
              <div className="flex items-center gap-3">
                <Link2 className="w-4 h-4 text-[#e63947] flex-shrink-0" />
                <a
                  href={evento.enlace_acceso}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#0f4c75] hover:underline flex items-center gap-1"
                >
                  Unirse al evento <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* ── Acceso y cupos ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#2a9d8f]/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-[#2a9d8f]" />
                <span className="text-xs text-[#6B7280] uppercase tracking-wide">Acceso</span>
              </div>
              <p className="text-sm text-[#2a9d8f] font-medium">{labelAcceso(evento.tipo_acceso)}</p>
              {evento.valor_entrada && (
                <p className="text-xs text-[#6B7280] mt-0.5">{evento.valor_entrada}</p>
              )}
              {evento.medios_pago && evento.medios_pago.length > 0 && (
                <p className="text-xs text-[#6B7280] mt-1">
                  {evento.medios_pago.join(' · ')}
                </p>
              )}
            </div>

            {evento.num_cupos && (
              <div className="bg-[#2a9d8f]/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#2a9d8f]" />
                  <span className="text-xs text-[#6B7280] uppercase tracking-wide">Cupos</span>
                </div>
                <p className="text-sm text-[#2a9d8f] font-medium">{evento.num_cupos} cupos</p>
              </div>
            )}
          </div>

          {/* ── Públicos objetivo ── */}
          {evento.publicos && evento.publicos.length > 0 && (
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-2">Dirigido a</p>
              <div className="flex flex-wrap gap-2">
                {evento.publicos.map((p) => (
                  <span key={p} className="px-3 py-1 bg-[#2a9d8f]/8 text-[#2a9d8f] rounded-full text-xs border border-[#2a9d8f]/15">
                    {labelPublico(p)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Texto invitación ── */}
          {evento.texto_invitacion && (
            <div className="border-l-4 border-[#e63947] pl-4">
              <p className="text-sm text-[#6B7280] italic leading-relaxed">
                "{evento.texto_invitacion}"
              </p>
            </div>
          )}

          {/* ── Organización ── */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2a9d8f]/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-[#2a9d8f]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2a9d8f]">{evento.nombre_organizacion}</p>
                {evento.tipo_organizacion_evento && (
                  <p className="text-xs text-[#6B7280]">{evento.tipo_organizacion_evento}</p>
                )}
                {evento.responsable_evento && (
                  <p className="text-xs text-[#6B7280] mt-0.5">Responsable: {evento.responsable_evento}</p>
                )}
                {evento.aliados && (
                  <p className="text-xs text-[#6B7280] mt-0.5">Con el apoyo de: {evento.aliados}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Contacto ── */}
          {(evento.nombre_contacto || evento.telefono_contacto || evento.correo_contacto) && (
            <div className="bg-[#0f4c75]/5 border border-[#0f4c75]/15 rounded-xl p-4 space-y-2">
              <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-2">Información de contacto</p>
              {evento.nombre_contacto && (
                <p className="text-sm text-[#2a9d8f] font-medium">{evento.nombre_contacto}</p>
              )}
              {evento.telefono_contacto && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#0f4c75]" />
                  <a href={`tel:${evento.telefono_contacto}`} className="text-sm text-[#0f4c75] hover:underline">
                    {evento.telefono_contacto}
                  </a>
                </div>
              )}
              {evento.correo_contacto && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B7280]">✉</span>
                  <a href={`mailto:${evento.correo_contacto}`} className="text-sm text-[#0f4c75] hover:underline break-all">
                    {evento.correo_contacto}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ── Redes sociales ── */}
          {evento.redes_sociales && (
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-[#6B7280]">Redes:</span>
              <span className="text-sm text-[#6B7280]">{evento.redes_sociales}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
