import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '../..');
const path = (...segments: string[]) => resolve(root, ...segments);

// Real values from the actual project's style-guide.md (Frontend Mentor
// "ecommerce-product-page"), not the approximated ecommerce-design-system-handoff.
describe('dawn design-system tokens', () => {
  it('uses the real style-guide colors (accent, surfaces, text, borders)', () => {
    const tokens = readFileSync(path('src/themes/dawn/tokens.css'), 'utf-8');

    expect(tokens).toMatch(/--color-orange-500:\s*hsl\(26,?\s*100%,?\s*55%\)/);
    expect(tokens).toMatch(/--color-orange-100:\s*hsl\(25,?\s*100%,?\s*94%\)/);
    expect(tokens).toMatch(/--color-neutral-950:\s*hsl\(220,?\s*13%,?\s*13%\)/);
    expect(tokens).toMatch(/--color-neutral-600:\s*hsl\(219,?\s*9%,?\s*45%\)/);
    expect(tokens).toMatch(/--color-neutral-300:\s*hsl\(220,?\s*14%,?\s*75%\)/);
    expect(tokens).toMatch(/--color-neutral-50:\s*hsl\(223,?\s*64%,?\s*98%\)/);

    expect(tokens).toMatch(/--color-action:\s*var\(--color-orange-500\)/);
    expect(tokens).toMatch(/--color-bg:\s*var\(--color-neutral-0\)/);
    expect(tokens).toMatch(/--color-surface:\s*var\(--color-neutral-0\)/);
    expect(tokens).toMatch(/--color-text:\s*var\(--color-neutral-950\)/);
    expect(tokens).toMatch(/--color-border:\s*var\(--color-neutral-300\)/);
  });

  it('only defines the two font weights the style guide specifies (400, 700)', () => {
    const tokens = readFileSync(path('src/themes/dawn/tokens.css'), 'utf-8');

    expect(tokens).toMatch(/--font-weight-regular:\s*400/);
    expect(tokens).toMatch(/--font-weight-bold:\s*700/);
    expect(tokens).not.toMatch(/--font-weight-medium/);
    expect(tokens).not.toMatch(/--font-weight-semibold/);

    const layout = readFileSync(path('src/themes/dawn/layout.astro'), 'utf-8');
    expect(layout).toMatch(/Kumbh\+Sans:wght@400;700/);
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
