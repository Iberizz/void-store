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
**Produit** : Écouteurs audio sans fil premium  
**Tagline** : "Silence. Redefined."  
**Objectif** : Vitrine niveau Awwwards  
**Mode** : Portfolio only

---

## 1. État actuel du projet

### Composants terminés
```
✅ app/globals.css        — Tailwind v4 @theme, palette OBSIDIAN, Fontshare
✅ app/layout.tsx         — ClientProviders, metadata VØID
✅ components/layout/
   ✅ Navbar.tsx          — blur scroll, liens actifs, cart badge
   ✅ ClientProviders.tsx — LenisProvider + CustomCursor dynamic imports
✅ components/shared/
   ✅ LenisProvider.tsx   — Lenis 1.4s + GSAP sync
   ✅ CustomCursor.tsx    — cercle magnétique, fade au premier mousemove
✅ components/home/
   ✅ Hero.tsx            — "SILENCE." SplitText + scramble GSAP
   ✅ Marquee.tsx         — 2 rangées CSS opposées, separateurs #4DFFB4
   ✅ FeaturedProduct.tsx — fullscreen poster, "Not headphones. A decision."
   🔄 HeroBis.tsx        — R3F Three.js en cours (modele visible, ajustements necessaires)
✅ lib/store.ts           — Zustand cart (addItem, removeItem, updateQuantity)
```

### Assets disponibles
```
public/images/
  headphone-hero.png      — shot principal 3/4 (utilise dans FeaturedProduct)
  headphone-detail.png    — close-up ear cup avec LED vert
  headphone-flatlay.png   — top-down view

public/models/
  headphone.glb           — modele 3D Meshy (texture matte black + ligne verte)

public/videos/
  headphone-exploded.mp4  — video Kling decomposition (prevu pour section future)
```

### A faire
```
🔄 HeroBis.tsx           — ajuster camera + lighting R3F
⬜ StatsSection.tsx       — counters animes au scroll
⬜ Collection preview     — 3 cards tilt 3D
⬜ Footer.tsx
⬜ Pages : /collection, /product/[slug], /cart, /about, /contact
```

---

## 2. Stack technique

```
Next.js 15      App Router
TypeScript      strict
Tailwind CSS    v4 — @theme dans globals.css
Framer Motion   page transitions
GSAP 3.15       ScrollTrigger, SplitText (free)
Lenis           import from 'lenis' (PAS @studio-freight)
Three.js / R3F  @react-three/fiber + @react-three/drei
Zustand         cart state
shadcn/ui       customise
Lucide Icons
Supabase        free tier
Vercel          free tier
```

---

## 3. Design System — Palette OBSIDIAN

```css
--void-base:     #000000
--void-surface:  #080808
--void-card:     #0F0F0F
--void-border:   #1C1C1C
--void-white:    #E8E8E8
--void-green:    #4DFFB4
--void-text:     #F2F2F2
--void-muted:    #666666

INTERDIT : cream, gold, warm tones, #FFF pur
```

### Typographie
```
TITRES (H1, H2) : Clash Display (Fontshare)
BODY            : Satoshi (Fontshare)
Weights         : 300 / 400 / 500 uniquement
```

### globals.css — règle critique Tailwind v4
```css
/* Reset DOIT être dans @layer base */
@layer base {
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
}
```

---

## 4. HeroBis — fix prioritaire

Modele R3F visible mais trop petit et trop sombre.

Fix à appliquer en premier :
```
camera position    : [0, 0, 1.8]
ambientLight       : intensity 0.4
pointLight blanc   : intensity 4, position [5, 3, 5], color #E8E8E8
pointLight verte   : intensity 0.8, position [-3, 0, 3], color #4DFFB4
model position     : [0, -0.5, 0]
model rotation     : [0.1, -0.3, 0]
useFrame rotation  : ref.current.rotation.y += 0.003
```

---

## 5. Page Home — ordre des sections

```tsx
<Hero />              // SILENCE. fullscreen - DONE
<HeroBis />           // R3F Three.js - EN COURS
<Marquee />           // bande defilante - DONE
<FeaturedProduct />   // Not headphones. A decision. - DONE
<StatsSection />      // a generer
<CollectionPreview /> // a generer
<Footer />            // a generer
```

---

## 6. Règles critiques

```
import Lenis from 'lenis' — jamais @studio-freight/lenis
Tailwind v4 — tokens dans @theme, reset dans @layer base
'use client' uniquement si interactions
Dynamic imports + ssr:false pour R3F et CustomCursor
useGSAP() pour cleanup automatique
Zero lorem ipsum — copy realiste VØID
Zero erreur TypeScript
Code complet — jamais de snippets
Demander validation avant chaque generation
```

---

*VØID — "Silence. Redefined." — Portfolio Project 2025*