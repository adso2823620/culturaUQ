import { createSupabaseServerClient } from '@/lib/supabase-server'
import OrganizacionesClient from './OrganizacionesClient'

export default async function OrganizacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string; busqueda?: string; estado?: string }>
}) {
  const params = await searchParams
  const pagina = parseInt(params.pagina ?? '1')
  const busqueda = params.busqueda ?? ''
  const estado = params.estado ?? 'todos'
  const porPagina = 15
  const desde = (pagina - 1) * porPagina

  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('organizaciones_culturales')
    .select('id, razon_social, municipio, sector_cultural, tipo_organizacion, foto_url, activa, verificada, creado_en', { count: 'exact' })
    .order('razon_social', { ascending: true })
    .range(desde, desde + porPagina - 1)

  if (busqueda) {
    query = query.ilike('razon_social', `%${busqueda}%`)
  }
  if (estado === 'activas') {
    query = query.eq('activa', true)
  } else if (estado === 'inactivas') {
    query = query.eq('activa', false)
  }

  const { data: organizaciones, count, error } = await query

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>
  }

  const totalPaginas = Math.ceil((count ?? 0) / porPagina)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0f4c75' }}>
          Organizaciones
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {count ?? 0} organizaciones en el directorio
        </p>
      </div>
      <OrganizacionesClient
        organizaciones={organizaciones ?? []}
        totalPaginas={totalPaginas}
        paginaActual={pagina}
        busquedaInicial={busqueda}
        estadoInicial={estado}
        total={count ?? 0}
      />
    </div>
  )
}