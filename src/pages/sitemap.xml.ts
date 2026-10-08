import type { APIRoute } from 'astro';
import { seoUrl } from '../lib/seo';

export const prerender = false;

export const GET: APIRoute = ({ url, site }) => {
  const paths = ['/', '/about', '/contact', '/privacy', '/terms'];
  const entries = paths
    .map(
      (path) =>
        `<url><loc>${seoUrl(path, url, site).replaceAll('&', '&amp;')}</loc></url>`,
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
