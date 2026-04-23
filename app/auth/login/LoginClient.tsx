'use client'

import { useRef, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { login } from '@/app/actions/auth'

gsap.registerPlugin(SplitText)

export default function LoginClient() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/account'

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
    const result = await login(formData)

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
          Sign in.
        </h1>
        <p className="text-void-muted font-sans text-sm mb-12">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-void-green hover:opacity-80 transition-opacity">
            Create one
          </Link>
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          <div className="group">
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

          <div className="group">
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
              autoComplete="current-password"
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
              aria-label="Sign in to your VØID account"
              className="w-full py-4 px-8 border border-void-border text-void-white font-sans text-sm tracking-[0.15em] uppercase hover:border-void-green hover:text-void-green transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
