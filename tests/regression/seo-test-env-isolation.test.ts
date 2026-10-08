import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const runner = resolve(
  dirname(require.resolve('vitest/package.json')),
  'vitest.mjs',
);

describe('SEO test environment isolation', () => {
  it('passes the SEO suites regardless of inherited SITE_URL', () => {
    for (const SITE_URL of ['https://public.example', 'not-a-url']) {
      const result = spawnSync(
        process.execPath,
        [
          runner,
          'run',
          'tests/acceptance/f1.10-basic-seo.test.ts',
          'tests/unit/basic-seo-metadata.test.ts',
          'tests/unit/seo-url.test.ts',
        ],
        {
          cwd: resolve(import.meta.dirname, '../..'),
          env: { ...process.env, SITE_URL },
          encoding: 'utf8',
          timeout: 60000,
        },
      );
      expect(result.error).toBeUndefined();
      expect(result.status, result.stdout + result.stderr).toBe(0);
    }
  }, 120000);
});
