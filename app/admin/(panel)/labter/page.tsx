import { createSupabaseServerClient } from '@/lib/supabase-server'
import LabterClient from './LabterClient'

export default async function LabterPage() {
  const supabase = await createSupabaseServerClient()

  const [
    { data: capacitaciones },
    { data: presentaciones },
    { data: materialApoyo },
    { data: bibliografia },
    { data: propuestas },
  ] = await Promise.all([
    supabase
      .from('capacitaciones')
      .select('*, capacitacion_archivos(id, tipo, titulo_archivo, url)')
      .order('creado_en', { ascending: false }),
    supabase
      .from('capacitacion_archivos')
      .select('*')
      .eq('tipo', 'presentacion')
      .order('orden', { ascending: true }),
    supabase
      .from('capacitacion_archivos')
      .select('*')
      .eq('tipo', 'material_apoyo')
      .order('orden', { ascending: true }),
    supabase
      .from('capacitacion_archivos')
      .select('*')
      .eq('tipo', 'bibliografia')
      .order('orden', { ascending: true }),
    supabase
      .from('capacitacion_archivos')
      .select('*')
      .eq('tipo', 'propuesta')
      .order('orden', { ascending: true }),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0f4c75' }}>
          Labter Cultural
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Gestión de contenidos de formación
        </p>
      </div>
      <LabterClient
        capacitaciones={capacitaciones ?? []}
        presentaciones={presentaciones ?? []}
        materialApoyo={materialApoyo ?? []}
        bibliografia={bibliografia ?? []}
        propuestas={propuestas ?? []}
      />
    </div>
  )
}