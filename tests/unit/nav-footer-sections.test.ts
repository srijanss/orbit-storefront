import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Nav from '../../src/components/sections/Nav.astro';
import Footer from '../../src/components/sections/Footer.astro';
import Layout from '../../src/themes/dawn/layout.astro';

describe('Nav section', () => {
  it('links to Home, About, and Contact', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav);

    expect(html).toMatch(/<nav[\s>]/);
    expect(html).toMatch(/<a[^>]+href="\/"[^>]*>/);
    expect(html).toMatch(/<a[^>]+href="\/about"[^>]*>/);
    expect(html).toMatch(/<a[^>]+href="\/contact"[^>]*>/);
  });
});

describe('Footer section', () => {
  it('links to Privacy and Terms', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer);

    expect(html).toMatch(/<footer[\s>]/);
    expect(html).toMatch(/<a[^>]+href="\/privacy"[^>]*>/);
    expect(html).toMatch(/<a[^>]+href="\/terms"[^>]*>/);
  });
});

describe('dawn theme layout', () => {
  it('wraps slotted content with the shared Nav and Footer sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      slots: { default: '<p>page content</p>' },
    });

    expect(html).toMatch(/<nav[\s>]/);
    expect(html).toMatch(/<footer[\s>]/);
    expect(html).toContain('page content');
  });
});
