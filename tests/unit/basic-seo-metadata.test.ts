import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Layout from '../../src/themes/dawn/layout.astro';

beforeEach(() => vi.stubEnv('SITE_URL', ''));
afterEach(() => vi.unstubAllEnvs());

describe('static page SEO metadata', () => {
  it('shares escaped page metadata with a canonical URL, real image and favicon', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      props: {
        title: 'Heritage & Craft',
        description: 'Handmade "treasures" & traditions',
      },
      request: new Request('https://store.example/about?campaign=test'),
    });
    expect(html).toContain(
      'rel="canonical" href="https://store.example/about"',
    );
    expect(html).toContain(
      'property="og:url" content="https://store.example/about"',
    );
    expect(html).toContain('property="og:type" content="website"');
    expect(html).toContain(
      'property="og:title" content="Heritage &amp; Craft"',
    );
    expect(html).toContain(
      'property="og:description" content="Handmade &quot;treasures&quot; &amp; traditions"',
    );
    expect(html).toContain(
      'property="og:image" content="https://store.example/og-image.png"',
    );
    expect(html).toContain(
      'property="og:image:alt" content="Sukunda, a traditional Nepalese oil lamp"',
    );
    expect(html).toContain(
      'rel="icon" type="image/svg+xml" href="/favicon.svg"',
    );
    expect(html).toContain('rel="icon" href="/favicon.ico"');
    const image = readFileSync(
      new URL('../../public/og-image.png', import.meta.url),
    );
    expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(image.readUInt32BE(16)).toBeGreaterThanOrEqual(1200);
    expect(image.readUInt32BE(20)).toBeGreaterThanOrEqual(630);
    const { seoUrl } = await import('../../src/lib/seo');
    expect(
      seoUrl(
        '/about',
        new URL('https://internal.example/about'),
        new URL('https://public.example'),
      ),
    ).toBe('https://public.example/about');
    vi.stubEnv('SITE_URL', 'https://configured.example/');
    try {
      expect(seoUrl('/about', new URL('http://localhost:4321/about'))).toBe(
        'https://configured.example/about',
      );
    } finally {
      vi.unstubAllEnvs();
    }
    expect(
      readFileSync(new URL('../../.env.example', import.meta.url), 'utf8'),
    ).toContain('SITE_URL=');
    expect(
      readFileSync(
        new URL('../../public/favicon.svg', import.meta.url),
        'utf8',
      ),
    ).toContain('<svg');
  });
});
