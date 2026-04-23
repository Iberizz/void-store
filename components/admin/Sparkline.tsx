type Props = {
  data: number[]
  color?: string
  width?: number
  height?: number
}

export default function Sparkline({ data, color = '#4DFFB4', width = 120, height = 40 }: Props) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const pad = 2
  const w = width - pad * 2
  const h = height - pad * 2

  const points = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * w,
    y: pad + h - ((v - min) / range) * h,
  }))

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ')

  const areaPath =
    `${linePath} L${points[points.length - 1].x.toFixed(2)},${(pad + h).toFixed(2)} L${pad},${(pad + h).toFixed(2)} Z`

  const last = points[points.length - 1]
  const gradId = `sg-${color.replace('#', '')}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity={0.18} />
          <stop offset="100%" stopColor={color} stopOpacity={0}    />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradId})`} />

      {/* Line */}
      <path d={linePath} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Last point dot */}
      <circle cx={last.x} cy={last.y} r={2.5} fill={color} />
    </svg>
  )
}
