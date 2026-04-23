'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { createClient } from '@/lib/supabase/client'

type Props = {
  initialName: string
  email: string
}

export default function ProfileClient({ initialName, email }: Props) {
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.from(headerRef.current, {
      opacity: 0,
      y: 16,
      duration: 0.7,
      ease: 'expo.out',
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({
      data: { full_name: name },
    })

    if (err) {
      setError(err.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }

    setSaving(false)
  }

  return (
    <div>
      <div ref={headerRef} className="mb-12 pb-8 border-b border-void-border">
        <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">
          Account
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">
          Profile.
        </h1>
      </div>

      <form onSubmit={handleSave} className="max-w-md space-y-8">
        <div>
          <label
            htmlFor="full_name"
            className="block font-sans text-xs text-void-muted tracking-[0.15em] uppercase mb-3"
          >
            Full Name
          </label>
          <input
            id="full_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-transparent border-0 border-b border-void-border text-void-white font-sans text-base pb-3 outline-none focus:border-void-green transition-colors duration-300"
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
            type="email"
            value={email}
            disabled
            aria-describedby="email-hint"
            className="w-full bg-transparent border-0 border-b border-void-border text-void-muted font-sans text-base pb-3 outline-none cursor-not-allowed"
          />
          <p id="email-hint" className="font-sans text-void-muted text-xs mt-2">
            Email cannot be changed.
          </p>
        </div>

        {error && <p className="font-sans text-sm text-red-400">{error}</p>}
        {success && (
          <p className="font-sans text-sm text-void-green">Profile updated.</p>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            aria-label="Save profile changes"
            className="py-4 px-8 border border-void-border text-void-white font-sans text-sm tracking-[0.15em] uppercase hover:border-void-green hover:text-void-green transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save changes →'}
          </button>
        </div>
      </form>

      {/* Danger zone */}
      <div className="mt-16 pt-8 border-t border-void-border">
        <h2 className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase mb-6">
          Danger zone
        </h2>
        <p className="font-sans text-void-muted text-sm mb-4">
          Permanently delete your account and all associated data.
        </p>
        <button
          type="button"
          aria-label="Delete your VØID account"
          disabled
          className="font-sans text-xs tracking-[0.15em] uppercase text-void-muted border border-void-border px-6 py-3 opacity-40 cursor-not-allowed"
        >
          Delete account
        </button>
      </div>
    </div>
  )
}
