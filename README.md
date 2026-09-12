# astro-storefront

Astro storefront frontend for the Medusa-backed ecommerce project (see `SPEC.md` for the full plan, `AGENTS.md` for how this repo is operated). SSR via the Node adapter — not a static export.

## Project Structure

```
src/
├── components/
│   ├── sections/       # Shared across ALL themes — Hero, Nav, Footer, etc.
│   │                    # Never fork a section per theme; style via tokens only.
│   └── islands/         # Interactive components (cart, auth forms)
├── themes/
│   └── dawn/              # Default theme — design tokens + layout + default pages
│       ├── tokens.css      # Tailwind v4 @theme tokens (colors, fonts, radii)
│       ├── layout.astro
│       └── pages/          # Landing, About, Contact, Privacy, Terms
├── pages/            # File-based routing — wires routes to theme pages
├── styles/
│   └── global.css     # @import 'tailwindcss' + theme tokens
public/
├── theme-previews/     # Screenshot per theme, for the Medusa Admin theme picker
tests/
├── acceptance/         # Outside-in TDD acceptance tests (one per SPEC.md feature)
├── unit/               # Drilled-down unit tests
└── regression/         # Bug-fix regression tests
astro.config.mjs
vitest.config.ts        # Uses astro/config's getViteConfig so .astro files
                        # render via Astro's Container API in tests
```

## Env Vars

Copy `.env.example` to `.env` and fill in values — never commit `.env`.

## Commands

```sh
pnpm install       # Install dependencies
pnpm build         # Build production site to ./dist/
pnpm preview       # Preview the build locally
pnpm test          # Run the Vitest suite
pnpm lint          # ESLint
pnpm format        # Prettier
```

### Dev server

Run the dev server in the background so it doesn't block your terminal:

```sh
npx astro dev --background   # start — prints the local URL (default http://localhost:4321)
npx astro dev status         # check if it's running
npx astro dev logs           # tail server logs
npx astro dev stop           # stop it
```

## Development workflow

This repo uses outside-in TDD (see `.agents/skills/tdd-start/` and the `outside-in-tdd` MCP server) — each feature starts with a failing acceptance test before any implementation. `pnpm test` must pass before a feature is considered done.

## Want to learn more?

See [Astro's documentation](https://docs.astro.build).
