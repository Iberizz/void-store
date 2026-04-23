'use client'

import { useState, useTransition } from 'react'
import { updateOrderStatus, type OrderStatus } from '@/app/actions/orders'

const STATUSES: OrderStatus[] = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

const STATUS_STYLES: Record<OrderStatus, { color: string; bg: string }> = {
  Processing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)'  },
  Shipped:    { color: '#E8E8E8', bg: 'rgba(232,232,232,0.06)' },
  Delivered:  { color: '#4DFFB4', bg: 'rgba(77,255,180,0.08)'  },
  Cancelled:  { color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)' },
}

type Props = {
  orderId: string
  current: OrderStatus
}

export default function OrderStatusSelect({ orderId, current }: Props) {
  const [status, setStatus]   = useState<OrderStatus>(current)
  const [open,   setOpen]     = useState(false)
  const [isPending, startTransition] = useTransition()

  const s = STATUS_STYLES[status]

  function select(next: OrderStatus) {
    setStatus(next)
    setOpen(false)
    startTransition(async () => {
      await updateOrderStatus(orderId, next)
    })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={isPending}
        aria-label={`Status: ${status}`}
        className="font-sans text-xs px-2 py-1 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
        style={{ color: s.color, background: s.bg }}
      >
        {isPending ? '...' : status}
        <span className="text-[8px] opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-void-card border border-void-border min-w-[120px] shadow-xl">
          {STATUSES.map((st) => {
            const ss = STATUS_STYLES[st]
            return (
              <button
                key={st}
                onClick={() => select(st)}
                className="w-full text-left px-3 py-2 font-sans text-xs hover:bg-void-surface transition-colors duration-100"
                style={{ color: ss.color }}
              >
                {st}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
