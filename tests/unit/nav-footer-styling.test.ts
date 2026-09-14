import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Nav from '../../src/components/sections/Nav.astro';
import Footer from '../../src/components/sections/Footer.astro';

describe('Nav section styling', () => {
  it('is a low-profile flex row with a bottom border and a brand wordmark', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav);

    expect(html).toMatch(/<nav[^>]+class="[^"]*flex[^"]*"[^>]*>/);
    expect(html).toMatch(/<nav[^>]+class="[^"]*border-b[^"]*"[^>]*>/);
    expect(html).toMatch(/<a[^>]+href="\/"[^>]*class="[^"]*font-bold[^"]*"/);
  });

  // Reference: ecommerce-product-page desktop/mobile screenshots — bold
  // lowercase wordmark, gray nav links with generous gaps, content
  // constrained to a contained width rather than spanning edge-to-edge.
  it("matches the reference screenshot's contained width, bold wordmark, and link spacing", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav);

    expect(html).toMatch(/class="[^"]*mx-auto[^"]*max-w-7xl[^"]*"/);
    expect(html).toMatch(/<a[^>]+href="\/"[^>]*class="[^"]*font-bold[^"]*"/);
    expect(html).toMatch(/<ul[^>]+class="[^"]*gap-8[^"]*"[^>]*>/);
  });

  // Reference layout: wordmark and links sit together on the left, with
  // empty space reserved on the right for cart/account icons (added once
  // checkout/auth exist) — not spread edge-to-edge via justify-between.
  it('groups the wordmark and links together on the left rather than spreading them apart', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav);

    expect(html).not.toMatch(/class="[^"]*justify-between[^"]*"/);
    expect(html).toMatch(/class="[^"]*flex[^"]*items-center[^"]*gap-10[^"]*"/);
  });
});

describe('Footer section styling', () => {
  it('is a grid of link columns with a top border and a copyright row', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer);

    expect(html).toMatch(/<footer[^>]+class="[^"]*border-t[^"]*"[^>]*>/);
    expect(html).toMatch(/class="[^"]*grid[^"]*"/);
    expect(html).toMatch(/©\s*\d{4}/);
  });

  // Design consistency: mirror Nav's container width and wordmark treatment
  // rather than a bespoke layout, per "design it based on nav".
  it("mirrors Nav's contained width and bold wordmark", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer);

    expect(html).toMatch(/class="[^"]*mx-auto[^"]*max-w-7xl[^"]*"/);
    expect(html).toMatch(/<a[^>]+href="\/"[^>]*class="[^"]*font-bold[^"]*"/);
  });
});

// Style guide only loads Kumbh Sans 400 and 700 — font-medium/font-semibold
// would fall back to a weight the font file doesn't actually have.
describe('Nav and Footer font weights', () => {
  it('never use font-medium or font-semibold', async () => {
    const container = await AstroContainer.create();
    const navHtml = await container.renderToString(Nav);
    const footerHtml = await container.renderToString(Footer);

    for (const html of [navHtml, footerHtml]) {
      expect(html).not.toMatch(/class="[^"]*font-medium[^"]*"/);
      expect(html).not.toMatch(/class="[^"]*font-semibold[^"]*"/);
    }
  });
});
