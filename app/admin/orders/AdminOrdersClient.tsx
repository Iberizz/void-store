'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdminSearchBar    from '@/components/admin/AdminSearchBar'
import OrderStatusSelect from '@/components/admin/OrderStatusSelect'
import type { OrderStatus } from '@/app/actions/orders'

type CartItem = { id: string; name: string; price: number; quantity: number; image: string }
type Order    = {
  id: string; created_at: string; items: CartItem[]; shipping: { firstName: string; lastName: string }
  card_brand: string; card_last4: string; total: number; status: string; user_id: string
}

export default function AdminOrdersClient({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? orders.filter(o => {
        const q     = query.toLowerCase()
        const items = o.items as CartItem[]
        const name  = `${o.shipping?.firstName ?? ''} ${o.shipping?.lastName ?? ''}`.toLowerCase()
        return (
          name.includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q) ||
          items.some(i => i.name.toLowerCase().includes(q))
        )
      })
    : orders

  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0)

  return (
    <>
      {/* Search */}
      <div className="mb-4">
        <AdminSearchBar value={query} onChange={setQuery} placeholder="Search by customer, product, status…" />
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 px-4 mb-2">
        {['Date', 'Items', 'Customer', 'Amount', 'Status'].map(h => (
          <p key={h} className="font-sans text-void-muted text-xs tracking-[0.12em] uppercase">{h}</p>
        ))}
      </div>

      <div className="space-y-px">
        {filtered.length === 0 ? (
          <p className="font-sans text-void-muted text-xs py-8 text-center">No orders match "{query}"</p>
        ) : filtered.map(order => {
          const items = order.items as CartItem[]
          const first = items[0]
          const date  = new Date(order.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })
          return (
            <div key={order.id}
              className="bg-void-surface hover:bg-void-card transition-colors duration-150 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 items-start px-4 py-4">

              <div>
                <p className="font-sans text-void-white text-xs">{date}</p>
                <p className="font-mono text-void-muted text-[10px]">{order.id.slice(0, 8)}…</p>
              </div>

              <div className="flex items-start gap-3">
                {first?.image && (
                  <div className="relative w-8 h-8 bg-void-card shrink-0 mt-0.5">
                    <Image src={first.image} alt={first.name} fill className="object-contain" sizes="32px" />
                  </div>
                )}
                <div className="min-w-0 space-y-0.5">
                  {items.map(item => (
                    <p key={item.id} className="font-sans text-void-white text-xs truncate">
                      {item.name}<span className="text-void-muted ml-1.5">× {item.quantity}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                <p className="font-sans text-void-white text-xs truncate">
                  {order.shipping?.firstName} {order.shipping?.lastName}
                </p>
                <p className="font-sans text-void-muted text-xs capitalize">
                  {order.card_brand} ···· {order.card_last4}
                </p>
              </div>

              <p className="font-sans text-void-white text-sm">€{order.total.toLocaleString()}</p>

              <OrderStatusSelect orderId={order.id} current={order.status as OrderStatus} />
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-void-border flex justify-between">
        <p className="font-sans text-void-muted text-xs">
          {filtered.length}{query ? ` of ${orders.length}` : ''} orders
        </p>
        <p className="font-sans text-void-muted text-xs">
          Revenue · <span className="text-void-white">€{totalRevenue.toLocaleString()}</span>
        </p>
      </div>
    </>
  )
}
