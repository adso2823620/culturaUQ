'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Org {
  id: string
  razon_social: string
  municipio: string
  sector_cultural: string
  tipo_organizacion: string
  foto_url: string | null
  activa: boolean
  verificada: boolean
  creado_en: string
}

interface Props {
  organizaciones: Org[]
  totalPaginas: number
  paginaActual: number
  busquedaInicial: string
  estadoInicial: string
  total: number
}

export default function OrganizacionesClient({
  organizaciones,
  totalPaginas,
  paginaActual,
  busquedaInicial,
  estadoInicial,
  total,
}: Props) {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState(busquedaInicial)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function navegarCon(params: Record<string, string>) {
    const url = new URLSearchParams({
      busqueda: busquedaInicial,
      estado: estadoInicial,
      pagina: '1',
      ...params,
    })
    router.push(`/admin/organizaciones?${url.toString()}`)
  }

  function handleBusqueda(e: React.FormEvent) {
    e.preventDefault()
    navegarCon({ busqueda, pagina: '1' })
  }

  async function toggleActiva(id: string, activa: boolean) {
    setLoadingId(id)
    const { error } = await supabase
      .from('organizaciones_culturales')
      .update({ activa: !activa })
      .eq('id', id)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      router.refresh()
    }
    setLoadingId(null)
  }

  return (
    <>
      {/* Barra búsqueda + filtros */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleBusqueda} className="flex gap-2 flex-1 min-w-0">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="flex-1 min-w-0 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none"
            style={{ borderColor: '#e2e8f0' }}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-sm font-medium text-white flex-shrink-0"
            style={{ backgroundColor: '#0f4c75' }}
          >
            Buscar
          </button>
          {busquedaInicial && (
            <button
              type="button"
              onClick={() => { setBusqueda(''); navegarCon({ busqueda: '', pagina: '1' }) }}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 flex-shrink-0"
            >
              Limpiar
            </button>
          )}
        </form>

        {/* Filtro estado */}
        <div className="flex gap-2 flex-shrink-0">
          {(['todos', 'activas', 'inactivas'] as const).map(f => (
            <button
              key={f}
              onClick={() => navegarCon({ estado: f, pagina: '1' })}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: estadoInicial === f ? '#0f4c75' : '#e2e8f0',
                color: estadoInicial === f ? 'white' : '#475569',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Contador */}
      <p className="text-sm text-gray-400 mb-4">
        {total} resultado{total !== 1 ? 's' : ''} · página {paginaActual} de {totalPaginas}
      </p>

      {/* Lista */}
      <div className="space-y-3 mb-6">
        {organizaciones.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500">No se encontraron organizaciones</p>
          </div>
        ) : (
          organizaciones.map(o => (
            <div
              key={o.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
            >
              {/* Foto / inicial */}
              {o.foto_url ? (
                <img
                  src={o.foto_url}
                  alt={o.razon_social}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: '#2a9d8f' }}
                >
                  {o.razon_social?.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{o.razon_social}</p>
                <p className="text-sm text-gray-500 truncate">
                  {o.municipio} · {o.sector_cultural}
                </p>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {o.verificada && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    ✓ Verificada
                  </span>
                )}
                <span
                  className="px-2 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: o.activa ? '#2a9d8f20' : '#e6394720',
                    color: o.activa ? '#2a9d8f' : '#e63947',
                  }}
                >
                  {o.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/organizaciones/${o.id}`}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  ✏️ Editar
                </Link>
                <button
                  onClick={() => toggleActiva(o.id, o.activa)}
                  disabled={loadingId === o.id}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: o.activa ? '#e63947' : '#2a9d8f' }}
                >
                  {loadingId === o.id ? '...' : o.activa ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => navegarCon({ pagina: String(paginaActual - 1) })}
            disabled={paginaActual === 1}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-white shadow-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            ← Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPaginas || Math.abs(p - paginaActual) <= 2)
            .reduce<(number | '...')[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
              acc.push(p)
              return acc
            }, [])
            .map((p, idx) =>
              p === '...' ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-400">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => navegarCon({ pagina: String(p) })}
                  className="w-10 h-10 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: paginaActual === p ? '#0f4c75' : 'white',
                    color: paginaActual === p ? 'white' : '#475569',
                  }}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => navegarCon({ pagina: String(paginaActual + 1) })}
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-white shadow-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </>
  )
}