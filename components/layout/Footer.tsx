import Link from 'next/link'

const LINKS = [
  { href: '/collection', label: 'Collection' },
  { href: '/about',      label: 'About'      },
  { href: '/contact',    label: 'Contact'    },
]

export default function Footer() {
  return (
    <footer
      className="relative z-10 border-t border-[#1C1C1C] bg-transparent"
      aria-label="Pied de page VØID"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-8 md:px-16 py-12">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display font-medium text-[#E8E8E8] text-xl tracking-tighter leading-none select-none"
          aria-label="VØID — Retour à l'accueil"
        >
          VØID
        </Link>

        {/* Nav links */}
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

        {/* Legal */}
        <p className="font-sans font-light text-xs text-[#333333] tracking-wide">
          © 2025 VØID. Silence. Redefined.
        </p>
      </div>
    </footer>
  )
}
