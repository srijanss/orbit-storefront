import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Terms from '../../src/themes/dawn/pages/terms.astro';
import TermsRoute from '../../src/pages/terms.astro';

describe('dawn theme Terms and Conditions page', () => {
  it('renders comprehensive terms through the dawn layout', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Terms);

    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]+"/);
    expect(html).toContain('Last updated');
    expect(html).toContain('Agreement to These Terms');
    expect(html).toContain('Accounts and Eligibility');
    expect(html).toContain('Products and Availability');
    expect(html).toContain('Orders, Pricing, and Payment');
    expect(html).toContain('Shipping and Delivery');
    expect(html).toContain('Returns and Refunds');
    expect(html).toContain('Acceptable Use');
    expect(html).toContain('Intellectual Property');
    expect(html).toContain('Disclaimers and Limitation of Liability');
    expect(html).toContain('Changes to These Terms');
    expect(html).not.toContain('Lorem ipsum');
    expect(html.match(/<section/g)).toHaveLength(10);
  });

  it('is what the /terms route renders', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TermsRoute);

    expect(html).toContain('Orders, Pricing, and Payment');
    expect(html).not.toContain('Lorem ipsum');
  });

  it('renders landing-page-aligned centered terms content and contact CTA', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Terms);

    expect(html).toContain('max-w-5xl');
    expect(html).toContain('text-center');
    expect(html).toContain('text-5xl');
    expect(html).toContain('text-text-secondary');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('bg-action');
  });
});
