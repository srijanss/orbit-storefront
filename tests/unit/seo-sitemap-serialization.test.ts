import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderEndpoint } from '../endpoint';
import * as sitemap from '../../src/pages/sitemap.xml';

afterEach(() => vi.unstubAllEnvs());

describe('sitemap URL serialization', () => {
  it('escapes raw and entity-looking ampersands exactly once for XML text', async () => {
    for (const [host, escapedHost] of [
      ['store&craft.example', 'store&amp;craft.example'],
      ['store&amp;craft.example', 'store&amp;amp;craft.example'],
    ]) {
      vi.stubEnv('SITE_URL', `https://${host}`);
      const response = await renderEndpoint(
        sitemap,
        new Request('https://internal.example/sitemap.xml'),
      );
      const xml = await response.text();
      expect(xml).toContain(`<loc>https://${escapedHost}/about</loc>`);
      expect(xml).not.toContain(`<loc>https://${host}/about</loc>`);
    }
  });
});
