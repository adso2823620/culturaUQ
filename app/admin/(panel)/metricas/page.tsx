import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import MetricasClient from './MetricasClient'

export default async function MetricasPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { session } } = await supabase.auth.getSession()
  const role = session?.user?.user_metadata?.role

  if (role !== 'superadmin') {
    redirect('/admin')
  }

  // ── Fetch paralelo de todas las métricas ──────────────
  const hoy = new Date()
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString()
  const hace6Meses = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1).toISOString()

  const [
    { count: totalOrgs },
    { count: orgsEsteMes },
    { count: solicitudesPendientes },
    { count: solicitudesAprobadas },
    { count: solicitudesRechazadas },
    { count: eventosPendientes },
    { count: eventosAprobados },
    { count: totalCapacitaciones },
    { count: totalVisitas },
    { count: visitasEsteMes },
    { data: visitasPorDia },
    { data: orgsPorMes },
    { data: eventosPorMes },
    { data: visitasPorRuta },
  ] = await Promise.all([
    supabase.from('organizaciones_culturales').select('*', { count: 'exact', head: true }).eq('activa', true),
    supabase.from('organizaciones_culturales').select('*', { count: 'exact', head: true }).gte('creado_en', inicioMes),
    supabase.from('solicitudes_organizacion').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
    supabase.from('solicitudes_organizacion').select('*', { count: 'exact', head: true }).eq('estado', 'aprobado'),
    supabase.from('solicitudes_organizacion').select('*', { count: 'exact', head: true }).eq('estado', 'rechazado'),
    supabase.from('eventos_culturales').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
    supabase.from('eventos_culturales').select('*', { count: 'exact', head: true }).eq('estado', 'aprobado'),
    supabase.from('capacitaciones').select('*', { count: 'exact', head: true }).eq('activa', true),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('creado_en', inicioMes),
    supabase.from('page_views').select('creado_en').gte('creado_en', hace6Meses).order('creado_en', { ascending: true }),
    supabase.from('organizaciones_culturales').select('creado_en').gte('creado_en', hace6Meses).order('creado_en', { ascending: true }),
    supabase.from('eventos_culturales').select('creado_en').gte('creado_en', hace6Meses).order('creado_en', { ascending: true }),
    supabase.from('page_views').select('path').gte('creado_en', inicioMes),
  ])

  // Agrupar visitas por día (últimos 30 días)
  const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000)
  const visitasDia: Record<string, number> = {}
  ;(visitasPorDia ?? [])
    .filter(v => new Date(v.creado_en) >= hace30Dias)
    .forEach(v => {
      const dia = v.creado_en.substring(0, 10)
      visitasDia[dia] = (visitasDia[dia] ?? 0) + 1
    })

  // Agrupar orgs por mes (últimos 6 meses)
  const orgsMes: Record<string, number> = {}
  ;(orgsPorMes ?? []).forEach(o => {
    const mes = o.creado_en.substring(0, 7)
    orgsMes[mes] = (orgsMes[mes] ?? 0) + 1
  })

  // Agrupar eventos por mes
  const eventosMes: Record<string, number> = {}
  ;(eventosPorMes ?? []).forEach(e => {
    const mes = e.creado_en.substring(0, 7)
    eventosMes[mes] = (eventosMes[mes] ?? 0) + 1
  })

  // Top rutas más visitadas este mes
  const rutasConteo: Record<string, number> = {}
  ;(visitasPorRuta ?? []).forEach(v => {
    rutasConteo[v.path] = (rutasConteo[v.path] ?? 0) + 1
  })
  const topRutas = Object.entries(rutasConteo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, count]) => ({ path, count }))

  return (
    <MetricasClient
      stats={{
        totalOrgs: totalOrgs ?? 0,
        orgsEsteMes: orgsEsteMes ?? 0,
        solicitudesPendientes: solicitudesPendientes ?? 0,
        solicitudesAprobadas: solicitudesAprobadas ?? 0,
        solicitudesRechazadas: solicitudesRechazadas ?? 0,
        eventosPendientes: eventosPendientes ?? 0,
        eventosAprobados: eventosAprobados ?? 0,
        totalCapacitaciones: totalCapacitaciones ?? 0,
        totalVisitas: totalVisitas ?? 0,
        visitasEsteMes: visitasEsteMes ?? 0,
      }}
      visitasDia={visitasDia}
      orgsMes={orgsMes}
      eventosMes={eventosMes}
      topRutas={topRutas}
    />
  )
}