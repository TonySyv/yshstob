/**
 * Redirect Worker - Ultra-fast URL shortener and redirect handler
 * 
 * Routes:
 * - POST /api/shorten - Create short URL
 * - GET /:code - Redirect to long URL (with async analytics)
 */

interface Env {
  KV_URLS: KVNamespace;
  ANALYTICS_WORKER_URL: string;
}

interface ShortenRequest {
  longUrl: string;
}

interface ShortenResponse {
  shortUrl: string;
  longUrl: string;
}

interface AnalyticsEvent {
  code: string;
  longUrl: string;
  timestamp: number;
  redirectTimeMs: number;
  region?: string;
  version?: string;
}

/**
 * Generate a short code using crypto API (no external dependencies)
 */
function generateShortCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[randomValues[i] % chars.length];
  }
  
  return code;
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Send analytics event to Analytics Worker (non-blocking)
 */
async function sendAnalyticsEvent(
  env: Env,
  event: AnalyticsEvent
): Promise<void> {
  const analyticsUrl = env.ANALYTICS_WORKER_URL;
  if (!analyticsUrl) {
    // Silently fail if analytics URL is not configured
    return;
  }

  try {
    await fetch(`${analyticsUrl}/analytics/redirect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
  } catch (error) {
    // Silently fail - analytics should never block redirects
  }
}

/**
 * Handle POST /api/shorten
 */
async function handleShorten(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body: ShortenRequest = await request.json();
    const { longUrl } = body;

    if (!longUrl || typeof longUrl !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid longUrl' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidUrl(longUrl)) {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique short code
    let code: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      code = generateShortCode();
      const existing = await env.KV_URLS.get(code);
      if (!existing) {
        break;
      }
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate unique code' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Store in KV
    await env.KV_URLS.put(code, longUrl);

    // Get the request URL to construct short URL
    const url = new URL(request.url);
    const shortUrl = `${url.origin}/${code}`;

    const response: ShortenResponse = {
      shortUrl,
      longUrl,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Handle GET /:code - Redirect with async analytics
 */
async function handleRedirect(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  code: string
): Promise<Response> {
  const startTime = Date.now();

  // Look up long URL
  const longUrl = await env.KV_URLS.get(code);

  if (!longUrl) {
    return new Response(
      JSON.stringify({ error: 'Short URL not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Calculate redirect time
  const redirectTime = Date.now() - startTime;

  // Send analytics event asynchronously (non-blocking)
  ctx.waitUntil(
    sendAnalyticsEvent(env, {
      code,
      longUrl,
      timestamp: Date.now(),
      redirectTimeMs: redirectTime,
      region: request.cf?.colo,
      version: 'v1.0.0', // Could be read from env or KV
    })
  );

  // Return redirect immediately (ultra-fast path)
  return Response.redirect(longUrl, 302);
}

/**
 * Main fetch handler
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // POST /api/shorten
    if (request.method === 'POST' && path === '/api/shorten') {
      return handleShorten(request, env);
    }

    // GET /:code
    if (request.method === 'GET' && path.length > 1) {
      const code = path.slice(1); // Remove leading '/'
      // Basic validation: code should be alphanumeric with hyphens/underscores
      if (/^[A-Za-z0-9_-]+$/.test(code)) {
        return handleRedirect(request, env, ctx, code);
      }
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  },
};

