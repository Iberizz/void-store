'use client'

import { useState, useRef, useEffect, useCallback, useTransition } from 'react'
import Image from 'next/image'
import { ChevronUp, ChevronDown, X, Trash2, Package, MapPin, CreditCard } from 'lucide-react'
import gsap from 'gsap'
import AdminSearchBar from '@/components/admin/AdminSearchBar'
import { updateOrderStatus, deleteOrder, type OrderStatus } from '@/app/actions/orders'

type CartItem = { id: string; name: string; price: number; quantity: number; image: string; slug: string }
type Shipping  = { firstName: string; lastName: string; address?: string; city?: string; postal?: string; country?: string }
type Order = {
  id: string; created_at: string; items: CartItem[]; shipping: Shipping
  card_brand: string; card_last4: string; total: number; status: string; user_id: string
}
type Filter  = 'all' | OrderStatus
type SortKey = 'date' | 'amount' | 'customer'
type SortDir = 'asc' | 'desc'

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Processing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.25)'  },
  Shipped:    { color: '#E8E8E8', bg: 'rgba(232,232,232,0.06)', border: 'rgba(232,232,232,0.15)' },
  Delivered:  { color: '#4DFFB4', bg: 'rgba(77,255,180,0.08)',  border: 'rgba(77,255,180,0.25)'  },
  Cancelled:  { color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.25)' },
}
const STATUSES: OrderStatus[] = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

function initials(s: Shipping) {
  return `${s.firstName?.[0] ?? ''}${s.lastName?.[0] ?? ''}`.toUpperCase()
}
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7)   return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
function cardBrandLabel(brand: string) {
  if (brand === 'visa')       return 'Visa'
  if (brand === 'mastercard') return 'MC'
  if (brand === 'amex')       return 'Amex'
  return brand
}

function useModal(open: boolean) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const overlay    = overlayRef.current
    const blockWheel = (e: WheelEvent) => e.preventDefault()
    overlay?.addEventListener('wheel', blockWheel, { passive: false })
    gsap.fromTo(overlay,         { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
    gsap.fromTo(cardRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' })
    return () => overlay?.removeEventListener('wheel', blockWheel)
  }, [open])
  return { overlayRef, cardRef }
}

export default function AdminOrdersClient({ orders }: { orders: Order[] }) {
  const [query,         setQuery]         = useState('')
  const [filter,        setFilter]        = useState<Filter>('all')
  const [sortKey,       setSortKey]       = useState<SortKey>('date')
  const [sortDir,       setSortDir]       = useState<SortDir>('desc')
  const [selected,      setSelected]      = useState<Order | null>(null)
  const [toDelete,      setToDelete]      = useState<Order | null>(null)
  const [deleting,      setDeleting]      = useState(false)
  const [deletedIds,    setDeletedIds]    = useState<Set<string>>(new Set())
  const [localStatuses, setLocalStatuses] = useState<Record<string, OrderStatus>>({})
  const [, startTransition] = useTransition()

  const detailModal = useModal(!!selected)
  const deleteModal = useModal(!!toDelete)

  const getStatus = (o: Order): OrderStatus => (localStatuses[o.id] ?? o.status) as OrderStatus

  const visible = orders.filter(o => !deletedIds.has(o.id))

  // Stats (live)
  const nonCancelled = visible.filter(o => getStatus(o) !== 'Cancelled')
  const revenue      = nonCancelled.reduce((s, o) => s + o.total, 0)
  const avgOrder     = nonCancelled.length > 0 ? Math.round(revenue / nonCancelled.length) : 0
  const pending      = visible.filter(o => getStatus(o) === 'Processing').length
  const maxTotal     = Math.max(...visible.map(o => o.total), 1)

  function handleSort(k: SortKey) {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('desc') }
  }
  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown size={11} className="text-void-border ml-1 inline" />
    return sortDir === 'asc'
      ? <ChevronUp   size={11} className="text-void-green ml-1 inline" />
      : <ChevronDown size={11} className="text-void-green ml-1 inline" />
  }

  function changeStatus(order: Order, next: OrderStatus) {
    setLocalStatuses(s => ({ ...s, [order.id]: next }))
    startTransition(async () => { await updateOrderStatus(order.id, next) })
  }

  const closeDetail = useCallback(() => {
    gsap.to(detailModal.cardRef.current,    { opacity: 0, y: 8, duration: 0.2, ease: 'power2.in' })
    gsap.to(detailModal.overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => setSelected(null) })
  }, [detailModal])

  const closeDelete = useCallback(() => {
    gsap.to(deleteModal.cardRef.current,    { opacity: 0, y: 8, duration: 0.2, ease: 'power2.in' })
    gsap.to(deleteModal.overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => setToDelete(null) })
  }, [deleteModal])

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    await deleteOrder(toDelete.id)
    setDeletedIds(s => new Set(s).add(toDelete.id))
    setDeleting(false)
    closeDelete()
    if (selected?.id === toDelete.id) closeDetail()
  }

  const FILTERS: { value: Filter; label: string }[] = [
    { value: 'all',        label: 'All'        },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped',    label: 'Shipped'    },
    { value: 'Delivered',  label: 'Delivered'  },
    { value: 'Cancelled',  label: 'Cancelled'  },
  ]

  const filtered = visible
    .filter(o => {
      if (filter !== 'all' && getStatus(o) !== filter) return false
      if (!query.trim()) return true
      const q    = query.toLowerCase()
      const name = `${o.shipping?.firstName ?? ''} ${o.shipping?.lastName ?? ''}`.toLowerCase()
      return name.includes(q) || o.id.toLowerCase().includes(q) ||
        (o.items as CartItem[]).some(i => i.name.toLowerCase().includes(q))
    })
    .sort((a, b) => {
      let diff = 0
      if (sortKey === 'date')     diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sortKey === 'amount')   diff = a.total - b.total
      if (sortKey === 'customer') diff = `${a.shipping?.firstName}${a.shipping?.lastName}`.localeCompare(`${b.shipping?.firstName}${b.shipping?.lastName}`)
      return sortDir === 'asc' ? diff : -diff
    })

  return (
    <>
      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-void-border mb-8">
        {[
          { label: 'Orders',    value: visible.length                                              },
          { label: 'Revenue',   value: `€${revenue.toLocaleString()}`,  accent: true              },
          { label: 'Avg order', value: `€${avgOrder.toLocaleString()}`                            },
          { label: 'Pending',   value: pending, warn: pending > 0                                 },
        ].map(({ label, value, accent, warn }) => (
          <div key={label} className="bg-void-surface px-6 py-4">
            <p className="font-sans text-void-muted text-[10px] tracking-[0.2em] uppercase mb-1">{label}</p>
            <p className="font-display text-2xl" style={{ color: accent ? '#4DFFB4' : warn ? '#F59E0B' : '#E8E8E8' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Search + Filter tabs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <AdminSearchBar value={query} onChange={setQuery} placeholder="Search by customer, product or order ID…" />
        </div>
        <div className="flex items-end border-b border-void-border">
          {FILTERS.map(({ value, label }) => {
            const count  = value === 'all' ? visible.length : visible.filter(o => getStatus(o) === value).length
            const active = filter === value
            const s      = value !== 'all' ? STATUS_STYLE[value] : null
            return (
              <button key={value} onClick={() => setFilter(value)}
                className="font-sans text-xs tracking-[0.1em] uppercase px-3 py-2 transition-colors duration-150 flex items-center gap-1.5"
                style={{ color: active ? (s?.color ?? '#4DFFB4') : '#444', borderBottom: `1px solid ${active ? (s?.color ?? '#4DFFB4') : 'transparent'}`, marginBottom: '-1px' }}>
                {label}
                {count > 0 && <span className="font-mono text-[10px] opacity-70">{count}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[2fr_2fr_auto_auto_auto_auto] gap-4 px-4 mb-2">
        {([
          { label: 'Customer', key: 'customer' as SortKey },
          { label: 'Items',    key: null                  },
          { label: 'Date',     key: 'date'     as SortKey },
          { label: 'Amount',   key: 'amount'   as SortKey },
          { label: 'Status',   key: null                  },
          { label: '',         key: null                  },
        ]).map(({ label, key }) => (
          <button key={label} onClick={() => key && handleSort(key)} disabled={!key}
            className="flex items-center font-sans text-void-muted text-xs tracking-[0.12em] uppercase text-left disabled:cursor-default hover:text-void-white transition-colors duration-150">
            {label}{key && <SortIcon k={key} />}
          </button>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-px">
        {filtered.length === 0 ? (
          <p className="font-sans text-void-muted text-xs py-12 text-center">
            {query ? `No orders match "${query}"` : `No ${filter === 'all' ? '' : filter + ' '}orders.`}
          </p>
        ) : filtered.map(order => {
          const items  = order.items as CartItem[]
          const status = getStatus(order)
          const s      = STATUS_STYLE[status] ?? STATUS_STYLE.Processing
          const pct    = (order.total / maxTotal) * 100

          return (
            <div key={order.id}
              className="group bg-void-surface hover:bg-void-card transition-colors duration-150 grid grid-cols-1 md:grid-cols-[2fr_2fr_auto_auto_auto_auto] gap-4 items-center px-4 py-4 cursor-pointer"
              onClick={() => setSelected(order)}>

              {/* Customer */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-void-card border border-void-border flex items-center justify-center shrink-0">
                  <span className="font-display text-void-muted text-[10px]">{initials(order.shipping)}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-void-white text-xs group-hover:text-void-green transition-colors duration-150">
                    {order.shipping?.firstName} {order.shipping?.lastName}
                  </p>
                  <p className="font-sans text-void-muted text-[10px]">
                    {cardBrandLabel(order.card_brand)} ···· {order.card_last4}
                  </p>
                </div>
              </div>

              {/* Items thumbnails */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  {items.slice(0, 3).map((item, idx) => (
                    <div key={item.id} className="relative w-8 h-8 bg-void-card border border-void-border shrink-0"
                      style={{ zIndex: 3 - idx }}>
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-contain p-0.5" sizes="32px" />
                      )}
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="w-8 h-8 bg-void-card border border-void-border flex items-center justify-center shrink-0">
                      <span className="font-mono text-void-muted text-[9px]">+{items.length - 3}</span>
                    </div>
                  )}
                </div>
                <p className="font-sans text-void-muted text-[10px]">
                  {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Date */}
              <p className="font-mono text-void-muted text-[10px] whitespace-nowrap">{timeAgo(order.created_at)}</p>

              {/* Amount + mini bar */}
              <div className="flex flex-col gap-1 min-w-[64px]">
                <p className="font-sans text-void-white text-sm">€{order.total.toLocaleString()}</p>
                <div className="h-px bg-void-border overflow-hidden w-16">
                  <div className="h-full bg-void-green transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>

              {/* Status */}
              <span className="font-sans text-xs px-2 py-0.5 whitespace-nowrap"
                style={{ color: s.color, background: s.bg }}>
                {status}
              </span>

              {/* Delete action */}
              <button onClick={e => { e.stopPropagation(); setToDelete(order) }}
                aria-label="Delete order"
                className="p-2 text-void-muted hover:text-red-400 transition-colors duration-200">
                <Trash2 size={13} strokeWidth={1.5} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-void-border flex justify-between">
        <p className="font-sans text-void-muted text-xs">
          {filtered.length}{query || filter !== 'all' ? ` of ${visible.length}` : ''} order{visible.length !== 1 ? 's' : ''}
        </p>
        <p className="font-sans text-void-muted text-xs">
          Revenue · <span className="text-void-white">€{revenue.toLocaleString()}</span>
        </p>
      </div>

      {/* ── Detail modal ── */}
      {selected && (() => {
        const items  = selected.items as CartItem[]
        const status = getStatus(selected)
        const s      = STATUS_STYLE[status] ?? STATUS_STYLE.Processing
        const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
        const shipping = selected.total - subtotal

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div ref={detailModal.overlayRef} onClick={closeDetail} className="absolute inset-0 bg-black/70" aria-hidden="true" />
            <div ref={detailModal.cardRef}
              className="relative z-10 w-full max-w-xl bg-void-surface border border-void-border flex flex-col max-h-[90vh]"
              role="dialog" aria-modal="true" aria-label={`Order ${selected.id.slice(0, 8)}`}>

              <button onClick={closeDetail} aria-label="Close"
                className="absolute top-4 right-4 text-void-muted hover:text-void-white transition-colors z-10">
                <X size={16} strokeWidth={1.5} />
              </button>

              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-void-border shrink-0">
                <div className="flex items-start justify-between pr-8">
                  <div>
                    <p className="font-sans text-void-muted text-[10px] tracking-[0.2em] uppercase mb-1">Order</p>
                    <p className="font-mono text-void-white text-lg tracking-widest">#{selected.id.slice(0, 8).toUpperCase()}</p>
                    <p className="font-sans text-void-muted text-xs mt-0.5">{timeAgo(selected.created_at)}</p>
                  </div>
                  <span className="font-sans text-xs px-2 py-1" style={{ color: s.color, background: s.bg }}>
                    {status}
                  </span>
                </div>

                {/* Status pills */}
                <div className="flex gap-2 flex-wrap mt-5">
                  {STATUSES.map(st => {
                    const ss       = STATUS_STYLE[st]
                    const isActive = status === st
                    return (
                      <button key={st} onClick={() => changeStatus(selected, st)}
                        className="font-sans text-xs tracking-[0.08em] uppercase px-3 py-1.5 transition-all duration-150"
                        style={{
                          color:      isActive ? ss.color : '#444',
                          background: isActive ? ss.bg : 'transparent',
                          border:     `1px solid ${isActive ? ss.border : '#1C1C1C'}`,
                        }}>
                        {st}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto" data-lenis-prevent>

                {/* Items */}
                <div className="px-8 py-6 border-b border-void-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Package size={12} strokeWidth={1.5} className="text-void-muted" />
                    <p className="font-sans text-void-muted text-[10px] tracking-[0.15em] uppercase">Items</p>
                  </div>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-void-card border border-void-border shrink-0">
                          {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="40px" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-void-white text-xs truncate">{item.name}</p>
                          <p className="font-sans text-void-muted text-[10px]">× {item.quantity}</p>
                        </div>
                        <p className="font-sans text-void-white text-xs shrink-0">
                          €{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Breakdown */}
                <div className="px-8 py-5 border-b border-void-border space-y-2">
                  <div className="flex justify-between">
                    <span className="font-sans text-void-muted text-xs">Subtotal</span>
                    <span className="font-sans text-void-white text-xs">€{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-void-muted text-xs">Shipping</span>
                    <span className="font-sans text-void-white text-xs">{shipping > 0 ? `€${shipping}` : 'Free'}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-void-border">
                    <span className="font-sans text-void-white text-xs tracking-[0.1em] uppercase">Total</span>
                    <span className="font-display text-void-green text-lg">€{selected.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Customer + Shipping */}
                <div className="px-8 py-5 grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard size={12} strokeWidth={1.5} className="text-void-muted" />
                      <p className="font-sans text-void-muted text-[10px] tracking-[0.15em] uppercase">Customer</p>
                    </div>
                    <p className="font-sans text-void-white text-xs mb-0.5">
                      {selected.shipping?.firstName} {selected.shipping?.lastName}
                    </p>
                    <p className="font-sans text-void-muted text-xs">
                      {cardBrandLabel(selected.card_brand)} ···· {selected.card_last4}
                    </p>
                  </div>
                  {selected.shipping?.address && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={12} strokeWidth={1.5} className="text-void-muted" />
                        <p className="font-sans text-void-muted text-[10px] tracking-[0.15em] uppercase">Shipping</p>
                      </div>
                      <p className="font-sans text-void-muted text-xs leading-relaxed">
                        {selected.shipping.address}<br />
                        {selected.shipping.postal} {selected.shipping.city}<br />
                        {selected.shipping.country}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer actions */}
              <div className="px-8 py-5 border-t border-void-border flex gap-3 shrink-0">
                <button onClick={closeDetail}
                  className="flex-1 py-3 border border-void-border text-void-muted font-sans text-xs tracking-[0.15em] uppercase hover:text-void-white hover:border-void-white transition-colors duration-200">
                  Close
                </button>
                <button onClick={() => { closeDetail(); setTimeout(() => setToDelete(selected), 250) }}
                  className="py-3 px-6 bg-[#FF6B6B]/10 border border-[#FF6B6B]/40 text-[#FF6B6B] font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#FF6B6B]/20 transition-colors duration-200">
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Delete confirm modal ── */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div ref={deleteModal.overlayRef} onClick={closeDelete} className="absolute inset-0 bg-black/70" aria-hidden="true" />
          <div ref={deleteModal.cardRef}
            className="relative z-10 w-full max-w-sm bg-void-surface border border-void-border px-8 py-8"
            role="dialog" aria-modal="true" aria-label="Confirm order deletion">
            <button onClick={closeDelete} aria-label="Close"
              className="absolute top-4 right-4 text-void-muted hover:text-void-white transition-colors">
              <X size={16} strokeWidth={1.5} />
            </button>
            <p className="font-sans text-void-muted text-[10px] tracking-[0.2em] uppercase mb-3">Order</p>
            <h2 className="font-display text-void-white text-2xl tracking-tight mb-2">Delete this order?</h2>
            <p className="font-sans text-void-white text-sm mb-1">
              #{toDelete.id.slice(0, 8).toUpperCase()} · {toDelete.shipping?.firstName} {toDelete.shipping?.lastName}
            </p>
            <p className="font-sans text-void-muted text-sm leading-relaxed mb-8">
              This action cannot be undone. Stock will not be automatically restored.
            </p>
            <div className="flex gap-3">
              <button onClick={closeDelete}
                className="flex-1 py-3 border border-void-border text-void-muted font-sans text-xs tracking-[0.15em] uppercase hover:text-void-white hover:border-void-white transition-colors duration-200">
                Keep it
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/40 text-[#FF6B6B] font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#FF6B6B]/20 transition-colors duration-200 disabled:opacity-40">
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
