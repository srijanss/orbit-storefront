import { afterAll, expect, it, vi } from 'vitest';

const loader = vi.hoisted(() => ({ loaded: false }));

// Emulate cold module loading under contention, without running a heavy build.
vi.mock('../endpoint', async (importOriginal) => {
  loader.loaded = true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return importOriginal<typeof import('../endpoint')>();
});

// The simulated import is deliberately slower than the assertion time budget.
vi.setConfig({ testTimeout: 1000 });
afterAll(() => vi.resetConfig());
await import('../unit/endpoint.test');

it('exercises the endpoint harness with a genuinely slow module loader', async () => {
  // Await the fixture even if the harness timed out before loading reached it.
  await import('../endpoint');
  expect(loader.loaded).toBe(true);
}, 15000);
