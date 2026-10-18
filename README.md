# CrushMe — Note ta drague par l'IA

Site SaaS B2C mobile-first. L'utilisateur envoie une capture d'ecran de conversation de drague, l'IA donne une note /10 et propose des reponses.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Supabase** — Auth (email magic link + Google) + PostgreSQL
- **Stripe** — Abonnements (essai 3j a 2 EUR puis 10 EUR/sem, ou 25 EUR/mois)
- **Anthropic API** — Claude Sonnet avec vision pour l'analyse d'images
- **Vercel** — Hebergement

## Setup rapide

### 1. Cloner et installer

```bash
git clone <repo-url>
cd rizzscore
npm install
cp .env.example .env.local
```

### 2. Supabase

1. Cree un projet sur [supabase.com](https://supabase.com)
2. Va dans **Settings > API** et copie :
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`
3. Va dans **SQL Editor** et execute le contenu de `supabase-schema.sql`
4. Va dans **Authentication > Providers** :
   - Active **Email** (magic link active par defaut)
   - Active **Google** (tu auras besoin d'un OAuth Client ID Google)
5. Va dans **Authentication > URL Configuration** :
   - Ajoute ton domaine dans "Redirect URLs" : `https://ton-domaine.com/**`

### 3. Anthropic

1. Cree un compte sur [console.anthropic.com](https://console.anthropic.com)
2. Cree une cle API -> `ANTHROPIC_API_KEY`

### 4. Stripe

1. Cree un compte sur [stripe.com](https://stripe.com)
2. En mode test, va dans **Developers > API keys** :
   - Secret key -> `STRIPE_SECRET_KEY`
   - Publishable key -> `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Cree 2 produits/prix dans **Products** :
   - **Essai hebdo** : 10 EUR/semaine (avec 3 jours d'essai)
     -> Copie le Price ID -> `STRIPE_TRIAL_PRICE_ID`
   - **Mensuel** : 25 EUR/mois
     -> Copie le Price ID -> `STRIPE_MONTHLY_PRICE_ID`
4. Configure un webhook dans **Developers > Webhooks** :
   - URL : `https://ton-domaine.com/api/webhook`
   - Evenements a ecouter :
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copie le signing secret -> `STRIPE_WEBHOOK_SECRET`
5. Active le **Customer Portal** dans **Settings > Billing > Customer portal**

### 5. Lancer en local

```bash
npm run dev
```

Ouvre http://localhost:3000

Pour tester les webhooks Stripe en local :
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### 6. Deployer sur Vercel

1. Push le code sur GitHub
2. Importe le repo sur [vercel.com](https://vercel.com)
3. Ajoute toutes les variables d'environnement du `.env.example`
4. Deploie

## Structure du projet

```
src/
  app/
    page.tsx              # Landing page
    layout.tsx            # Layout global + PWA
    analyse/page.tsx      # Upload + resultats
    historique/page.tsx   # Historique des analyses
    compte/page.tsx       # Gestion compte/abo
    connexion/page.tsx    # Auth (Google + email)
    mentions-legales/     # Mentions legales
    cgv/                  # CGV
    confidentialite/      # RGPD
    api/
      analyze/route.ts    # Analyse IA
      checkout/route.ts   # Stripe Checkout
      portal/route.ts     # Stripe Portal
      webhook/route.ts    # Stripe Webhooks
  components/
    BottomNav.tsx         # Navigation mobile
    ImageUpload.tsx       # Upload d'image
    PaywallOverlay.tsx    # Paywall flou
    ScoreRing.tsx         # Score anime
    SuggestionCard.tsx    # Carte de suggestion
  lib/
    anthropic.ts          # Client Anthropic
    stripe.ts             # Client Stripe
    supabase-browser.ts   # Client Supabase (browser)
    supabase-server.ts    # Client Supabase (server)
  types/index.ts
  proxy.ts                # Auth proxy (middleware)
```

## Securite

- Images jamais stockees (traitement en memoire)
- Cles API uniquement cote serveur
- RLS Supabase (chaque user voit ses donnees)
- Limite 30 analyses/jour par user
- L'IA refuse les conversations avec mineurs/harcelement
- Reserve aux 18+
