import { describe, expect, it, vi } from 'vitest';
import { existsSync } from 'node:fs';
import { renderEndpoint } from '../endpoint';

describe('crawl discovery endpoints', () => {
  it('serves robots and an XML sitemap containing only the five public pages', async () => {
    expect(
      existsSync(new URL('../../src/pages/robots.txt.ts', import.meta.url)),
    ).toBe(true);
    expect(
      existsSync(new URL('../../src/pages/sitemap.xml.ts', import.meta.url)),
    ).toBe(true);
    const robots = await import('../../src/pages/robots.txt');
    const sitemap = await import('../../src/pages/sitemap.xml');
    expect(robots.prerender).toBe(false);
    expect(sitemap.prerender).toBe(false);
    vi.stubEnv('SITE_URL', 'https://public.example');
    try {
      const response = await renderEndpoint(
        robots,
        new Request('http://internal.example/robots.txt'),
      );
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/plain');
      expect(await response.text()).toBe(
        'User-agent: *\nAllow: /\nSitemap: https://public.example/sitemap.xml\n',
      );
      const xmlResponse = await renderEndpoint(
        sitemap,
        new Request('http://internal.example/sitemap.xml'),
      );
      expect(xmlResponse.status).toBe(200);
      expect(xmlResponse.headers.get('content-type')).toContain(
        'application/xml',
      );
      const xml = await xmlResponse.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain(
        'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      );
      for (const path of ['/', '/about', '/contact', '/privacy', '/terms']) {
        expect(xml).toContain(`<loc>https://public.example${path}</loc>`);
      }
      expect(xml.match(/<loc>/g)).toHaveLength(5);
      expect(xml).not.toContain('internal.example');
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
