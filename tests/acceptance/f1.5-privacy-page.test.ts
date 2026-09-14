import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Page from '../../src/pages/privacy.astro';

// F1.5 — Privacy Policy page (SPEC.md MVP 1)
//
// User story: As a visitor concerned about how their data is handled, I
// want a Privacy Policy page reachable from the site, so I can understand
// how my information is handled.
describe('F1.5 Privacy Policy page', () => {
  it('renders the dawn theme layout with policy content and metadata', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Page);

    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/);
    expect(html).toContain('Your Privacy Rights');
    expect(html).not.toContain('Lorem ipsum');
  });
});
