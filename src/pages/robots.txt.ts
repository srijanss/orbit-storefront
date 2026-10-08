import type { APIRoute } from 'astro';
import { seoUrl } from '../lib/seo';

export const prerender = false;

export const GET: APIRoute = ({ url, site }) => {
  const sitemapUrl = seoUrl('/sitemap.xml', url, site);
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
