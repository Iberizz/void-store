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

  const allOrders = orders ?? []

  return (
    <div>
      <div className="mb-10 pb-8 border-b border-void-border">
        <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">Admin</p>
        <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">Orders.</h1>
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
