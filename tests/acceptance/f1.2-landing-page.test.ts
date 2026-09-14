import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Page from '../../src/pages/index.astro';

// F1.2 — Landing page (SPEC.md MVP 1)
//
// User story: As a first-time visitor, I want the home page to load with
// placeholder branded content and a clear title/description, so I know the
// site is live even before real copy and products exist.
describe('F1.2 Landing page', () => {
  it('renders the dawn theme layout with placeholder content and metadata', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Page);

    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/);
    expect(html).toContain('Lorem ipsum');
  });

  it('renders the heritage storefront story with scroll-animated editorial sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Page);

    expect(html).toContain('Sukunda');
    expect(html).toContain('More Than an Object');
    expect(html).toContain('Light That Connects Us');
    expect(html).toContain('A Flame of Blessings');
    expect(html).toContain('Details That Endure');
    expect(html).toContain('Treasures from Nepal');
    expect(html).toContain('Preserve Our Heritage');
    expect(html).toContain('Stories, New Arrivals &amp; More');
    expect(html).toMatch(/data-scroll-reveal/);
    expect(html).toMatch(/data-scroll-progress/);
  });
});
