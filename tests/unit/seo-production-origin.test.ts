import { afterEach, describe, expect, it, vi } from 'vitest';
import { seoUrl } from '../../src/lib/seo';

afterEach(() => vi.unstubAllEnvs());

describe('production SEO URL policy', () => {
  it('requires a configured origin only in production', () => {
    vi.stubEnv('SITE_URL', '');
    vi.stubEnv('PROD', true);
    const request = new URL('https://attacker.example/about');
    expect(() => seoUrl('/about', request)).toThrow(
      'SITE_URL is required in production',
    );
    vi.stubEnv('SITE_URL', 'https://public.example');
    expect(seoUrl('/about', request)).toBe('https://public.example/about');
    vi.stubEnv('SITE_URL', '');
    expect(seoUrl('/about', request, new URL('https://trusted.example'))).toBe(
      'https://trusted.example/about',
    );
    vi.stubEnv('PROD', false);
    expect(seoUrl('/about', request)).toBe('https://attacker.example/about');
  });
});
