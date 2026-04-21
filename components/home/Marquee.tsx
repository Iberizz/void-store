const ITEMS = [
  'SILENCE',
  'REDEFINED',
  'PREMIUM AUDIO',
  'AW25',
  'ENGINEERED SOUND',
  'VØID',
]

function MarqueeRow({ direction }: { direction: 'left' | 'right' }) {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS]

  return (
    <div className="flex overflow-hidden">
      <ul
        className={direction === 'left' ? 'marquee-left' : 'marquee-right'}
        role="list"
        style={{
          display: 'flex',
          flexShrink: 0,
          minWidth: '100%',
          animation: direction === 'left'
            ? 'scroll-left 25s linear infinite'
            : 'scroll-right 35s linear infinite',
        }}
      >
        {repeated.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-6 shrink-0 font-sans font-light text-sm tracking-[0.15em] uppercase"
            style={{ color: '#444444' }}
          >
            {item}
            <span style={{ color: '#4DFFB4' }} aria-hidden="true">·</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Marquee() {
  return (
    <section
      className="bg-[#080808] py-6 overflow-hidden border-y border-[#1C1C1C] flex flex-col gap-y-3"
      aria-hidden="true"
    >
      <MarqueeRow direction="left" />
      <MarqueeRow direction="right" />
    </section>
  )
}
