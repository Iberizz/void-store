'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { Heart, X } from 'lucide-react'
import { useWishlistStore } from '@/lib/store'

export default function WishlistPage() {
  const items      = useWishlistStore((s) => s.items)
  const removeItem = useWishlistStore((s) => s.removeItem)

  return (
    <div>
      <div className="mb-10 pb-8 border-b border-void-border">
        <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">Account</p>
        <div className="flex items-end justify-between">
          <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">Wishlist.</h1>
          <p className="font-display text-2xl text-void-green">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <Heart size={32} strokeWidth={1} className="text-void-border" />
          <p className="font-sans text-void-muted text-sm text-center">Your wishlist is empty.</p>
          <Link
            href="/collection"
            className="font-sans text-xs tracking-[0.15em] uppercase text-void-white border border-void-border px-6 py-3 hover:border-void-green hover:text-void-green transition-colors duration-200"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-px">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-void-surface hover:bg-void-card transition-colors duration-150 p-4">
              {/* Image */}
              <Link href={`/product/${item.slug}`} className="relative w-16 h-16 bg-void-card border border-void-border shrink-0 overflow-hidden">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                )}
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.slug}`}>
                  <p className="font-sans text-void-white text-sm hover:text-void-green transition-colors duration-200 truncate">
                    {item.name}
                  </p>
                </Link>
                <p className="font-sans text-void-muted text-xs mt-0.5">€{item.price.toLocaleString()}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-sans text-xs tracking-[0.15em] uppercase text-void-white border border-void-border px-4 py-2 hover:border-void-green hover:text-void-green transition-colors duration-200 hidden sm:block"
                >
                  View
                </Link>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name} from wishlist`}
                  className="p-2 text-void-muted hover:text-red-400 transition-colors duration-200"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
