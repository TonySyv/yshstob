/**
 * Pages Function: POST /api/shorten
 * Creates a short URL from a long URL
 */

interface Env {
  KV_URLS: KVNamespace;
  ANALYTICS_WORKER_URL: string;
}

interface ShortenRequest {
  longUrl: string;
  proposedCode?: string;
}

interface ShortenResponse {
  shortUrl: string;
  longUrl: string;
}

/**
 * Generate a short code using crypto API
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
 * Normalize URL - add https:// if no protocol is provided
 */
function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.match(/^https?:\/\//i)) {
    return trimmed;
  }
  return `https://${trimmed}`;
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
 * Validate a proposed short code from the client
 */
function isValidProposedCode(code: string | undefined): code is string {
  if (!code || typeof code !== 'string') return false;
  return /^[A-Za-z0-9_-]{8}$/.test(code);
}

/**
 * CORS headers
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

// Handle POST /api/shorten
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body: ShortenRequest = await request.json();
    const { longUrl, proposedCode } = body;

    if (!longUrl || typeof longUrl !== 'string') {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: 'Missing or invalid longUrl' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ));
    }

    // Normalize URL (add https:// if no protocol)
    const normalizedUrl = normalizeUrl(longUrl);

    // Validate normalized URL
    if (!isValidUrl(normalizedUrl)) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ));
    }

    // Try to use client-proposed code first (optimistic UI support)
    let code: string | undefined;
    
    if (isValidProposedCode(proposedCode)) {
      const existing = await env.KV_URLS.get(proposedCode);
      if (!existing) {
        code = proposedCode;
      }
    }

    // Generate unique short code if no valid proposed code
    if (!code) {
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
        return addCorsHeaders(new Response(
          JSON.stringify({ error: 'Failed to generate unique code' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        ));
      }
    }

    // Store normalized URL in KV
    await env.KV_URLS.put(code, normalizedUrl);

    // Get the request URL to construct short URL
    const url = new URL(request.url);
    const shortUrl = `${url.origin}/${code}`;

    const response: ShortenResponse = {
      shortUrl,
      longUrl: normalizedUrl,
    };

    return addCorsHeaders(new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
  } catch (error) {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    ));
  }
};

