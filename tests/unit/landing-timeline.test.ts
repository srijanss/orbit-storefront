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

import { initHeritageMotion } from '../../src/lib/landing-motion';

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
});
