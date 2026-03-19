import { createSupabaseServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import EditarOrgClient from './EditarOrgClient'

export default async function EditarOrgPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: org, error } = await supabase
    .from('organizaciones_culturales')
    .select('*')
    .eq('id', id)
    .single()

  console.log('org:', org, 'error:', error)

  if (error || !org) notFound()

  return <EditarOrgClient org={org} />
}