'use client'

import { useMemo } from 'react'

interface Stats {
  totalOrgs: number
  orgsEsteMes: number
  solicitudesPendientes: number
  solicitudesAprobadas: number
  solicitudesRechazadas: number
  eventosPendientes: number
  eventosAprobados: number
  totalCapacitaciones: number
  totalVisitas: number
  visitasEsteMes: number
}

interface Props {
  stats: Stats
  visitasDia: Record<string, number>
  orgsMes: Record<string, number>
  eventosMes: Record<string, number>
  topRutas: { path: string; count: number }[]
}

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function getMesLabel(key: string) {
  const [, m] = key.split('-')
  return MESES[parseInt(m) - 1]
}

function getUltimos6Meses() {
  const meses = []
  const hoy = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
    meses.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return meses
}

function getUltimos30Dias() {
  const dias = []
  const hoy = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(hoy.getTime() - i * 24 * 60 * 60 * 1000)
    dias.push(d.toISOString().substring(0, 10))
  }
  return dias
}

// ── Mini barra ────────────────────────────────────────────────────────────────
function BarChart({
  data,
  labels,
  color,
  height = 80,
}: {
  data: number[]
  labels: string[]
  color: string
  height?: number
}) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${(val / max) * (height - 16)}px`,
              backgroundColor: color,
              minHeight: val > 0 ? 3 : 0,
            }}
          />
          {/* Tooltip */}
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {labels[i]}: {val}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string
  value: number
  sub?: string
  icon: string
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: color + '20' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold" style={{ color }}>{value.toLocaleString()}</p>
        <p className="text-gray-500 text-sm">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function MetricasClient({ stats, visitasDia, orgsMes, eventosMes, topRutas }: Props) {
  const meses6 = useMemo(() => getUltimos6Meses(), [])
  const dias30 = useMemo(() => getUltimos30Dias(), [])

  const visitasData = dias30.map(d => visitasDia[d] ?? 0)
  const orgsData = meses6.map(m => orgsMes[m] ?? 0)
  const eventosData = meses6.map(m => eventosMes[m] ?? 0)
  const mesesLabels = meses6.map(getMesLabel)

  const diasLabels = dias30.map(d => {
    const [, m, day] = d.split('-')
    return `${parseInt(day)} ${MESES[parseInt(m) - 1]}`
  })

  const totalSolicitudes = stats.solicitudesAprobadas + stats.solicitudesRechazadas + stats.solicitudesPendientes

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0f4c75' }}>
          📈 Métricas
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Estadísticas en tiempo real de la plataforma
        </p>
      </div>

      {/* Visitas */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Visitas</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Visitas totales" value={stats.totalVisitas} icon="👁️" color="#0f4c75" />
        <StatCard label="Visitas este mes" value={stats.visitasEsteMes} icon="📅" color="#2a9d8f" />
      </div>

      {/* Gráfica visitas 30 días */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <p className="text-sm font-semibold text-gray-600 mb-4">Visitas últimos 30 días</p>
        <BarChart data={visitasData} labels={diasLabels} color="#0f4c75" height={100} />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{diasLabels[0]}</span>
          <span>{diasLabels[diasLabels.length - 1]}</span>
        </div>
      </div>

      {/* Top rutas */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <p className="text-sm font-semibold text-gray-600 mb-4">Páginas más visitadas este mes</p>
        {topRutas.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin datos aún</p>
        ) : (
          <div className="space-y-2">
            {topRutas.map((r, i) => {
              const maxCount = topRutas[0].count
              return (
                <div key={r.path} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-5 text-right">{i + 1}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(r.count / maxCount) * 100}%`,
                          backgroundColor: '#2a9d8f',
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 truncate max-w-48">{r.path}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-8 text-right">{r.count}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Organizaciones */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Organizaciones</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Organizaciones activas" value={stats.totalOrgs} icon="🏛️" color="#2a9d8f" />
        <StatCard label="Nuevas este mes" value={stats.orgsEsteMes} icon="✨" color="#e63947" />
      </div>

      {/* Solicitudes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <p className="text-sm font-semibold text-gray-600 mb-5">Estado de solicitudes</p>
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Pendientes', value: stats.solicitudesPendientes, color: '#f59e0b' },
            { label: 'Aprobadas', value: stats.solicitudesAprobadas, color: '#2a9d8f' },
            { label: 'Rechazadas', value: stats.solicitudesRechazadas, color: '#e63947' },
          ].map(item => (
            <div key={item.label} className="text-center p-4 rounded-xl" style={{ backgroundColor: item.color + '10' }}>
              <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
        {/* Barra de progreso */}
        {totalSolicitudes > 0 && (
          <div className="h-3 rounded-full overflow-hidden flex">
            <div className="h-full transition-all" style={{ width: `${(stats.solicitudesPendientes / totalSolicitudes) * 100}%`, backgroundColor: '#f59e0b' }} />
            <div className="h-full transition-all" style={{ width: `${(stats.solicitudesAprobadas / totalSolicitudes) * 100}%`, backgroundColor: '#2a9d8f' }} />
            <div className="h-full transition-all" style={{ width: `${(stats.solicitudesRechazadas / totalSolicitudes) * 100}%`, backgroundColor: '#e63947' }} />
          </div>
        )}
      </div>

      {/* Eventos */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Eventos</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Eventos pendientes" value={stats.eventosPendientes} icon="⏳" color="#f59e0b" />
        <StatCard label="Eventos aprobados" value={stats.eventosAprobados} icon="✅" color="#2a9d8f" />
      </div>

      {/* Gráficas orgs y eventos por mes */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-600 mb-4">Nuevas organizaciones por mes</p>
          <BarChart data={orgsData} labels={mesesLabels} color="#2a9d8f" height={80} />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            {mesesLabels.map(m => <span key={m}>{m}</span>)}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-600 mb-4">Nuevos eventos por mes</p>
          <BarChart data={eventosData} labels={mesesLabels} color="#e63947" height={80} />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            {mesesLabels.map(m => <span key={m}>{m}</span>)}
          </div>
        </div>
      </div>

      {/* Labter */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Labter</h2>
      <div className="grid grid-cols-1 gap-4">
        <StatCard label="Capacitaciones activas" value={stats.totalCapacitaciones} icon="🎓" color="#0f4c75" />
      </div>
    </div>
  )
}