export const dynamic  = 'force-dynamic'
export const metadata = { title: 'Users — VØID Admin' }

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminUsersClient from './AdminUsersClient'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user: me } } = await supabase.auth.getUser()
  if (!me?.user_metadata?.is_admin) return null

  const admin = createAdminClient()

  const [{ data: { users } }, { data: orders }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from('orders').select('user_id, total, status, created_at'),
  ])

  const statsMap = new Map<string, { count: number; spent: number }>()
  for (const order of orders ?? []) {
    const s = statsMap.get(order.user_id) ?? { count: 0, spent: 0 }
    s.count++
    if (order.status !== 'Cancelled') s.spent += order.total
    statsMap.set(order.user_id, s)
  }

  const enriched = users.map(u => {
    const stats    = statsMap.get(u.id) ?? { count: 0, spent: 0 }
    const name     = (u.user_metadata?.full_name as string) || u.email?.split('@')[0] || '—'
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    const joined   = new Date(u.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    return { id: u.id, name, initials, email: u.email ?? '—', joined, isActive: stats.count > 0, ...stats }
  }).sort((a, b) => b.spent - a.spent)

  const totalRevenue = enriched.reduce((s, u) => s + u.spent, 0)
  const activeCount  = enriched.filter(u => u.isActive).length
  const avgLTV       = enriched.length > 0 ? Math.round(totalRevenue / enriched.length) : 0

  return (
    <div>
      <div className="mb-10 pb-8 border-b border-void-border">
        <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">Admin</p>
        <div className="flex items-end justify-between">
          <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">Users.</h1>
          <div className="text-right">
            <p className="font-sans text-void-muted text-xs mb-0.5">{activeCount} with orders</p>
            <p className="font-display text-2xl text-void-green">€{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {enriched.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-void-muted">No users yet.</p>
        </div>
      ) : (
        <AdminUsersClient users={enriched} totalRevenue={totalRevenue} avgLTV={avgLTV} />
      )}
    </div>
  )
}
