'use client'

import { useTransition, useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import gsap from 'gsap'
import { cancelOrder } from '@/app/actions/cancelOrder'

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen]              = useState(false)
  const overlayRef                   = useRef<HTMLDivElement>(null)
  const cardRef                      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const overlay = overlayRef.current
    const blockWheel = (e: WheelEvent) => e.preventDefault()
    overlay?.addEventListener('wheel', blockWheel, { passive: false })

    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
    gsap.fromTo(cardRef.current,    { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' })

    return () => overlay?.removeEventListener('wheel', blockWheel)
  }, [open])

  function handleClose() {
    gsap.to(cardRef.current,    { opacity: 0, y: 8, duration: 0.2, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => setOpen(false) })
  }

  function handleConfirm() {
    startTransition(async () => {
      await cancelOrder(orderId)
      setOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-sans text-xs tracking-[0.1em] uppercase text-[#444] hover:text-[#FF6B6B] transition-colors duration-200"
      >
        Cancel order
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            ref={overlayRef}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70"
            aria-hidden="true"
          />

          {/* Card */}
          <div
            ref={cardRef}
            className="relative z-10 w-full max-w-sm bg-void-surface border border-void-border px-8 py-8"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm order cancellation"
          >
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-void-muted hover:text-void-white transition-colors"
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            <p className="font-sans text-void-muted text-[10px] tracking-[0.2em] uppercase mb-3">Order #{orderId.slice(0, 8)}</p>
            <h2 className="font-display text-void-white text-2xl tracking-tight mb-2">Cancel this order?</h2>
            <p className="font-sans text-void-muted text-sm leading-relaxed mb-8">
              This action cannot be undone. Your order will be permanently cancelled.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 border border-void-border text-void-muted font-sans text-xs tracking-[0.15em] uppercase hover:text-void-white hover:border-void-white transition-colors duration-200"
              >
                Keep order
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 py-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/40 text-[#FF6B6B] font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#FF6B6B]/20 transition-colors duration-200 disabled:opacity-40"
              >
                {isPending ? 'Cancelling…' : 'Yes, cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
