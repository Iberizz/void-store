'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/lib/store'

export default function WishlistPreview() {
  const items = useWishlistStore((s) => s.items)

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-sans text-void-white text-sm tracking-[0.15em] uppercase">Wishlist</h2>
        <Link href="/account/wishlist" className="font-sans text-void-muted text-xs hover:text-void-green transition-colors">
          View all →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex items-center gap-3 py-8 justify-center">
          <Heart size={14} strokeWidth={1.5} className="text-void-border" />
          <p className="font-sans text-void-muted text-xs">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="flex gap-px">
          {items.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.slug}`}
              className="relative flex-1 aspect-square bg-void-surface hover:bg-void-card transition-colors duration-150 overflow-hidden group"
              aria-label={item.name}
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}
            </Link>
          ))}
          {items.length > 4 && (
            <Link
              href="/account/wishlist"
              className="flex-1 aspect-square bg-void-surface flex items-center justify-center hover:bg-void-card transition-colors duration-150"
              aria-label={`View all ${items.length} wishlist items`}
            >
              <span className="font-display text-void-muted text-lg">+{items.length - 4}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
