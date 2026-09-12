import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Terms from '../../src/themes/dawn/pages/terms.astro';
import TermsRoute from '../../src/pages/terms.astro';

describe('dawn theme Terms and Conditions page', () => {
  it('renders its own title, description, and lorem ipsum placeholder copy through the dawn layout', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Terms);

    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/);
    expect(html).toContain('Lorem ipsum');
  });

  it('is what the /terms route renders', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TermsRoute);

    expect(html).toContain('Lorem ipsum');
  });
});
