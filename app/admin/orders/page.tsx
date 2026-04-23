export const dynamic  = 'force-dynamic'
export const metadata = { title: 'Orders — VØID Admin' }

import { createClient } from '@/lib/supabase/server'
import AdminOrdersClient from './AdminOrdersClient'

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const allOrders    = orders ?? []
  const totalRevenue = allOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((s: number, o) => s + o.total, 0)

  return (
    <div>
      <div className="mb-10 pb-8 border-b border-void-border">
        <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">Admin</p>
        <div className="flex items-end justify-between">
          <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">Orders.</h1>
          <div className="text-right">
            <p className="font-sans text-void-muted text-xs mb-0.5">Total Revenue</p>
            <p className="font-display text-2xl text-void-green">€{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {allOrders.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-void-muted">No orders yet.</p>
        </div>
      ) : (
        <AdminOrdersClient orders={allOrders} />
      )}
    </div>
  )
}
