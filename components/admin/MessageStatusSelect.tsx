'use client'

import { useState, useTransition } from 'react'
import { updateMessageStatus, type MessageStatus } from '@/app/actions/contact'

const STATUSES: { value: MessageStatus; label: string; color: string }[] = [
  { value: 'new',       label: 'New',       color: '#4DFFB4' },
  { value: 'read',      label: 'Read',      color: '#E8E8E8' },
  { value: 'processed', label: 'Processed', color: '#666666' },
]

const STYLE: Record<MessageStatus, { color: string; bg: string }> = {
  new:       { color: '#4DFFB4', bg: 'rgba(77,255,180,0.08)'  },
  read:      { color: '#E8E8E8', bg: 'rgba(232,232,232,0.06)' },
  processed: { color: '#666666', bg: 'rgba(102,102,102,0.08)' },
}

export default function MessageStatusSelect({
  messageId,
  current,
}: {
  messageId: string
  current: string
}) {
  const [status, setStatus]          = useState<MessageStatus>(current as MessageStatus)
  const [open, setOpen]              = useState(false)
  const [isPending, startTransition] = useTransition()

  const s = STYLE[status]

  function select(next: MessageStatus) {
    setStatus(next)
    setOpen(false)
    startTransition(async () => {
      await updateMessageStatus(messageId, next)
    })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={isPending}
        className="font-sans text-xs px-2 py-1 flex items-center gap-1.5 transition-opacity disabled:opacity-50"
        style={{ color: s.color, background: s.bg }}
      >
        {isPending ? '…' : STATUSES.find(st => st.value === status)?.label}
        <span className="text-[8px] opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-void-card border border-void-border min-w-[120px] shadow-xl">
          {STATUSES.map((st) => (
            <button
              key={st.value}
              onClick={() => select(st.value)}
              className="w-full text-left px-3 py-2 font-sans text-xs hover:bg-void-surface transition-colors duration-100"
              style={{ color: st.color }}
            >
              {st.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
