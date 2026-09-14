import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Nav from '../../src/components/sections/Nav.astro';
import Footer from '../../src/components/sections/Footer.astro';

describe('Nav section styling', () => {
  it('is a low-profile flex row with a bottom border and a brand wordmark', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav);

    expect(html).toMatch(/<nav[^>]+class="[^"]*flex[^"]*"[^>]*>/);
    expect(html).toMatch(/<nav[^>]+class="[^"]*border-b[^"]*"[^>]*>/);
    expect(html).toMatch(/<a[^>]+href="\/"[^>]*class="[^"]*font-semibold[^"]*"/);
  });
});

describe('Footer section styling', () => {
  it('is a grid of link columns with a top border and a copyright row', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer);

    expect(html).toMatch(/<footer[^>]+class="[^"]*grid[^"]*"[^>]*>/);
    expect(html).toMatch(/<footer[^>]+class="[^"]*border-t[^"]*"[^>]*>/);
    expect(html).toMatch(/©\s*\d{4}/);
  });
});
