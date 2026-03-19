import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  const role = session.user.user_metadata?.role as string

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
      <AdminSidebar role={role} userEmail={session.user.email ?? ''} />
      <main className="flex-1 overflow-y-auto p-8 min-w-0 relative">
        {/* Marca de agua */}
        <div
          className="fixed inset-0 ml-64 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'url(/imgadmin.png)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '65%',
              opacity: 0.2,
            }}
          />
        </div>
        {/* Contenido encima */}
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  )
}