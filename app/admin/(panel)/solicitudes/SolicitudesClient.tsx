'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

interface Solicitud {
  id: string
  razon_social: string
  municipio: string
  sector_cultural: string
  tipo_organizacion: string
  tipologia: string
  direccion: string
  nombre_contacto: string
  cargo_contacto: string
  telefono_1: string
  telefono_2: string
  correo: string
  whatsapp: string
  instagram: string
  facebook: string
  youtube: string
  foto_url: string
  estado: string
  creado_en: string
}

interface Props {
  solicitudes: Solicitud[]
}

const estadoColors: Record<string, string> = {
  pendiente: '#f59e0b',
  aprobado: '#2a9d8f',
  rechazado: '#e63947',
}

export default function SolicitudesClient({ solicitudes }: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<'todos' | 'pendiente' | 'aprobado' | 'rechazado'>('pendiente')
  const [detalle, setDetalle] = useState<Solicitud | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const filtradas = solicitudes.filter(s =>
    filtro === 'todos' ? true : s.estado === filtro
  )

  const conteos = {
    todos: solicitudes.length,
    pendiente: solicitudes.filter(s => s.estado === 'pendiente').length,
    aprobado: solicitudes.filter(s => s.estado === 'aprobado').length,
    rechazado: solicitudes.filter(s => s.estado === 'rechazado').length,
  }

  async function cambiarEstado(id: string, nuevoEstado: 'aprobado' | 'rechazado') {
    setLoadingId(id)
    const { error } = await supabase
      .from('solicitudes_organizacion')
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
      <div className="flex gap-2 mb-6">
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
      {filtradas.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500">No hay solicitudes {filtro !== 'todos' ? `con estado "${filtro}"` : ''}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtradas.map(s => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4"
            >
              {/* Foto / inicial */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: '#2a9d8f' }}
                >
                  {s.razon_social?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{s.razon_social}</p>
                  <p className="text-sm text-gray-500">{s.municipio} · {s.sector_cultural}</p>
                  <p className="text-xs text-gray-400">{new Date(s.creado_en).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Estado */}
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                style={{
                  backgroundColor: (estadoColors[s.estado] ?? '#94a3b8') + '20',
                  color: estadoColors[s.estado] ?? '#94a3b8',
                }}
              >
                {s.estado}
              </span>

              {/* Acciones */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setDetalle(s)}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Ver detalle
                </button>
                {s.estado === 'pendiente' && (
                  <>
                    <button
                      onClick={() => cambiarEstado(s.id, 'aprobado')}
                      disabled={loadingId === s.id}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: '#2a9d8f' }}
                    >
                      {loadingId === s.id ? '...' : '✓ Aprobar'}
                    </button>
                    <button
                      onClick={() => cambiarEstado(s.id, 'rechazado')}
                      disabled={loadingId === s.id}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: '#e63947' }}
                    >
                      {loadingId === s.id ? '...' : '✗ Rechazar'}
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg" style={{ color: '#0f4c75' }}>
                {detalle.razon_social}
              </h2>
              <button onClick={() => setDetalle(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {/* Foto */}
            {detalle.foto_url && (
              <div className="px-6 pt-4">
                <img
                  src={detalle.foto_url}
                  alt={detalle.razon_social}
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Datos */}
            <div className="p-6 space-y-3">
              {[
                { label: 'Municipio', value: detalle.municipio },
                { label: 'Sector cultural', value: detalle.sector_cultural },
                { label: 'Tipo organización', value: detalle.tipo_organizacion },
                { label: 'Tipología', value: detalle.tipologia },
                { label: 'Dirección', value: detalle.direccion },
                { label: 'Contacto', value: detalle.nombre_contacto },
                { label: 'Cargo', value: detalle.cargo_contacto },
                { label: 'Teléfono', value: detalle.telefono_1 },
                { label: 'Correo', value: detalle.correo },
                { label: 'WhatsApp', value: detalle.whatsapp },
                { label: 'Instagram', value: detalle.instagram },
                { label: 'Facebook', value: detalle.facebook },
              ].filter(f => f.value).map(field => (
                <div key={field.label} className="flex gap-3 text-sm">
                  <span className="text-gray-400 w-32 flex-shrink-0">{field.label}</span>
                  <span className="text-gray-700 font-medium">{field.value}</span>
                </div>
              ))}
            </div>

            {/* Acciones modal */}
            {detalle.estado === 'pendiente' && (
              <div className="p-6 border-t flex gap-3">
                <button
                  onClick={() => cambiarEstado(detalle.id, 'aprobado')}
                  disabled={loadingId === detalle.id}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
                  style={{ backgroundColor: '#2a9d8f' }}
                >
                  {loadingId === detalle.id ? 'Procesando...' : '✓ Aprobar organización'}
                </button>
                <button
                  onClick={() => cambiarEstado(detalle.id, 'rechazado')}
                  disabled={loadingId === detalle.id}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
                  style={{ backgroundColor: '#e63947' }}
                >
                  {loadingId === detalle.id ? 'Procesando...' : '✗ Rechazar'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}