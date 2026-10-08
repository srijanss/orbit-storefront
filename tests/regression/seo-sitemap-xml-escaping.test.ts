import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderEndpoint } from '../endpoint';
import * as sitemap from '../../src/pages/sitemap.xml';

afterEach(() => vi.unstubAllEnvs());

describe('sitemap XML escaping', () => {
  it('escapes ampersands in every sitemap URL without changing the URL value', async () => {
    vi.stubEnv('SITE_URL', 'https://store&craft.example');
    const response = await renderEndpoint(
      sitemap,
      new Request('https://internal.example/sitemap.xml'),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/xml');
    const xml = await response.text();
    expect(xml).not.toContain('store&craft.example');
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1],
    );
    expect(locations).toEqual(
      ['/', '/about', '/contact', '/privacy', '/terms'].map(
        (path) => `https://store&amp;craft.example${path}`,
      ),
    );
    expect(locations.map((value) => value.replaceAll('&amp;', '&'))).toEqual(
      ['/', '/about', '/contact', '/privacy', '/terms'].map(
        (path) => `https://store&craft.example${path}`,
      ),
    );
    vi.stubEnv('SITE_URL', '');
    vi.stubEnv('PROD', false);
    const fallback = await renderEndpoint(
      sitemap,
      new Request('https://store&craft.example/sitemap.xml'),
    );
    expect(await fallback.text()).toBe(xml);
  });
});
