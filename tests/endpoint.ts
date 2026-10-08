import type { APIRoute } from 'astro';
import { createContext } from 'astro/middleware';

/** Exercise an endpoint through Astro's public, typed request context. */
export async function renderEndpoint(
  endpoint: { GET: APIRoute },
  request: Request,
): Promise<Response> {
  return endpoint.GET(createContext({ request, defaultLocale: '' }));
}
