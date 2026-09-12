import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import HomePage from '../../src/pages/index.astro';
import AboutPage from '../../src/pages/about.astro';

// F1.7 — Nav + footer (SPEC.md MVP 1)
//
// User story: As a visitor on any page of the site, I want a consistent
// navigation bar and footer, so I can always get to Home, About, Contact,
// Privacy, and Terms without hunting for a route.
describe('F1.7 Nav and footer', () => {
  it('appears on the home page, linking to the main pages and legal pages', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HomePage);

    expect(html).toMatch(/<nav[\s>]/);
    expect(html).toMatch(/<a[^>]+href="\/"[^>]*>/);
    expect(html).toMatch(/<a[^>]+href="\/about"[^>]*>/);
    expect(html).toMatch(/<a[^>]+href="\/contact"[^>]*>/);

    expect(html).toMatch(/<footer[\s>]/);
    expect(html).toMatch(/<a[^>]+href="\/privacy"[^>]*>/);
    expect(html).toMatch(/<a[^>]+href="\/terms"[^>]*>/);
  });

  it('also appears on other pages, proving it is shared through the layout rather than per-page', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(AboutPage);

    expect(html).toMatch(/<nav[\s>]/);
    expect(html).toMatch(/<footer[\s>]/);
  });
});
