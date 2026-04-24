'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronUp, ChevronDown, X, Trash2, ShoppingBag, CreditCard } from 'lucide-react'
import gsap from 'gsap'
import AdminSearchBar from '@/components/admin/AdminSearchBar'
import { deleteUser }  from '@/app/actions/users'

type UserOrder = { id: string; total: number; status: string; created_at: string; items: unknown[] }

type User = {
  id: string; name: string; initials: string; email: string
  joined: string; count: number; spent: number; isActive: boolean
  lastOrderAt: string | null; orders: UserOrder[]
}

type SortKey = 'name' | 'joined' | 'count' | 'spent'
type SortDir = 'asc' | 'desc'

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Delivered:  { color: '#4DFFB4', bg: 'rgba(77,255,180,0.08)'  },
  Shipped:    { color: '#E8E8E8', bg: 'rgba(232,232,232,0.06)' },
  Processing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)'  },
  Cancelled:  { color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)' },
}

function useModal(open: boolean) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const overlay    = overlayRef.current
    const blockWheel = (e: WheelEvent) => e.preventDefault()
    overlay?.addEventListener('wheel', blockWheel, { passive: false })
    gsap.fromTo(overlay,       { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
    gsap.fromTo(cardRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' })
    return () => overlay?.removeEventListener('wheel', blockWheel)
  }, [open])

  return { overlayRef, cardRef }
}

export default function AdminUsersClient({ users, totalRevenue, avgLTV }: {
  users: User[]
  totalRevenue: number
  avgLTV: number
}) {
  const [query,      setQuery]      = useState('')
  const [sortKey,    setSortKey]    = useState<SortKey>('spent')
  const [sortDir,    setSortDir]    = useState<SortDir>('desc')
  const [selected,   setSelected]   = useState<User | null>(null)
  const [toDelete,   setToDelete]   = useState<User | null>(null)
  const [deleting,   setDeleting]   = useState(false)

  const detailModal = useModal(!!selected)
  const deleteModal = useModal(!!toDelete)

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
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
    await deleteUser(toDelete.id)
    setDeleting(false)
    closeDelete()
  }

  const filtered = (query.trim()
    ? users.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
      )
    : [...users]
  ).sort((a, b) => {
    let diff = 0
    if (sortKey === 'name')   diff = a.name.localeCompare(b.name)
    if (sortKey === 'joined') diff = new Date(a.joined).getTime() - new Date(b.joined).getTime()
    if (sortKey === 'count')  diff = a.count - b.count
    if (sortKey === 'spent')  diff = a.spent - b.spent
    return sortDir === 'asc' ? diff : -diff
  })

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown size={11} className="text-void-border ml-1 inline" />
    return sortDir === 'asc'
      ? <ChevronUp   size={11} className="text-void-green ml-1 inline" />
      : <ChevronDown size={11} className="text-void-green ml-1 inline" />
  }

  const COLS: { label: string; key: SortKey | null }[] = [
    { label: 'Customer', key: 'name'   },
    { label: 'Joined',   key: 'joined' },
    { label: 'Orders',   key: 'count'  },
    { label: 'Spent',    key: 'spent'  },
    { label: 'Status',   key: null     },
    { label: '',         key: null     },
  ]

  return (
    <>
      <div className="mb-4">
        <AdminSearchBar value={query} onChange={setQuery} placeholder="Search by name or email…" />
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 mb-2">
        {COLS.map(({ label, key }) => (
          <button
            key={label}
            onClick={() => key && handleSort(key)}
            disabled={!key}
            className="flex items-center font-sans text-void-muted text-xs tracking-[0.12em] uppercase text-left disabled:cursor-default hover:text-void-white transition-colors duration-150"
          >
            {label}
            {key && <SortIcon k={key} />}
          </button>
        ))}
      </div>

      <div className="space-y-px">
        {filtered.length === 0 ? (
          <p className="font-sans text-void-muted text-xs py-8 text-center">No users match "{query}"</p>
        ) : filtered.map(user => (
          <div
            key={user.id}
            className="bg-void-surface hover:bg-void-card transition-colors duration-150 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-4 cursor-pointer group"
            onClick={() => setSelected(user)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-void-card border border-void-border flex items-center justify-center shrink-0">
                <span className="font-display text-void-green text-[10px]">{user.initials}</span>
              </div>
              <div className="min-w-0">
                <p className="font-sans text-void-white text-sm group-hover:text-void-green transition-colors duration-150">{user.name}</p>
                <p className="font-sans text-void-muted text-xs truncate">{user.email}</p>
              </div>
            </div>

            <p className="font-sans text-void-muted text-xs">{user.joined}</p>
            <p className="font-sans text-void-white text-sm">{user.count}</p>
            <p className="font-sans text-void-white text-sm">
              {user.spent > 0 ? `€${user.spent.toLocaleString()}` : '—'}
            </p>

            <span className="font-sans text-xs px-2 py-0.5 w-fit"
              style={{
                color:      user.isActive ? '#4DFFB4' : '#444',
                background: user.isActive ? 'rgba(77,255,180,0.08)' : 'rgba(102,102,102,0.06)',
              }}>
              {user.isActive ? 'Active' : 'No orders'}
            </span>

            {/* Delete btn — stop propagation */}
            <button
              onClick={e => { e.stopPropagation(); setToDelete(user) }}
              aria-label={`Delete ${user.name}`}
              className="p-2 text-void-muted hover:text-red-400 transition-colors duration-200"
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-void-border flex justify-between">
        <p className="font-sans text-void-muted text-xs">
          {filtered.length}{query ? ` of ${users.length}` : ''} user{users.length !== 1 ? 's' : ''}
        </p>
        <p className="font-sans text-void-muted text-xs">
          Avg LTV · <span className="text-void-white">€{avgLTV.toLocaleString()}</span>
        </p>
      </div>

      {/* ── User detail modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            ref={detailModal.overlayRef}
            onClick={closeDetail}
            className="absolute inset-0 bg-black/70"
            aria-hidden="true"
          />
          <div
            ref={detailModal.cardRef}
            className="relative z-10 w-full max-w-lg bg-void-surface border border-void-border"
            role="dialog"
            aria-modal="true"
            aria-label={`User profile — ${selected.name}`}
          >
            <button onClick={closeDetail} aria-label="Close" className="absolute top-4 right-4 text-void-muted hover:text-void-white transition-colors">
              <X size={16} strokeWidth={1.5} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 px-8 pt-8 pb-6 border-b border-void-border">
              <div className="w-12 h-12 rounded-full bg-void-card border border-void-border flex items-center justify-center shrink-0">
                <span className="font-display text-void-green text-sm">{selected.initials}</span>
              </div>
              <div className="min-w-0">
                <p className="font-sans text-void-white text-base">{selected.name}</p>
                <p className="font-sans text-void-muted text-xs truncate">{selected.email}</p>
              </div>
              <span
                className="ml-auto font-sans text-xs px-2 py-0.5 shrink-0"
                style={{
                  color:      selected.isActive ? '#4DFFB4' : '#444',
                  background: selected.isActive ? 'rgba(77,255,180,0.08)' : 'rgba(102,102,102,0.06)',
                }}
              >
                {selected.isActive ? 'Active' : 'No orders'}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-px bg-void-border">
              {[
                { label: 'Member since', value: selected.joined },
                { label: 'Orders',       value: selected.count },
                { label: 'Total spent',  value: selected.spent > 0 ? `€${selected.spent.toLocaleString()}` : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-void-surface px-5 py-4">
                  <p className="font-sans text-void-muted text-[10px] tracking-[0.15em] uppercase mb-1">{label}</p>
                  <p className="font-display text-void-white text-xl">{value}</p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="px-8 py-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={13} strokeWidth={1.5} className="text-void-muted" />
                <p className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase">Recent orders</p>
              </div>

              {selected.orders.length === 0 ? (
                <p className="font-sans text-void-muted text-xs py-4 text-center">No orders yet.</p>
              ) : (
                <div className="space-y-px">
                  {selected.orders.map(order => {
                    const s    = STATUS_STYLES[order.status] ?? STATUS_STYLES['Processing']
                    const date = new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    return (
                      <div key={order.id} className="flex items-center justify-between bg-void-card px-4 py-3">
                        <div className="flex items-center gap-3">
                          <CreditCard size={12} strokeWidth={1.5} className="text-void-muted shrink-0" />
                          <div>
                            <p className="font-mono text-void-muted text-[10px]">#{order.id.slice(0, 8)}</p>
                            <p className="font-sans text-void-muted text-[10px]">{date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-sans text-void-white text-sm">€{order.total.toLocaleString()}</p>
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

            {/* Footer */}
            <div className="px-8 pb-8 flex gap-3">
              <button
                onClick={closeDetail}
                className="flex-1 py-3 border border-void-border text-void-muted font-sans text-xs tracking-[0.15em] uppercase hover:text-void-white hover:border-void-white transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={() => { closeDetail(); setTimeout(() => setToDelete(selected), 250) }}
                className="py-3 px-6 bg-[#FF6B6B]/10 border border-[#FF6B6B]/40 text-[#FF6B6B] font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#FF6B6B]/20 transition-colors duration-200"
              >
                Delete user
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            ref={deleteModal.overlayRef}
            onClick={closeDelete}
            className="absolute inset-0 bg-black/70"
            aria-hidden="true"
          />
          <div
            ref={deleteModal.cardRef}
            className="relative z-10 w-full max-w-sm bg-void-surface border border-void-border px-8 py-8"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm user deletion"
          >
            <button onClick={closeDelete} aria-label="Close" className="absolute top-4 right-4 text-void-muted hover:text-void-white transition-colors">
              <X size={16} strokeWidth={1.5} />
            </button>

            <p className="font-sans text-void-muted text-[10px] tracking-[0.2em] uppercase mb-3">User account</p>
            <h2 className="font-display text-void-white text-2xl tracking-tight mb-2">Delete this user?</h2>
            <p className="font-sans text-void-white text-sm mb-1">{toDelete.name}</p>
            <p className="font-sans text-void-muted text-sm leading-relaxed mb-8">
              This will permanently delete their account and all associated data. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeDelete}
                className="flex-1 py-3 border border-void-border text-void-muted font-sans text-xs tracking-[0.15em] uppercase hover:text-void-white hover:border-void-white transition-colors duration-200"
              >
                Keep it
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/40 text-[#FF6B6B] font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#FF6B6B]/20 transition-colors duration-200 disabled:opacity-40"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
