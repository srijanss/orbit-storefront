import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Layout from '../../src/themes/dawn/layout.astro';

const root = resolve(__dirname, '../..');
const path = (...segments: string[]) => resolve(root, ...segments);

describe('dawn theme layout', () => {
  it('wraps page content in a full HTML document that links the dawn design tokens', () => {
    const layout = readFileSync(path('src/themes/dawn/layout.astro'), 'utf-8');

    expect(layout).toContain('<!doctype html>');
    expect(layout).toContain('<html');
    expect(layout).toContain('<slot');
    expect(layout).toContain('global.css');

    const globalCss = readFileSync(path('src/styles/global.css'), 'utf-8');
    expect(globalCss).toContain('tokens.css');
  });

  it('reserves a pages directory for the theme default pages (F1.2-F1.6)', () => {
    expect(existsSync(path('src/themes/dawn/pages'))).toBe(true);
  });

  // Sticky footer: on short pages the footer should sit at the bottom of
  // the viewport rather than right under the content; on tall pages it
  // should flow naturally below the content instead of overlapping it.
  it('keeps the footer at the bottom of short pages and flows it below tall content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      slots: { default: '<p>page content</p>' },
    });

    expect(html).toMatch(/<body[^>]+class="[^"]*flex[^"]*min-h-screen[^"]*flex-col[^"]*"/);
    expect(html).toMatch(/<div[^>]+class="[^"]*flex-1[^"]*"[^>]*>\s*<p>page content<\/p>/);
  });
});
