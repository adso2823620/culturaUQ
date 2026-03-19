'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

interface Org {
  id: string
  razon_social: string
  nit: string
  municipio: string
  sector_cultural: string
  tipo_organizacion: string
  tipologia: string
  direccion: string
  comuna_corregimiento: string
  latitud: number
  longitud: number
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
  activa: boolean
  verificada: boolean
  anio_creacion: number
  nombre_representante: string
  documento_representante: string
  telefono_representante: string
  legalmente_constituida: string
  fecha_matricula: string
  ultimo_anio_renovacion: number
  numero_integrantes: string
  tiene_junta_directiva: string
  tiene_estatutos: string
  actividades_culturales: string
  territorios: string
  descripcion_servicios: string
  herramientas_digitales: string
  experiencia_contratacion: string
  tipo_experiencia: string
  instancia_participacion: string
  escala_incidencia: string
  nombre_resguardo: string
  ciiu_1: string
  ciiu_2: string
  ciiu_3: string
  campo_1: string
  campo_2: string
  campo_3: string
  campo_4: string
  poblacion_1: string
  poblacion_2: string
  poblacion_3: string
  poblacion_4: string
  hace_parte_red: string
  nombre_red: string
  interesada_articularse: string
  ha_participado_formacion: string
  temas_formacion: string
}

const SECCIONES = [
  { id: 'identidad', label: 'Identidad', icon: '🏛️' },
  { id: 'ubicacion', label: 'Ubicación', icon: '📍' },
  { id: 'contacto', label: 'Contacto', icon: '📞' },
  { id: 'redes', label: 'Redes sociales', icon: '🌐' },
  { id: 'representante', label: 'Representante', icon: '👤' },
  { id: 'estructura', label: 'Estructura legal', icon: '📄' },
  { id: 'actividad', label: 'Actividad cultural', icon: '🎭' },
  { id: 'clasificacion', label: 'Clasificación', icon: '📊' },
  { id: 'participacion', label: 'Participación', icon: '🤝' },
  { id: 'formacion', label: 'Formación', icon: '📚' },
  { id: 'foto', label: 'Foto', icon: '📸' },
]

const SECTORES = [
  'Música', 'Teatro', 'Danza', 'Artesanías', 'Patrimonio',
  'Audiovisual', 'Artes Visuales', 'Cultural y Social', 'Educativo', 'Comunitario',
]

const MUNICIPIOS = [
  'Manizales', 'Villamaría', 'Chinchiná', 'Palestina', 'Neira',
  'Anserma', 'Riosucio', 'Supía', 'La Dorada', 'Victoria',
  'Manzanares', 'Marquetalia', 'Pensilvania', 'Salamina',
]

interface Props { org: Org }

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400 bg-white"
const selectClass = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400 bg-white"

export default function EditarOrgClient({ org }: Props) {
  const router = useRouter()
  const [seccionActiva, setSeccionActiva] = useState('identidad')
  const [form, setForm] = useState<Org>(org ?? {} as Org)
  const [saving, setSaving] = useState(false)
  const [savedSection, setSavedSection] = useState<string | null>(null)
  const [uploadingFoto, setUploadingFoto] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  if (!org) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Organización no encontrada</p>
      </div>
    )
  }

  function set(field: keyof Org, value: string | number | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function guardarSeccion(campos: (keyof Org)[]) {
    setSaving(true)
    const payload = Object.fromEntries(campos.map(c => [c, form[c]]))
    const { error } = await supabase
      .from('organizaciones_culturales')
      .update(payload)
      .eq('id', org.id)

    if (error) {
      alert('Error al guardar: ' + error.message)
    } else {
      setSavedSection(seccionActiva)
      setTimeout(() => setSavedSection(null), 2500)
    }
    setSaving(false)
  }

  async function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFoto(true)

    const ext = file.name.split('.').pop()
    const nombre = `org-${org.id}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('organizaciones-fotos')
      .upload(nombre, file, { upsert: true })

    if (uploadError) {
      alert('Error subiendo foto: ' + uploadError.message)
      setUploadingFoto(false)
      return
    }

    const { data } = supabase.storage
      .from('organizaciones-fotos')
      .getPublicUrl(nombre)

    const fotoUrl = data.publicUrl
    set('foto_url', fotoUrl)

    const { error } = await supabase
      .from('organizaciones_culturales')
      .update({ foto_url: fotoUrl })
      .eq('id', org.id)

    if (error) {
      alert('Error guardando URL: ' + error.message)
    } else {
      setSavedSection('foto')
      setTimeout(() => setSavedSection(null), 2500)
    }
    setUploadingFoto(false)
  }

  function BtnGuardar({ campos }: { campos: (keyof Org)[] }) {
    return (
      <div className="flex items-center gap-3 mt-6 pt-6 border-t">
        <button
          onClick={() => guardarSeccion(campos)}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-opacity"
          style={{ backgroundColor: '#2a9d8f' }}
        >
          {saving ? 'Guardando...' : '💾 Guardar sección'}
        </button>
        {savedSection === seccionActiva && (
          <span className="text-sm text-green-600 font-medium">✓ Guardado correctamente</span>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/organizaciones')}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Volver
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#0f4c75' }}>
            {form.razon_social}
          </h1>
          <p className="text-gray-400 text-sm">{form.municipio}</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar secciones */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-3 sticky top-6">
            {SECCIONES.map(s => (
              <button
                key={s.id}
                onClick={() => setSeccionActiva(s.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left mb-1"
                style={{
                  backgroundColor: seccionActiva === s.id ? '#0f4c75' : 'transparent',
                  color: seccionActiva === s.id ? 'white' : '#64748b',
                }}
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido sección */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm p-6">

          {/* IDENTIDAD */}
          {seccionActiva === 'identidad' && (
            <div>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#0f4c75' }}>🏛️ Identidad básica</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Campo label="Razón social">
                    <input className={inputClass} value={form.razon_social ?? ''} onChange={e => set('razon_social', e.target.value)} />
                  </Campo>
                </div>
                <Campo label="NIT">
                  <input className={inputClass} value={form.nit ?? ''} onChange={e => set('nit', e.target.value)} />
                </Campo>
                <Campo label="Año de creación">
                  <input type="number" className={inputClass} value={form.anio_creacion ?? ''} onChange={e => set('anio_creacion', parseInt(e.target.value))} />
                </Campo>
                <Campo label="Sector cultural">
                  <select className={selectClass} value={form.sector_cultural ?? ''} onChange={e => set('sector_cultural', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Campo>
                <Campo label="Tipo de organización">
                  <input className={inputClass} value={form.tipo_organizacion ?? ''} onChange={e => set('tipo_organizacion', e.target.value)} />
                </Campo>
                <Campo label="Tipología">
                  <input className={inputClass} value={form.tipologia ?? ''} onChange={e => set('tipologia', e.target.value)} />
                </Campo>
                <Campo label="Legalmente constituida">
                  <select className={selectClass} value={form.legalmente_constituida ?? ''} onChange={e => set('legalmente_constituida', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="SI">Sí</option>
                    <option value="NO">No</option>
                    <option value="EN PROCESO">En proceso</option>
                  </select>
                </Campo>
                <div className="col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.activa ?? false} onChange={e => set('activa', e.target.checked)} className="rounded" />
                    <span className="text-sm text-gray-600">Organización activa</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.verificada ?? false} onChange={e => set('verificada', e.target.checked)} className="rounded" />
                    <span className="text-sm text-gray-600">Verificada</span>
                  </label>
                </div>
              </div>
              <BtnGuardar campos={['razon_social', 'nit', 'anio_creacion', 'sector_cultural', 'tipo_organizacion', 'tipologia', 'legalmente_constituida', 'activa', 'verificada']} />
            </div>
          )}

          {/* UBICACIÓN */}
          {seccionActiva === 'ubicacion' && (
            <div>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#0f4c75' }}>📍 Ubicación</h2>
              <div className="grid grid-cols-2 gap-4">
                <Campo label="Municipio">
                  <select className={selectClass} value={form.municipio ?? ''} onChange={e => set('municipio', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Campo>
                <Campo label="Comuna / Corregimiento">
                  <input className={inputClass} value={form.comuna_corregimiento ?? ''} onChange={e => set('comuna_corregimiento', e.target.value)} />
                </Campo>
                <div className="col-span-2">
                  <Campo label="Dirección">
                    <input className={inputClass} value={form.direccion ?? ''} onChange={e => set('direccion', e.target.value)} />
                  </Campo>
                </div>
                <Campo label="Latitud">
                  <input type="number" step="any" className={inputClass} value={form.latitud ?? ''} onChange={e => set('latitud', parseFloat(e.target.value))} />
                </Campo>
                <Campo label="Longitud">
                  <input type="number" step="any" className={inputClass} value={form.longitud ?? ''} onChange={e => set('longitud', parseFloat(e.target.value))} />
                </Campo>
              </div>
              <BtnGuardar campos={['municipio', 'comuna_corregimiento', 'direccion', 'latitud', 'longitud']} />
            </div>
          )}

          {/* CONTACTO */}
          {seccionActiva === 'contacto' && (
            <div>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#0f4c75' }}>📞 Contacto</h2>
              <div className="grid grid-cols-2 gap-4">
                <Campo label="Nombre de contacto">
                  <input className={inputClass} value={form.nombre_contacto ?? ''} onChange={e => set('nombre_contacto', e.target.value)} />
                </Campo>
                <Campo label="Cargo">
                  <input className={inputClass} value={form.cargo_contacto ?? ''} onChange={e => set('cargo_contacto', e.target.value)} />
                </Campo>
                <Campo label="Teléfono 1">
                  <input className={inputClass} value={form.telefono_1 ?? ''} onChange={e => set('telefono_1', e.target.value)} />
                </Campo>
                <Campo label="Teléfono 2">
                  <input className={inputClass} value={form.telefono_2 ?? ''} onChange={e => set('telefono_2', e.target.value)} />
                </Campo>
                <Campo label="Correo electrónico">
                  <input type="email" className={inputClass} value={form.correo ?? ''} onChange={e => set('correo', e.target.value)} />
                </Campo>
                <Campo label="WhatsApp">
                  <input className={inputClass} value={form.whatsapp ?? ''} onChange={e => set('whatsapp', e.target.value)} />
                </Campo>
              </div>
              <BtnGuardar campos={['nombre_contacto', 'cargo_contacto', 'telefono_1', 'telefono_2', 'correo', 'whatsapp']} />
            </div>
          )}

          {/* REDES */}
          {seccionActiva === 'redes' && (
            <div>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#0f4c75' }}>🌐 Redes sociales</h2>
              <div className="grid grid-cols-1 gap-4">
                <Campo label="Instagram (URL completa)">
                  <input className={inputClass} value={form.instagram ?? ''} onChange={e => set('instagram', e.target.value)} placeholder="https://instagram.com/..." />
                </Campo>
                <Campo label="Facebook (URL completa)">
                  <input className={inputClass} value={form.facebook ?? ''} onChange={e => set('facebook', e.target.value)} placeholder="https://facebook.com/..." />
                </Campo>
                <Campo label="YouTube (URL completa)">
                  <input className={inputClass} value={form.youtube ?? ''} onChange={e => set('youtube', e.target.value)} placeholder="https://youtube.com/..." />
                </Campo>
              </div>
              <BtnGuardar campos={['instagram', 'facebook', 'youtube']} />
            </div>
          )}

          {/* REPRESENTANTE */}
          {seccionActiva === 'representante' && (
            <div>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#0f4c75' }}>👤 Representante legal</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Campo label="Nombre del representante legal">
                    <input className={inputClass} value={form.nombre_representante ?? ''} onChange={e => set('nombre_representante', e.target.value)} />
                  </Campo>
                </div>
                <Campo label="Documento de identidad">
                  <input className={inputClass} value={form.documento_representante ?? ''} onChange={e => set('documento_representante', e.target.value)} />
                </Campo>
                <Campo label="Teléfono del representante">
                  <input className={inputClass} value={form.telefono_representante ?? ''} onChange={e => set('telefono_representante', e.target.value)} />
                </Campo>
              </div>
              <BtnGuardar campos={['nombre_representante', 'documento_representante', 'telefono_representante']} />
            </div>
          )}

          {/* ESTRUCTURA LEGAL */}
          {seccionActiva === 'estructura' && (
            <div>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#0f4c75' }}>📄 Estructura legal</h2>
              <div className="grid grid-cols-2 gap-4">
                <Campo label="Fecha de matrícula">
                  <input className={inputClass} value={form.fecha_matricula ?? ''} onChange={e => set('fecha_matricula', e.target.value)} />
                </Campo>
                <Campo label="Último año de renovación">
                  <input type="number" className={inputClass} value={form.ultimo_anio_renovacion ?? ''} onChange={e => set('ultimo_anio_renovacion', parseInt(e.target.value))} />
                </Campo>
                <Campo label="Número de integrantes">
                  <input className={inputClass} value={form.numero_integrantes ?? ''} onChange={e => set('numero_integrantes', e.target.value)} />
                </Campo>
                <Campo label="¿Tiene junta directiva?">
                  <select className={selectClass} value={form.tiene_junta_directiva ?? ''} onChange={e => set('tiene_junta_directiva', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="SI">Sí</option>
                    <option value="NO">No</option>
                  </select>
                </Campo>
                <Campo label="¿Tiene estatutos?">
                  <select className={selectClass} value={form.tiene_estatutos ?? ''} onChange={e => set('tiene_estatutos', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="SI">Sí</option>
                    <option value="NO">No</option>
                  </select>
                </Campo>
                <Campo label="Herramientas digitales">
                  <input className={inputClass} value={form.herramientas_digitales ?? ''} onChange={e => set('herramientas_digitales', e.target.value)} />
                </Campo>
              </div>
              <BtnGuardar campos={['fecha_matricula', 'ultimo_anio_renovacion', 'numero_integrantes', 'tiene_junta_directiva', 'tiene_estatutos', 'herramientas_digitales']} />
            </div>
          )}

          {/* ACTIVIDAD CULTURAL */}
          {seccionActiva === 'actividad' && (
            <div>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#0f4c75' }}>🎭 Actividad cultural</h2>
              <div className="grid grid-cols-1 gap-4">
                <Campo label="Actividades culturales que realiza regularmente">
                  <textarea rows={3} className={inputClass} value={form.actividades_culturales ?? ''} onChange={e => set('actividades_culturales', e.target.value)} />
                </Campo>
                <Campo label="Descripción de servicios culturales">
                  <textarea rows={3} className={inputClass} value={form.descripcion_servicios ?? ''} onChange={e => set('descripcion_servicios', e.target.value)} />
                </Campo>
                <Campo label="Territorios donde focaliza su trabajo">
                  <input className={inputClass} value={form.territorios ?? ''} onChange={e => set('territorios', e.target.value)} />
                </Campo>
                <div className="grid grid-cols-2 gap-4">
                  <Campo label="Experiencia en contratación">
                    <select className={selectClass} value={form.experiencia_contratacion ?? ''} onChange={e => set('experiencia_contratacion', e.target.value)}>
                      <option value="">Seleccionar...</option>
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                      <option value="No">No tiene</option>
                    </select>
                  </Campo>
                  <Campo label="Tipo de experiencia">
                    <input className={inputClass} value={form.tipo_experiencia ?? ''} onChange={e => set('tipo_experiencia', e.target.value)} />
                  </Campo>
                </div>
              </div>
              <BtnGuardar campos={['actividades_culturales', 'descripcion_servicios', 'territorios', 'experiencia_contratacion', 'tipo_experiencia']} />
            </div>
          )}

          {/* CLASIFICACIÓN */}
          {seccionActiva === 'clasificacion' && (
            <div>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#0f4c75' }}>📊 Clasificación</h2>
              <div className="grid grid-cols-2 gap-4">
                <Campo label="CIIU 1"><input className={inputClass} value={form.ciiu_1 ?? ''} onChange={e => set('ciiu_1', e.target.value)} /></Campo>
                <Campo label="CIIU 2"><input className={inputClass} value={form.ciiu_2 ?? ''} onChange={e => set('ciiu_2', e.target.value)} /></Campo>
                <Campo label="CIIU 3"><input className={inputClass} value={form.ciiu_3 ?? ''} onChange={e => set('ciiu_3', e.target.value)} /></Campo>
                <Campo label="Escala de incidencia"><input className={inputClass} value={form.escala_incidencia ?? ''} onChange={e => set('escala_incidencia', e.target.value)} /></Campo>
                <Campo label="Campo de acción 1"><input className={inputClass} value={form.campo_1 ?? ''} onChange={e => set('campo_1', e.target.value)} /></Campo>
                <Campo label="Campo de acción 2"><input className={inputClass} value={form.campo_2 ?? ''} onChange={e => set('campo_2', e.target.value)} /></Campo>
                <Campo label="Campo de acción 3"><input className={inputClass} value={form.campo_3 ?? ''} onChange={e => set('campo_3', e.target.value)} /></Campo>
                <Campo label="Campo de acción 4"><input className={inputClass} value={form.campo_4 ?? ''} onChange={e => set('campo_4', e.target.value)} /></Campo>
                <Campo label="Población objetivo 1"><input className={inputClass} value={form.poblacion_1 ?? ''} onChange={e => set('poblacion_1', e.target.value)} /></Campo>
                <Campo label="Población objetivo 2"><input className={inputClass} value={form.poblacion_2 ?? ''} onChange={e => set('poblacion_2', e.target.value)} /></Campo>
                <Campo label="Población objetivo 3"><input className={inputClass} value={form.poblacion_3 ?? ''} onChange={e => set('poblacion_3', e.target.value)} /></Campo>
                <Campo label="Población objetivo 4"><input className={inputClass} value={form.poblacion_4 ?? ''} onChange={e => set('poblacion_4', e.target.value)} /></Campo>
                <div className="col-span-2">
                  <Campo label="Nombre resguardo / cabildo (si aplica)"><input className={inputClass} value={form.nombre_resguardo ?? ''} onChange={e => set('nombre_resguardo', e.target.value)} /></Campo>
                </div>
              </div>
              <BtnGuardar campos={['ciiu_1', 'ciiu_2', 'ciiu_3', 'escala_incidencia', 'campo_1', 'campo_2', 'campo_3', 'campo_4', 'poblacion_1', 'poblacion_2', 'poblacion_3', 'poblacion_4', 'nombre_resguardo']} />
            </div>
          )}

          {/* PARTICIPACIÓN */}
          {seccionActiva === 'participacion' && (
            <div>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#0f4c75' }}>🤝 Participación y redes</h2>
              <div className="grid grid-cols-2 gap-4">
                <Campo label="Instancia de participación">
                  <input className={inputClass} value={form.instancia_participacion ?? ''} onChange={e => set('instancia_participacion', e.target.value)} />
                </Campo>
                <Campo label="¿Hace parte de una red?">
                  <select className={selectClass} value={form.hace_parte_red ?? ''} onChange={e => set('hace_parte_red', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="SI">Sí</option>
                    <option value="NO">No</option>
                  </select>
                </Campo>
                <div className="col-span-2">
                  <Campo label="Nombre de la red o alianza">
                    <input className={inputClass} value={form.nombre_red ?? ''} onChange={e => set('nombre_red', e.target.value)} />
                  </Campo>
                </div>
                <Campo label="¿Interesada en articularse?">
                  <select className={selectClass} value={form.interesada_articularse ?? ''} onChange={e => set('interesada_articularse', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="SI">Sí</option>
                    <option value="NO">No</option>
                  </select>
                </Campo>
              </div>
              <BtnGuardar campos={['instancia_participacion', 'hace_parte_red', 'nombre_red', 'interesada_articularse']} />
            </div>
          )}

          {/* FORMACIÓN */}
          {seccionActiva === 'formacion' && (
            <div>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#0f4c75' }}>📚 Formación</h2>
              <div className="grid grid-cols-1 gap-4">
                <Campo label="¿Ha participado en procesos de formación?">
                  <select className={selectClass} value={form.ha_participado_formacion ?? ''} onChange={e => set('ha_participado_formacion', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="SI">Sí</option>
                    <option value="NO">No</option>
                  </select>
                </Campo>
                <Campo label="Temas en los que le gustaría recibir formación">
                  <textarea rows={4} className={inputClass} value={form.temas_formacion ?? ''} onChange={e => set('temas_formacion', e.target.value)} />
                </Campo>
              </div>
              <BtnGuardar campos={['ha_participado_formacion', 'temas_formacion']} />
            </div>
          )}

          {/* FOTO */}
          {seccionActiva === 'foto' && (
            <div>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#0f4c75' }}>📸 Foto</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  {form.foto_url ? (
                    <img
                      src={form.foto_url}
                      alt={form.razon_social}
                      className="w-32 h-32 rounded-2xl object-cover border border-gray-200"
                    />
                  ) : (
                    <div
                      className="w-32 h-32 rounded-2xl flex items-center justify-center text-white text-4xl font-bold"
                      style={{ backgroundColor: '#2a9d8f' }}
                    >
                      {form.razon_social?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Foto actual</p>
                    <p className="text-xs text-gray-400">Recomendado: 400x400px, JPG o PNG, máx 500KB</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Subir nueva foto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={subirFoto}
                    disabled={uploadingFoto}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:text-white file:cursor-pointer disabled:opacity-50"
                  />
                  {uploadingFoto && <p className="text-sm text-teal-600 mt-2">Subiendo foto...</p>}
                  {savedSection === 'foto' && <p className="text-sm text-green-600 mt-2">✓ Foto actualizada correctamente</p>}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}