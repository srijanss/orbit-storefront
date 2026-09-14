import { beforeEach, describe, expect, it, vi } from 'vitest';

const motion = vi.hoisted(() => {
  const revert = vi.fn();
  return {
    context: vi.fn((setup: () => void) => {
      setup();
      return { revert };
    }),
    from: vi.fn(),
    to: vi.fn(),
    create: vi.fn(),
    registerPlugin: vi.fn(),
    revert,
  };
});

vi.mock('gsap', () => ({
  gsap: {
    context: motion.context,
    from: motion.from,
    to: motion.to,
    registerPlugin: motion.registerPlugin,
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { name: 'ScrollTrigger', create: motion.create },
}));

import {
  initHeritageMotion,
  initScrollMotion,
} from '../../src/lib/landing-motion';

describe('landing motion', () => {
  beforeEach(() => vi.clearAllMocks());

  it('exposes a theme-neutral initializer with an options-based API', () => {
    const root = {
      querySelectorAll: vi.fn(() => []),
      querySelector: vi.fn(() => null),
    } as unknown as ParentNode;

    const cleanup = initScrollMotion(root, { reducedMotion: true });

    expect(cleanup).toBeTypeOf('function');
    expect(motion.context).not.toHaveBeenCalled();
  });

  it('creates scroll-triggered reveals and returns GSAP context cleanup', () => {
    const sections = [{ id: 'discover' }, { id: 'ritual' }];
    const progress = { id: 'progress' };
    const root = {
      querySelectorAll: vi.fn((selector: string) =>
        selector === '[data-scroll-reveal]' ? sections : [],
      ),
      querySelector: vi.fn((selector: string) =>
        selector === '[data-scroll-progress]' ? progress : null,
      ),
    } as unknown as ParentNode;

    const cleanup = initHeritageMotion(root, false);

    expect(motion.context).toHaveBeenCalledOnce();
    expect(motion.from).toHaveBeenCalledWith(
      sections[0],
      expect.objectContaining({
        opacity: 0,
        scrollTrigger: expect.objectContaining({ trigger: sections[0] }),
      }),
    );
    expect(motion.to).toHaveBeenCalledWith(
      progress,
      expect.objectContaining({
        scrollTrigger: expect.objectContaining({ scrub: true }),
      }),
    );

    cleanup();
    expect(motion.revert).toHaveBeenCalledOnce();
  });

  it('reveals each editorial section when that section reaches the viewport', () => {
    const sections = [{ id: 'discover' }, { id: 'ritual' }];
    const root = {
      querySelectorAll: vi.fn((selector: string) =>
        selector === '[data-scroll-reveal]' ? sections : [],
      ),
      querySelector: vi.fn(() => null),
    } as unknown as ParentNode;

    initHeritageMotion(root, false);

    expect(motion.from).toHaveBeenCalledTimes(2);
    expect(motion.from).toHaveBeenNthCalledWith(
      2,
      sections[1],
      expect.objectContaining({
        scrollTrigger: expect.objectContaining({ trigger: sections[1] }),
      }),
    );
  });

  it('activates the matching timeline step as each chapter enters the viewport', () => {
    const discover = { id: 'discover' };
    const ritual = { id: 'ritual' };
    const steps = [
      {
        dataset: { timelineTarget: 'discover' },
        classList: { toggle: vi.fn() },
      },
      {
        dataset: { timelineTarget: 'ritual' },
        classList: { toggle: vi.fn() },
      },
    ];
    const root = {
      querySelectorAll: vi.fn((selector: string) => {
        if (selector === '[data-timeline-step]') return steps;
        return [];
      }),
      querySelector: vi.fn((selector: string) => {
        if (selector === '#discover') return discover;
        if (selector === '#ritual') return ritual;
        return null;
      }),
    } as unknown as ParentNode;

    initHeritageMotion(root, false);

    expect(motion.create).toHaveBeenCalledTimes(2);
    const ritualTrigger = motion.create.mock.calls[1]?.[0] as {
      onEnter: () => void;
    };
    ritualTrigger.onEnter();

    expect(steps[0].classList.toggle).toHaveBeenLastCalledWith(
      'is-active',
      false,
    );
    expect(steps[1].classList.toggle).toHaveBeenLastCalledWith(
      'is-active',
      true,
    );
  });
});
