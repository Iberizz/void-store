'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { signup } from '@/app/actions/auth'

gsap.registerPlugin(SplitText)

export default function SignupClient() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!titleRef.current) return

      const split = new SplitText(titleRef.current, {
        type: 'chars',
        charsClass: 'inline-block overflow-hidden',
      })

      gsap.from(split.chars, {
        y: 80,
        opacity: 0,
        stagger: 0.03,
        duration: 1,
        ease: 'expo.out',
        delay: 0.2,
      })

      gsap.from(formRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'expo.out',
        delay: 0.6,
      })
    })

    return () => ctx.revert()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const password = formData.get('password') as string
    const confirm = formData.get('confirm_password') as string

    if (password !== confirm) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    const result = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-void-base flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="font-display text-void-muted text-sm tracking-[0.2em] uppercase mb-16 block hover:text-void-white transition-colors"
        >
          ← VØID
        </Link>

        <h1
          ref={titleRef}
          className="font-display text-5xl md:text-6xl text-void-white tracking-[-0.04em] mb-3"
        >
          Join VØID.
        </h1>
        <p className="text-void-muted font-sans text-sm mb-12">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-void-green hover:opacity-80 transition-opacity">
            Sign in
          </Link>
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="full_name"
              className="block font-sans text-xs text-void-muted tracking-[0.15em] uppercase mb-3"
            >
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              className="w-full bg-transparent border-0 border-b border-void-border text-void-white font-sans text-base pb-3 outline-none placeholder:text-void-border focus:border-void-green transition-colors duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-sans text-xs text-void-muted tracking-[0.15em] uppercase mb-3"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full bg-transparent border-0 border-b border-void-border text-void-white font-sans text-base pb-3 outline-none placeholder:text-void-border focus:border-void-green transition-colors duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-sans text-xs text-void-muted tracking-[0.15em] uppercase mb-3"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              minLength={8}
              className="w-full bg-transparent border-0 border-b border-void-border text-void-white font-sans text-base pb-3 outline-none placeholder:text-void-border focus:border-void-green transition-colors duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="confirm_password"
              className="block font-sans text-xs text-void-muted tracking-[0.15em] uppercase mb-3"
            >
              Confirm Password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full bg-transparent border-0 border-b border-void-border text-void-white font-sans text-base pb-3 outline-none placeholder:text-void-border focus:border-void-green transition-colors duration-300"
            />
          </div>

          {error && (
            <p className="font-sans text-sm text-red-400">{error}</p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              aria-label="Create your VØID account"
              className="w-full py-4 px-8 border border-void-border text-void-white font-sans text-sm tracking-[0.15em] uppercase hover:border-void-green hover:text-void-green transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </div>

          <p className="font-sans text-xs text-void-muted text-center">
            By joining, you agree to receive exclusive VØID communications.
          </p>
        </form>
      </div>
    </main>
  )
}
