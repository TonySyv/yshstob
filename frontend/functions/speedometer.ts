/**
 * Pages Function: GET /speedometer
 * Proxies speedometer requests to the Analytics Worker
 */

interface Env {
  ANALYTICS_WORKER_URL: string;
}

/**
 * CORS headers
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function addCorsHeaders(response: Response): Response {
  const newResponse = new Response(response.body, response);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });
  return newResponse;
}

// Handle OPTIONS preflight
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

// Handle GET /speedometer
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Check if this is an API request (Accept: application/json) or browser navigation (Accept: text/html)
  const acceptHeader = request.headers.get('Accept') || '';
  const isApiRequest = acceptHeader.includes('application/json') || 
                       request.headers.get('Content-Type')?.includes('application/json');

  // If it's a browser navigation request, let it pass through to the React app
  if (!isApiRequest && acceptHeader.includes('text/html')) {
    return context.next();
  }

  // Otherwise, proxy API request to analytics worker
  const analyticsUrl = env.ANALYTICS_WORKER_URL;
  if (!analyticsUrl) {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: 'Analytics worker URL not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    ));
  }

  try {
    // Proxy request to analytics worker
    const response = await fetch(`${analyticsUrl}/speedometer`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return addCorsHeaders(new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    }));
  } catch (error) {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: 'Failed to fetch speedometer data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    ));
  }
};

