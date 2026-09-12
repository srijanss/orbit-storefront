import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '../..');
const path = (...segments: string[]) => resolve(root, ...segments);

// F1.1 — Astro project setup (SPEC.md MVP 1)
//
// User story: As a developer starting a new client build, I want the Astro
// project scaffolded with a shared, theme-agnostic sections library and the
// `dawn` default theme (design tokens, layout, a place for default pages),
// so that later features (F1.2-F1.6 pages, MVP2 catalog, theming) have a
// stable structure to build on and switching themes can never break a page.
//
// User story: As a developer adding a second theme later, I want sections
// to live once in `src/components/sections/` (never forked per theme), so
// that every theme automatically supports every section.
describe('F1.1 Astro project setup', () => {
  it('provides a shared, theme-agnostic sections library separate from interactive islands', () => {
    expect(existsSync(path('src/components/sections'))).toBe(true);
    expect(existsSync(path('src/components/islands'))).toBe(true);
  });

  it('scaffolds the dawn theme with design tokens, a layout, and a place for its default pages', () => {
    expect(existsSync(path('src/themes/dawn/tokens.css'))).toBe(true);
    expect(existsSync(path('src/themes/dawn/layout.astro'))).toBe(true);
    expect(existsSync(path('src/themes/dawn/pages'))).toBe(true);

    const layout = readFileSync(path('src/themes/dawn/layout.astro'), 'utf-8');
    expect(layout).toContain('<slot');
  });
});
