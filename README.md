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
| `void-surface` | `#080808` | Surfaces, StatsSection, filter bar |
| `void-card` | `#0F0F0F` | Cards produit, Navbar pill |
| `void-border` | `#1C1C1C` | Bordures, dividers |
| `void-white` | `#E8E8E8` | Textes importants |
| `void-green` | `#4DFFB4` | Accent — tags, unités, liens actifs |
| `void-text` | `#F2F2F2` | Texte principal |
| `void-muted` | `#666666` | Texte secondaire |

**Fonts** : Clash Display (titres) + Satoshi (body) — Fontshare CDN

---

## Architecture narrative — Home

Le scroll = le temps. Le canvas R3F est fixé derrière toutes les sections.

```
SceneCanvas (fixed z-0)       — casque 3D tourne en continu, réagit au scroll
│
├── Section 1  Hero            — "SILENCE." SplitText scramble, CTAs
├── Marquee                    — CSS dynamique, ResizeObserver, 2 rangées opposées
├── Section 2  Stats           — 4 counters GSAP animés
├── Section 3  Manifesto       — WordReveal scrub + "01" watermark + specs
├── Section 4  Cinematic       — sticky 400vh, 4 slides, fond blanc, transitions diagonales
├── Section 5  CollectionPreview — 3 cards tilt 3D + slide-up CTA
├── Section 6  Final CTA       — "Ready for silence?"
└── Footer                     — Lusion style, wordmark pleine largeur
```

---

## Structure fichiers

```
void-store/
├── app/
│   ├── globals.css              # @theme tokens, reset @layer base, keyframes
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home narrative
│   ├── collection/
│   │   ├── page.tsx             # Server Component wrapper
│   │   └── CollectionClient.tsx # Filtres + grille symétrique + hero card
│   ├── product/[slug]/page.tsx
│   ├── cart/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Pill flottante centrée, backdrop-blur
│   │   ├── Footer.tsx           # Lusion style — wordmark full-width
│   │   └── ClientProviders.tsx  # LenisProvider + CustomCursor dynamic
│   ├── home/
│   │   ├── Hero.tsx             # SILENCE. + GSAP scramble, z-10 transparent
│   │   ├── SceneCanvas.tsx      # R3F canvas fixed z-0 + SVG sound waves
│   │   ├── SceneCanvasLoader.tsx# ssr:false wrapper
│   │   ├── Marquee.tsx          # ResizeObserver, copies dynamiques, CSS var offset
│   │   ├── ManifestoSection.tsx # WordReveal + "01" watermark + specs #4DFFB4
│   │   ├── StatsSection.tsx     # 4 counters GSAP, bg-[#080808]
│   │   ├── CinematicSection.tsx # Sticky 400vh, 4 slides, fond blanc, progress bar
│   │   ├── CollectionPreview.tsx# 3 cards tilt 3D, addItem Zustand
│   │   └── FinalCTA.tsx         # "Ready for silence?"
│   ├── product/
│   │   └── ProductCard.tsx      # useInView clip-path + GSAP tilt, object-contain
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
    │   ├── void-pro.png / void-pro-916.png
    │   ├── void-air.png / void-air-916.png
    │   ├── void-studio.png / void-studio-916.png
    │   ├── slide-drivers.png
    │   ├── slide-battery.png
    │   ├── slide-anc.png
    │   ├── slide-hero.png
    │   ├── headphone-hero.png
    │   ├── headphone-flatlay.png
    │   └── headphone-detail.png
    ├── models/
    │   └── headphone.glb
    └── videos/
        └── headphone-exploded.mp4
```

---

## Avancement

```
✅ Design system + globals.css
✅ Layout root (Navbar pill, Lenis, CustomCursor)
✅ Home — toutes les sections (Hero, Marquee, Stats, Manifesto, Cinematic, CollectionPreview, FinalCTA)
✅ Navbar pill flottante
✅ SceneCanvas R3F global (canvas fixé)
✅ WordReveal (composant réutilisable)
✅ CinematicSection (sticky 400vh, 4 slides, fond blanc, progress bar)
✅ Footer Lusion style
✅ ProductCard (clip-path reveal, tilt 3D)
✅ /collection (filtres, hero card, grille symétrique)
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

*Portfolio project — not a real store · VØID 2026*
