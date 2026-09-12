import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Page from '../../src/pages/about.astro';

// F1.3 — About page (SPEC.md MVP 1)
//
// User story: As a visitor curious about the business, I want an About page
// with placeholder content and a clear title/description, so the site has
// a working About route before real copy is written.
describe('F1.3 About page', () => {
  it('renders the dawn theme layout with placeholder content and metadata', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Page);

    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/);
    expect(html).toContain('Lorem ipsum');
  });
});
