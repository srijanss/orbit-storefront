import { afterEach, describe, expect, it, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { renderEndpoint } from '../endpoint';
import Layout from '../../src/themes/dawn/layout.astro';
import * as robots from '../../src/pages/robots.txt';
import * as sitemap from '../../src/pages/sitemap.xml';

afterEach(() => vi.unstubAllEnvs());

describe('SEO configuration validation', () => {
  it('rejects invalid origins consistently without exposing credentials in errors', async () => {
    vi.stubEnv('PROD', true);
    const container = await AstroContainer.create();
    const error =
      'SITE_URL must be an absolute HTTP(S) origin without credentials, path, query or fragment';
    for (const value of [
      'not-a-url',
      'ftp://public.example',
      'file:///tmp/secret',
      'https://user:secret@public.example',
      'https://public.example/subpath',
      'https://public.example?token=secret',
      'https://public.example#fragment',
      'https:public.example',
      '   ',
    ]) {
      vi.stubEnv('SITE_URL', value);
      await expect(
        container.renderToString(Layout, {
          request: new Request('https://public.example/about'),
          props: { title: 'About', description: 'Our story' },
        }),
      ).rejects.toThrow(error);
      for (const endpoint of [robots, sitemap]) {
        await expect(
          renderEndpoint(endpoint, new Request('https://public.example/')),
        ).rejects.toThrow(error);
      }
    }
  });
});
