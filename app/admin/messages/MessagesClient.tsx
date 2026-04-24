'use client'

import { useState, useRef, useEffect, useCallback, useTransition } from 'react'
import { ChevronUp, ChevronDown, Reply, Trash2, X, Mail, CheckCheck } from 'lucide-react'
import gsap from 'gsap'
import AdminSearchBar      from '@/components/admin/AdminSearchBar'
import MessageReplyModal   from '@/components/admin/MessageReplyModal'
import { updateMessageStatus, deleteMessage } from '@/app/actions/contact'

type Message = {
  id: string; name: string; email: string; topic: string
  message: string; status: string; processed_by: string | null; created_at: string
}
type Filter  = 'all' | 'new' | 'read' | 'processed'
type SortKey = 'date' | 'name'
type SortDir = 'asc' | 'desc'

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  new:       { color: '#4DFFB4', bg: 'rgba(77,255,180,0.08)',   label: 'New'       },
  read:      { color: '#E8E8E8', bg: 'rgba(232,232,232,0.06)', label: 'Read'      },
  processed: { color: '#666666', bg: 'rgba(102,102,102,0.08)', label: 'Processed' },
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase()
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7)   return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
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

export default function MessagesClient({ messages }: { messages: Message[] }) {
  const [query,          setQuery]          = useState('')
  const [filter,         setFilter]         = useState<Filter>('all')
  const [sortKey,        setSortKey]        = useState<SortKey>('date')
  const [sortDir,        setSortDir]        = useState<SortDir>('desc')
  const [selected,       setSelected]       = useState<Message | null>(null)
  const [replying,       setReplying]       = useState<Message | null>(null)
  const [toDelete,       setToDelete]       = useState<Message | null>(null)
  const [deleting,       setDeleting]       = useState(false)
  const [deletedIds,     setDeletedIds]     = useState<Set<string>>(new Set())
  const [localStatuses,  setLocalStatuses]  = useState<Record<string, string>>({})
  const [, startTransition] = useTransition()

  const detailModal = useModal(!!selected)
  const deleteModal = useModal(!!toDelete)

  const getStatus = (id: string, fallback: string) => localStatuses[id] ?? fallback

  const visible = messages.filter(m => !deletedIds.has(m.id))

  // Stats use live statuses
  const stats = {
    total:     visible.length,
    unread:    visible.filter(m => getStatus(m.id, m.status) === 'new').length,
    processed: visible.filter(m => getStatus(m.id, m.status) === 'processed').length,
  }

  const filtered = visible
    .filter(m => {
      const s = getStatus(m.id, m.status)
      if (filter !== 'all' && s !== filter) return false
      if (!query.trim()) return true
      const q = query.toLowerCase()
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.topic.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      const diff = sortKey === 'date'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : a.name.localeCompare(b.name)
      return sortDir === 'asc' ? diff : -diff
    })

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

  function openDetail(msg: Message) {
    setSelected(msg)
    if (getStatus(msg.id, msg.status) === 'new') {
      setLocalStatuses(s => ({ ...s, [msg.id]: 'read' }))
      startTransition(async () => { await updateMessageStatus(msg.id, 'read') })
    }
  }

  function markProcessed(msg: Message) {
    setLocalStatuses(s => ({ ...s, [msg.id]: 'processed' }))
    startTransition(async () => { await updateMessageStatus(msg.id, 'processed') })
  }

  const closeDetail = useCallback(() => {
    gsap.to(detailModal.cardRef.current,    { opacity: 0, y: 8,  duration: 0.2, ease: 'power2.in' })
    gsap.to(detailModal.overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => setSelected(null) })
  }, [detailModal])

  const closeDelete = useCallback(() => {
    gsap.to(deleteModal.cardRef.current,    { opacity: 0, y: 8,  duration: 0.2, ease: 'power2.in' })
    gsap.to(deleteModal.overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => setToDelete(null) })
  }, [deleteModal])

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    await deleteMessage(toDelete.id)
    setDeletedIds(s => new Set(s).add(toDelete.id))
    setDeleting(false)
    closeDelete()
    if (selected?.id === toDelete.id) closeDetail()
  }

  const FILTERS: { value: Filter; label: string }[] = [
    { value: 'all',       label: 'All'       },
    { value: 'new',       label: 'New'       },
    { value: 'read',      label: 'Read'      },
    { value: 'processed', label: 'Processed' },
  ]

  return (
    <>
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-px bg-void-border mb-8">
        {[
          { label: 'Total',     value: stats.total     },
          { label: 'Unread',    value: stats.unread,    accent: stats.unread > 0  },
          { label: 'Processed', value: stats.processed                            },
        ].map(({ label, value, accent }) => (
          <div key={label} className="bg-void-surface px-6 py-4">
            <p className="font-sans text-void-muted text-[10px] tracking-[0.2em] uppercase mb-1">{label}</p>
            <p className="font-display text-2xl" style={{ color: accent ? '#4DFFB4' : '#E8E8E8' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <AdminSearchBar value={query} onChange={setQuery} placeholder="Search by name, email or topic…" />
        </div>
        <div className="flex items-end gap-0 border-b border-void-border">
          {FILTERS.map(({ value, label }) => {
            const count = value === 'all'
              ? visible.length
              : visible.filter(m => getStatus(m.id, m.status) === value).length
            const active = filter === value
            return (
              <button key={value} onClick={() => setFilter(value)}
                className="font-sans text-xs tracking-[0.1em] uppercase px-4 py-2 transition-colors duration-150 flex items-center gap-1.5"
                style={{ color: active ? '#4DFFB4' : '#444444', borderBottom: `1px solid ${active ? '#4DFFB4' : 'transparent'}`, marginBottom: '-1px' }}>
                {label}
                {count > 0 && <span className="font-mono text-[10px] opacity-70">{count}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[2fr_auto_1fr_2fr_auto_auto] gap-4 px-4 mb-2">
        {([
          { label: 'Sender', key: 'name' as SortKey },
          { label: 'Time',   key: 'date' as SortKey },
          { label: 'Topic',  key: null               },
          { label: 'Message',key: null               },
          { label: 'Status', key: null               },
          { label: '',       key: null               },
        ]).map(({ label, key }) => (
          <button key={label} onClick={() => key && handleSort(key)} disabled={!key}
            className="flex items-center font-sans text-void-muted text-xs tracking-[0.12em] uppercase text-left disabled:cursor-default hover:text-void-white transition-colors duration-150">
            {label}
            {key && <SortIcon k={key} />}
          </button>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-px">
        {filtered.length === 0 ? (
          <p className="font-sans text-void-muted text-xs py-12 text-center">
            {query ? `No messages match "${query}"` : `No ${filter === 'all' ? '' : filter + ' '}messages.`}
          </p>
        ) : filtered.map(msg => {
          const status = getStatus(msg.id, msg.status)
          const s      = STATUS_STYLE[status] ?? STATUS_STYLE.new
          const isNew  = status === 'new'

          return (
            <div key={msg.id}
              className="group bg-void-surface hover:bg-void-card transition-colors duration-150 grid grid-cols-1 md:grid-cols-[2fr_auto_1fr_2fr_auto_auto] gap-4 items-center px-4 py-4 cursor-pointer"
              style={{ opacity: status === 'processed' ? 0.55 : 1 }}
              onClick={() => openDetail(msg)}>

              {/* Sender */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-void-card border border-void-border flex items-center justify-center shrink-0"
                  style={{ borderColor: isNew ? 'rgba(77,255,180,0.3)' : undefined }}>
                  <span className="font-display text-[10px]" style={{ color: isNew ? '#4DFFB4' : '#666' }}>
                    {initials(msg.name)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-void-white text-xs group-hover:text-void-green transition-colors duration-150 flex items-center gap-1.5">
                    {msg.name}
                    {isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4DFFB4]" />}
                  </p>
                  <p className="font-sans text-void-muted text-[11px] truncate">{msg.email}</p>
                </div>
              </div>

              {/* Time */}
              <p className="font-mono text-void-muted text-[10px] whitespace-nowrap">{timeAgo(msg.created_at)}</p>

              {/* Topic */}
              <p className="font-sans text-void-muted text-xs truncate">{msg.topic}</p>

              {/* Message preview */}
              <p className="font-sans text-void-muted text-xs leading-relaxed line-clamp-1">{msg.message}</p>

              {/* Status badge */}
              <span className="font-sans text-xs px-2 py-0.5 whitespace-nowrap"
                style={{ color: s.color, background: s.bg }}>
                {s.label}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button onClick={() => { setReplying(msg) }}
                  aria-label="Reply" title="Reply"
                  className="p-2 text-void-muted hover:text-void-green transition-colors duration-200">
                  <Reply size={13} strokeWidth={1.5} />
                </button>
                <button onClick={() => setToDelete(msg)}
                  aria-label="Delete" title="Delete"
                  className="p-2 text-void-muted hover:text-red-400 transition-colors duration-200">
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-void-border flex justify-between">
        <p className="font-sans text-void-muted text-xs">
          {filtered.length}{query || filter !== 'all' ? ` of ${visible.length}` : ''} message{visible.length !== 1 ? 's' : ''}
        </p>
        <p className="font-sans text-void-muted text-xs">
          {stats.processed} processed
        </p>
      </div>

      {/* ── Detail modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div ref={detailModal.overlayRef} onClick={closeDetail} className="absolute inset-0 bg-black/70" aria-hidden="true" />
          <div ref={detailModal.cardRef}
            className="relative z-10 w-full max-w-lg bg-void-surface border border-void-border"
            role="dialog" aria-modal="true" aria-label={`Message de ${selected.name}`}>

            <button onClick={closeDetail} aria-label="Close"
              className="absolute top-4 right-4 text-void-muted hover:text-void-white transition-colors">
              <X size={16} strokeWidth={1.5} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 px-8 pt-8 pb-6 border-b border-void-border">
              <div className="w-12 h-12 rounded-full bg-void-card border border-void-border flex items-center justify-center shrink-0">
                <span className="font-display text-void-green text-sm">{initials(selected.name)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-void-white text-base">{selected.name}</p>
                <a href={`mailto:${selected.email}`}
                  className="font-sans text-void-muted text-xs hover:text-void-green transition-colors"
                  onClick={e => e.stopPropagation()}>
                  {selected.email}
                </a>
              </div>
              {(() => {
                const s = STATUS_STYLE[getStatus(selected.id, selected.status)] ?? STATUS_STYLE.new
                return (
                  <span className="font-sans text-xs px-2 py-0.5 shrink-0" style={{ color: s.color, background: s.bg }}>
                    {s.label}
                  </span>
                )
              })()}
            </div>

            {/* Meta strip */}
            <div className="grid grid-cols-3 gap-px bg-void-border">
              {[
                { label: 'Received', value: timeAgo(selected.created_at) },
                { label: 'Topic',    value: selected.topic                },
                { label: 'ID',       value: `#${selected.id.slice(0, 8)}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-void-surface px-5 py-3">
                  <p className="font-sans text-void-muted text-[10px] tracking-[0.15em] uppercase mb-0.5">{label}</p>
                  <p className="font-sans text-void-white text-xs truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Full message */}
            <div className="px-8 py-6">
              <div className="flex items-center gap-2 mb-3">
                <Mail size={12} strokeWidth={1.5} className="text-void-muted" />
                <p className="font-sans text-void-muted text-[10px] tracking-[0.15em] uppercase">Message</p>
              </div>
              <p className="font-sans text-void-white text-sm leading-relaxed max-h-48 overflow-y-auto">
                {selected.message}
              </p>
              {selected.processed_by && (
                <p className="font-sans text-void-muted text-[10px] mt-4">
                  Processed by {selected.processed_by}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="px-8 pb-8 flex gap-2 flex-wrap">
              <button onClick={() => { closeDetail(); setTimeout(() => setReplying(selected), 250) }}
                className="flex items-center gap-2 flex-1 justify-center py-3 bg-void-green text-void-base font-sans text-xs tracking-[0.15em] uppercase hover:bg-void-white transition-colors duration-200">
                <Reply size={13} strokeWidth={1.5} /> Reply
              </button>
              {getStatus(selected.id, selected.status) !== 'processed' && (
                <button onClick={() => { markProcessed(selected); closeDetail() }}
                  className="flex items-center gap-2 py-3 px-5 border border-void-border text-void-muted font-sans text-xs tracking-[0.15em] uppercase hover:border-void-green hover:text-void-green transition-colors duration-200">
                  <CheckCheck size={13} strokeWidth={1.5} /> Done
                </button>
              )}
              <button onClick={() => { closeDetail(); setTimeout(() => setToDelete(selected), 250) }}
                className="py-3 px-4 bg-[#FF6B6B]/10 border border-[#FF6B6B]/40 text-[#FF6B6B] font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#FF6B6B]/20 transition-colors duration-200">
                <Trash2 size={13} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm modal ── */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div ref={deleteModal.overlayRef} onClick={closeDelete} className="absolute inset-0 bg-black/70" aria-hidden="true" />
          <div ref={deleteModal.cardRef}
            className="relative z-10 w-full max-w-sm bg-void-surface border border-void-border px-8 py-8"
            role="dialog" aria-modal="true" aria-label="Confirm message deletion">
            <button onClick={closeDelete} aria-label="Close"
              className="absolute top-4 right-4 text-void-muted hover:text-void-white transition-colors">
              <X size={16} strokeWidth={1.5} />
            </button>
            <p className="font-sans text-void-muted text-[10px] tracking-[0.2em] uppercase mb-3">Contact message</p>
            <h2 className="font-display text-void-white text-2xl tracking-tight mb-2">Delete this message?</h2>
            <p className="font-sans text-void-white text-sm mb-1">{toDelete.name}</p>
            <p className="font-sans text-void-muted text-sm leading-relaxed mb-8">
              This action cannot be undone. The message will be permanently removed.
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

      {/* Reply modal */}
      {replying && (
        <MessageReplyModal
          msg={replying}
          onClose={() => setReplying(null)}
          onReplied={() => setLocalStatuses(s => ({ ...s, [replying.id]: 'processed' }))}
        />
      )}
    </>
  )
}
