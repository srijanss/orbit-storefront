import { afterEach, describe, expect, it, vi } from 'vitest';
import { seoUrl } from '../../src/lib/seo';

afterEach(() => vi.unstubAllEnvs());

describe('SEO origin validation', () => {
  it('accepts only HTTP(S) origins and reports sanitized configuration errors', () => {
    vi.stubEnv('PROD', true);
    const request = new URL('https://attacker.example/about');
    const message =
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
      expect(() => seoUrl('/about', request)).toThrow(new Error(message));
    }
    for (const value of [
      'https://public.example',
      'https://public.example/',
      'http://localhost:4321/',
    ]) {
      vi.stubEnv('SITE_URL', value);
      expect(seoUrl('/about', request)).toBe(new URL('/about', value).href);
    }
    vi.stubEnv('SITE_URL', 'not-a-url');
    expect(seoUrl('/about', request, new URL('https://trusted.example'))).toBe(
      'https://trusted.example/about',
    );
    expect(() =>
      seoUrl('/about', request, new URL('ftp://public.example')),
    ).toThrow(new Error(message));
  });
});
