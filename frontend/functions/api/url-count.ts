/**
 * Pages Function: GET /api/url-count
 * Returns the count of URLs in the KV database
 */

interface Env {
  KV_URLS: KVNamespace;
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

// Handle GET /api/url-count
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    // List all keys in KV to count them
    // Note: This may be slow for very large databases, but KV list is efficient
    let count = 0;
    let cursor: string | undefined;
    
    do {
      const result = await env.KV_URLS.list({ cursor, limit: 1000 });
      count += result.keys.length;
      cursor = result.list_complete ? undefined : result.cursor;
    } while (cursor);

    return addCorsHeaders(new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
  } catch (error) {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: 'Failed to count URLs', count: 0 }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    ));
  }
};

