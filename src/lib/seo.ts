/** Use the public origin for SEO, even behind a reverse proxy. */
export function seoUrl(pathname: string, requestUrl: URL, site?: URL): string {
  const configuredUrl = site?.href || import.meta.env.SITE_URL;
  if (!configuredUrl && import.meta.env.PROD) {
    throw new Error('SITE_URL is required in production');
  }
  const value = configuredUrl || requestUrl.origin;
  const invalidOrigin =
    'SITE_URL must be an absolute HTTP(S) origin without credentials, path, query or fragment';
  if (!/^https?:\/\//i.test(value) || !URL.canParse(value)) {
    throw new Error(invalidOrigin);
  }
  const canonical = new URL(value);
  if (
    canonical.username ||
    canonical.password ||
    canonical.pathname !== '/' ||
    canonical.search ||
    canonical.hash ||
    value.includes('?') ||
    value.includes('#')
  ) {
    throw new Error(invalidOrigin);
  }
  canonical.pathname = `/${pathname.replace(/^\/+|\/+$/g, '')}`;
  return canonical.href;
}
