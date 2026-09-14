import { describe, expect, it, vi } from 'vitest';

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

import { initScrollMotion } from '../../src/lib/landing-motion';

describe('scroll motion API', () => {
  it('exports a neutral options-based initializer', () => {
    const root = {
      querySelectorAll: vi.fn(() => []),
      querySelector: vi.fn(() => null),
    } as unknown as ParentNode;

    expect(initScrollMotion(root, { reducedMotion: true })).toBeTypeOf(
      'function',
    );
  });

  it('uses a theme-provided selector and timeline-state contract', () => {
    const reveal = { id: 'custom-reveal' };
    const chapter = { id: 'custom-chapter' };
    const step = {
      getAttribute: vi.fn((name: string) =>
        name === 'data-section' ? 'custom-chapter' : null,
      ),
      classList: { toggle: vi.fn() },
    };
    const root = {
      querySelectorAll: vi.fn((selector: string) => {
        if (selector === '.theme-reveal') return [reveal];
        if (selector === '.theme-step') return [step];
        return [];
      }),
      querySelector: vi.fn((selector: string) =>
        selector === '#custom-chapter' ? chapter : null,
      ),
    } as unknown as ParentNode;

    initScrollMotion(root, {
      reducedMotion: false,
      selectors: {
        reveal: '.theme-reveal',
        pageProgress: '.theme-page-progress',
        parallaxMedia: '.theme-parallax',
        leadMedia: '.theme-lead-media',
        timelineStep: '.theme-step',
        timelineProgress: '.theme-timeline-progress',
      },
      timelineTargetAttribute: 'data-section',
      activeClass: 'current',
    });

    expect(motion.from).toHaveBeenCalledWith(
      reveal,
      expect.objectContaining({
        scrollTrigger: expect.objectContaining({ trigger: reveal }),
      }),
    );
    expect(motion.create).toHaveBeenCalledOnce();
    const trigger = motion.create.mock.calls[0]?.[0] as { onEnter: () => void };
    trigger.onEnter();
    expect(step.classList.toggle).toHaveBeenCalledWith('current', true);
    expect(root.querySelectorAll).not.toHaveBeenCalledWith(
      '[data-scroll-reveal]',
    );
  });
});
