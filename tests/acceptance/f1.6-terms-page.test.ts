import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Page from '../../src/pages/terms.astro';

// F1.6 — Terms & Conditions page (SPEC.md MVP 1)
//
// User story: As a visitor about to use the site, I want a Terms &
// Conditions page reachable from the site, so a terms route exists before
// real legal copy is written.
describe('F1.6 Terms and Conditions page', () => {
  it('renders the dawn theme layout with placeholder content and metadata', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Page);

    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/);
    expect(html).toContain('Lorem ipsum');
  });
});
