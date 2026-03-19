import { createSupabaseServerClient } from '@/lib/supabase-server'

async function getStats() {
  const supabase = await createSupabaseServerClient()

  const [
    { count: totalOrgs },
    { count: solicitudesPendientes },
    { count: eventosPendientes },
    { count: eventosAprobados },
    { count: totalCapacitaciones },
  ] = await Promise.all([
    supabase.from('organizaciones_culturales').select('*', { count: 'exact', head: true }).eq('activa', true),
    supabase.from('solicitudes_organizacion').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
    supabase.from('eventos_culturales').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
    supabase.from('eventos_culturales').select('*', { count: 'exact', head: true }).eq('estado', 'aprobado'),
    supabase.from('capacitaciones').select('*', { count: 'exact', head: true }).eq('activa', true),
  ])

  return {
    totalOrgs: totalOrgs ?? 0,
    solicitudesPendientes: solicitudesPendientes ?? 0,
    eventosPendientes: eventosPendientes ?? 0,
    eventosAprobados: eventosAprobados ?? 0,
    totalCapacitaciones: totalCapacitaciones ?? 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    {
      label: 'Organizaciones activas',
      value: stats.totalOrgs,
      icon: '🏛️',
      color: '#2a9d8f',
      href: '/admin/organizaciones',
    },
    {
      label: 'Solicitudes pendientes',
      value: stats.solicitudesPendientes,
      icon: '📋',
      color: stats.solicitudesPendientes > 0 ? '#e63947' : '#2a9d8f',
      href: '/admin/solicitudes',
    },
    {
      label: 'Eventos pendientes',
      value: stats.eventosPendientes,
      icon: '🎭',
      color: stats.eventosPendientes > 0 ? '#e63947' : '#2a9d8f',
      href: '/admin/eventos',
    },
    {
      label: 'Eventos aprobados',
      value: stats.eventosAprobados,
      icon: '✅',
      color: '#2a9d8f',
      href: '/admin/eventos',
    },
    {
      label: 'Capacitaciones Labter',
      value: stats.totalCapacitaciones,
      icon: '🎓',
      color: '#0f4c75',
      href: '/admin/labter',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0f4c75' }}>
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Resumen general de la plataforma
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {cards.map(card => (
         <a 
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: card.color + '20' }}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: card.color }}>
                {card.value}
              </p>
              <p className="text-gray-500 text-sm">{card.label}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Alertas pendientes */}
      {(stats.solicitudesPendientes > 0 || stats.eventosPendientes > 0) && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">⚠️ Requieren atención</h2>
          <div className="space-y-3">
            {stats.solicitudesPendientes > 0 && (
              
              <a  href="/admin/solicitudes"
                className="flex items-center justify-between p-4 rounded-xl transition-colors hover:opacity-80"
                style={{ backgroundColor: '#e6394715' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📋</span>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.solicitudesPendientes} solicitud{stats.solicitudesPendientes > 1 ? 'es' : ''} de organización pendiente{stats.solicitudesPendientes > 1 ? 's' : ''}
                  </span>
                </div>
                <span className="text-sm font-semibold" style={{ color: '#e63947' }}>
                  Revisar →
                </span>
              </a>
            )}
            {stats.eventosPendientes > 0 && (
              <a
                href="/admin/eventos"
                className="flex items-center justify-between p-4 rounded-xl transition-colors hover:opacity-80"
                style={{ backgroundColor: '#e6394715' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎭</span>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.eventosPendientes} evento{stats.eventosPendientes > 1 ? 's' : ''} pendiente{stats.eventosPendientes > 1 ? 's' : ''} de aprobación
                  </span>
                </div>
                <span className="text-sm font-semibold" style={{ color: '#e63947' }}>
                  Revisar →
                </span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}