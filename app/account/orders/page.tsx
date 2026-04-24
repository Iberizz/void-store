import Image from 'next/image'
import Link  from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CancelItemButton  from '@/components/account/CancelItemButton'
import CancelOrderButton from '@/components/account/CancelOrderButton'

export const dynamic  = 'force-dynamic'
export const metadata = { title: 'Orders — VØID Account' }

const STATUS_STYLES: Record<string, { color: string; bg: string; dot: string }> = {
  Delivered:  { color: '#4DFFB4', bg: 'rgba(77,255,180,0.08)',   dot: '#4DFFB4'  },
  Shipped:    { color: '#E8E8E8', bg: 'rgba(232,232,232,0.06)',  dot: '#E8E8E8'  },
  Processing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',   dot: '#F59E0B'  },
  Cancelled:  { color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)',  dot: '#FF6B6B'  },
}

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  cancelled?: boolean
  cancel_reason?: string
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const allOrders  = orders ?? []
  const total      = allOrders.filter(o => o.status !== 'Cancelled').reduce((s: number, o) => s + o.total, 0)
  const totalItems = allOrders.reduce((s: number, o) => {
    const items = o.items as CartItem[]
    return s + items.filter(i => !i.cancelled).reduce((q, i) => q + i.quantity, 0)
  }, 0)

  return (
    <div>
      <div className="mb-12 pb-8 border-b border-void-border">
        <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">Account</p>
        <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">Orders.</h1>
      </div>

      {!allOrders || allOrders.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-void-muted mb-4">No orders yet.</p>
          <p className="font-sans text-void-muted text-sm mb-8">Your void is empty — for now.</p>
          <Link href="/collection" className="font-sans text-xs tracking-[0.2em] uppercase text-void-base bg-void-green px-8 py-3 hover:bg-void-white transition-colors">
            Shop Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {allOrders.map((order) => {
            const s        = STATUS_STYLES[order.status] ?? STATUS_STYLES['Processing']
            const items    = order.items as CartItem[]
            const date     = new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            const activeItems    = items.filter(i => !i.cancelled)
            const cancelledItems = items.filter(i => i.cancelled)
            const canCancelOrder = order.status === 'Processing' && activeItems.length > 0

            return (
              <div key={order.id} className="bg-void-surface border border-void-border hover:border-void-muted/40 transition-colors duration-200">

                {/* Order header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-void-border">
                  <div className="flex items-center gap-4">
                    <p className="font-mono text-void-muted text-xs">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="font-sans text-void-muted text-xs">{date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1.5 font-sans text-xs px-2.5 py-1"
                      style={{ color: s.color, background: s.bg }}
                    >
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: s.dot }} />
                      {order.status}
                    </span>
                    <p className="font-display text-void-white text-lg">€{order.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Items list */}
                <div className="divide-y divide-void-border">
                  {items.map((item) => {
                    const isCancelled = !!item.cancelled
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 px-6 py-4"
                        style={{ opacity: isCancelled ? 0.5 : 1 }}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-14 h-14 bg-void-card border border-void-border shrink-0 overflow-hidden">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className={`object-contain p-1.5 ${isCancelled ? 'grayscale' : ''}`}
                              sizes="56px"
                            />
                          )}
                        </div>

                        {/* Name + reason */}
                        <div className="flex-1 min-w-0">
                          <p className={`font-sans text-sm leading-snug ${isCancelled ? 'line-through text-void-muted' : 'text-void-white'}`}>
                            {item.name}
                            <span className="text-void-muted text-xs ml-2 no-underline" style={{ textDecoration: 'none' }}>
                              × {item.quantity}
                            </span>
                          </p>
                          {isCancelled && item.cancel_reason && (
                            <p className="font-sans text-[10px] text-[#FF6B6B]/60 mt-0.5 tracking-[0.05em]">
                              {item.cancel_reason}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <p className={`font-sans text-sm shrink-0 ${isCancelled ? 'line-through text-void-muted' : 'text-void-white'}`}>
                          €{(item.price * item.quantity).toLocaleString()}
                        </p>

                        {/* Cancel button — only for active items on Processing orders */}
                        {order.status === 'Processing' && !isCancelled && (
                          <CancelItemButton
                            orderId={order.id}
                            itemId={item.id}
                            itemName={item.name}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Order footer */}
                <div className="px-6 py-3 border-t border-void-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <p className="font-sans text-void-muted text-xs capitalize">
                      {order.card_brand} •••• {order.card_last4}
                    </p>
                    {cancelledItems.length > 0 && activeItems.length > 0 && (
                      <p className="font-sans text-[10px] text-[#FF6B6B]/60 tracking-[0.05em]">
                        {cancelledItems.length} item{cancelledItems.length > 1 ? 's' : ''} cancelled
                      </p>
                    )}
                  </div>

                  {canCancelOrder ? (
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

      {allOrders.length > 0 && (
        <div className="mt-8 pt-6 border-t border-void-border flex justify-between">
          <p className="font-sans text-void-muted text-xs">
            {allOrders.length} order{allOrders.length !== 1 ? 's' : ''} · {totalItems} active item{totalItems !== 1 ? 's' : ''}
          </p>
          <p className="font-sans text-void-muted text-xs">
            Total · <span className="text-void-white">€{total.toLocaleString()}</span>
          </p>
        </div>
      )}
    </div>
  )
}
