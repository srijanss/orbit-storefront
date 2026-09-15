import { beforeEach, describe, expect, it, vi } from 'vitest';

const motion = vi.hoisted(() => ({
  context: vi.fn((setup: () => void) => {
    setup();
    return { revert: vi.fn() };
  }),
  create: vi.fn(),
  from: vi.fn(),
  to: vi.fn(),
  registerPlugin: vi.fn(),
}));

vi.mock('gsap', () => ({
  gsap: {
    context: motion.context,
    from: motion.from,
    to: motion.to,
    registerPlugin: motion.registerPlugin,
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: motion.create },
}));

import {
  initHeritageMotion,
  initScrollMotion,
} from '../../src/lib/landing-motion';

describe('landing timeline motion', () => {
  beforeEach(() => vi.clearAllMocks());

  it('tracks each configured chapter and activates its matching step in both scroll directions', () => {
    const chapters = [{ id: 'discover' }, { id: 'ritual' }];
    const steps = chapters.map((chapter) => ({
      dataset: { timelineTarget: chapter.id },
      classList: { toggle: vi.fn() },
    }));
    const root = {
      querySelectorAll: vi.fn((selector: string) =>
        selector === '[data-timeline-step]' ? steps : [],
      ),
      querySelector: vi.fn(
        (selector: string) =>
          chapters.find((chapter) => `#${chapter.id}` === selector) ?? null,
      ),
    } as unknown as ParentNode;

    initHeritageMotion(root, false);

    expect(motion.create).toHaveBeenCalledTimes(2);
    const ritualTrigger = motion.create.mock.calls[1]?.[0] as {
      trigger: unknown;
      onEnter: () => void;
      onEnterBack: () => void;
    };
    expect(ritualTrigger.trigger).toBe(chapters[1]);

    ritualTrigger.onEnter();
    ritualTrigger.onEnterBack();

    expect(steps[0].classList.toggle).toHaveBeenLastCalledWith(
      'is-active',
      false,
    );
    expect(steps[1].classList.toggle).toHaveBeenLastCalledWith(
      'is-active',
      true,
    );
    expect(steps[1].classList.toggle).toHaveBeenCalledTimes(2);
  });

  it('scrubs the timeline fill from empty to full across the configured chapters', () => {
    const fill = { id: 'timeline-fill' };
    const firstChapter = { id: 'discover' };
    const lastChapter = { id: 'collection' };
    const steps = [
      {
        dataset: { timelineTarget: 'discover' },
        classList: { toggle: vi.fn() },
      },
      {
        dataset: { timelineTarget: 'collection' },
        classList: { toggle: vi.fn() },
      },
    ];
    const root = {
      querySelectorAll: vi.fn((selector: string) =>
        selector === '[data-timeline-step]' ? steps : [],
      ),
      querySelector: vi.fn((selector: string) => {
        if (selector === '[data-timeline-progress]') return fill;
        if (selector === '#discover') return firstChapter;
        if (selector === '#collection') return lastChapter;
        return null;
      }),
    } as unknown as ParentNode;

    initHeritageMotion(root, false);

    expect(motion.to).toHaveBeenCalledWith(
      fill,
      expect.objectContaining({
        scaleY: 1,
        scrollTrigger: expect.objectContaining({
          trigger: firstChapter,
          endTrigger: lastChapter,
          scrub: true,
        }),
      }),
    );
  });

  it('uses one scroll snap controller to move content between real chapter positions', () => {
    const chapters = [
      { id: 'discover', getBoundingClientRect: () => ({ top: 0 }) },
      { id: 'ritual', getBoundingClientRect: () => ({ top: 400 }) },
      { id: 'craftsmanship', getBoundingClientRect: () => ({ top: 1000 }) },
    ];
    const fill = { id: 'timeline-fill' };
    const steps = chapters.map((chapter) => ({
      dataset: { timelineTarget: chapter.id },
      classList: { toggle: vi.fn() },
    }));
    const root = {
      querySelectorAll: vi.fn((selector: string) =>
        selector === '[data-timeline-step]' ? steps : [],
      ),
      querySelector: vi.fn((selector: string) => {
        if (selector === '[data-timeline-progress]') return fill;
        return (
          chapters.find((chapter) => `#${chapter.id}` === selector) ?? null
        );
      }),
    } as unknown as ParentNode;

    initScrollMotion(root, { reducedMotion: false, timelineSnap: true });

    const progressTween = motion.to.mock.calls.find(
      ([target]) => target === fill,
    )?.[1] as {
      scrollTrigger: {
        trigger: unknown;
        endTrigger: unknown;
        start: string;
        end: string;
        scrub: boolean;
        snap: {
          snapTo: (progress: number, trigger: { direction: number }) => number;
          delay: number;
          duration: { min: number; max: number };
          inertia: boolean;
        };
      };
    };
    const snap = progressTween.scrollTrigger.snap;

    expect(progressTween.scrollTrigger).toMatchObject({
      trigger: chapters[0],
      endTrigger: chapters[2],
      start: 'top top',
      end: 'top top',
      scrub: true,
      snap: {
        delay: 0.24,
        duration: { min: 0.45, max: 0.8 },
        ease: 'power3.out',
        inertia: false,
      },
    });
    expect(snap.snapTo(0.29, { direction: 1 })).toBe(0.29);
    expect(snap.snapTo(0.3, { direction: 1 })).toBe(0.4);
    expect(snap.snapTo(0.85, { direction: 1 })).toBe(1);
    expect(snap.snapTo(0.95, { direction: -1 })).toBe(0.95);
    for (const [trigger] of motion.create.mock.calls) {
      expect(trigger).not.toHaveProperty('snap');
    }
  });
});
