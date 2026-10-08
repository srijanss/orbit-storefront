import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('type-check configuration', () => {
  it('provides a reproducible typecheck command with Node, Astro and Vitest declarations', () => {
    const root = resolve(import.meta.dirname, '../..');
    const manifest: { scripts: Record<string, string> } = JSON.parse(
      readFileSync(resolve(root, 'package.json'), 'utf8'),
    );
    const result = spawnSync(
      'pnpm',
      ['exec', 'tsc', '--noEmit', '--pretty', 'false'],
      {
        cwd: root,
        encoding: 'utf8',
        timeout: 60000,
      },
    );
    expect(result.error).toBeUndefined();
    expect([0, 2]).toContain(result.status);
    expect(result.stdout + result.stderr).not.toMatch(
      /^(?:tests\/|vitest\.config\.ts).*error TS\d+:/m,
    );
    expect(manifest.scripts.typecheck).toBe('tsc --noEmit');
  }, 90000);
});
