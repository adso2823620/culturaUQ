'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

interface Archivo {
  id: string
  tipo: string
  titulo_archivo: string | null
  url: string
  orden: number
  capacitacion_id: string | null
}

interface Capacitacion {
  id: string
  titulo: string
  ponente: string | null
  fecha: string | null
  descripcion: string | null
  imagen_url: string | null
  activa: boolean
  capacitacion_archivos: Archivo[]
}

interface Props {
  capacitaciones: Capacitacion[]
  presentaciones: Archivo[]
  materialApoyo: Archivo[]
  bibliografia: Archivo[]
  propuestas: Archivo[]
}

const TABS = [
  { id: 'presentaciones', label: 'Presentaciones', icon: '📊', color: '#0f4c75', tipoBD: 'presentacion' },
  { id: 'material_apoyo', label: 'Material de Apoyo', icon: '📎', color: '#2a9d8f', tipoBD: 'material_apoyo' },
  { id: 'bibliografia', label: 'Bibliografía', icon: '📚', color: '#f59e0b', tipoBD: 'bibliografia' },
  { id: 'propuestas', label: 'Propuestas', icon: '💡', color: '#8b5cf6', tipoBD: 'propuesta' },
]

const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400 bg-white"

// ── Tab Capacitaciones ────────────────────────────────────────────────────────
function TabCapacitaciones({ capacitaciones }: { capacitaciones: Capacitacion[] }) {
  const router = useRouter()
  const [expandido, setExpandido] = useState<string | null>(null)
  const [showNueva, setShowNueva] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savingNueva, setSavingNueva] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [uploadingNueva, setUploadingNueva] = useState(false)

  const [edits, setEdits] = useState<Record<string, {
    titulo: string
    ponente: string
    fecha: string
    descripcion: string
    imagen_url: string
    activa: boolean
    videoTitulo: string
    videoUrl: string
  }>>({})

  const [nueva, setNueva] = useState({
    titulo: '', ponente: '', fecha: '', descripcion: '',
    videoTitulo: '', videoUrl: '', imagenUrl: '',
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function abrirEdicion(cap: Capacitacion) {
    if (expandido === cap.id) { setExpandido(null); return }
    const video = cap.capacitacion_archivos?.find(a => a.tipo === 'video')
    setEdits(prev => ({
      ...prev,
      [cap.id]: {
        titulo: cap.titulo ?? '',
        ponente: cap.ponente ?? '',
        fecha: cap.fecha ?? '',
        descripcion: cap.descripcion ?? '',
        imagen_url: cap.imagen_url ?? '',
        activa: cap.activa ?? true,
        videoTitulo: video?.titulo_archivo ?? '',
        videoUrl: video?.url ?? '',
      }
    }))
    setExpandido(cap.id)
  }

  function setField(capId: string, field: string, value: string | boolean) {
    setEdits(prev => ({ ...prev, [capId]: { ...prev[capId], [field]: value } }))
  }

  async function guardar(cap: Capacitacion) {
    const f = edits[cap.id]
    if (!f) return
    setSavingId(cap.id)
    const { error } = await supabase
      .from('capacitaciones')
      .update({
        titulo: f.titulo,
        ponente: f.ponente || null,
        fecha: f.fecha || null,
        descripcion: f.descripcion || null,
        activa: f.activa,
      })
      .eq('id', cap.id)
    if (error) { alert('Error: ' + error.message); setSavingId(null); return }

    const video = cap.capacitacion_archivos?.find(a => a.tipo === 'video')
    if (f.videoUrl) {
      if (video) {
        await supabase.from('capacitacion_archivos').update({
          titulo_archivo: f.videoTitulo || 'Grabación',
          url: f.videoUrl,
        }).eq('id', video.id)
      } else {
        await supabase.from('capacitacion_archivos').insert({
          capacitacion_id: cap.id,
          tipo: 'video',
          titulo_archivo: f.videoTitulo || 'Grabación',
          url: f.videoUrl,
          orden: 0,
        })
      }
    }
    setSavingId(null)
    setSavedId(cap.id)
    setTimeout(() => setSavedId(null), 2500)
    setExpandido(null)
    router.refresh()
  }

  async function subirImagenEdicion(capId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingId(capId)
    const ext = file.name.split('.').pop()
    const nombre = `capacitacion-${capId}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('labter-archivos').upload(nombre, file, { upsert: true })
    if (error) { alert('Error: ' + error.message); setUploadingId(null); return }
    const { data } = supabase.storage.from('labter-archivos').getPublicUrl(nombre)
    await supabase.from('capacitaciones').update({ imagen_url: data.publicUrl }).eq('id', capId)
    setField(capId, 'imagen_url', data.publicUrl)
    setUploadingId(null)
    router.refresh()
  }

  async function subirImagenNueva(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingNueva(true)
    const ext = file.name.split('.').pop()
    const nombre = `capacitacion-nueva-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('labter-archivos').upload(nombre, file, { upsert: true })
    if (error) { alert('Error subiendo imagen: ' + error.message); setUploadingNueva(false); return }
    const { data } = supabase.storage.from('labter-archivos').getPublicUrl(nombre)
    setNueva(p => ({ ...p, imagenUrl: data.publicUrl }))
    setUploadingNueva(false)
  }

  async function toggleActiva(id: string, activa: boolean) {
    setLoadingId(id)
    await supabase.from('capacitaciones').update({ activa: !activa }).eq('id', id)
    router.refresh()
    setLoadingId(null)
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta capacitación y todos sus archivos?')) return
    setLoadingId(id)
    await supabase.from('capacitaciones').delete().eq('id', id)
    router.refresh()
    setLoadingId(null)
  }

  async function crearNueva() {
    if (!nueva.titulo.trim()) { alert('El título es obligatorio'); return }
    setSavingNueva(true)
    const { data, error } = await supabase.from('capacitaciones').insert({
      titulo: nueva.titulo.trim(),
      ponente: nueva.ponente.trim() || null,
      fecha: nueva.fecha || null,
      descripcion: nueva.descripcion.trim() || null,
      imagen_url: nueva.imagenUrl || null,
      activa: true,
    }).select().single()
    if (error) { alert('Error: ' + error.message); setSavingNueva(false); return }
    if (nueva.videoUrl && data) {
      await supabase.from('capacitacion_archivos').insert({
        capacitacion_id: data.id,
        tipo: 'video',
        titulo_archivo: nueva.videoTitulo.trim() || 'Grabación',
        url: nueva.videoUrl.trim(),
        orden: 0,
      })
    }
    setNueva({ titulo: '', ponente: '', fecha: '', descripcion: '', videoTitulo: '', videoUrl: '', imagenUrl: '' })
    setShowNueva(false)
    setSavingNueva(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {!showNueva && (
        <button
          onClick={() => setShowNueva(true)}
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: '#e63947' }}
        >
          + Nueva capacitación
        </button>
      )}

      {showNueva && (
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Nueva capacitación</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
              <input className={inputClass} value={nueva.titulo} onChange={e => setNueva(p => ({ ...p, titulo: e.target.value }))} placeholder="Ej: Taller Marketing Digital" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Ponente</label>
              <input className={inputClass} value={nueva.ponente} onChange={e => setNueva(p => ({ ...p, ponente: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fecha</label>
              <input type="date" className={inputClass} value={nueva.fecha} onChange={e => setNueva(p => ({ ...p, fecha: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
              <textarea rows={2} className={inputClass} value={nueva.descripcion} onChange={e => setNueva(p => ({ ...p, descripcion: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">🎬 Título del video</label>
              <input className={inputClass} value={nueva.videoTitulo} onChange={e => setNueva(p => ({ ...p, videoTitulo: e.target.value }))} placeholder="Ej: Grabación sesión 1" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">🎬 URL de YouTube</label>
              <input className={inputClass} value={nueva.videoUrl} onChange={e => setNueva(p => ({ ...p, videoUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-2">🖼️ Imagen de portada</label>
              <input
                type="file"
                accept="image/*"
                onChange={subirImagenNueva}
                disabled={uploadingNueva}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:text-white file:cursor-pointer disabled:opacity-50"
              />
              {uploadingNueva && <p className="text-xs text-teal-600 mt-1">⏳ Subiendo imagen...</p>}
              {nueva.imagenUrl && (
                <img src={nueva.imagenUrl} alt="" className="mt-2 w-32 h-20 rounded-xl object-cover border border-gray-200" />
              )}
              <p className="text-xs text-gray-400 mt-1">Recomendado: 800x450px, JPG o PNG</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={crearNueva} disabled={savingNueva} className="px-5 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50" style={{ backgroundColor: '#2a9d8f' }}>
              {savingNueva ? 'Creando...' : '💾 Crear'}
            </button>
            <button onClick={() => setShowNueva(false)} className="px-5 py-2 rounded-xl text-sm bg-gray-200 text-gray-600">Cancelar</button>
          </div>
        </div>
      )}

      {capacitaciones.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          <p className="text-3xl mb-2">🎬</p>
          <p className="text-gray-400 text-sm">No hay capacitaciones registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {capacitaciones.map(cap => {
            const f = edits[cap.id]
            const video = cap.capacitacion_archivos?.find(a => a.tipo === 'video')
            const abierto = expandido === cap.id
            return (
              <div key={cap.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 flex items-start gap-4">
                  {cap.imagen_url ? (
                    <img src={cap.imagen_url} alt={cap.titulo} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: '#0f4c75' }}>🎬</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-800">{cap.titulo}</p>
                        <p className="text-sm text-gray-500">
                          {cap.ponente}{cap.ponente && cap.fecha ? ' · ' : ''}
                          {cap.fecha ? new Date(cap.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                        </p>
                        {video && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#e6394720', color: '#e63947' }}>
                            🎬 {video.titulo_archivo ?? 'Video'}
                          </span>
                        )}
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ backgroundColor: cap.activa ? '#2a9d8f20' : '#e6394720', color: cap.activa ? '#2a9d8f' : '#e63947' }}>
                        {cap.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <button onClick={() => abrirEdicion(cap)} className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                        {abierto ? '▲ Cerrar' : '✏️ Editar'}
                      </button>
                      <button onClick={() => toggleActiva(cap.id, cap.activa)} disabled={loadingId === cap.id} className="px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50" style={{ backgroundColor: cap.activa ? '#e63947' : '#2a9d8f' }}>
                        {loadingId === cap.id ? '...' : cap.activa ? 'Desactivar' : 'Activar'}
                      </button>
                      <button onClick={() => eliminar(cap.id)} disabled={loadingId === cap.id} className="px-4 py-2 rounded-xl text-sm font-medium bg-red-50 hover:bg-red-100 text-red-500 disabled:opacity-50">
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>

                {abierto && f && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
                        <input className={inputClass} value={f.titulo} onChange={e => setField(cap.id, 'titulo', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Ponente</label>
                        <input className={inputClass} value={f.ponente} onChange={e => setField(cap.id, 'ponente', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Fecha</label>
                        <input type="date" className={inputClass} value={f.fecha} onChange={e => setField(cap.id, 'fecha', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
                        <textarea rows={2} className={inputClass} value={f.descripcion} onChange={e => setField(cap.id, 'descripcion', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">🎬 Título del video</label>
                        <input className={inputClass} value={f.videoTitulo} onChange={e => setField(cap.id, 'videoTitulo', e.target.value)} placeholder="Ej: Grabación sesión 1" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">🎬 URL de YouTube</label>
                        <input className={inputClass} value={f.videoUrl} onChange={e => setField(cap.id, 'videoUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-2">🖼️ Imagen de portada</label>
                        <div className="flex items-center gap-4">
                          {f.imagen_url ? (
                            <img src={f.imagen_url} alt="" className="w-24 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0" />
                          ) : (
                            <div className="w-24 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: '#0f4c75' }}>🎓</div>
                          )}
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => subirImagenEdicion(cap.id, e)}
                              disabled={uploadingId === cap.id}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:text-white file:cursor-pointer disabled:opacity-50"
                            />
                            {uploadingId === cap.id && <p className="text-xs text-teal-600 mt-1">⏳ Subiendo imagen...</p>}
                            <p className="text-xs text-gray-400 mt-1">Recomendado: 800x450px, JPG o PNG</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={f.activa} onChange={e => setField(cap.id, 'activa', e.target.checked)} className="rounded" />
                          <span className="text-sm text-gray-600">Activa (visible al público)</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <button onClick={() => guardar(cap)} disabled={savingId === cap.id} className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50" style={{ backgroundColor: '#2a9d8f' }}>
                        {savingId === cap.id ? 'Guardando...' : '💾 Guardar cambios'}
                      </button>
                      <button onClick={() => setExpandido(null)} className="px-5 py-2.5 rounded-xl text-sm bg-gray-200 text-gray-600">Cancelar</button>
                      {savedId === cap.id && <span className="text-sm text-green-600 font-medium">✓ Guardado</span>}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Tab archivos independientes ───────────────────────────────────────────────
function TabArchivos({
  archivos,
  tipo,
  tipoBD,
  color,
  capacitaciones,
}: {
  archivos: Archivo[]
  tipo: string
  tipoBD: string
  color: string
  capacitaciones: Capacitacion[]
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Archivo | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [url, setUrl] = useState('')
  const [capacitacionId, setCapacitacionId] = useState<string>('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function abrirNuevo() {
    setEditando(null)
    setTitulo('')
    setUrl('')
    setCapacitacionId('')
    setShowForm(true)
  }

  function abrirEdicion(a: Archivo) {
    setEditando(a)
    setTitulo(a.titulo_archivo ?? '')
    setUrl(a.url)
    setCapacitacionId(a.capacitacion_id ?? '')
    setShowForm(true)
  }

  async function subirArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const nombreLimpio = file.name
      .replace(/\.[^/.]+$/, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)
    const nombre = `${tipoBD}-${Date.now()}-${nombreLimpio}.${ext}`
    const { error } = await supabase.storage
      .from('labter-archivos')
      .upload(nombre, file, { upsert: true })
    if (error) { alert('Error subiendo archivo: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('labter-archivos').getPublicUrl(nombre)
    setUrl(data.publicUrl)
    if (!titulo) setTitulo(file.name.replace(/\.[^/.]+$/, ''))
    setUploading(false)
  }

  async function guardar() {
    if (!titulo.trim() || !url.trim()) { alert('Título y archivo son obligatorios'); return }
    setSaving(true)
    const payload = {
      tipo: tipoBD,
      titulo_archivo: titulo.trim(),
      url: url.trim(),
      orden: 0,
      capacitacion_id: capacitacionId || null,
    }
    if (editando) {
      const { error } = await supabase
        .from('capacitacion_archivos')
        .update({ titulo_archivo: payload.titulo_archivo, url: payload.url, capacitacion_id: payload.capacitacion_id })
        .eq('id', editando.id)
      if (error) { alert('Error: ' + error.message); setSaving(false); return }
    } else {
      const { error } = await supabase
        .from('capacitacion_archivos')
        .insert(payload)
      if (error) { alert('Error: ' + error.message); setSaving(false); return }
    }
    setSaving(false)
    setShowForm(false)
    setEditando(null)
    setTitulo('')
    setUrl('')
    setCapacitacionId('')
    router.refresh()
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar este item?')) return
    setLoadingId(id)
    await supabase.from('capacitacion_archivos').delete().eq('id', id)
    router.refresh()
    setLoadingId(null)
  }

  const iconoPorTipo: Record<string, string> = {
    presentacion: '📊',
    material_apoyo: '📎',
    bibliografia: '📚',
    propuesta: '💡',
  }

  return (
    <div className="space-y-4">
      {!showForm && (
        <button
          onClick={abrirNuevo}
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: color }}
        >
          + Agregar item
        </button>
      )}

      {showForm && (
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            {editando ? 'Editar item' : 'Nuevo item'}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
              <input
                className={inputClass}
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Nombre descriptivo del recurso"
              />
            </div>

            {/* Vinculo opcional a capacitación */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Vincular a una capacitación <span className="text-gray-400">(opcional)</span>
              </label>
              <select
                className={inputClass}
                value={capacitacionId}
                onChange={e => setCapacitacionId(e.target.value)}
              >
                <option value="">— Sin vincular (item independiente) —</option>
                {capacitaciones.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.titulo}{c.ponente ? ` · ${c.ponente}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Subir archivo (PDF, PPT, DOC...)
              </label>
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx"
                onChange={subirArchivo}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:text-white file:cursor-pointer disabled:opacity-50"
              />
              {uploading && <p className="text-xs text-teal-600 mt-1">⏳ Subiendo archivo...</p>}
            </div>

            {url && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-500">
                <span>✅ Archivo listo:</span>
                <a href={url} target="_blank" rel="noreferrer" className="truncate hover:underline" style={{ color }}>
                  {url.split('/').pop()}
                </a>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={guardar}
                disabled={saving || uploading || !url}
                className="px-5 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: '#2a9d8f' }}
              >
                {saving ? 'Guardando...' : '💾 Guardar'}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditando(null); setTitulo(''); setUrl(''); setCapacitacionId('') }}
                className="px-5 py-2 rounded-xl text-sm bg-gray-200 text-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {archivos.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          <p className="text-3xl mb-2">{iconoPorTipo[tipoBD] ?? '📄'}</p>
          <p className="text-gray-400 text-sm">No hay items registrados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {archivos.map(a => {
            const capVinculada = capacitaciones.find(c => c.id === a.capacitacion_id)
            return (
              <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: color + '20', color }}
                >
                  {iconoPorTipo[a.tipo] ?? '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{a.titulo_archivo ?? 'Sin título'}</p>
                  {capVinculada && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      📎 Vinculado a: <span className="font-medium">{capVinculada.titulo}</span>
                    </p>
                  )}
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs hover:underline truncate block mt-0.5"
                    style={{ color }}
                  >
                    {a.url.split('/').pop()}
                  </a>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => abrirEdicion(a)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminar(a.id)}
                    disabled={loadingId === a.id}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-50 hover:bg-red-100 text-red-500 disabled:opacity-50"
                  >
                    {loadingId === a.id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function LabterClient({
  capacitaciones,
  presentaciones,
  materialApoyo,
  bibliografia,
  propuestas,
}: Props) {
  const [tabActivo, setTabActivo] = useState('capacitaciones')

  const tabData: Record<string, Archivo[]> = {
    presentaciones,
    material_apoyo: materialApoyo,
    bibliografia,
    propuestas,
  }

  const allTabs = [
    { id: 'capacitaciones', label: 'Capacitaciones', icon: '🎬', color: '#e63947' },
    ...TABS,
  ]

  return (
    <>
      <div className="flex gap-2 mb-6 flex-wrap">
        {allTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTabActivo(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: tabActivo === tab.id ? tab.color : '#e2e8f0',
              color: tabActivo === tab.id ? 'white' : '#475569',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {tabActivo === 'capacitaciones' && (
        <TabCapacitaciones capacitaciones={capacitaciones} />
      )}
      {tabActivo !== 'capacitaciones' && (() => {
        const tab = TABS.find(t => t.id === tabActivo)
        if (!tab) return null
        return (
          <TabArchivos
            archivos={tabData[tabActivo] ?? []}
            tipo={tabActivo}
            tipoBD={tab.tipoBD}
            color={tab.color}
            capacitaciones={capacitaciones}
          />
        )
      })()}
    </>
  )
}