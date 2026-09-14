import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Privacy from '../../src/themes/dawn/pages/privacy.astro';
import PrivacyRoute from '../../src/pages/privacy.astro';

describe('dawn theme Privacy Policy page', () => {
  it('renders its own title, description, and lorem ipsum placeholder copy through the dawn layout', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Privacy);

    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/);
    expect(html).toContain('Lorem ipsum');
  });

  it('is what the /privacy route renders', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PrivacyRoute);

    expect(html).toContain('Lorem ipsum');
  });

  it('renders landing-page-aligned centered privacy content and contact CTA', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Privacy);

    expect(html).toContain('max-w-5xl');
    expect(html).toContain('text-center');
    expect(html).toContain('text-5xl');
    expect(html).toContain('text-text-secondary');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('bg-action');
  });
});
