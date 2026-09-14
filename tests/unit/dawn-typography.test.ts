import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Layout from '../../src/themes/dawn/layout.astro';

const root = resolve(__dirname, '../..');
const path = (...segments: string[]) => resolve(root, ...segments);

describe('dawn layout typography', () => {
  it("loads Kumbh Sans, the reference design's typeface", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      slots: { default: '<p>page content</p>' },
    });

    expect(html).toMatch(/fonts\.googleapis\.com\/css2\?family=Kumbh\+Sans/);

    const tokens = readFileSync(path('src/themes/dawn/tokens.css'), 'utf-8');
    expect(tokens).toMatch(/--font-sans:\s*['"]Kumbh Sans['"]/);
  });
});
