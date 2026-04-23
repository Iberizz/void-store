'use client'

import { useTransition, useState } from 'react'
import { cancelOrder } from '@/app/actions/cancelOrder'

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition()
  const [confirmed, setConfirmed]    = useState(false)

  function handleClick() {
    if (!confirmed) {
      setConfirmed(true)
      // Reset confirmation after 4s if user doesn't confirm
      setTimeout(() => setConfirmed(false), 4000)
      return
    }
    startTransition(async () => {
      await cancelOrder(orderId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="font-sans text-xs tracking-[0.1em] uppercase transition-colors duration-200 disabled:opacity-40"
      style={{ color: confirmed ? '#FF6B6B' : '#444' }}
    >
      {isPending ? 'Cancelling…' : confirmed ? 'Confirm cancel?' : 'Cancel order'}
    </button>
  )
}
