import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import HomePage from '../../src/pages/index.astro';

// Styling pass — design-system handoff (ecommerce-design-system-handoff)
//
// User story: As a visitor, I want the home page's header, hero, and footer
// to reflect the brand's design system (warm orange accent used sparingly,
// neutral surfaces, compact radii, editorial typography scale), so the site
// looks intentional rather than unstyled, using the same tokens every page
// and theme will share.
describe('Styled home page (header, hero, footer)', () => {
  it('renders a low-profile header with a brand wordmark and nav links', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HomePage);

    // Header/Nav: flex row, bottom border, sits above content — per
    // components/core-components.md "Header" contract.
    expect(html).toMatch(/<nav[^>]+class="[^"]*flex[^"]*"[^>]*>/);
    expect(html).toMatch(/<nav[^>]+class="[^"]*border-b[^"]*"[^>]*>/);
  });

  it("renders a hero with the display type scale and a primary CTA using the brand's action color", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HomePage);

    // Hero heading: display/H1 scale (text-5xl per foundations.md), semibold.
    expect(html).toMatch(/<h1[^>]+class="[^"]*text-5xl[^"]*"[^>]*>/);

    // Primary CTA uses the accent color as a background, not the whole page —
    // foundations.md: "Warm orange is the primary action/accent color".
    const contactLinks = [...html.matchAll(/<a\s([^>]*href="\/contact"[^>]*)>/g)];
    expect(contactLinks.some((match) => /class="[^"]*bg-action[^"]*"/.test(match[1]))).toBe(true);
  });

  it('renders a footer with grouped link columns and a copyright row', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HomePage);

    expect(html).toMatch(/<footer[^>]+class="[^"]*border-t[^"]*"[^>]*>/);
    expect(html).toMatch(/class="[^"]*grid[^"]*"/);
    expect(html).toMatch(/©/);
  });
});
