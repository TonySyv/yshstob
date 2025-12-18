/**
 * Pages Function: GET /:code
 * Handles short URL redirects with async analytics
 */

interface Env {
  KV_URLS: KVNamespace;
  ANALYTICS_WORKER_URL: string;
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
 * Send analytics event to Analytics Worker (non-blocking)
 */
async function sendAnalyticsEvent(
  env: Env,
  event: AnalyticsEvent
): Promise<void> {
  const analyticsUrl = env.ANALYTICS_WORKER_URL;
  if (!analyticsUrl) {
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

// Handle GET /:code
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env, params, waitUntil } = context;
  const startTime = Date.now();

  // Get the code from the URL parameter
  const code = params.code as string;

  // Skip if it looks like a static asset or known route
  if (code.includes('.') || ['api', 'info', 'speedometer', 'assets', '_next'].includes(code)) {
    return context.next();
  }

  // Validate code format
  if (!/^[A-Za-z0-9_-]+$/.test(code)) {
    return context.next();
  }

  // Look up long URL
  const longUrl = await env.KV_URLS.get(code);

  if (!longUrl) {
    // Not found in KV - let Pages handle it (might be a valid route)
    return context.next();
  }

  // Calculate redirect time
  const redirectTime = Date.now() - startTime;

  // Send analytics event asynchronously (non-blocking)
  waitUntil(
    sendAnalyticsEvent(env, {
      code,
      longUrl,
      timestamp: Date.now(),
      redirectTimeMs: redirectTime,
      region: (request.cf as any)?.colo ? String((request.cf as any).colo) : undefined,
      version: 'v1.0.0',
    })
  );

  // Return redirect immediately (ultra-fast path)
  return Response.redirect(longUrl, 302);
};

