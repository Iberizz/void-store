import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import OrderSuccess from './OrderSuccess'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  // Fallback — order not found or RLS blocked (e.g. not logged in)
  if (!order) {
    return (
      <main className="min-h-screen bg-void-base pt-28 pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <OrderSuccess />
          <p className="font-sans text-void-muted text-sm mb-8">
            Your order has been placed. Check your account for details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account/orders"
              className="py-4 px-8 border border-void-border text-void-white font-sans text-xs tracking-[0.15em] uppercase hover:border-void-green hover:text-void-green transition-colors duration-300">
              View my orders
            </Link>
            <Link href="/collection"
              className="py-4 px-8 bg-void-green text-void-base font-sans text-xs tracking-[0.15em] uppercase hover:bg-void-white transition-colors duration-300">
              Continue shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const items    = order.items as CartItem[]
  const shipping = order.shipping as { firstName: string; lastName: string; address: string; city: string; country: string; postal: string }
  const date     = new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <main className="min-h-screen bg-void-base pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-6">

        <OrderSuccess />

        {/* Order ID */}
        <div className="mb-10 pb-8 border-b border-void-border">
          <p className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase mb-1">Order</p>
          <p className="font-mono text-void-white text-sm">{order.id}</p>
          <p className="font-sans text-void-muted text-xs mt-1">{date}</p>
        </div>

        {/* Items */}
        <div className="mb-8 pb-8 border-b border-void-border">
          <p className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase mb-4">Items</p>
          <ul className="space-y-4" role="list">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4">
                <div className="relative w-12 h-12 bg-void-card border border-void-border shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="48px" />
                </div>
                <div className="flex-1">
                  <p className="font-sans text-void-white text-sm">{item.name}</p>
                  <p className="font-sans text-void-muted text-xs">Qty {item.quantity}</p>
                </div>
                <p className="font-sans text-void-white text-sm">€{(item.price * item.quantity).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Shipping + Payment */}
        <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-void-border">
          <div>
            <p className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase mb-3">Shipped to</p>
            <p className="font-sans text-void-white text-sm">{shipping.firstName} {shipping.lastName}</p>
            <p className="font-sans text-void-muted text-xs mt-1">{shipping.address}</p>
            <p className="font-sans text-void-muted text-xs">{shipping.postal} {shipping.city}</p>
            <p className="font-sans text-void-muted text-xs">{shipping.country}</p>
          </div>
          <div>
            <p className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase mb-3">Payment</p>
            <p className="font-sans text-void-white text-sm capitalize">{order.card_brand}</p>
            <p className="font-sans text-void-muted text-xs mt-1">•••• •••• •••• {order.card_last4}</p>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-baseline mb-10">
          <span className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase">Total paid</span>
          <span className="font-display text-void-white text-3xl tracking-[-0.03em]">€{order.total.toLocaleString()}</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/account/orders"
            className="flex-1 py-4 px-6 border border-void-border text-void-white font-sans text-xs tracking-[0.15em] uppercase text-center hover:border-void-green hover:text-void-green transition-colors duration-300">
            View my orders
          </Link>
          <Link href="/collection"
            className="flex-1 py-4 px-6 bg-void-green text-void-base font-sans text-xs tracking-[0.15em] uppercase text-center hover:bg-void-white transition-colors duration-300">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
