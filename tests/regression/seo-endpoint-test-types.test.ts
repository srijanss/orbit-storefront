import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

describe('SEO endpoint test types', () => {
  it('does not pass endpoint modules to an Astro component-only API', () => {
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
    // The repo has unrelated existing type errors; this guards the endpoint
    // argument errors without making their presence a requirement.
    expect([0, 2]).toContain(result.status);
    const diagnostics = result.stdout + result.stderr;
    expect(diagnostics).not.toMatch(
      /^tests\/.*(?:f1\.10-basic-seo|seo-|basic-seo-discovery).*error TS2345:/m,
    );
    expect(diagnostics).not.toMatch(/^tests\/endpoint\.ts.*error TS\d+:/m);
  }, 90000);
});
