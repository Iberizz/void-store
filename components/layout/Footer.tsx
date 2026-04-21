import Link from 'next/link'

const LINKS = [
  { href: '/collection', label: 'Collection' },
  { href: '/about',      label: 'About'      },
  { href: '/contact',    label: 'Contact'    },
]

export default function Footer() {
  return (
    <footer
      className="relative z-10 bg-transparent pt-24"
      aria-label="Pied de page VØID"
    >
      {/* Full-width VØID wordmark */}
      <div className="text-center px-4">
        <p
          className="font-display text-[#E8E8E8] leading-none select-none"
          style={{ fontSize: 'clamp(16vw, 20vw, 24vw)', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1 }}
          aria-hidden="true"
        >
          VØID
        </p>
        <p
          className="font-sans font-light uppercase text-[#666666] mt-4 mb-12"
          style={{ fontSize: '11px', letterSpacing: '0.2em' }}
        >
          Silence. Redefined.
        </p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1C1C1C]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 md:px-16 py-8">

          <Link
            href="/"
            className="font-display font-medium text-[#E8E8E8] text-xl tracking-tighter leading-none select-none"
            aria-label="VØID — Retour à l'accueil"
          >
            VØID
          </Link>

          <nav aria-label="Liens de pied de page">
            <ul className="flex items-center gap-8" role="list">
              {LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans font-light text-xs tracking-[0.15em] uppercase text-[#666666] transition-colors duration-200 hover:text-[#E8E8E8]"
                    data-cursor="pointer"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="font-sans font-light text-xs text-[#333333] tracking-wide">
            © 2025 VØID. Silence. Redefined.
          </p>

        </div>
      </div>
    </footer>
  )
}
