'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

interface Evento {
  id: string
  titulo: string
  tipo_evento: string
  area_artistica: string
  descripcion: string
  fecha_inicio: string
  fecha_fin: string
  hora_inicio: string
  modalidad: string
  municipio: string
  lugar_nombre: string
  direccion: string
  enlace_acceso: string
  tipo_acceso: string
  valor_entrada: string
  num_cupos: number
  nombre_organizacion: string
  tipo_organizacion_evento: string
  nit_organizacion: string
  responsable_evento: string
  redes_sociales: string
  aliados: string
  nombre_contacto: string
  correo_contacto: string
  telefono_contacto: string
  whatsapp_contacto: string
  imagen_url: string
  texto_invitacion: string
  publicos: string[]
  medios_pago: string[]
  autoriza_datos: boolean
  autoriza_difusion: boolean
  autoriza_piezas: boolean
  estado: string
  creado_en: string
}

interface Props {
  eventos: Evento[]
}

const estadoColors: Record<string, string> = {
  pendiente: '#f59e0b',
  aprobado: '#2a9d8f',
  rechazado: '#e63947',
}

const tipoEventoLabel: Record<string, string> = {
  taller: 'Taller',
  conversatorio: 'Conversatorio',
  feria: 'Feria',
  festival: 'Festival',
  proceso_formacion: 'Proceso de formación',
  jornada_comunitaria: 'Jornada comunitaria',
  lanzamiento: 'Lanzamiento',
  seminario: 'Seminario',
  exposicion: 'Exposición',
  presentacion_artistica: 'Presentación artística',
  otro: 'Otro',
}

export default function EventosClient({ eventos }: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<'todos' | 'pendiente' | 'aprobado' | 'rechazado'>('pendiente')
  const [detalle, setDetalle] = useState<Evento | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const filtrados = eventos.filter(e =>
    filtro === 'todos' ? true : e.estado === filtro
  )

  const conteos = {
    todos: eventos.length,
    pendiente: eventos.filter(e => e.estado === 'pendiente').length,
    aprobado: eventos.filter(e => e.estado === 'aprobado').length,
    rechazado: eventos.filter(e => e.estado === 'rechazado').length,
  }

  async function cambiarEstado(id: string, nuevoEstado: 'aprobado' | 'rechazado') {
    setLoadingId(id)
    const { error } = await supabase
      .from('eventos_culturales')
      .update({ estado: nuevoEstado })
      .eq('id', id)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setDetalle(null)
      router.refresh()
    }
    setLoadingId(null)
  }

  return (
    <>
      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['todos', 'pendiente', 'aprobado', 'rechazado'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: filtro === f ? '#0f4c75' : '#e2e8f0',
              color: filtro === f ? 'white' : '#475569',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({conteos[f]})
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500">
            No hay eventos {filtro !== 'todos' ? `con estado "${filtro}"` : ''}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map(e => (
            <div
              key={e.id}
              className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {e.imagen_url ? (
                  <img
                    src={e.imagen_url}
                    alt={e.titulo}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: '#0f4c75' }}
                  >
                    🎭
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{e.titulo}</p>
                  <p className="text-sm text-gray-500">
                    {tipoEventoLabel[e.tipo_evento] ?? e.tipo_evento} · {e.municipio ?? 'Sin municipio'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {e.fecha_inicio
                      ? new Date(e.fecha_inicio).toLocaleDateString('es-CO', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })
                      : 'Sin fecha'
                    } · {e.nombre_organizacion}
                  </p>
                </div>
              </div>

              {/* Estado */}
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                style={{
                  backgroundColor: (estadoColors[e.estado] ?? '#94a3b8') + '20',
                  color: estadoColors[e.estado] ?? '#94a3b8',
                }}
              >
                {e.estado}
              </span>

              {/* Acciones */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setDetalle(e)}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Ver detalle
                </button>
                {e.estado === 'pendiente' && (
                  <>
                    <button
                      onClick={() => cambiarEstado(e.id, 'aprobado')}
                      disabled={loadingId === e.id}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: '#2a9d8f' }}
                    >
                      {loadingId === e.id ? '...' : '✓ Aprobar'}
                    </button>
                    <button
                      onClick={() => cambiarEstado(e.id, 'rechazado')}
                      disabled={loadingId === e.id}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: '#e63947' }}
                    >
                      {loadingId === e.id ? '...' : '✗ Rechazar'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal detalle */}
      {detalle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setDetalle(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-lg" style={{ color: '#0f4c75' }}>
                {detalle.titulo}
              </h2>
              <button
                onClick={() => setDetalle(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Imagen */}
            {detalle.imagen_url && (
              <div className="px-6 pt-4">
                <img
                  src={detalle.imagen_url}
                  alt={detalle.titulo}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            )}

            <div className="p-6 space-y-6">
              {/* Información del evento */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                  Información del evento
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Tipo', value: tipoEventoLabel[detalle.tipo_evento] ?? detalle.tipo_evento },
                    { label: 'Área artística', value: detalle.area_artistica },
                    { label: 'Descripción', value: detalle.descripcion },
                    { label: 'Fecha inicio', value: detalle.fecha_inicio ? new Date(detalle.fecha_inicio).toLocaleDateString('es-CO') : null },
                    { label: 'Fecha fin', value: detalle.fecha_fin ? new Date(detalle.fecha_fin).toLocaleDateString('es-CO') : null },
                    { label: 'Hora', value: detalle.hora_inicio },
                    { label: 'Modalidad', value: detalle.modalidad },
                    { label: 'Municipio', value: detalle.municipio },
                    { label: 'Lugar', value: detalle.lugar_nombre },
                    { label: 'Dirección', value: detalle.direccion },
                    { label: 'Enlace acceso', value: detalle.enlace_acceso },
                    { label: 'Tipo acceso', value: detalle.tipo_acceso },
                    { label: 'Valor entrada', value: detalle.valor_entrada },
                    { label: 'Cupos', value: detalle.num_cupos?.toString() },
                  ].filter(f => f.value).map(field => (
                    <div key={field.label} className="flex gap-3 text-sm">
                      <span className="text-gray-400 w-36 flex-shrink-0">{field.label}</span>
                      <span className="text-gray-700">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organización */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                  Organización
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Nombre', value: detalle.nombre_organizacion },
                    { label: 'Tipo', value: detalle.tipo_organizacion_evento },
                    { label: 'NIT', value: detalle.nit_organizacion },
                    { label: 'Responsable', value: detalle.responsable_evento },
                    { label: 'Aliados', value: detalle.aliados },
                    { label: 'Redes sociales', value: detalle.redes_sociales },
                  ].filter(f => f.value).map(field => (
                    <div key={field.label} className="flex gap-3 text-sm">
                      <span className="text-gray-400 w-36 flex-shrink-0">{field.label}</span>
                      <span className="text-gray-700">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                  Contacto
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Nombre', value: detalle.nombre_contacto },
                    { label: 'Correo', value: detalle.correo_contacto },
                    { label: 'Teléfono', value: detalle.telefono_contacto },
                    { label: 'WhatsApp', value: detalle.whatsapp_contacto },
                  ].filter(f => f.value).map(field => (
                    <div key={field.label} className="flex gap-3 text-sm">
                      <span className="text-gray-400 w-36 flex-shrink-0">{field.label}</span>
                      <span className="text-gray-700">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Públicos */}
              {detalle.publicos?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                    Públicos objetivo
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {detalle.publicos.map(p => (
                      <span
                        key={p}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#2a9d8f20', color: '#2a9d8f' }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Texto invitación */}
              {detalle.texto_invitacion && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                    Texto para difusión
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4">
                    {detalle.texto_invitacion}
                  </p>
                </div>
              )}
            </div>

            {/* Acciones modal */}
            {detalle.estado === 'pendiente' && (
              <div className="p-6 border-t flex gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => cambiarEstado(detalle.id, 'aprobado')}
                  disabled={loadingId === detalle.id}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
                  style={{ backgroundColor: '#2a9d8f' }}
                >
                  {loadingId === detalle.id ? 'Procesando...' : '✓ Aprobar evento'}
                </button>
                <button
                  onClick={() => cambiarEstado(detalle.id, 'rechazado')}
                  disabled={loadingId === detalle.id}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
                  style={{ backgroundColor: '#e63947' }}
                >
                  {loadingId === detalle.id ? 'Procesando...' : '✗ Rechazar evento'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}