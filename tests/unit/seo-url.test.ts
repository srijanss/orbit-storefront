import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { seoUrl } from '../../src/lib/seo';

beforeEach(() => vi.stubEnv('SITE_URL', ''));
afterEach(() => vi.unstubAllEnvs());

describe('SEO URLs', () => {
  it('normalizes canonical paths without letting a path replace the public origin', () => {
    const request = new URL('https://store.example/about/?campaign=test');
    expect(seoUrl('/about/', request)).toBe('https://store.example/about');
    expect(seoUrl('/', request)).toBe('https://store.example/');
    expect(seoUrl('//other.example/about/', request)).toBe(
      'https://store.example/other.example/about',
    );
    expect(seoUrl('/og-image.png', request)).toBe(
      'https://store.example/og-image.png',
    );
  });
});
