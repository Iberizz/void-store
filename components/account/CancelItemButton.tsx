'use client'

import { useTransition, useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import gsap from 'gsap'
import { cancelOrderItem } from '@/app/actions/cancelOrder'

const PRESET_REASONS = [
  'Ordered by mistake',
  'Found a better price',
  'Item no longer needed',
  'Delivery time too long',
  'Changed my mind',
  'Other',
] as const

interface Props {
  orderId:  string
  itemId:   string
  itemName: string
}

export default function CancelItemButton({ orderId, itemId, itemName }: Props) {
  const [open,      setOpen]      = useState(false)
  const [reason,    setReason]    = useState<string>(PRESET_REASONS[0])
  const [otherText, setOtherText] = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const overlay     = overlayRef.current
    const blockWheel  = (e: WheelEvent) => e.preventDefault()
    overlay?.addEventListener('wheel', blockWheel, { passive: false })
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
    gsap.fromTo(cardRef.current,    { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' })
    return () => overlay?.removeEventListener('wheel', blockWheel)
  }, [open])

  function handleOpen() {
    setReason(PRESET_REASONS[0])
    setOtherText('')
    setError(null)
    setOpen(true)
  }

  function handleClose() {
    gsap.to(cardRef.current,    { opacity: 0, y: 8,  duration: 0.2, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => setOpen(false) })
  }

  function handleConfirm() {
    const finalReason = reason === 'Other' ? otherText.trim() : reason
    if (!finalReason) { setError('Please specify a reason.'); return }

    setError(null)
    startTransition(async () => {
      const result = await cancelOrderItem(orderId, itemId, finalReason)
      if (result?.error) { setError(result.error); return }
      setOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label={`Cancel ${itemName}`}
        className="font-sans text-[10px] tracking-[0.1em] uppercase text-[#FF6B6B]/60 border border-[#FF6B6B]/20 px-2 py-1 hover:border-[#FF6B6B]/60 hover:text-[#FF6B6B] transition-colors duration-200 shrink-0"
      >
        Cancel
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            ref={overlayRef}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70"
            aria-hidden="true"
          />

          <div
            ref={cardRef}
            className="relative z-10 w-full max-w-sm bg-void-surface border border-void-border px-8 py-8"
            role="dialog"
            aria-modal="true"
            aria-label="Cancel item"
          >
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-void-muted hover:text-void-white transition-colors"
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            <p className="font-sans text-void-muted text-[10px] tracking-[0.2em] uppercase mb-3">
              Cancel item
            </p>
            <h2 className="font-display text-void-white text-xl tracking-tight mb-1 leading-tight">
              {itemName}
            </h2>
            <p className="font-sans text-void-muted text-sm mb-6">
              Select a reason for cancellation.
            </p>

            {/* Reason select */}
            <div className="mb-4">
              <label className="block font-sans text-[10px] text-[#444] tracking-[0.2em] uppercase mb-2">
                Reason
              </label>
              <div className="flex flex-col gap-1.5">
                {PRESET_REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className="text-left font-sans text-xs py-2 px-3 border transition-colors duration-150"
                    style={{
                      borderColor: reason === r ? '#4DFFB4' : '#1C1C1C',
                      color:       reason === r ? '#E8E8E8' : '#666666',
                      background:  reason === r ? 'rgba(77,255,180,0.04)' : 'transparent',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Free text for "Other" */}
            {reason === 'Other' && (
              <div className="mb-4">
                <input
                  type="text"
                  value={otherText}
                  onChange={e => setOtherText(e.target.value)}
                  placeholder="Describe your reason…"
                  maxLength={120}
                  className="w-full bg-transparent border-b border-[#1C1C1C] text-[#E8E8E8] font-sans text-sm pb-2 outline-none placeholder:text-[#333] focus:border-[#4DFFB4] transition-colors duration-300"
                />
              </div>
            )}

            {error && (
              <p className="font-sans text-xs text-[#FF6B6B] mb-4">{error}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClose}
                className="flex-1 py-3 border border-void-border text-void-muted font-sans text-xs tracking-[0.15em] uppercase hover:text-void-white hover:border-void-white transition-colors duration-200"
              >
                Keep it
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 py-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/40 text-[#FF6B6B] font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#FF6B6B]/20 transition-colors duration-200 disabled:opacity-40"
              >
                {isPending ? 'Cancelling…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
