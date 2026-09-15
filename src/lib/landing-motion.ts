import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface ScrollMotionOptions {
  reducedMotion?: boolean;
  selectors?: Partial<ScrollMotionSelectors>;
  timelineTargetAttribute?: string;
  activeClass?: string;
}

export interface ScrollMotionSelectors {
  reveal: string;
  pageProgress: string;
  parallaxMedia: string;
  leadMedia: string;
  timelineRoot: string;
  timelineStep: string;
  timelineProgress: string;
}

export const defaultScrollMotionSelectors: ScrollMotionSelectors = {
  reveal: '[data-scroll-reveal]',
  pageProgress: '[data-scroll-progress]',
  parallaxMedia: '[data-parallax-media]',
  leadMedia: '[data-hero-media]',
  timelineRoot: '[data-scroll-timeline]',
  timelineStep: '[data-timeline-step]',
  timelineProgress: '[data-timeline-progress]',
};

export function initScrollMotion(
  root: ParentNode = document,
  options: ScrollMotionOptions = {},
): () => void {
  const reducedMotion = options.reducedMotion ?? prefersReducedMotion();
  if (reducedMotion) return () => undefined;

  const selectors = {
    ...defaultScrollMotionSelectors,
    ...options.selectors,
  };
  const timelineTargetAttribute =
    options.timelineTargetAttribute ?? 'data-timeline-target';
  const activeClass = options.activeClass ?? 'is-active';
  const sections = Array.from(
    root.querySelectorAll<HTMLElement>(selectors.reveal),
  );
  const progress = root.querySelector<HTMLElement>(selectors.pageProgress);
  const parallaxMedia = Array.from(
    root.querySelectorAll<HTMLElement>(selectors.parallaxMedia),
  );
  const leadMedia = root.querySelector<HTMLElement>(selectors.leadMedia);
  const timelineRoot = root.querySelector<HTMLElement>(selectors.timelineRoot);
  const timelineSteps = Array.from(
    root.querySelectorAll<HTMLElement>(selectors.timelineStep),
  );
  const timelineProgress = root.querySelector<HTMLElement>(
    selectors.timelineProgress,
  );
  const scope =
    typeof Element !== 'undefined' && root instanceof Element
      ? root
      : undefined;

  const getTimelineTarget = (step: HTMLElement): string | null => {
    if (typeof step.getAttribute === 'function') {
      return step.getAttribute(timelineTargetAttribute);
    }

    return timelineTargetAttribute === 'data-timeline-target'
      ? (step.dataset.timelineTarget ?? null)
      : null;
  };

  const context = gsap.context(() => {
    const activateTimelineStep = (
      activeStep: HTMLElement,
      activeChapter: HTMLElement,
    ): void => {
      timelineSteps.forEach((step) => {
        step.classList.toggle(activeClass, step === activeStep);
      });
      timelineRoot?.classList.toggle(
        'is-on-dark',
        activeChapter.dataset.timelineTone === 'dark',
      );
    };

    timelineSteps.forEach((step) => {
      const targetId = getTimelineTarget(step);
      if (!targetId) return;

      const chapter = root.querySelector<HTMLElement>(`#${targetId}`);
      if (!chapter) return;

      ScrollTrigger.create({
        trigger: chapter,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => activateTimelineStep(step, chapter),
        onEnterBack: () => activateTimelineStep(step, chapter),
      });
    });

    const firstTargetId = timelineSteps[0]
      ? getTimelineTarget(timelineSteps[0])
      : null;
    const lastStep = timelineSteps.at(-1);
    const lastTargetId = lastStep ? getTimelineTarget(lastStep) : null;
    const firstChapter = firstTargetId
      ? root.querySelector<HTMLElement>(`#${firstTargetId}`)
      : null;
    const lastChapter = lastTargetId
      ? root.querySelector<HTMLElement>(`#${lastTargetId}`)
      : null;

    if (timelineProgress && firstChapter && lastChapter) {
      gsap.to(timelineProgress, {
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: {
          trigger: firstChapter,
          endTrigger: lastChapter,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      });
    }

    sections.forEach((section) => {
      gsap.from(section, {
        y: 48,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
        },
      });
    });

    if (progress) {
      gsap.to(progress, {
        scaleY: 1,
        transformOrigin: 'bottom',
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    }

    parallaxMedia.forEach((media) => {
      gsap.to(media, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: media.parentElement ?? media,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    if (leadMedia) {
      gsap.to(leadMedia, {
        yPercent: 6,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=700',
          scrub: 1,
        },
      });
    }
  }, scope);

  return () => context.revert();
}

/** @deprecated Use initScrollMotion with an options object. */
export function initHeritageMotion(
  root: ParentNode = document,
  reducedMotion: boolean = prefersReducedMotion(),
): () => void {
  return initScrollMotion(root, { reducedMotion });
}
