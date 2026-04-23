export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import KPICard from '@/components/admin/KPICard'
import RevenueChart from '@/components/admin/RevenueChart'
import type { OrderStatus } from '@/app/actions/orders'

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Delivered:  { color: '#4DFFB4', bg: 'rgba(77,255,180,0.08)'  },
  Shipped:    { color: '#E8E8E8', bg: 'rgba(232,232,232,0.06)' },
  Processing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)'  },
  Cancelled:  { color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)' },
}

type CartItem = { id: string; name: string; price: number; quantity: number; image: string }

export default async function AdminPage() {
  const supabase = await createClient()

  const [{ data: allOrders }, { data: recentOrders }, { data: products }] = await Promise.all([
    supabase.from('orders').select('id, total, user_id, status, created_at, items'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('*').order('price', { ascending: false }),
  ])

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const activeOrders    = (allOrders ?? []).filter(o => o.status !== 'Cancelled')
  const totalRevenue    = activeOrders.reduce((s, o) => s + o.total, 0)
  const orderCount      = (allOrders ?? []).length
  const uniqueCustomers = new Set((allOrders ?? []).map(o => o.user_id)).size
  const aov             = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0

  // Month-over-month trend
  const now       = new Date()
  const thisMonth = (allOrders ?? []).filter(o => {
    const d = new Date(o.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const lastMonth = (allOrders ?? []).filter(o => {
    const d    = new Date(o.created_at)
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return d.getMonth() === prev.getMonth() && d.getFullYear() === prev.getFullYear()
  })
  const thisRevenue = thisMonth.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0)
  const lastRevenue = lastMonth.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0)
  const revTrend    = lastRevenue > 0 ? +((thisRevenue - lastRevenue) / lastRevenue * 100).toFixed(1) : 0
  const ordTrend    = lastMonth.length > 0 ? +((thisMonth.length - lastMonth.length) / lastMonth.length * 100).toFixed(1) : 0

  // ── Sparklines from real data (last 12 monthly revenue points) ────────────
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const d       = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    const label   = d.toLocaleDateString('en-GB', { month: 'short' })
    const bucket  = (allOrders ?? []).filter(o => {
      const od = new Date(o.created_at)
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear()
    })
    const revenue = bucket.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0)
    return { month: label, revenue, orders: bucket.length }
  })

  const revenueSparkline   = monthlyData.map(m => m.revenue)
  const ordersSparkline    = monthlyData.map(m => m.orders)
  // customers + AOV stay flat sparklines (no time-series data readily available)
  const customersSparkline = Array(12).fill(uniqueCustomers)
  const aovSparkline       = Array(12).fill(aov)

  // ── Real units sold per product from order items ──────────────────────────
  const salesMap = new Map<string, { qty: number; revenue: number; name: string; image: string }>()
  for (const order of (allOrders ?? []).filter(o => o.status !== 'Cancelled')) {
    for (const item of (order.items as CartItem[])) {
      // Normalise ID: strip "-black" suffix to match product table IDs
      const pid  = item.id.endsWith('-black') ? item.id.slice(0, -6) : item.id
      const prev = salesMap.get(pid) ?? { qty: 0, revenue: 0, name: item.name, image: item.image }
      salesMap.set(pid, {
        qty:     prev.qty + item.quantity,
        revenue: prev.revenue + item.price * item.quantity,
        name:    item.name,
        image:   item.image,
      })
    }
  }

  const orders      = recentOrders ?? []
  const allProducts = products ?? []

  // Enrich products with real sales, sort by revenue desc
  const topProducts = allProducts
    .map(p => {
      const sales = salesMap.get(p.id) ?? { qty: 0, revenue: 0 }
      return { ...p, unitsSold: sales.qty, realRevenue: sales.revenue }
    })
    .sort((a, b) => b.realRevenue - a.realRevenue)

  const maxRevenue = Math.max(...topProducts.map(p => p.realRevenue), 1)
  const nowLabel   = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="pb-8 border-b border-void-border">
        <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">
          Admin · {nowLabel}
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">
          Overview.
        </h1>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-px bg-void-border">
        <KPICard label="Total Revenue"    value={totalRevenue}    unit="€" trend={revTrend} period="vs last month" sparkline={revenueSparkline}   format="currency" index={0} />
        <KPICard label="Orders"           value={orderCount}      unit=""  trend={ordTrend} period="vs last month" sparkline={ordersSparkline}    index={1} />
        <KPICard label="Customers"        value={uniqueCustomers} unit=""  trend={0}        period="total"         sparkline={customersSparkline} index={2} />
        <KPICard label="Avg. Order Value" value={aov}             unit="€" trend={0}        period="all time"      sparkline={aovSparkline}       format="currency" index={3} />
      </div>

      {/* Revenue Chart — real data */}
      <div className="bg-void-surface border border-void-border p-6">
        <RevenueChart data={monthlyData} />
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-void-border">

        {/* Recent Orders */}
        <div className="bg-void-surface p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans text-void-white text-sm tracking-[0.15em] uppercase">Recent Orders</h2>
            <Link href="/admin/orders" className="font-sans text-void-muted text-xs hover:text-void-green transition-colors">
              View all →
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="font-sans text-void-muted text-xs">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const items    = order.items as CartItem[]
                const first    = items[0]
                const totalQty = items.reduce((q, i) => q + i.quantity, 0)
                const s        = STATUS_STYLES[order.status as OrderStatus] ?? STATUS_STYLES['Processing']
                return (
                  <div key={order.id} className="flex items-center gap-3">
                    <div className="relative w-8 h-8 bg-void-card shrink-0 overflow-hidden">
                      {first?.image && (
                        <Image src={first.image} alt={first.name} fill className="object-contain" sizes="32px" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-void-white text-xs truncate">
                        {order.shipping?.firstName} {order.shipping?.lastName}
                      </p>
                      <p className="font-sans text-void-muted text-xs truncate">
                        {totalQty} item{totalQty !== 1 ? 's' : ''}{items.length > 1 ? ` · ${items.length} products` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-sans text-void-white text-xs">€{order.total.toLocaleString()}</p>
                      <span className="font-sans text-[10px] px-1.5 py-0.5" style={{ color: s.color, background: s.bg }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-void-surface p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans text-void-white text-sm tracking-[0.15em] uppercase">Top Products</h2>
            <Link href="/admin/products" className="font-sans text-void-muted text-xs hover:text-void-green transition-colors">
              View all →
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <p className="font-sans text-void-muted text-xs">No products yet.</p>
          ) : (
            <div className="space-y-5">
              {topProducts.slice(0, 4).map((product, i) => {
                const pct = (product.realRevenue / maxRevenue) * 100
                return (
                  <div key={product.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-void-muted text-xs w-4">{i + 1}</span>
                        {product.image_black && (
                          <div className="relative w-6 h-6 shrink-0">
                            <Image src={product.image_black} alt={product.name} fill className="object-contain" sizes="24px" />
                          </div>
                        )}
                        <div>
                          <p className="font-sans text-void-white text-xs">{product.name}</p>
                          <p className="font-sans text-void-muted text-[10px]">
                            {product.unitsSold > 0 ? `${product.unitsSold} sold · ` : ''}{product.stock} left
                          </p>
                        </div>
                      </div>
                      <p className="font-sans text-void-white text-xs">
                        {product.realRevenue > 0 ? `€${product.realRevenue.toLocaleString()}` : '—'}
                      </p>
                    </div>
                    <div className="h-px bg-void-border overflow-hidden">
                      <div className="h-full bg-void-green transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
