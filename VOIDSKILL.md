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
                             keyframes: grain, scroll-left, scroll-right, wave-pulse
  layout.tsx               — Navbar + ClientProviders, metadata VØID
  page.tsx                 — Home narrative complète (SceneCanvas → Hero → Marquee
                             → Manifesto → Stats → CollectionPreview → FinalCTA → Footer)

components/layout/
  Navbar.tsx               — Pill flottante fixed top-6 left-1/2 rounded-full,
                             backdrop-blur, border #1C1C1C → #333333 au scroll 50px,
                             entrance y:-16, mobile fullscreen menu z-40
  Footer.tsx               — Wordmark + nav + copyright, border-t #1C1C1C
  ClientProviders.tsx      — 'use client', dynamic imports LenisProvider + CustomCursor

components/shared/
  LenisProvider.tsx        — import from 'lenis', synced GSAP ticker + ScrollTrigger
  CustomCursor.tsx         — cercle magnétique, data-cursor="pointer" → grow 12→40px,
                             MutationObserver pour éléments dynamiques
  WordReveal.tsx           — split par mots, opacity 0.15→1, scrub ScrollTrigger,
                             réutilisable (prop: text, className)

components/home/
  Hero.tsx                 — 'use client', section z-10 pointer-events-none,
                             "SILENCE." SplitText scramble + slide-up GSAP,
                             CTAs pointer-events-auto, gradient bas pour lisibilité,
                             PAS de canvas propre (SceneCanvas est global)
  SceneCanvas.tsx          — fixed inset-0 z-0 pointer-events-none,
                             Canvas R3F alpha:true frameloop="always",
                             HeadphoneModel: idle rot +0.002/frame + scroll states
                             (0→0.3: scale 1, 0.3→0.6: scale 1.1, 0.6→0.9: scale 0.9),
                             SVG sound waves: 4 cercles, wave-pulse 3.2s stagger 0.8s
  SceneCanvasLoader.tsx    — 'use client', dynamic + ssr:false wrapper pour page.tsx
  Marquee.tsx              — CSS pur zéro JS, 2 rangées opposées, separateurs #4DFFB4
  ManifestoSection.tsx     — WordReveal (manifeste) + specs #4DFFB4 en sidebar
  StatsSection.tsx         — bg-[#080808] border-y, 4 stats, GSAP counter 0→valeur,
                             AW25 statique (AW blanc + 25 vert), unités en #4DFFB4
  CollectionPreview.tsx    — 3 cards tilt 3D (rotateX±6 rotateY±10 perspective 800),
                             highlight spéculaire radial-gradient souris,
                             "Add to cart" slide-up translateY(100%)→0 expo.out,
                             SplitText titre + stagger cards ScrollTrigger,
                             next/image branché, addItem Zustand
  FinalCTA.tsx             — "Ready for silence?", CTA border #4DFFB4, stagger reveal

lib/
  store.ts                 — Zustand useCartStore,
                             CartItem: { id, slug, name, price, quantity, image }
                             actions: addItem (merge), removeItem, updateQuantity,
                             clearCart, openCart, closeCart
```

### Assets disponibles
```
public/images/
  void-pro.png             — VØID Pro (card 001)
  void-air.png             — VØID Air (card 002)
  void-studio.png          — VØID Studio (card 003)

public/models/
  headphone.glb            — modèle 3D (texture matte black + ligne verte)

public/videos/
  headphone-exploded.mp4   — prévu pour section future
```

### À faire
```
⬜ /collection/page.tsx    — grid produits + filtres
⬜ /product/[slug]/page.tsx— gallery, 3D viewer, cart, specs
⬜ /cart/page.tsx          — résumé + checkout
⬜ CartDrawer.tsx          — slide-in Zustand
⬜ /about/page.tsx         — brand story + timeline
⬜ /contact/page.tsx       — formulaire Resend
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
--void-surface:  #080808   /* StatsSection, surfaces secondaires */
--void-card:     #0F0F0F   /* cards produit, Navbar pill bg */
--void-border:   #1C1C1C   /* bordures, dividers */
--void-white:    #E8E8E8   /* textes importants, CTA primary */
--void-green:    #4DFFB4   /* accent : tags, unités, liens actifs, CTA final */
--void-text:     #F2F2F2   /* texte principal */
--void-muted:    #666666   /* texte secondaire */

INTERDIT : cream, gold, warm tones, #FFFFFF pur, backgrounds colorés
```

### Typographie
```
TITRES (h1, h2)  : Clash Display, font-display, weight 400/500
BODY             : Satoshi, font-sans, weight 300/400
MONO             : ui-monospace (refs produit, codes)
Letter-spacing   : -0.03em à -0.05em sur les titres display
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
✅ next/image                        — obligatoire pour les images
✅ Code complet uniquement           — jamais de snippets isolés
✅ Demander validation avant coder   — spec → validation → code
✅ bg-transparent sur sections home  — le canvas noir est le fond global
✅ z-index home: canvas z-0, sections z-10
✅ pointer-events-none sur sections hero, pointer-events-auto sur CTAs
✅ Zéro lorem ipsum                  — copy réaliste VØID partout
```

---

## 5. Patterns récurrents

### ssr:false dans un Server Component
```tsx
// ❌ INTERDIT dans app/page.tsx (Server Component)
// const X = dynamic(() => import('./X'), { ssr: false })

// ✅ Créer un wrapper 'use client'
// components/home/XLoader.tsx
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

### ScrollTrigger once
```ts
scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true }
```

---

*VØID — "Silence. Redefined." — Portfolio Project 2025*
