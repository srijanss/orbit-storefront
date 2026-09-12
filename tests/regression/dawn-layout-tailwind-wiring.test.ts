import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '../..');
const path = (...segments: string[]) => resolve(root, ...segments);

// Bug: src/themes/dawn/layout.astro imports tokens.css directly, bypassing
// src/styles/global.css (which has `@import 'tailwindcss'` + tokens.css) —
// so Tailwind utility classes never actually load on any page.
describe('dawn layout Tailwind wiring', () => {
  it('imports the global stylesheet that pulls in Tailwind, not just the theme tokens directly', () => {
    const layout = readFileSync(path('src/themes/dawn/layout.astro'), 'utf-8');
    expect(layout).toMatch(/import\s+['"].*styles\/global\.css['"]/);

    const globalCss = readFileSync(path('src/styles/global.css'), 'utf-8');
    expect(globalCss).toContain("@import 'tailwindcss'");
  });
});
