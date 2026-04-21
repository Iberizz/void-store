# VØID — Silence. Redefined.

> Portfolio e-commerce ultra premium — niveau Awwwards
> Produit fictif : casque audio sans fil premium

---

## Stack

| Outil | Usage |
|-------|-------|
| **Next.js 15** | App Router, Server + Client Components |
| **TypeScript** | strict mode |
| **Tailwind CSS v4** | `@theme` tokens, palette OBSIDIAN |
| **GSAP 3.15** | SplitText, ScrollTrigger, scramble, counters |
| **Lenis** | `import from 'lenis'` — smooth scroll |
| **Three.js / R3F** | Canvas 3D global fixé, modèle headphone.glb |
| **Zustand** | Cart state |
| **shadcn/ui** | Composants base customisés |
| **Lucide Icons** | Icônes |
| **Supabase** | Free tier — données produits |
| **Vercel** | Déploiement |

---

## Design System — Palette OBSIDIAN

| Token | Valeur | Usage |
|-------|--------|-------|
| `void-base` | `#000000` | Fond absolu |
| `void-surface` | `#080808` | Surfaces, StatsSection |
| `void-card` | `#0F0F0F` | Cards produit |
| `void-border` | `#1C1C1C` | Bordures, dividers |
| `void-white` | `#E8E8E8` | Textes importants, CTA |
| `void-green` | `#4DFFB4` | Accent électrique, unités, tags |
| `void-text` | `#F2F2F2` | Texte principal |
| `void-muted` | `#666666` | Texte secondaire |

**Fonts** : Clash Display (titres) + Satoshi (body) — Fontshare CDN

---

## Architecture narrative — Home

Le scroll = le temps. Le canvas R3F est fixé derrière toutes les sections.

```
SceneCanvas (fixed z-0)    — casque 3D tourne en continu, réagit au scroll
│
├── Section 1  Hero         — "SILENCE." SplitText scramble, CTAs
├── Marquee                 — bande CSS défilante bidirectionnelle
├── Section 2  Manifesto    — word reveal au scrub ScrollTrigger
├── Section 3  Stats        — 4 counters GSAP animés
├── Section 4  Collection   — 3 cards tilt 3D + slide-up CTA
├── Section 5  Final CTA    — "Ready for silence?"
└── Footer
```

---

## Structure fichiers

```
void-store/
├── app/
│   ├── globals.css              # @theme tokens, reset @layer base, keyframes
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home narrative
│   ├── collection/page.tsx
│   ├── product/[slug]/page.tsx
│   ├── cart/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Pill flottante centrée, backdrop-blur
│   │   ├── Footer.tsx
│   │   └── ClientProviders.tsx  # LenisProvider + CustomCursor dynamic
│   ├── home/
│   │   ├── Hero.tsx             # SILENCE. + GSAP scramble, z-10 transparent
│   │   ├── SceneCanvas.tsx      # R3F canvas fixed z-0 + SVG sound waves
│   │   ├── SceneCanvasLoader.tsx# ssr:false wrapper
│   │   ├── Marquee.tsx          # CSS pur, 2 rangées opposées
│   │   ├── ManifestoSection.tsx # WordReveal + specs #4DFFB4
│   │   ├── StatsSection.tsx     # 4 counters GSAP, bg-[#080808]
│   │   ├── CollectionPreview.tsx# 3 cards tilt 3D
│   │   └── FinalCTA.tsx         # "Ready for silence?"
│   ├── product/
│   │   └── ProductCard.tsx      # (à extraire de CollectionPreview)
│   ├── cart/
│   │   └── CartDrawer.tsx       # à builder
│   └── shared/
│       ├── LenisProvider.tsx
│       ├── CustomCursor.tsx     # magnétique, data-cursor="pointer"
│       └── WordReveal.tsx       # scrub opacity 0.15→1 mot par mot
│
├── lib/
│   └── store.ts                 # Zustand — CartItem { id, slug, name, price, quantity, image }
│
└── public/
    ├── images/
    │   ├── void-pro.png
    │   ├── void-air.png
    │   └── void-studio.png
    └── models/
        └── headphone.glb
```

---

## Avancement

```
✅ Design system + globals.css
✅ Layout root (Navbar pill, Lenis, CustomCursor)
✅ Home — toutes les sections
✅ Navbar pill flottante
✅ SceneCanvas R3F global (canvas fixé)
✅ WordReveal (composant réutilisable)
⬜ /collection
⬜ /product/[slug]
⬜ /cart + CartDrawer
⬜ /about
⬜ /contact
```

---

## Install

```bash
npm install
npm run dev
```

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

---

*Portfolio project — not a real store · VØID 2025*
