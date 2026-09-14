import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Contact from '../../src/themes/dawn/pages/contact.astro';
import ContactRoute from '../../src/pages/contact.astro';

describe('dawn theme Contact page', () => {
  it('renders its own title, description, and a mailto link through the dawn layout', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Contact);

    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/);
    expect(html).toMatch(/<a[^>]+href="mailto:[^"]+"/);
  });

  it('is what the /contact route renders', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ContactRoute);

    expect(html).toMatch(/<a[^>]+href="mailto:[^"]+"/);
  });

  it('renders landing-page-aligned centered contact content and styled email link', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Contact);

    expect(html).toContain('max-w-5xl');
    expect(html).toContain('text-center');
    expect(html).toContain('text-5xl');
    expect(html).toContain('text-text-secondary');
    expect(html).toContain('text-action');
  });
});
