import Image from 'next/image'
import type { CartItem } from '@/lib/store'

type Props = {
  items: CartItem[]
  subtotal: number
}

export default function OrderSummary({ items, subtotal }: Props) {
  const shipping = subtotal >= 500 ? 0 : 15
  const total    = subtotal + shipping

  return (
    <div className="bg-void-surface border border-void-border p-6 lg:p-8">
      <h2 className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-6">
        Order Summary
      </h2>

      {/* Items */}
      <ul className="space-y-4 mb-6 pb-6 border-b border-void-border" role="list">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4">
            <div className="relative w-12 h-12 shrink-0">
              <div className="w-full h-full bg-void-card border border-void-border overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="48px" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-void-muted flex items-center justify-center">
                <span className="font-sans text-[9px] text-void-base leading-none">{item.quantity}</span>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-void-white text-xs truncate">{item.name}</p>
              <p className="font-sans text-void-muted text-xs">AW25</p>
            </div>
            <p className="font-sans text-void-white text-xs shrink-0">
              €{(item.price * item.quantity).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      {/* Pricing */}
      <div className="space-y-3 mb-6 pb-6 border-b border-void-border">
        <div className="flex justify-between">
          <span className="font-sans text-void-muted text-xs">Subtotal</span>
          <span className="font-sans text-void-white text-xs">€{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-sans text-void-muted text-xs">Shipping</span>
          <span className="font-sans text-xs" style={{ color: shipping === 0 ? '#4DFFB4' : '#E8E8E8' }}>
            {shipping === 0 ? 'Free' : `€${shipping}`}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-baseline">
        <span className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase">Total</span>
        <span className="font-display text-void-white text-2xl tracking-[-0.02em]">
          €{total.toLocaleString()}
        </span>
      </div>

      {/* Trust badges */}
      <div className="mt-6 pt-6 border-t border-void-border space-y-2">
        {['SSL Secure payment', '30-day free returns', '2-year warranty'].map((b) => (
          <div key={b} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-void-green shrink-0" aria-hidden="true" />
            <p className="font-sans text-void-muted text-xs">{b}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
