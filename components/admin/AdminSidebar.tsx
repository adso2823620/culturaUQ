'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/solicitudes', label: 'Solicitudes', icon: '📋' },
  { href: '/admin/eventos', label: 'Eventos', icon: '🎭' },
  { href: '/admin/organizaciones', label: 'Organizaciones', icon: '🏛️' },
  { href: '/admin/labter', label: 'Labter', icon: '🎓' },
]

const metricasItem: { href: string; label: string; icon: string; exact?: boolean } = { href: '/admin/metricas', label: 'Métricas', icon: '📈' }

interface Props {
  role: string
  userEmail: string
}

export default function AdminSidebar({ role, userEmail }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const items = role === 'superadmin' ? [...navItems, metricasItem] : navItems

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col h-screen"
      style={{ backgroundColor: '#0f4c75' }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: '#e63947' }}
          >
            C
          </div>
          <div>
            <p className="text-white font-bold text-sm">Cultura Caldas</p>
            <p className="text-white/50 text-xs">Panel Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(item.href, item.exact)
                ? 'text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            style={
              isActive(item.href, item.exact)
                ? { backgroundColor: '#2a9d8f' }
                : {}
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Usuario + logout */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <div className="mb-3 px-2">
          <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Sesión activa</p>
          <p className="text-white/80 text-xs truncate">{userEmail}</p>
          <span
            className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: role === 'superadmin' ? '#e63947' : '#2a9d8f',
              color: 'white'
            }}
          >
            {role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
