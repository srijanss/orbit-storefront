import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '../..');
const path = (...segments: string[]) => resolve(root, ...segments);

// Tokens translated from ../ecommerce-design-system-handoff/design-system/tokens.css
// into Tailwind v4 @theme keys (so Tailwind generates matching utilities,
// e.g. --color-action -> bg-action/text-action).
describe('dawn design-system tokens', () => {
  it('defines the semantic color tokens (accent, surfaces, text, borders)', () => {
    const tokens = readFileSync(path('src/themes/dawn/tokens.css'), 'utf-8');

    expect(tokens).toMatch(/--color-action:\s*(oklch\(|var\(--color-orange)/);
    expect(tokens).toMatch(/--color-action-hover:\s*(oklch\(|var\(--color-orange)/);
    expect(tokens).toMatch(/--color-bg:\s*(oklch\(|var\(--color-neutral)/);
    expect(tokens).toMatch(/--color-surface:\s*(oklch\(|var\(--color-neutral)/);
    expect(tokens).toMatch(/--color-text:\s*(oklch\(|var\(--color-neutral)/);
    expect(tokens).toMatch(/--color-border:\s*(oklch\(|var\(--color-neutral)/);
  });

  it('defines the editorial type scale from the foundations doc', () => {
    const tokens = readFileSync(path('src/themes/dawn/tokens.css'), 'utf-8');

    expect(tokens).toMatch(/--text-5xl:\s*3\.5rem/);
    expect(tokens).toMatch(/--text-base:\s*1rem/);
    expect(tokens).toMatch(/--font-sans:/);
  });

  it('defines the compact radius scale', () => {
    const tokens = readFileSync(path('src/themes/dawn/tokens.css'), 'utf-8');

    expect(tokens).toMatch(/--radius-sm:\s*4px/);
    expect(tokens).toMatch(/--radius-md:\s*6px/);
  });
});
