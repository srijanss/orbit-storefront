import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import About from '../../src/themes/dawn/pages/about.astro';
import AboutRoute from '../../src/pages/about.astro';

describe('dawn theme About page', () => {
  it('renders its own title, description, and lorem ipsum placeholder copy through the dawn layout', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);

    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/);
    expect(html).toContain('Lorem ipsum');
  });

  it('is what the /about route renders', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(AboutRoute);

    expect(html).toContain('Lorem ipsum');
  });
});
