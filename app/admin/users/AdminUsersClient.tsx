'use client'

import { useState } from 'react'
import AdminSearchBar from '@/components/admin/AdminSearchBar'

type User = {
  id: string; name: string; initials: string; email: string
  joined: string; count: number; spent: number; isActive: boolean
}

export default function AdminUsersClient({ users, totalRevenue, avgLTV }: {
  users: User[]
  totalRevenue: number
  avgLTV: number
}) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? users.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
      )
    : users

  return (
    <>
      {/* Search */}
      <div className="mb-4">
        <AdminSearchBar value={query} onChange={setQuery} placeholder="Search by name or email…" />
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 mb-2">
        {['Customer', 'Joined', 'Orders', 'Total Spent', 'Status'].map(h => (
          <p key={h} className="font-sans text-void-muted text-xs tracking-[0.12em] uppercase">{h}</p>
        ))}
      </div>

      <div className="space-y-px">
        {filtered.length === 0 ? (
          <p className="font-sans text-void-muted text-xs py-8 text-center">No users match "{query}"</p>
        ) : filtered.map(user => (
          <div key={user.id}
            className="bg-void-surface hover:bg-void-card transition-colors duration-150 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-4">

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-void-card border border-void-border flex items-center justify-center shrink-0">
                <span className="font-display text-void-green text-[10px]">{user.initials}</span>
              </div>
              <div className="min-w-0">
                <p className="font-sans text-void-white text-sm">{user.name}</p>
                <p className="font-sans text-void-muted text-xs truncate">{user.email}</p>
              </div>
            </div>

            <p className="font-sans text-void-muted text-xs">{user.joined}</p>
            <p className="font-sans text-void-white text-sm">{user.count}</p>
            <p className="font-sans text-void-white text-sm">
              {user.spent > 0 ? `€${user.spent.toLocaleString()}` : '—'}
            </p>

            <span className="font-sans text-xs px-2 py-0.5 w-fit"
              style={{
                color:      user.isActive ? '#4DFFB4' : '#444',
                background: user.isActive ? 'rgba(77,255,180,0.08)' : 'rgba(102,102,102,0.06)',
              }}>
              {user.isActive ? 'Active' : 'No orders'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-void-border flex justify-between">
        <p className="font-sans text-void-muted text-xs">
          {filtered.length}{query ? ` of ${users.length}` : ''} user{users.length !== 1 ? 's' : ''}
        </p>
        <p className="font-sans text-void-muted text-xs">
          Avg LTV · <span className="text-void-white">€{avgLTV.toLocaleString()}</span>
        </p>
      </div>
    </>
  )
}
