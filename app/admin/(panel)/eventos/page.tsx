import { createSupabaseServerClient } from '@/lib/supabase-server'
import EventosClient from './EventosClient'

export default async function EventosPage() {
  const supabase = await createSupabaseServerClient()

  const { data: eventos, error } = await supabase
    .from('eventos_culturales')
    .select('*')
    .order('creado_en', { ascending: false })

  if (error) {
    return <p className="text-red-500">Error cargando eventos: {error.message}</p>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0f4c75' }}>
          Eventos Culturales
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Revisa y aprueba o rechaza los eventos registrados
        </p>
      </div>
      <EventosClient eventos={eventos ?? []} />
    </div>
  )
}