import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CancelOrderButton from '@/components/account/CancelOrderButton'

export const dynamic  = 'force-dynamic'
export const metadata = { title: 'Orders — VØID Account' }

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Delivered:  { color: '#4DFFB4', bg: 'rgba(77,255,180,0.08)'  },
  Shipped:    { color: '#E8E8E8', bg: 'rgba(232,232,232,0.06)' },
  Processing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)'  },
  Cancelled:  { color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)' },
}

type CartItem = { id: string; name: string; price: number; quantity: number; image: string }

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const total      = (orders ?? []).filter(o => o.status !== 'Cancelled').reduce((s: number, o) => s + o.total, 0)
  const totalItems = (orders ?? []).reduce((s: number, o) => {
    const items = o.items as CartItem[]
    return s + items.reduce((q, i) => q + i.quantity, 0)
  }, 0)

  return (
    <div>
      <div className="mb-12 pb-8 border-b border-void-border">
        <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">Account</p>
        <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">Orders.</h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-void-muted mb-4">No orders yet.</p>
          <p className="font-sans text-void-muted text-sm mb-8">Your void is empty — for now.</p>
          <Link href="/collection" className="font-sans text-xs tracking-[0.2em] uppercase text-void-base bg-void-green px-8 py-3 hover:bg-void-white transition-colors">
            Shop Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-px">
          {orders.map((order) => {
            const s          = STATUS_STYLES[order.status] ?? STATUS_STYLES['Processing']
            const items      = order.items as CartItem[]
            const first      = items[0]
            const totalQty   = items.reduce((q, i) => q + i.quantity, 0)
            const date       = new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

            return (
              <div key={order.id} className="bg-void-surface border border-transparent hover:border-void-border transition-colors duration-200">
                <div className="flex items-center gap-6 p-6">

                  {/* Thumbnails stack */}
                  <div className="flex shrink-0">
                    {items.slice(0, 3).map((item, i) => (
                      <div
                        key={item.id + i}
                        className="relative w-14 h-14 bg-void-card border border-void-border overflow-hidden"
                        style={{ marginLeft: i > 0 ? '-12px' : 0, zIndex: items.length - i }}
                      >
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="56px" />
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div
                        className="relative w-14 h-14 bg-void-card border border-void-border flex items-center justify-center"
                        style={{ marginLeft: '-12px' }}
                      >
                        <span className="font-sans text-void-muted text-xs">+{items.length - 3}</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 space-y-0.5">
                      {items.map((item) => (
                        <p key={item.id} className="font-sans text-void-white text-sm truncate">
                          {item.name}
                          <span className="text-void-muted text-xs ml-2">× {item.quantity}</span>
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-sans text-void-muted text-xs">{date}</p>
                      <span className="text-void-border">·</span>
                      <p className="font-sans text-void-muted text-xs">
                        {totalQty} item{totalQty !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Order ID — desktop */}
                  <div className="hidden md:block text-center">
                    <p className="font-sans text-void-muted text-xs tracking-[0.1em] uppercase">Order</p>
                    <p className="font-mono text-void-white text-xs mt-0.5">{order.id.slice(0, 8)}…</p>
                  </div>

                  {/* Total + status */}
                  <div className="text-right shrink-0">
                    <p className="font-sans text-void-white text-sm mb-1.5">€{order.total.toLocaleString()}</p>
                    <span className="font-sans text-xs px-2 py-0.5" style={{ color: s.color, background: s.bg }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-4 border-t border-void-border pt-3 flex justify-between items-center">
                  <p className="font-sans text-void-muted text-xs capitalize">
                    {order.card_brand} •••• {order.card_last4}
                  </p>
                  {order.status === 'Processing' ? (
                    <CancelOrderButton orderId={order.id} />
                  ) : (
                    <p className="font-sans text-void-muted text-xs">Free worldwide shipping</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="mt-8 pt-6 border-t border-void-border flex justify-between">
          <p className="font-sans text-void-muted text-xs">
            {orders.length} order{orders.length !== 1 ? 's' : ''} · {totalItems} item{totalItems !== 1 ? 's' : ''}
          </p>
          <p className="font-sans text-void-muted text-xs">Total · <span className="text-void-white">€{total.toLocaleString()}</span></p>
        </div>
      )}
    </div>
  )
}
