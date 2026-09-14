import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { existsSync, readFileSync } from 'node:fs';
import Landing from '../../src/themes/dawn/pages/landing.astro';
import IndexPage from '../../src/pages/index.astro';

describe('dawn theme Landing page', () => {
  it('renders its own title, description, and lorem ipsum placeholder copy through the dawn layout', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Landing);

    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/);
    expect(html).toContain('Lorem ipsum');
  });

  it('is what the home route (src/pages/index.astro) renders', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(IndexPage);

    expect(html).toContain('Lorem ipsum');
  });

  it('builds the Sukunda editorial journey as semantic, revealable sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Landing);

    expect(html).toMatch(/<main[^>]+data-heritage-landing/);
    expect(html).toMatch(/<h1[^>]*>\s*Sukunda\s*<\/h1>/);
    expect(html.match(/<section\b/g)).toHaveLength(7);
    expect(html.match(/data-scroll-reveal/g)?.length).toBeGreaterThanOrEqual(6);
    expect(html).toMatch(/data-scroll-progress/);
    expect(html).toMatch(/<section[^>]+aria-labelledby="collection-title"/);
    expect(html).toMatch(/<form[^>]+aria-label="Newsletter signup"/);
  });

  it('renders the complete heritage story, product collection, and local editorial imagery', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Landing);

    for (const copy of [
      'More Than an Object',
      'Light That Connects Us',
      'A Flame of Blessings',
      'Details That Endure',
      'Treasures from Nepal',
      'Preserve Our Heritage',
      'Stories, New Arrivals &amp; More',
    ]) {
      expect(html).toContain(copy);
    }

    expect(html).toContain('sukunda-hero');
    expect(html).toContain('sukunda-ritual');
    expect(html).toContain('sukunda-detail');
    expect(html).toContain('kathmandu-heritage');
    expect(html).toMatch(/data-hero-media/);
    expect(html).toMatch(/data-product-grid/);
    expect(html.match(/data-product-card/g)).toHaveLength(5);
  });

  it('initializes the theme-neutral scroll motion API from a bundled client script', () => {
    const source = readFileSync('src/themes/dawn/pages/landing.astro', 'utf8');

    expect(source).toMatch(/<script>/);
    expect(source).toMatch(
      /import \{ initScrollMotion \} from ['"][^'"]+landing-motion['"]/,
    );
    expect(source).toContain('initScrollMotion()');
    expect(source).not.toContain('HeritageMotion');
  });

  it('maps the persistent story timeline to its four scroll chapters', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Landing);
    const source = readFileSync('src/themes/dawn/pages/landing.astro', 'utf8');

    expect(html.match(/data-timeline-step/g)).toHaveLength(4);
    for (const target of [
      'discover',
      'ritual',
      'craftsmanship',
      'collection',
    ]) {
      expect(html).toContain(`data-timeline-target="${target}"`);
      expect(html).toContain(`href="#${target}"`);
    }
    expect(html).toMatch(/data-timeline-progress/);
    expect(source).toMatch(
      /\.hero__steps-progress\s*\{[^}]*transform:\s*scaleY\(0\)/s,
    );
  });

  it('keeps the persistent timeline out of the page content', () => {
    const source = readFileSync('src/themes/dawn/pages/landing.astro', 'utf8');

    expect(source).toMatch(
      /\.hero__steps\s*\{[^}]*left:\s*calc\(50% \+ 590px \+ 1rem\)/s,
    );
    expect(source).toMatch(
      /@media \(max-width: 1499px\)\s*\{\s*\.hero__steps\s*\{\s*display:\s*none/s,
    );
  });

  it('keeps Dawn editorial images alongside the Dawn theme', () => {
    const source = readFileSync('src/themes/dawn/pages/landing.astro', 'utf8');

    for (const filename of [
      'sukunda-hero.png',
      'sukunda-ritual.png',
      'sukunda-detail.png',
      'kathmandu-heritage.png',
    ]) {
      expect(existsSync(`src/themes/dawn/assets/${filename}`)).toBe(true);
      expect(source).toContain(`../assets/${filename}`);
      expect(source).not.toContain(`/images/heritage/${filename}`);
    }
  });
});
