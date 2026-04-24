import Image from 'next/image'
import Link  from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CancelOrderButton from '@/components/account/CancelOrderButton'

export const dynamic  = 'force-dynamic'
export const metadata = { title: 'Orders — VØID Account' }

const STATUS_STYLES: Record<string, { color: string; bg: string; dot: string }> = {
  Delivered:  { color: '#4DFFB4', bg: 'rgba(77,255,180,0.08)',   dot: '#4DFFB4'  },
  Shipped:    { color: '#E8E8E8', bg: 'rgba(232,232,232,0.06)',  dot: '#E8E8E8'  },
  Processing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',   dot: '#F59E0B'  },
  Cancelled:  { color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)',  dot: '#FF6B6B'  },
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
        <div className="space-y-3">
          {orders.map((order) => {
            const s        = STATUS_STYLES[order.status] ?? STATUS_STYLES['Processing']
            const items    = order.items as CartItem[]
            const totalQty = items.reduce((q, i) => q + i.quantity, 0)
            const date     = new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

            return (
              <div key={order.id} className="bg-void-surface border border-void-border hover:border-void-muted/40 transition-colors duration-200">

                {/* Top — images + meta + status */}
                <div className="flex items-start gap-5 p-6">

                  {/* Thumbnails */}
                  <div className="flex shrink-0 mt-0.5">
                    {items.slice(0, 3).map((item, i) => (
                      <div
                        key={item.id + i}
                        className="relative w-16 h-16 bg-void-card border border-void-border overflow-hidden"
                        style={{ marginLeft: i > 0 ? '-10px' : 0, zIndex: items.length - i }}
                      >
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1.5" sizes="64px" />
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div
                        className="relative w-16 h-16 bg-void-card border border-void-border flex items-center justify-center"
                        style={{ marginLeft: '-10px' }}
                      >
                        <span className="font-sans text-void-muted text-xs">+{items.length - 3}</span>
                      </div>
                    )}
                  </div>

                  {/* Items list */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 space-y-1">
                      {items.map((item) => (
                        <p key={item.id} className="font-sans text-void-white text-sm leading-snug">
                          {item.name}
                          <span className="text-void-muted text-xs ml-2">× {item.quantity}</span>
                        </p>
                      ))}
                    </div>
                    <p className="font-sans text-void-muted text-xs">
                      {date} · {totalQty} item{totalQty !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Right — total + status */}
                  <div className="text-right shrink-0">
                    <p className="font-display text-xl text-void-white mb-3">
                      €{order.total.toLocaleString()}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 font-sans text-xs px-2.5 py-1"
                      style={{ color: s.color, background: s.bg }}
                    >
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: s.dot }} />
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Bottom — card + order id + cancel */}
                <div className="px-6 py-3 border-t border-void-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <p className="font-sans text-void-muted text-xs capitalize">
                      {order.card_brand} •••• {order.card_last4}
                    </p>
                    <p className="font-mono text-void-muted text-xs hidden sm:block">
                      #{order.id.slice(0, 8)}
                    </p>
                  </div>

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
          <p className="font-sans text-void-muted text-xs">
            Total · <span className="text-void-white">€{total.toLocaleString()}</span>
          </p>
        </div>
      )}
    </div>
  )
}
