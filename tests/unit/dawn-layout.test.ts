import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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
});
