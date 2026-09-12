import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Page from '../../src/pages/contact.astro';

// F1.4 — Contact Us page (SPEC.md MVP 1)
//
// User story: As a visitor wanting to get in touch, I want a Contact page
// with a mailto link, so I can reach out by email with no backend/API
// dependency yet (migrated to a real form in F2.12).
describe('F1.4 Contact page', () => {
  it('renders the dawn theme layout with a mailto link and page metadata', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Page);

    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/);
    expect(html).toMatch(/<a[^>]+href="mailto:[^"]+"/);
  });
});
