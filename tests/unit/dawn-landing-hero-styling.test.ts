import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Landing from '../../src/themes/dawn/pages/landing.astro';

describe('dawn Landing page hero styling', () => {
  it('renders the heading at the display type scale and a primary CTA using the accent color', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Landing);

    expect(html).toMatch(/<h1[^>]+class="[^"]*text-5xl[^"]*"[^>]*>/);
    const contactLinks = [...html.matchAll(/<a\s([^>]*href="\/contact"[^>]*)>/g)];
    expect(contactLinks.some((match) => /class="[^"]*bg-action[^"]*"/.test(match[1]))).toBe(true);
  });

  // Style guide only loads Kumbh Sans 400 and 700 — font-semibold would
  // fall back to a weight the font file doesn't actually have.
  it('never uses font-semibold', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Landing);

    expect(html).not.toMatch(/class="[^"]*font-semibold[^"]*"/);
  });
});
