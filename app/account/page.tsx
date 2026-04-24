export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import WishlistPreview from '@/components/account/WishlistPreview'

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Delivered:  { color: '#4DFFB4', bg: 'rgba(77,255,180,0.08)'  },
  Shipped:    { color: '#E8E8E8', bg: 'rgba(232,232,232,0.06)' },
  Processing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)'  },
  Cancelled:  { color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)' },
}

type CartItem = { id: string; name: string; price: number; quantity: number; image: string }

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name        = (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || 'there'
  const firstName   = name.split(' ')[0]
  const memberSince = user?.created_at ? new Date(user.created_at).getFullYear() : '—'

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const allOrders  = orders ?? []
  const totalSpent = allOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((s: number, o) => s + o.total, 0)

  const recentOrders = allOrders.slice(0, 3)

  return (
    <div>
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-void-border">
        <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">Welcome back</p>
        <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">
          {firstName}.
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-void-border mb-12">
        {[
          { label: 'Orders',       value: allOrders.length },
          { label: 'Total spent',  value: `€${totalSpent.toLocaleString()}` },
          { label: 'Member since', value: memberSince },
        ].map(({ label, value }) => (
          <div key={label} className="bg-void-base p-6">
            <p className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase mb-2">{label}</p>
            <p className="font-display text-2xl text-void-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans text-void-white text-sm tracking-[0.15em] uppercase">Recent orders</h2>
          <Link href="/account/orders" className="font-sans text-void-muted text-xs hover:text-void-green transition-colors">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="font-sans text-void-muted text-xs py-8 text-center">No orders yet.</p>
        ) : (
          <div className="space-y-px">
            {recentOrders.map((order) => {
              const items  = order.items as CartItem[]
              const first  = items[0]
              const s      = STATUS_STYLES[order.status] ?? STATUS_STYLES['Processing']
              const date   = new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              const totalQty = items.reduce((q, i) => q + i.quantity, 0)

              return (
                <div key={order.id} className="flex items-center gap-4 bg-void-surface p-4">
                  <div className="relative w-12 h-12 bg-void-card shrink-0 overflow-hidden">
                    {first?.image && (
                      <Image src={first.image} alt={first.name} fill className="object-contain" sizes="48px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-void-white text-sm truncate">
                      {items.length === 1 ? first?.name : `${first?.name} +${items.length - 1}`}
                    </p>
                    <p className="font-sans text-void-muted text-xs">
                      {date} · {totalQty} item{totalQty !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-sans text-void-white text-sm mb-1">€{order.total.toLocaleString()}</p>
                    <span className="font-sans text-xs px-2 py-0.5" style={{ color: s.color, background: s.bg }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Wishlist */}
      <WishlistPreview />

      {/* CTA */}
      <div className="border border-void-border p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-sans text-void-white text-sm mb-1">Discover AW25</p>
          <p className="font-sans text-void-muted text-xs">New season. Uncompromised silence.</p>
        </div>
        <Link
          href="/collection"
          className="font-sans text-xs tracking-[0.15em] uppercase text-void-white border border-void-border px-6 py-3 hover:border-void-green hover:text-void-green transition-colors duration-200 shrink-0"
        >
          Shop Collection
        </Link>
      </div>
    </div>
  )
}
