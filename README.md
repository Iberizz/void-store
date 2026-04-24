# VØID — Silence. Redefined.

> Portfolio e-commerce ultra premium — niveau Awwwards  
> Produit fictif : casque audio sans fil premium — Collection AW25

---

## Stack

| Outil              | Version        | Usage                                                     |
| ------------------ | -------------- | --------------------------------------------------------- |
| **Next.js**        | 15 (Turbopack) | App Router, Server + Client Components                    |
| **TypeScript**     | strict         | Typage partout, zéro `any`                                |
| **Tailwind CSS**   | v3             | Config custom tokens OBSIDIAN                             |
| **GSAP**           | 3.15           | SplitText, ScrollTrigger, scrub, counters, scramble       |
| **Lenis**          | latest         | `import from 'lenis'` — smooth scroll, recreate par route |
| **Three.js / R3F** | latest         | Canvas 3D global fixé `z-0`, modèle `headphone.glb`       |
| **Zustand**        | latest         | Cart state global                                         |
| **Supabase**       | latest         | Base de données, auth, RLS                                |
| **Stripe**         | latest         | Paiement (mode test)                                      |
| **Resend**         | latest         | Envoi d'emails contact                                    |
| **Lucide Icons**   | latest         | Icônes uniquement                                         |
| **Vercel**         | free           | Déploiement                                               |

---

## Design System — Palette OBSIDIAN

| Token            | Valeur    | Usage                                           |
| ---------------- | --------- | ----------------------------------------------- |
| `--void-base`    | `#000000` | Fond absolu                                     |
| `--void-surface` | `#080808` | Surfaces — StatsSection, filter bar             |
| `--void-card`    | `#0F0F0F` | Cards, Navbar pill                              |
| `--void-border`  | `#1C1C1C` | Bordures, dividers, separators                  |
| `--void-white`   | `#E8E8E8` | Textes importants, CTAs                         |
| `--void-green`   | `#4DFFB4` | Accent — tags, unités, highlights, links actifs |
| `--void-muted`   | `#666666` | Texte secondaire                                |

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

## Structure fichiers

```
void-store/
├── app/
│   ├── globals.css
│   ├── layout.tsx                       # Root — LenisProvider, CustomCursor, Navbar, grain
│   ├── page.tsx                         # Home narrative
│   ├── not-found.tsx                    # 404 — parallax glitch + MagneticButton
│   │
│   ├── auth/
│   │   ├── login/page.tsx               # Connexion (LoginClient)
│   │   ├── signup/page.tsx              # Inscription (SignupClient)
│   │   └── callback/route.ts            # Supabase OAuth callback
│   │
│   ├── account/
│   │   ├── layout.tsx                   # Sidebar compte + auth guard
│   │   ├── page.tsx                     # Dashboard aperçu commandes
│   │   ├── profile/page.tsx             # Infos personnelles
│   │   ├── orders/page.tsx              # Historique commandes
│   │   └── wishlist/page.tsx            # Liste de souhaits
│   │
│   ├── collection/
│   │   ├── page.tsx                     # Server wrapper
│   │   └── CollectionClient.tsx         # Filtres + grille 3 cols (produits dynamiques)
│   │
│   ├── product/[slug]/
│   │   ├── page.tsx                     # Server — stock, images, variantes couleur
│   │   └── ProductPageClient.tsx        # Galerie clip-path, info produit, add to cart
│   │
│   ├── checkout/
│   │   ├── page.tsx
│   │   └── CheckoutClient.tsx           # 3 étapes : shipping / paiement / confirmation
│   │
│   ├── order/[id]/
│   │   ├── page.tsx
│   │   └── OrderSuccess.tsx             # Page confirmation commande
│   │
│   ├── about/page.tsx                   # Brand story éditoriale
│   ├── contact/page.tsx                 # Formulaire Resend
│   │
│   ├── admin/
│   │   ├── layout.tsx                   # Admin guard + AdminSidebar
│   │   ├── page.tsx                     # Dashboard — KPIs, revenue chart, top produits
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── AdminProductsClient.tsx  # CRUD produits + modal création/édition/couleurs
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── AdminOrdersClient.tsx    # Gestion commandes + statuts
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── AdminUsersClient.tsx     # Liste utilisateurs
│   │   └── messages/
│   │       ├── page.tsx
│   │       └── MessagesClient.tsx       # Messages contact + réponses email
│   │
│   └── actions/
│       ├── auth.ts                      # Login, signup, signout
│       ├── products.ts                  # Fetch produits (collection, slug)
│       ├── orders.ts                    # Création et lecture commandes
│       ├── cancelOrder.ts              # Annulation commande
│       ├── checkout.ts                  # Stripe intent
│       ├── contact.ts                   # Resend email
│       └── colors.ts                    # Gestion variantes couleur produit
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                   # Pill flottante, blur, mobile menu GSAP
│   │   ├── Footer.tsx                   # Newsletter + 4 cols + wordmark + specs ticker
│   │   └── ClientProviders.tsx          # Providers client-side globaux
│   ├── home/
│   │   ├── Hero.tsx                     # SILENCE. scramble + Marquee + scroll indicator
│   │   ├── SceneCanvas.tsx              # R3F canvas fixed z-0
│   │   ├── SceneCanvasLoader.tsx        # ssr:false wrapper
│   │   ├── EmotionalScroll.tsx          # 4 panels sticky 400vh
│   │   ├── StatsSection.tsx             # 4 counters GSAP
│   │   ├── CinematicSection.tsx         # Sticky 400vh, 4 slides
│   │   ├── CollectionPreview.tsx        # 3 cards tilt 3D
│   │   ├── FinalCTA.tsx                 # SplitText + clip-path + MagneticButton
│   │   └── Marquee.tsx                  # Marquee dynamique ResizeObserver
│   ├── collection/
│   │   └── CollectionHero.tsx           # 100vh — watermark AW25 + headphone + specs
│   ├── product/
│   │   ├── ProductCard.tsx              # useInView clip-path reveal + tilt 3D
│   │   ├── ProductGallery.tsx           # Galerie produit clip-path scroll
│   │   └── ProductInfo.tsx              # Prix, couleur, stock, add to cart
│   ├── cart/
│   │   └── CartDrawer.tsx               # Slide-in depuis droite, items, subtotal
│   ├── checkout/
│   │   ├── CardPreview.tsx              # Preview carte bancaire animée
│   │   └── OrderSummary.tsx             # Récapitulatif commande
│   ├── account/
│   │   ├── AccountSidebar.tsx           # Navigation compte
│   │   └── CancelOrderButton.tsx        # Bouton annulation commande
│   ├── admin/
│   │   ├── AdminSidebar.tsx             # Navigation admin
│   │   ├── KPICard.tsx                  # Carte métrique avec sparkline
│   │   ├── Sparkline.tsx                # Mini graphe SVG inline
│   │   ├── RevenueChart.tsx             # Graphe revenus
│   │   ├── OrderStatusSelect.tsx        # Sélecteur statut commande
│   │   ├── MessageStatusSelect.tsx      # Sélecteur statut message
│   │   ├── MessageReplyModal.tsx        # Modal réponse message (Resend)
│   │   ├── AdminSearchBar.tsx           # Barre de recherche admin
│   │   ├── ProductEditModal.tsx         # Modal édition produit
│   │   ├── ProductCreateModal.tsx       # Modal création produit
│   │   └── ProductColorsModal.tsx       # Modal gestion variantes couleur
│   └── shared/
│       ├── LenisProvider.tsx            # Recreate par pathname, scrollRestoration manual
│       ├── CustomCursor.tsx             # Curseur magnétique, data-cursor="pointer"
│       ├── MagneticButton.tsx           # GSAP elastic.out — réutilisable
│       └── WordReveal.tsx               # Scrub opacity mot par mot
│
├── lib/
│   ├── store.ts                         # Zustand — cart + wishlist state
│   ├── products.ts                      # PRODUCTS_DATA statiques (produits de base)
│   ├── supabase/
│   │   ├── client.ts                    # Supabase client (browser)
│   │   ├── server.ts                    # Supabase client (server)
│   │   └── admin.ts                     # Supabase admin client (service role)
│   └── utils.ts
│
└── public/
    ├── images/
    │   ├── void-pro-transparent.png
    │   ├── void-air-transparent.png
    │   ├── void-studio.png
    │   ├── void-pro-white.png
    │   ├── void-air-white.png
    │   ├── void-studio-white.png
    │   ├── slide-drivers.png
    │   ├── slide-battery.png
    │   ├── slide-anc.png
    │   ├── slide-hero.png
    │   └── error404.png
    ├── models/
    │   └── headphone.glb
    └── videos/
        └── headphone-exploded.mp4
```

---

## Pages & fonctionnalités

| Page / Feature        | Description                                                               |
| --------------------- | ------------------------------------------------------------------------- |
| `/`                   | Home narrative — R3F canvas, EmotionalScroll, CinematicSection, FinalCTA |
| `/collection`         | Grille produits dynamiques (Supabase) — filtres catégorie/couleur         |
| `/product/[slug]`     | Galerie scroll, variantes couleur, add to cart, stock live                |
| `/checkout`           | 3 étapes : adresse → paiement Stripe (test) → confirmation                |
| `/order/[id]`         | Page de succès commande                                                   |
| `/about`              | Brand story éditoriale                                                    |
| `/contact`            | Formulaire → email via Resend                                             |
| `/auth/login`         | Connexion Supabase Auth                                                   |
| `/auth/signup`        | Inscription Supabase Auth                                                 |
| `/account`            | Dashboard client — commandes, profil, wishlist                            |
| `/admin`              | Dashboard admin — KPIs, revenus, top produits                             |
| `/admin/products`     | CRUD complet produits — image vitrine, images produit, variantes couleur  |
| `/admin/orders`       | Gestion commandes + mise à jour statuts                                   |
| `/admin/users`        | Liste des utilisateurs inscrits                                           |
| `/admin/messages`     | Messages contact + réponse email depuis l'interface                       |
| `CartDrawer`          | Slide-in global — items, quantités, subtotal, lien checkout               |

---

## Logique image produit

| Contexte           | Image utilisée                              |
| ------------------ | ------------------------------------------- |
| Collection card    | `image_vitrine` (image fond transparent/showcase) |
| Slug produit       | `image_black` / `image_white`               |
| Backoffice liste   | `image_black` (fallback `image_vitrine`)    |

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
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

---

_Portfolio project · not a real store · VØID Studio 2026_
