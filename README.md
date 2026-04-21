# VØID — Silence. Redefined.

> — Site e-commerce portfolio ultra premium — 

---

## Stack

- **Next.js 15** — App Router
- **TypeScript** — strict mode
- **Tailwind CSS v4** — design system OBSIDIAN
- **Framer Motion** — page transitions, reveals
- **GSAP + ScrollTrigger** — animations premium
- **Lenis** — smooth scroll
- **Three.js / R3F** — scène 3D hero
- **Zustand** — cart state
- **Supabase** — free tier
- **Vercel** — déploiement

---

## Design System — Palette OBSIDIAN

| Token | Valeur | Usage |
|-------|--------|-------|
| `void-base` | `#000000` | Fond absolu |
| `void-surface` | `#080808` | Surfaces |
| `void-card` | `#0F0F0F` | Cartes, modals |
| `void-border` | `#1C1C1C` | Bordures |
| `void-white` | `#E8E8E8` | Blanc froid |
| `void-green` | `#4DFFB4` | Accent électrique |
| `void-text` | `#F2F2F2` | Texte principal |
| `void-muted` | `#666666` | Texte secondaire |

**Fonts** : Clash Display (titres) + Satoshi (body) via Fontshare

---

## Structure

```
void-store/
├── app/
│   ├── page.tsx              # Home
│   ├── collection/           # Catalog
│   ├── product/[slug]/       # Product page
│   ├── cart/                 # Panier
│   ├── about/                # Brand story
│   └── contact/              # Formulaire
├── components/
│   ├── layout/               # Navbar, Footer, PageTransition
│   ├── home/                 # Hero, Marquee, Stats
│   ├── product/              # ProductCard, Gallery
│   ├── cart/                 # CartDrawer
│   └── shared/               # Cursor, Lenis, SplitText
├── lib/                      # gsap, store, supabase
├── hooks/                    # useGSAP, useLenis, useCart
└── types/
```

---

## Install

```bash
npm install
npm run dev
```

---

## Variables d'environnement

Crée un fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

---

*Portfolio project — not a real store*