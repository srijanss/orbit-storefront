import { afterEach, describe, expect, it, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { renderEndpoint } from '../endpoint';
import Layout from '../../src/themes/dawn/layout.astro';
import * as robots from '../../src/pages/robots.txt';
import * as sitemap from '../../src/pages/sitemap.xml';
import { seoUrl } from '../../src/lib/seo';

afterEach(() => vi.unstubAllEnvs());

describe('trusted production SEO origin', () => {
  it('rejects missing production configuration instead of trusting request hosts', async () => {
    vi.stubEnv('PROD', true);
    vi.stubEnv('SITE_URL', '');
    const request = new Request('https://attacker.example/about');
    expect(() => seoUrl('/about', new URL(request.url))).toThrow(
      'SITE_URL is required in production',
    );
    const container = await AstroContainer.create();
    await expect(
      container.renderToString(Layout, {
        request,
        props: { title: 'About', description: 'Our story' },
      }),
    ).rejects.toThrow('SITE_URL is required in production');
    for (const endpoint of [robots, sitemap]) {
      await expect(renderEndpoint(endpoint, request)).rejects.toThrow(
        'SITE_URL is required in production',
      );
    }
    vi.stubEnv('SITE_URL', 'https://public.example');
    expect(seoUrl('/about', new URL(request.url))).toBe(
      'https://public.example/about',
    );
    vi.stubEnv('SITE_URL', '');
    expect(
      seoUrl(
        '/about',
        new URL(request.url),
        new URL('https://trusted.example'),
      ),
    ).toBe('https://trusted.example/about');
    vi.stubEnv('PROD', false);
    expect(seoUrl('/about', new URL('http://localhost:4321/about'))).toBe(
      'http://localhost:4321/about',
    );
  });
});
