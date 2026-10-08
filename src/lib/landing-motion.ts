import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface ScrollMotionOptions {
  reducedMotion?: boolean;
  timelineSnap?: boolean;
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

  const timelineSnap =
    options.timelineSnap ??
    (typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 901px)').matches);

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

  const scrollTriggerRoot =
    scope ?? root.querySelector<HTMLElement>('html') ?? undefined;

  const getTimelineTarget = (step: HTMLElement): string | null => {
    if (typeof step.getAttribute === 'function') {
      return step.getAttribute(timelineTargetAttribute);
    }

    return timelineTargetAttribute === 'data-timeline-target'
      ? (step.dataset.timelineTarget ?? null)
      : null;
  };
  const timelineChapters = timelineSteps.flatMap((step) => {
    const targetId = getTimelineTarget(step);
    const chapter = targetId
      ? root.querySelector<HTMLElement>(`#${targetId}`)
      : null;

    return chapter ? [chapter] : [];
  });

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

    const firstChapter = timelineChapters[0] ?? null;
    const lastChapter = timelineChapters.at(-1) ?? null;

    if (timelineProgress && firstChapter && lastChapter) {
      const progressTrigger: ScrollTrigger.Vars = {
        trigger: firstChapter,
        endTrigger: lastChapter,
        start: 'top top',
        end: 'top top',
        scrub: true,
      };

      if (timelineSnap && timelineChapters.length > 1) {
        progressTrigger.snap = {
          snapTo: (progress: number, scrollTrigger?: ScrollTrigger): number => {
            if (scrollTrigger?.direction !== 1) return progress;

            const chapterTops = timelineChapters.map(
              (chapter) => chapter.getBoundingClientRect().top,
            );
            const firstTop = chapterTops[0] ?? 0;
            const lastTop = chapterTops.at(-1) ?? firstTop;
            const totalDistance = lastTop - firstTop;
            if (totalDistance <= 0) return progress;

            const snapPoints = chapterTops.map(
              (top) => (top - firstTop) / totalDistance,
            );
            const nextIndex = snapPoints.findIndex((point) => point > progress);
            if (nextIndex <= 0) return progress;

            const previousPoint = snapPoints[nextIndex - 1] ?? progress;
            const nextPoint = snapPoints[nextIndex] ?? progress;
            const threshold =
              previousPoint + (nextPoint - previousPoint) * 0.75;

            return progress + Number.EPSILON >= threshold
              ? nextPoint
              : progress;
          },
          delay: 0.24,
          duration: { min: 0.45, max: 0.8 },
          ease: 'power3.out',
          inertia: false,
          directional: true,
        };
      }

      gsap.to(timelineProgress, {
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: progressTrigger,
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
          trigger: scrollTriggerRoot,
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
          trigger: scrollTriggerRoot,
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
