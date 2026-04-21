---
name: void-ecommerce
description: Expert skill for building the VØID premium e-commerce portfolio site. Use this skill for all tasks related to the VØID project — architecture, components, animations, design system, and code generation. Triggers on any mention of VØID, the e-commerce portfolio, Next.js components for this project, GSAP animations, or the OBSIDIAN palette.
---

# SKILL — VØID E-Commerce Portfolio
> Référence projet pour Claude Code. Lire ce fichier au début de chaque session.

---

## 0. Contexte projet

**Projet** : Site e-commerce portfolio ultra premium  
**Marque fictive** : VØID  
**Produit** : Casque audio sans fil premium  
**Tagline** : "Silence. Redefined."  
**Objectif** : Vitrine niveau Awwwards — iyo.ai / Apple  
**Philosophie** : Le scroll = le temps. Expérience narrative continue. Fond noir absolu. Le canvas R3F est le fond global.  
**Mode** : Portfolio only

---

## 1. État actuel du projet

### Composants terminés ✅

```
app/
  globals.css              — Tailwind v4 @theme, palette OBSIDIAN, Fontshare CDN,
                             keyframes: grain, wave-pulse,
                             scroll-left/scroll-right utilisent var(--marquee-offset)
  layout.tsx               — Navbar + ClientProviders, metadata VØID
  page.tsx                 — Home narrative complète :
                             SceneCanvasLoader → Hero → Marquee → StatsSection
                             → ManifestoSection → CinematicSection
                             → CollectionPreview → FinalCTA → Footer

  collection/
    page.tsx               — Server Component, bg-[#000000], pas de pt-20
    CollectionClient.tsx   — 'use client', filtres ['All','Over-ear','In-ear','Studio'],
                             hero card full-width (70vh), grille symétrique 1fr 1fr (70vh),
                             Array<typeof rest> pour les rows (éviter typeof rest[])

components/layout/
  Navbar.tsx               — Pill fixed top-6 left-1/2 rounded-full,
                             backdrop-blur, border #1C1C1C → #333333 au scroll 50px,
                             entrance y:-16, mobile fullscreen z-40, z-50
  Footer.tsx               — Lusion style : wordmark VØID clamp(16vw,20vw,24vw) centré,
                             tagline, border-t, bottom bar Logo | nav | copyright
  ClientProviders.tsx      — 'use client', dynamic imports LenisProvider + CustomCursor

components/shared/
  LenisProvider.tsx        — import from 'lenis', synced GSAP ticker + ScrollTrigger
  CustomCursor.tsx         — cercle magnétique, data-cursor="pointer" → grow 12→40px
  WordReveal.tsx           — split par mots, opacity 0.15→1, scrub ScrollTrigger,
                             props: text, className

components/home/
  Hero.tsx                 — 'use client', section z-10 pointer-events-none,
                             "SILENCE." SplitText scramble + slide-up GSAP,
                             CTAs pointer-events-auto, gradient bas,
                             PAS de canvas propre (SceneCanvas est global)
  SceneCanvas.tsx          — fixed inset-0 z-0 pointer-events-none,
                             Canvas R3F alpha:true frameloop="always",
                             HeadphoneModel idle rot +0.002/frame + scroll states
                             (0→0.3: scale 1 / 0.3→0.6: scale 1.1 / 0.6→0.9: scale 0.9),
                             SVG sound waves: 4 cercles, wave-pulse 3.2s stagger 0.8s
  SceneCanvasLoader.tsx    — 'use client', dynamic + ssr:false wrapper
  Marquee.tsx              — 'use client', ResizeObserver sur container,
                             copies = Math.ceil(window.innerWidth / singleW) + 2,
                             --marquee-offset CSS var = -100/copies %,
                             will-change: transform, cleanup ro.disconnect()
  ManifestoSection.tsx     — "01" watermark absolute fontSize 20vw color #0F0F0F z:-1,
                             ligne verticale w-px h-16 #1C1C1C + WordReveal,
                             specs row flex-row gap-8 mt-auto (#4DFFB4 uppercase)
  StatsSection.tsx         — bg-[#080808] border-y #1C1C1C, grid 2×2 / 4-col desktop,
                             GSAP counter 0→valeur, AW25 statique, unités #4DFFB4
  CinematicSection.tsx     — height: 400vh, sticky h-screen overflow-hidden z-6,
                             fond blanc overlay z-0 (opacity 0→1 ScrollTrigger enter/leave),
                             4 slides: Drivers / Battery / Silence / Collection,
                             left 45%: progress bar 4×1px #1C1C1C fill #4DFFB4 0→48px,
                             right 55%: images fill object-cover,
                             goTo(): title exit y:-40 skewY:3 / enter y:60 skewY:-3 expo.out,
                             image exit scale:1.05 / enter scale:1→1,
                             querySelector('[data-title]') pour cibler les h2,
                             mobile: image top h-[50vh] order-1, texte bottom order-2
  CollectionPreview.tsx    — 3 cards tilt 3D (rotateX±6 rotateY±10 perspective 800),
                             highlight spéculaire radial-gradient souris,
                             "Add to cart" slide-up translateY(100%)→0 expo.out,
                             addItem: { id, slug, name, price, quantity:1, image }
  FinalCTA.tsx             — "Ready for silence?", CTA border #4DFFB4

components/product/
  ProductCard.tsx          — 'use client', props: name price category slug imageSrc size delay,
                             motion.div useInView { once:true, margin:'0px 0px -10% 0px' },
                             clipPath inset(0 0 100% 0)→inset(0 0 0% 0) duration 0.9,
                             GSAP tilt rotateX±8 rotateY±8 perspective 800,
                             image: absolute inset-0 p-8 > div relative > Image fill object-contain,
                             bottom bar: name #F2F2F2 + price #4DFFB4

lib/
  store.ts                 — Zustand useCartStore,
                             CartItem: { id, slug, name, price, quantity, image } (tous requis)
                             actions: addItem (merge qty), removeItem, updateQuantity,
                             clearCart, openCart, closeCart
```

### Assets disponibles
```
public/images/
  void-pro.png             — VØID Pro landscape (utilisé dans /collection + CollectionPreview)
  void-air.png             — VØID Air landscape
  void-studio.png          — VØID Studio landscape
  void-pro-916.png         — format portrait 9:16 (disponible si besoin)
  void-air-916.png
  void-studio-916.png
  slide-drivers.png        — CinematicSection slide 1
  slide-battery.png        — CinematicSection slide 2
  slide-anc.png            — CinematicSection slide 3
  slide-hero.png           — CinematicSection slide 4
  headphone-hero.png
  headphone-flatlay.png
  headphone-detail.png

public/models/
  headphone.glb            — modèle 3D SceneCanvas

public/videos/
  headphone-exploded.mp4   — prévu section future
```

### À faire
```
⬜ /product/[slug]/page.tsx — gallery, 3D viewer, cart, specs
⬜ /cart/page.tsx           — résumé + checkout
⬜ CartDrawer.tsx           — slide-in Zustand
⬜ /about/page.tsx          — brand story + timeline
⬜ /contact/page.tsx        — formulaire Resend
```

---

## 2. Stack technique

```
Next.js 15      App Router — lire node_modules/next/dist/docs/ avant de coder
TypeScript      strict mode — zéro erreur
Tailwind CSS    v4 — tokens dans @theme (PAS tailwind.config.ts)
GSAP 3.15       ScrollTrigger, SplitText (free depuis 3.12)
Lenis           import from 'lenis' — JAMAIS @studio-freight/lenis
Three.js / R3F  @react-three/fiber + @react-three/drei
Zustand         cart state
shadcn/ui       customisé palette OBSIDIAN
Lucide Icons
```

---

## 3. Design System — Palette OBSIDIAN

```css
--void-base:     #000000   /* fond absolu — PARTOUT */
--void-surface:  #080808   /* StatsSection, filter bar collection */
--void-card:     #0F0F0F   /* cards produit, Navbar pill bg */
--void-border:   #1C1C1C   /* bordures, dividers */
--void-white:    #E8E8E8   /* textes importants */
--void-green:    #4DFFB4   /* accent : tags, unités, liens actifs, progress bars */
--void-text:     #F2F2F2   /* texte principal */
--void-muted:    #666666   /* texte secondaire */

INTERDIT : cream, gold, warm tones, #FFFFFF pur, backgrounds colorés
```

### Typographie
```
TITRES (h1, h2)  : Clash Display, font-display, weight 400/500
BODY             : Satoshi, font-sans, weight 300/400
Letter-spacing   : -0.03em à -0.05em sur les titres display
Tags / labels    : uppercase, tracking-[0.15em à 0.25em], font-light
```

---

## 4. Règles critiques

```
✅ import Lenis from 'lenis'         — jamais @studio-freight
✅ Tailwind v4                        — reset dans @layer base (sinon padding cassé)
✅ dynamic + ssr:false               — interdit dans Server Components
                                       → créer un wrapper 'use client'
✅ useGLTF / Canvas                  — toujours ssr:false
✅ ScrollTrigger + Lenis             — syncer via gsap.ticker.add + lagSmoothing(0)
✅ data-cursor="pointer"             — sur tous les éléments cliquables
✅ aria-label                        — sur tous les boutons/liens
✅ next/image fill + object-contain  — pour les images produit (fond transparent)
✅ Code complet uniquement           — jamais de snippets isolés
✅ Demander validation avant coder   — spec → validation → code
✅ bg-transparent sur sections home  — le canvas noir est le fond global
✅ z-index home: canvas z-0, sections z-10, navbar z-50
✅ pointer-events-none sur sections hero, pointer-events-auto sur CTAs
✅ Zéro lorem ipsum                  — copy réaliste VØID partout
✅ CartItem: tous les champs requis  — { id, slug, name, price, quantity, image }
✅ Array<typeof T>                   — jamais typeof T[] (bug TypeScript parsing)
```

---

## 5. Patterns récurrents

### ssr:false dans un Server Component
```tsx
// ❌ INTERDIT dans app/page.tsx (Server Component)
// const X = dynamic(() => import('./X'), { ssr: false })

// ✅ Créer un wrapper 'use client'
'use client'
import dynamic from 'next/dynamic'
const X = dynamic(() => import('./X'), { ssr: false })
export default function XLoader() { return <X /> }
```

### GSAP cleanup
```tsx
useEffect(() => {
  const ctx = gsap.context(() => { /* animations */ }, ref)
  return () => ctx.revert()
}, [])
```

### ResizeObserver cleanup
```tsx
useEffect(() => {
  const ro = new ResizeObserver(callback)
  ro.observe(element)
  return () => ro.disconnect()
}, [])
```

### Array de tableaux TypeScript
```tsx
// ❌ Bug: TypeScript parse comme element type, pas array d'arrays
const rows: typeof rest[] = []
// ✅
const rows: Array<typeof rest> = []
```

### Spread vers un composant avec id non déclaré
```tsx
// Destructurer id hors des props avant de spread
const { id, ...cardProps } = product
return <ProductCard {...cardProps} />
```

---

*VØID — "Silence. Redefined." — Portfolio Project 2026*
