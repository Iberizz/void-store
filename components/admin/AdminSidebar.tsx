'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { logout } from '@/app/actions/auth'
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, Zap, MessageSquare } from 'lucide-react'

const NAV = [
  { href: '/admin',           label: 'Overview',  icon: LayoutDashboard },
  { href: '/admin/orders',    label: 'Orders',    icon: ShoppingBag     },
  { href: '/admin/products',  label: 'Products',  icon: Package         },
  { href: '/admin/messages',  label: 'Messages',  icon: MessageSquare   },
  { href: '/admin/users',     label: 'Users',     icon: Users           },
] as const

export default function AdminSidebar({ user, newMessages = 0 }: { user: User; newMessages?: number }) {
  const pathname = usePathname()

  return (
    <aside className="lg:w-56 shrink-0">
      {/* Brand + badge */}
      <div className="mb-10 pb-8 border-b border-void-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display text-void-white text-lg tracking-tight">VØID</span>
          <span className="flex items-center gap-1 bg-[rgba(77,255,180,0.1)] border border-[rgba(77,255,180,0.2)] px-2 py-0.5">
            <Zap size={9} className="text-void-green" />
            <span className="font-sans text-void-green text-[10px] tracking-[0.1em] uppercase">Admin</span>
          </span>
        </div>
        <p className="font-sans text-void-muted text-xs truncate">{user.email}</p>
      </div>

      {/* Nav */}
      <nav aria-label="Admin navigation">
        <ul className="space-y-0.5" role="list">
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
                  <Icon size={14} strokeWidth={1.5} />
                  <span className="flex-1">{label}</span>
                  {href === '/admin/messages' && newMessages > 0 && (
                    <span className="font-sans text-[10px] text-void-base bg-void-green px-1.5 py-0.5 leading-none">
                      {newMessages}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Links bottom */}
      <div className="mt-8 pt-8 border-t border-void-border space-y-1">
        <Link
          href="/account"
          className="flex items-center gap-3 px-3 py-2.5 font-sans text-xs text-void-muted hover:text-void-white transition-colors duration-200"
        >
          ← Client Dashboard
        </Link>

        <form action={logout}>
          <button
            type="submit"
            aria-label="Sign out"
            className="flex items-center gap-3 px-3 py-2.5 font-sans text-xs text-void-muted hover:text-void-white transition-colors duration-200 w-full text-left"
          >
            <LogOut size={13} strokeWidth={1.5} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
