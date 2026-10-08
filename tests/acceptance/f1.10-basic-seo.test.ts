import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { renderEndpoint } from '../endpoint';
import Home from '../../src/pages/index.astro';
import About from '../../src/pages/about.astro';
import Contact from '../../src/pages/contact.astro';
import Privacy from '../../src/pages/privacy.astro';
import Terms from '../../src/pages/terms.astro';

// F1.10 — Visitors and crawlers can discover and share every static page.
beforeEach(() => vi.stubEnv('SITE_URL', ''));
afterEach(() => vi.unstubAllEnvs());

describe('F1.10 Basic SEO', () => {
  it('uses the same canonical path for trailing-slash page requests and sitemap entries', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About, {
      request: new Request('https://store.example/about/?campaign=test'),
    });
    expect(html).toContain(
      'rel="canonical" href="https://store.example/about"',
    );
  });

  it('publishes metadata and crawl discovery for all static storefront pages', async () => {
    const container = await AstroContainer.create();
    const pages = [
      ['/', Home],
      ['/about', About],
      ['/contact', Contact],
      ['/privacy', Privacy],
      ['/terms', Terms],
    ] as const;
    for (const [path, page] of pages) {
      const html = await container.renderToString(page, {
        request: new Request(`https://store.example${path}?campaign=test`),
      });
      expect(html).toContain('rel="canonical"');
      expect(html).toContain(`href="https://store.example${path}"`);
      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:description"');
      expect(html).toContain('content="https://store.example/og-image.png"');
      expect(html).toContain('href="/favicon.svg"');
    }
    const robots = await import('../../src/pages/robots.txt');
    const sitemap = await import('../../src/pages/sitemap.xml');
    const robotsResponse = await renderEndpoint(
      robots,
      new Request('https://store.example/robots.txt'),
    );
    expect(robotsResponse.status).toBe(200);
    expect(await robotsResponse.text()).toContain(
      'Sitemap: https://store.example/sitemap.xml',
    );
    const sitemapResponse = await renderEndpoint(
      sitemap,
      new Request('https://store.example/sitemap.xml'),
    );
    expect(sitemapResponse.status).toBe(200);
    const xml = await sitemapResponse.text();
    for (const [path] of pages)
      expect(xml).toContain(`<loc>https://store.example${path}</loc>`);
    expect(xml.match(/<loc>/g)).toHaveLength(pages.length);
  });
});
