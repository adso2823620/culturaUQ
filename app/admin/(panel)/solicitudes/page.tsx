import { createSupabaseServerClient } from '@/lib/supabase-server'
import SolicitudesClient from './SolicitudesClient'

export default async function SolicitudesPage() {
  const supabase = await createSupabaseServerClient()

  const { data: solicitudes, error } = await supabase
    .from('solicitudes_organizacion')
    .select('*')
    .order('creado_en', { ascending: false })

  if (error) {
    return <p className="text-red-500">Error cargando solicitudes: {error.message}</p>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0f4c75' }}>
          Solicitudes de Organizaciones
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Revisa y aprueba o rechaza las nuevas organizaciones
        </p>
      </div>
      <SolicitudesClient solicitudes={solicitudes ?? []} />
    </div>
  )
}