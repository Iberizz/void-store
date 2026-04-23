'use client'

import { useEffect, useState } from 'react'

export type MonthlyData = { month: string; revenue: number; orders: number }

export default function RevenueChart({ data }: { data: MonthlyData[] }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const max          = Math.max(...data.map(m => m.revenue), 1)
  const totalRevenue = data.reduce((s, m) => s + m.revenue, 0)
  const totalOrders  = data.reduce((s, m) => s + m.orders, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-sans text-void-white text-sm tracking-[0.15em] uppercase">
          Revenue — Last 12 Months
        </h2>
        <div className="flex items-center gap-4">
          <p className="font-sans text-void-muted text-xs hidden sm:block">
            {totalOrders} order{totalOrders !== 1 ? 's' : ''}
          </p>
          <p className="font-sans text-void-muted text-xs">
            Total · <span className="text-void-white">€{totalRevenue.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1.5 h-44 px-1">
        {data.map((m, i) => {
          const pct    = (m.revenue / max) * 100
          const isLast = i === data.length - 1

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex items-end" style={{ height: '160px' }}>
                <div
                  className="w-full relative"
                  style={{
                    height:     pct > 0 ? `${pct}%` : '2px',
                    minHeight:  pct > 0 ? '4px' : '2px',
                    background: isLast
                      ? 'linear-gradient(to top, #4DFFB4, rgba(77,255,180,0.35))'
                      : 'rgba(255,255,255,0.07)',
                    borderTop:  isLast ? '1px solid #4DFFB4' : '1px solid rgba(255,255,255,0.12)',
                    transform:        mounted ? 'scaleY(1)' : 'scaleY(0)',
                    transformOrigin:  'bottom',
                    transition:       `transform ${0.4 + i * 0.04}s cubic-bezier(0.16, 1, 0.3, 1)`,
                  }}
                />
                {/* Hover tooltip */}
                {m.revenue > 0 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap">
                    <span className="font-sans text-xs text-void-white bg-void-card border border-void-border px-2 py-1">
                      €{m.revenue >= 1000 ? `${(m.revenue / 1000).toFixed(1)}k` : m.revenue}
                    </span>
                  </div>
                )}
              </div>

              <span className="font-sans text-xs" style={{ color: isLast ? '#4DFFB4' : '#333' }}>
                {m.month}
              </span>
            </div>
          )
        })}
      </div>

      {/* Y-axis */}
      <div className="flex justify-between mt-3 border-t border-void-border pt-3">
        <span className="font-sans text-void-muted text-xs">€0</span>
        <span className="font-sans text-void-muted text-xs">
          €{max >= 1000 ? `${(max / 1000).toFixed(0)}k` : max}
        </span>
      </div>
    </div>
  )
}
