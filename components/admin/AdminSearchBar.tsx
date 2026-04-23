'use client'

import { Search, X } from 'lucide-react'

interface Props {
  value:       string
  onChange:    (v: string) => void
  placeholder?: string
}

export default function AdminSearchBar({ value, onChange, placeholder = 'Search…' }: Props) {
  return (
    <div className="relative flex items-center">
      <Search size={13} className="absolute left-3 text-void-muted pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-64 bg-void-surface border border-void-border text-void-white font-sans text-xs pl-9 pr-8 py-2 outline-none placeholder:text-void-muted focus:border-void-green transition-colors duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 text-void-muted hover:text-void-white transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}
