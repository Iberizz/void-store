'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { useCartStore } from '@/lib/store'
import CardPreview from '@/components/checkout/CardPreview'
import OrderSummary from '@/components/checkout/OrderSummary'
import { createOrder } from '@/app/actions/checkout'

// ── Luhn validation ──────────────────────────────────────────────────────────
function luhn(num: string): boolean {
  const d = num.replace(/\D/g, '')
  let sum = 0, alt = false
  for (let i = d.length - 1; i >= 0; i--) {
    let n = parseInt(d[i])
    if (alt) { n *= 2; if (n > 9) n -= 9 }
    sum += n; alt = !alt
  }
  return d.length > 0 && sum % 10 === 0
}

function detectBrand(num: string): 'visa' | 'mastercard' | 'amex' | 'unknown' {
  const n = num.replace(/\D/g, '')
  if (/^4/.test(n))           return 'visa'
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n))       return 'amex'
  return 'unknown'
}

function formatCardNumber(raw: string, brand: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, brand === 'amex' ? 15 : 16)
  if (brand === 'amex') {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10)].filter(Boolean).join(' ')
  }
  return digits.match(/.{1,4}/g)?.join(' ') ?? digits
}

type Shipping = { firstName: string; lastName: string; address: string; city: string; country: string; postal: string }
type Card     = { number: string; name: string; expiry: string; cvv: string }

const COUNTRIES = ['France', 'Germany', 'Italy', 'Spain', 'United Kingdom', 'United States', 'Japan', 'Canada', 'Australia', 'Switzerland']

export default function CheckoutClient({ userEmail = '' }: { userEmail?: string }) {
  const { items, clearCart } = useCartStore()
  const router    = useRouter()
  const step1Ref  = useRef<HTMLDivElement>(null)
  const step2Ref  = useRef<HTMLDivElement>(null)

  const [step, setStep]     = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [cvvFocused, setCvvFocused] = useState(false)

  const [shipping, setShipping] = useState<Shipping>({
    firstName: '', lastName: '', address: '', city: '', country: 'France', postal: '',
  })
  const [card, setCard] = useState<Card>({ number: '', name: '', expiry: '', cvv: '' })

  const subtotal      = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const brand         = detectBrand(card.number)
  const submittedRef  = useRef(false)
  const [frozenTotal, setFrozenTotal] = useState<number | null>(null)
  const [frozenItems, setFrozenItems] = useState<typeof items | null>(null)

  const displayTotal = frozenTotal ?? subtotal
  const displayItems = frozenItems ?? items

  useEffect(() => {
    // Don't redirect if we just placed an order — navigation is handled by window.location.href
    if (items.length === 0 && !submittedRef.current) router.push('/')
  }, [items, router])

  // ── Step transition ──────────────────────────────────────────────────────
  function goToPayment() {
    const { firstName, lastName, address, city, postal } = shipping
    if (!firstName || !lastName || !address || !city || !postal) {
      setError('Please fill in all shipping fields.')
      return
    }
    setError(null)

    gsap.to(step1Ref.current, { opacity: 0, x: -24, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        setStep(2)
        gsap.fromTo(step2Ref.current, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' })
      }
    })
  }

  function goBack() {
    gsap.to(step2Ref.current, { opacity: 0, x: 24, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        setStep(1)
        gsap.fromTo(step1Ref.current, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' })
      }
    })
  }

  // ── Card input handlers ──────────────────────────────────────────────────
  function handleCardNumber(raw: string) {
    const b = detectBrand(raw)
    setCard(c => ({ ...c, number: formatCardNumber(raw, b) }))
  }

  function handleExpiry(raw: string) {
    const cleaned = raw.replace(/\D/g, '').slice(0, 4)
    const formatted = cleaned.length > 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned
    setCard(c => ({ ...c, expiry: formatted }))
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const digits = card.number.replace(/\D/g, '')
    const maxLen = brand === 'amex' ? 15 : 16

    if (digits.length < maxLen) { setError('Invalid card number length.'); return }
    if (!luhn(digits))          { setError('Invalid card number.'); return }
    if (card.expiry.length < 5) { setError('Invalid expiry date.'); return }
    if (card.cvv.length < 3)    { setError('Invalid CVV.'); return }
    if (!card.name.trim())      { setError('Please enter the cardholder name.'); return }

    setError(null)
    setLoading(true)

    const result = await createOrder({
      shipping,
      cardLast4: digits.slice(-4),
      cardBrand: brand,
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image, slug: i.slug })),
      total: subtotal,
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.orderId) {
      submittedRef.current = true
      setFrozenTotal(subtotal)
      setFrozenItems([...items])

      // Send order confirmation email (fire & forget — don't block redirect)
      try {
        const orderItems = items
          .map(i => `${i.name} × ${i.quantity}`)
          .join(', ')

        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID!,
          {
            to_name:      shipping.firstName,
            to_email:     userEmail,
            order_id:     result.orderId.slice(0, 8).toUpperCase(),
            order_date:   new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            order_total:  `€${subtotal.toLocaleString()}`,
            order_items:  orderItems,
            order_status: 'Processing',
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        )
      } catch (err) {
        console.warn('Order confirmation email failed:', err)
      }

      clearCart()
      window.location.href = `/order/${result.orderId}`
    } else {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-transparent border-0 border-b border-void-border text-void-white font-sans text-sm pb-3 outline-none placeholder:text-void-border focus:border-void-green transition-colors duration-300"
  const labelClass = "block font-sans text-xs text-void-muted tracking-[0.15em] uppercase mb-2"

  return (
    <main className="min-h-screen bg-void-base pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Back */}
        <Link href="/" onClick={() => useCartStore.getState().openCart()}
          className="inline-flex items-center gap-2 font-sans text-void-muted text-xs hover:text-void-white transition-colors mb-10">
          <ArrowLeft size={14} /> Back to cart
        </Link>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-12">
          {['Shipping', 'Payment'].map((label, i) => {
            const n = i + 1
            const isActive = step === n
            const isDone   = step > n
            return (
              <div key={label} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 flex items-center justify-center font-sans text-xs transition-colors duration-300"
                    style={{
                      background: isDone || isActive ? '#4DFFB4' : 'transparent',
                      border: isDone || isActive ? 'none' : '1px solid #1C1C1C',
                      color: isDone || isActive ? '#000' : '#666',
                    }}
                  >
                    {isDone ? '✓' : n}
                  </div>
                  <span className={`font-sans text-xs tracking-[0.1em] uppercase transition-colors duration-300 ${isActive ? 'text-void-white' : 'text-void-muted'}`}>
                    {label}
                  </span>
                </div>
                {i < 1 && <div className="w-12 h-px bg-void-border" />}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">

          {/* ── Left: Form ── */}
          <div>
            {/* Step 1 — Shipping */}
            {step === 1 && (
              <div ref={step1Ref}>
                <h1 className="font-display text-3xl text-void-white tracking-[-0.03em] mb-8">
                  Shipping.
                </h1>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input className={inputClass} placeholder="Ibrahim" value={shipping.firstName}
                      onChange={e => setShipping(s => ({ ...s, firstName: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input className={inputClass} placeholder="Nimaga" value={shipping.lastName}
                      onChange={e => setShipping(s => ({ ...s, lastName: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Address</label>
                    <input className={inputClass} placeholder="12 rue de la Paix" value={shipping.address}
                      onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input className={inputClass} placeholder="Paris" value={shipping.city}
                      onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Postal Code</label>
                    <input className={inputClass} placeholder="75001" value={shipping.postal}
                      onChange={e => setShipping(s => ({ ...s, postal: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Country</label>
                    <select
                      className={`${inputClass} cursor-pointer`}
                      value={shipping.country}
                      onChange={e => setShipping(s => ({ ...s, country: e.target.value }))}
                      style={{ background: 'transparent' }}
                    >
                      {COUNTRIES.map(c => <option key={c} value={c} style={{ background: '#0F0F0F' }}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {error && <p className="font-sans text-sm text-red-400 mt-6">{error}</p>}

                <button onClick={goToPayment}
                  className="mt-10 flex items-center gap-3 font-sans text-xs tracking-[0.15em] uppercase text-void-white border border-void-border px-8 py-4 hover:border-void-green hover:text-void-green transition-colors duration-300">
                  Continue to Payment <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div ref={step2Ref}>
                <h1 className="font-display text-3xl text-void-white tracking-[-0.03em] mb-8">
                  Payment.
                </h1>

                {/* Card preview */}
                <div className="mb-8">
                  <CardPreview
                    number={card.number}
                    name={card.name}
                    expiry={card.expiry}
                    cvv={card.cvv}
                    brand={brand}
                    flipped={cvvFocused}
                  />
                </div>

                {/* Test card hint */}
                <div className="mb-6 px-3 py-2 border border-void-border/50 bg-void-surface">
                  <p className="font-sans text-void-muted text-xs">
                    <span className="text-void-green">Test cards:</span>{' '}
                    Visa <span className="text-void-white">4242 4242 4242 4242</span>
                    {' · '}
                    MC <span className="text-void-white">5555 5555 5555 4444</span>
                    {' · '}
                    Any future date · Any CVV
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className={labelClass}>Card Number</label>
                    <input
                      className={inputClass}
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      onChange={e => handleCardNumber(e.target.value)}
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={brand === 'amex' ? 17 : 19}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Cardholder Name</label>
                    <input
                      className={inputClass}
                      placeholder="IBRAHIM NIMAGA"
                      value={card.name}
                      onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                      autoComplete="cc-name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Expiry</label>
                      <input
                        className={inputClass}
                        placeholder="MM/YY"
                        value={card.expiry}
                        onChange={e => handleExpiry(e.target.value)}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>CVV</label>
                      <input
                        className={inputClass}
                        placeholder={brand === 'amex' ? '••••' : '•••'}
                        value={card.cvv}
                        onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, brand === 'amex' ? 4 : 3) }))}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        onFocus={() => setCvvFocused(true)}
                        onBlur={() => setCvvFocused(false)}
                        maxLength={brand === 'amex' ? 4 : 3}
                      />
                    </div>
                  </div>

                  {error && <p className="font-sans text-sm text-red-400">{error}</p>}

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={goBack}
                      className="flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-void-muted border border-void-border px-6 py-4 hover:text-void-white hover:border-void-white transition-colors duration-300">
                      <ArrowLeft size={14} /> Back
                    </button>

                    <button type="submit" disabled={loading}
                      aria-label="Place order"
                      className="flex-1 flex items-center justify-center gap-3 font-sans text-xs tracking-[0.2em] uppercase text-void-base bg-void-green hover:bg-void-white transition-colors duration-300 py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? (
                        <>Processing...</>
                      ) : (
                        <><Lock size={13} /> Place Order — €{displayTotal.toLocaleString()}</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:sticky lg:top-28 h-fit">
            <OrderSummary items={displayItems} subtotal={displayTotal} />
          </div>
        </div>
      </div>
    </main>
  )
}
