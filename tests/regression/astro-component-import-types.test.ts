import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import type Layout from '../../src/themes/dawn/layout.astro';

// Keep the declaration tied to the actual renderer type, not an untyped shim.
// @ts-expect-error A string is not a compiled Astro component factory.
const invalidComponent: typeof Layout = 'not a component';
void invalidComponent;

describe('Astro component import types', () => {
  it('resolves compiled test components without weakening their factory type', () => {
    const result = spawnSync(
      'pnpm',
      ['exec', 'tsc', '--noEmit', '--pretty', 'false'],
      {
        cwd: resolve(import.meta.dirname, '../..'),
        encoding: 'utf8',
        timeout: 60000,
      },
    );
    expect(result.error).toBeUndefined();
    expect([0, 2]).toContain(result.status);
    const diagnostics = result.stdout + result.stderr;
    expect(diagnostics).not.toMatch(
      /error TS2307: Cannot find module '.*\.astro'/,
    );
    expect(diagnostics).not.toMatch(
      /^tests\/regression\/astro-component-import-types\.test\.ts.*error TS\d+:/m,
    );
  }, 90000);
});
