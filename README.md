# VØID — Silence. Redefined.

> Portfolio e-commerce ultra premium — niveau Awwwards  
> Produit fictif : casque audio sans fil premium — AW25

---

## Stack

| Outil | Version | Usage |
|-------|---------|-------|
| **Next.js** | 15 (Turbopack) | App Router, Server + Client Components |
| **TypeScript** | strict | Typage partout, zéro `any` |
| **Tailwind CSS** | v3 | Config custom tokens OBSIDIAN |
| **GSAP** | 3.15 | SplitText, ScrollTrigger, scrub, counters, scramble |
| **Lenis** | latest | `import from 'lenis'` — smooth scroll, recreate par route |
| **Three.js / R3F** | latest | Canvas 3D global fixé `z-0`, modèle `headphone.glb` |
| **Zustand** | latest | Cart state global |
| **Lucide Icons** | latest | Icônes uniquement |
| **Vercel** | free | Déploiement |

---

## Design System — Palette OBSIDIAN

| Token | Valeur | Usage |
|-------|--------|-------|
| `--void-base` | `#000000` | Fond absolu |
| `--void-surface` | `#080808` | Surfaces — StatsSection, filter bar |
| `--void-card` | `#0F0F0F` | Cards, Navbar pill |
| `--void-border` | `#1C1C1C` | Bordures, dividers, separators |
| `--void-white` | `#E8E8E8` | Textes importants, CTAs |
| `--void-green` | `#4DFFB4` | Accent — tags, unités, highlights, links actifs |
| `--void-muted` | `#666666` | Texte secondaire |

**Typo** : `font-display` = Clash Display (Fontshare) · `font-sans` = Geist/Inter  
**Weights autorisés** : 300 / 400 / 500 — 600+ interdit sauf hero  
**Letter-spacing hero** : `-0.03em` à `-0.05em`

---

## Architecture narrative — Home

Le scroll = le temps. Le canvas R3F est fixé derrière toutes les sections (`z-0`).

```
SceneCanvasLoader (fixed z-0)     R3F headphone 3D — tourne, réagit au scroll
│
├─ Hero                            SILENCE. — SplitText scramble + Marquee fusionné en bas
│   └─ Marquee                     2 rangées CSS opposées, copies dynamiques ResizeObserver
├─ EmotionalScroll (400vh)         4 panels sticky — SILENCE/CLARITY/PRESENCE/VØID
│                                  casque droit scrub rotation, watermark swap, progress bar
├─ StatsSection                    4 counters GSAP — 12k+ / 98dB / AW25 / 48h
├─ CinematicSection (400vh)        Sticky 4 slides fond blanc — drivers/battery/ANC/Pro
│                                  onEnter fade-in, onLeave fade-out + bg switch
├─ CollectionPreview               3 cards tilt 3D, aspect-[3/4]
├─ FinalCTA                        "Enter the void." — 3 cols, SplitText, clip-path reveal
│                                  MagneticButton + trust signals
└─ Footer                          Newsletter + grid 4 cols + wordmark outline + ticker specs
```

---

## Structure fichiers — état actuel

```
void-store/
├── app/
│   ├── globals.css                # tokens, reset, @keyframes marquee + soundWave
│   ├── layout.tsx                 # Root layout — LenisProvider, CustomCursor, Navbar, grain
│   ├── page.tsx                   # Home narrative
│   ├── not-found.tsx              # 404 — parallax + glitch + MagneticButton
│   ├── collection/
│   │   ├── page.tsx               # Server wrapper
│   │   └── CollectionClient.tsx   # Filtres + grille 3 cols (6 produits)
│   ├── product/[slug]/page.tsx    # ⬜ À builder
│   ├── cart/page.tsx              # ⬜ À builder
│   ├── about/page.tsx             # ⬜ À builder
│   └── contact/page.tsx           # ⬜ À builder
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # Pill flottante centrée, blur, mobile menu GSAP
│   │   │                          # handleLogoClick (reload si déjà /) + handleNavClick (scrollTop)
│   │   └── Footer.tsx             # Newsletter + 4 cols + wordmark outline + specs ticker
│   ├── home/
│   │   ├── Hero.tsx               # SILENCE. scramble + Marquee fusionné + scroll indicator droit
│   │   ├── SceneCanvas.tsx        # R3F canvas fixed z-0
│   │   ├── SceneCanvasLoader.tsx  # ssr:false wrapper
│   │   ├── EmotionalScroll.tsx    # 4 panels sticky 400vh — casque scrub + watermark swap
│   │   ├── StatsSection.tsx       # 4 counters GSAP, bg-[#080808], mb-72 desktop
│   │   ├── CinematicSection.tsx   # Sticky 400vh, 4 slides, bg-black opacity fade in/out
│   │   ├── CollectionPreview.tsx  # 3 cards tilt 3D aspect-[3/4]
│   │   └── FinalCTA.tsx           # Grid 3 cols — SplitText + clip-path + MagneticButton
│   ├── collection/
│   │   └── CollectionHero.tsx     # 100vh — watermark AW25 + headphone + specs flottantes
│   ├── product/
│   │   └── ProductCard.tsx        # useInView clip-path reveal + GSAP tilt optionnel (tilt prop)
│   ├── cart/
│   │   └── CartDrawer.tsx         # ⬜ À builder — slide-in spring Framer Motion
│   └── shared/
│       ├── LenisProvider.tsx      # Recreate par pathname — scrollRestoration manual
│       ├── CustomCursor.tsx       # Curseur magnétique, data-cursor="pointer"
│       ├── MagneticButton.tsx     # Bouton magnétique GSAP elastic.out — réutilisable
│       └── WordReveal.tsx         # Scrub opacity 0.15→1 mot par mot ScrollTrigger
│
├── lib/
│   └── store.ts                   # Zustand — CartItem { id, slug, name, price, qty, image }
│
└── public/
    ├── images/
    │   ├── void-pro-transparent.png     # ✅ Utilisé dans EmotionalScroll + CollectionPreview
    │   ├── void-air-transparent.png     # ✅ Collection
    │   ├── void-studio.png              # ✅ Collection (pas de version transparent)
    │   ├── void-pro-white.png           # ✅ Collection variante blanche
    │   ├── void-air-white.png           # ✅ Collection variante blanche
    │   ├── void-studio-white.png        # ✅ Collection variante blanche
    │   ├── slide-drivers.png            # CinematicSection slide 1
    │   ├── slide-battery.png            # CinematicSection slide 2
    │   ├── slide-anc.png                # CinematicSection slide 3
    │   ├── slide-hero.png               # CinematicSection slide 4
    │   └── error404.png                 # Background page 404
    ├── models/
    │   └── headphone.glb                # Modèle R3F SceneCanvas
    └── videos/
        └── headphone-exploded.mp4       # ManifestoSection (retiré de Home, conservé)
```

---

## Avancement

```
✅ Design system — globals.css, tokens, keyframes
✅ Root layout — Lenis, CustomCursor, Navbar, grain overlay
✅ Home — Hero, EmotionalScroll, Stats, Cinematic, CollectionPreview, FinalCTA, Footer
✅ Navbar — pill flottante, mobile menu, scroll-to-top, reload on home
✅ SceneCanvas R3F (canvas fixé z-0)
✅ LenisProvider — recreate par route, scrollRestoration manual
✅ /collection — CollectionHero + filtres + grille 3 cols × 2 rows (6 produits)
✅ /not-found — 404 glitch parallax MagneticButton
✅ MagneticButton — composant réutilisable
✅ WordReveal — composant réutilisable
✅ ProductCard — clip-path reveal, tilt 3D optionnel
⬜ /product/[slug] — galerie clip-path, info produit, add to cart
⬜ /cart — CartDrawer slide-in + résumé commande + Stripe test
⬜ /about — page éditoriale brand story
⬜ /contact — formulaire minimal + Resend
```

---

## Pages restantes — ce qui est attendu

### `/product/[slug]`
- Galerie images : clip-path reveal diagonal, navigation dots
- Info produit : SplitText titre, prix, variantes couleur (noir/blanc)
- Accordion specs : 40mm / Beryllium / ANC / 48h / Poids
- Add to cart → Zustand store → CartDrawer slide-in
- Section "You may also like" — 3 ProductCards
- Back → `/collection`

### `/cart`
- CartDrawer : slide-in depuis la droite, spring Framer Motion
- Liste items : image + nom + prix + qty +/- + remove
- Subtotal + shipping + CTA "Checkout" → Stripe test mode
- Empty state : "Your void is empty." + lien collection

### `/about`
- Brand story éditoriale — layout magazine
- Timeline : fondation → premier prototype → AW25
- Équipe (fictive) : 3 photos noir/blanc
- Valeurs : Silence / Craft / Zero compromise

### `/contact`
- Formulaire : nom + email + message — style VØID (border-bottom only)
- Validation + envoi Resend
- Map ou localisation fictive (Paris, FR)

---

## Patterns réutilisables établis

```ts
// Scroll to top on same-page nav link click
const handleNavClick = (e, href) => {
  if (pathname === href) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }
}

// Reload logo si déjà sur la home
const handleLogoClick = (e) => {
  if (pathname === '/') { e.preventDefault(); window.location.reload() }
}

// SplitText chars reveal standard
const split = new SplitText(ref.current, { type: 'chars', charsClass: 'inline-block overflow-hidden' })
gsap.from(split.chars, { y: 80, opacity: 0, stagger: 0.02, duration: 1, ease: 'expo.out',
  scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true } })

// Marquee dynamique ResizeObserver
const singleW = track.scrollWidth / copiesRef.current
const newCopies = Math.ceil(window.innerWidth / singleW) + 2

// LenisProvider — recreate par route
window.history.scrollRestoration = 'manual'
lenis.scrollTo(0, { immediate: true })

// EmotionalScroll / fast-scroll safe panel switch
gsap.killTweensOf(el)
gsap.set(nonActiveEls, { opacity: 0, y: 0 })
gsap.fromTo(activeEl, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ... })
```

---

## Install

```bash
npm install
npm run dev    # http://localhost:3000
```

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

---

*Portfolio project · not a real store · VØID Studio 2026*
