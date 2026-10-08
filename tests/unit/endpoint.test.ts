import { describe, expect, it } from 'vitest';
import type { APIRoute } from 'astro';
import { existsSync } from 'node:fs';

describe('typed endpoint harness', () => {
  it('uses a real Astro context and supports sync, async and failing handlers', async () => {
    expect(existsSync(new URL('../endpoint.ts', import.meta.url))).toBe(true);
    const { renderEndpoint } = await import('../endpoint');
    const request = new Request('https://store.example/sitemap.xml');
    const GET: APIRoute = (context) => {
      expect(context.request).toBe(request);
      expect(context.url.href).toBe(request.url);
      expect(context.site).toBeUndefined();
      expect(context.params).toEqual({});
      return new Response('sync', {
        headers: { 'Content-Type': 'text/plain' },
      });
    };
    const response = await renderEndpoint({ GET }, request);
    expect(await response.text()).toBe('sync');
    expect(response.headers.get('content-type')).toBe('text/plain');
    expect(
      await (
        await renderEndpoint(
          { GET: async () => new Response('async') },
          request,
        )
      ).text(),
    ).toBe('async');
    await expect(
      renderEndpoint(
        {
          GET: () => {
            throw new Error('endpoint error');
          },
        },
        request,
      ),
    ).rejects.toThrow('endpoint error');
  });
});
