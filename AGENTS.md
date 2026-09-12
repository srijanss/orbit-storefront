# AGENTS.md — astro-storefront

Operating manual for this repo. Pair with `SPEC.md` (what/why). This file = how. Only non-obvious info — don't restate what's inferable from code/`package.json`.

## Stack

Node.js 24 LTS · Astro (SSR via Node adapter, not static export) · TypeScript (strict) · Tailwind · Vite · pnpm · Vitest · ESLint + Prettier + `eslint-plugin-astro` + `prettier-plugin-astro` + `prettier-plugin-tailwindcss`

**Personalized per client** (unlike `medusa-backend`) — branding/layout/pages diverge freely, but keep `src/lib/medusa-client.ts` reusable/portable across client forks.

## Structure

```
src/
├── components/
│   ├── sections/       # Shared across ALL themes — Hero, ProductGrid, etc.
│   │                    # Never fork a section per theme; style via tokens only.
│   └── islands/         # Interactive components (cart, auth forms)
├── themes/
│   └── dawn/              # Default theme — design tokens + layout + default pages
│       ├── tokens.css      # CSS variables consumed by Tailwind config
│       ├── layout.astro
│       └── pages/          # Landing, About, Privacy, Terms (lorem ipsum initially)
├── pages/            # File-based routing (products/[handle].astro, etc.) — resolves active theme
├── lib/
│   ├── medusa-client.ts   # All Store API calls go through here
│   ├── theme.ts            # Resolves active theme from Medusa store metadata
│   └── features.ts          # Resolves feature flags (auth/products/checkout) from Medusa store metadata
├── stores/            # nanostores — cross-island state (cart, auth)
└── styles/
public/
├── theme-previews/     # Screenshot per theme, referenced by Medusa Admin theme picker
astro.config.mjs
```

New themes = a new `src/themes/<name>/` folder with its own `tokens.css` + `layout.astro` + pages — **never** a forked copy of `src/components/sections/`. Flag before adding new top-level folders.

## Env Vars (`.env`, never commit; keep `.env.example` current)

```
PUBLIC_MEDUSA_BACKEND_URL=   # PUBLIC_ = exposed client-side
MEDUSA_BACKEND_URL=          # server-only, prefer for SSR
STRIPE_PUBLISHABLE_KEY=      # MVP 5+
GOOGLE_OAUTH_CLIENT_ID=      # MVP 3+
APPLE_OAUTH_CLIENT_ID=       # MVP 3+
```

## Commands

```
pnpm install · pnpm dev · pnpm build · pnpm preview
pnpm test · pnpm lint · pnpm format
```

## Conventions

- Default to zero-JS. Only add `client:*` directives where interactivity is genuinely needed.
- Prefer SSR data fetching over client-side calls to Medusa.
- All Store API calls go through `medusa-client.ts` — no ad hoc `fetch()` in components.
- Cross-island state → `src/stores/` (nanostores), not prop drilling.
- Every page needs title + description metadata at minimum.
- Page content (About, Terms, etc.) is hardcoded per theme — not fetched from Medusa. Medusa only stores which theme is active (`store.metadata.active_theme`).
- Sections in `src/components/sections/` are shared across every theme — themes change styling (tokens) only, never fork or reimplement a section. This is what guarantees theme-switching can't break a page.
- Check `features.ts` before rendering auth UI, catalog routes, or checkout/buy buttons — don't hardcode assumptions that these are always on.
- No `any` — narrow `unknown` or type properly.
- Conventional Commits, one logical change per commit, reference `SPEC.md` feature ID (e.g. `F2.6`) where useful.

## Testing

Unit tests: cart/checkout logic, non-trivial data transforms.
Component tests: islands with real logic (not purely presentational ones).
E2E: deferred post-MVP unless requested.
`pnpm test` must pass before a task is done.

## Non-Goals

- No guest checkout.
- No payment UI before MVP 5.
- nanostores only — no heavier state library.
- Flag new dependencies not already in `SPEC.md` before adding.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
