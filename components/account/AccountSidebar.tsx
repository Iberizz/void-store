'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { logout } from '@/app/actions/auth'
import { LayoutDashboard, ShoppingBag, Heart, User as UserIcon, LogOut } from 'lucide-react'

const NAV = [
  { href: '/account',          label: 'Overview',  icon: LayoutDashboard },
  { href: '/account/orders',   label: 'Orders',    icon: ShoppingBag     },
  { href: '/account/wishlist', label: 'Wishlist',  icon: Heart           },
  { href: '/account/profile',  label: 'Profile',   icon: UserIcon        },
] as const

export default function AccountSidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const name = (user.user_metadata?.full_name as string) || user.email || 'VØID Member'
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="lg:w-64 shrink-0">
      {/* Avatar + identity */}
      <div className="flex items-center gap-4 mb-10 pb-8 border-b border-void-border">
        <div
          className="w-12 h-12 rounded-full bg-void-surface border border-void-border flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="font-display text-void-green text-sm tracking-wider">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="font-sans text-void-white text-sm truncate">{name}</p>
          <p className="font-sans text-void-muted text-xs truncate">{user.email}</p>
        </div>
      </div>

      {/* Nav */}
      <nav aria-label="Account navigation">
        <ul className="space-y-1" role="list">
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 font-sans text-sm transition-colors duration-200 ${
                    isActive
                      ? 'text-void-white border-l border-void-green pl-[11px]'
                      : 'text-void-muted hover:text-void-white'
                  }`}
                >
                  <Icon size={15} strokeWidth={1.5} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <form action={logout} className="mt-8 pt-8 border-t border-void-border">
        <button
          type="submit"
          aria-label="Sign out of your VØID account"
          className="flex items-center gap-3 px-3 py-2.5 font-sans text-sm text-void-muted hover:text-void-white transition-colors duration-200 w-full text-left"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Sign out
        </button>
      </form>
    </aside>
  )
}
