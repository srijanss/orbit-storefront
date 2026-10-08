import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

describe('repository type-check', () => {
  it('checks all source, tests and configuration without diagnostics', () => {
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
    expect(result.status, result.stdout + result.stderr).toBe(0);
  }, 90000);
});
