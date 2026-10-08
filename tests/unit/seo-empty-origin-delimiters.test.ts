import { afterEach, describe, expect, it, vi } from 'vitest';
import { seoUrl } from '../../src/lib/seo';

afterEach(() => vi.unstubAllEnvs());

describe('SEO origin delimiters', () => {
  it('rejects bare query and fragment markers from environment and Astro site configuration', () => {
    vi.stubEnv('PROD', true);
    const request = new URL('https://request.example/about');
    const message =
      'SITE_URL must be an absolute HTTP(S) origin without credentials, path, query or fragment';
    for (const value of [
      'https://public.example?',
      'https://public.example#',
      'https://public.example/?#',
    ]) {
      vi.stubEnv('SITE_URL', value);
      expect(() => seoUrl('/about', request)).toThrow(message);
      expect(() => seoUrl('/about', request, new URL(value))).toThrow(message);
    }
    vi.stubEnv('SITE_URL', 'https://public.example/');
    expect(seoUrl('/about', request)).toBe('https://public.example/about');
  });
});
