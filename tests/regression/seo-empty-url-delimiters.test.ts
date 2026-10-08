import { afterEach, describe, expect, it, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { renderEndpoint } from '../endpoint';
import Layout from '../../src/themes/dawn/layout.astro';
import * as robots from '../../src/pages/robots.txt';
import * as sitemap from '../../src/pages/sitemap.xml';

afterEach(() => vi.unstubAllEnvs());

describe('empty URL delimiters', () => {
  it('rejects empty query and fragment delimiters in configured SEO origins', async () => {
    vi.stubEnv('PROD', true);
    const container = await AstroContainer.create();
    const message =
      'SITE_URL must be an absolute HTTP(S) origin without credentials, path, query or fragment';
    for (const value of [
      'https://public.example?',
      'https://public.example#',
      'https://public.example/?#',
    ]) {
      vi.stubEnv('SITE_URL', value);
      const request = new Request('https://attacker.example/about');
      await expect(
        container.renderToString(Layout, {
          request,
          props: { title: 'About', description: 'Our story' },
        }),
      ).rejects.toThrow(message);
      for (const endpoint of [robots, sitemap]) {
        await expect(renderEndpoint(endpoint, request)).rejects.toThrow(
          message,
        );
      }
    }
  });
});
