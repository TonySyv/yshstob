/**
 * Analytics Worker - Tracks redirect events and provides metrics
 * 
 * Routes:
 * - POST /analytics/redirect - Receive redirect events
 * - GET /speedometer - Get metrics JSON
 * - PATCH /metadata/deploy - Update deploy metadata
 */

interface Env {
  KV_ANALYTICS: KVNamespace;
}

interface AnalyticsEvent {
  code: string;
  longUrl: string;
  timestamp: number;
  redirectTimeMs: number;
  region?: string;
  version?: string;
}

interface Counters {
  total_redirects: number;
  total_ms: number;
  version: string;
  deploy_timestamp: string;
  commit_summary: string;
}

interface SpeedometerResponse {
  version: string;
  deploy_timestamp: string;
  commit_summary: string;
  total_redirects: number;
  average_redirect_ms: number;
}

interface DeployMetadata {
  version: string;
  commit_summary: string;
  deploy_timestamp: string;
}

// KV Keys
const KEY_TOTAL_REDIRECTS = 'analytics:total_redirects';
const KEY_TOTAL_MS = 'analytics:total_ms';
const KEY_VERSION = 'analytics:version';
const KEY_DEPLOY_TIMESTAMP = 'analytics:deploy_timestamp';
const KEY_COMMIT_SUMMARY = 'analytics:commit_summary';

// Default values
const DEFAULT_COUNTERS: Counters = {
  total_redirects: 0,
  total_ms: 0,
  version: 'v1.000',
  deploy_timestamp: new Date().toISOString(),
  commit_summary: 'Initial deployment',
};

/**
 * Read counters from KV
 */
async function readCounters(env: Env): Promise<Counters> {
  const [
    totalRedirectsStr,
    totalMsStr,
    version,
    deployTimestamp,
    commitSummary,
  ] = await Promise.all([
    env.KV_ANALYTICS.get(KEY_TOTAL_REDIRECTS),
    env.KV_ANALYTICS.get(KEY_TOTAL_MS),
    env.KV_ANALYTICS.get(KEY_VERSION),
    env.KV_ANALYTICS.get(KEY_DEPLOY_TIMESTAMP),
    env.KV_ANALYTICS.get(KEY_COMMIT_SUMMARY),
  ]);

  return {
    total_redirects: totalRedirectsStr ? parseInt(totalRedirectsStr, 10) : DEFAULT_COUNTERS.total_redirects,
    total_ms: totalMsStr ? parseInt(totalMsStr, 10) : DEFAULT_COUNTERS.total_ms,
    version: version || DEFAULT_COUNTERS.version,
    deploy_timestamp: deployTimestamp || DEFAULT_COUNTERS.deploy_timestamp,
    commit_summary: commitSummary || DEFAULT_COUNTERS.commit_summary,
  };
}

/**
 * Write counters to KV
 */
async function writeCounters(env: Env, counters: Partial<Counters>): Promise<void> {
  const updates: Promise<void>[] = [];

  if (counters.total_redirects !== undefined) {
    updates.push(env.KV_ANALYTICS.put(KEY_TOTAL_REDIRECTS, counters.total_redirects.toString()));
  }
  if (counters.total_ms !== undefined) {
    updates.push(env.KV_ANALYTICS.put(KEY_TOTAL_MS, counters.total_ms.toString()));
  }
  if (counters.version !== undefined) {
    updates.push(env.KV_ANALYTICS.put(KEY_VERSION, counters.version));
  }
  if (counters.deploy_timestamp !== undefined) {
    updates.push(env.KV_ANALYTICS.put(KEY_DEPLOY_TIMESTAMP, counters.deploy_timestamp));
  }
  if (counters.commit_summary !== undefined) {
    updates.push(env.KV_ANALYTICS.put(KEY_COMMIT_SUMMARY, counters.commit_summary));
  }

  await Promise.all(updates);
}

/**
 * Compute average redirect time
 */
function computeAverage(totalMs: number, totalRedirects: number): number {
  if (totalRedirects === 0) {
    return 0;
  }
  return totalMs / totalRedirects;
}

/**
 * Handle POST /analytics/redirect
 */
async function handleAnalyticsRedirect(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const event: AnalyticsEvent = await request.json();

    // Validate event
    if (!event.code || !event.longUrl || !event.timestamp) {
      return new Response(
        JSON.stringify({ error: 'Invalid event data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Read current counters
    const counters = await readCounters(env);

    // Use redirect time from event (in milliseconds)
    const redirectTimeMs = event.redirectTimeMs || 0;

    // Update counters atomically
    await writeCounters(env, {
      total_redirects: counters.total_redirects + 1,
      total_ms: counters.total_ms + redirectTimeMs,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Handle GET /speedometer
 */
async function handleSpeedometer(env: Env): Promise<Response> {
  try {
    const counters = await readCounters(env);
    const averageMs = computeAverage(counters.total_ms, counters.total_redirects);

    const response: SpeedometerResponse = {
      version: counters.version,
      deploy_timestamp: counters.deploy_timestamp,
      commit_summary: counters.commit_summary,
      total_redirects: counters.total_redirects,
      average_redirect_ms: Math.round(averageMs * 1000) / 1000, // Round to 3 decimal places
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
 * Handle PATCH /metadata/deploy
 */
async function handleDeployMetadata(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const metadata: DeployMetadata = await request.json();

    // Validate metadata
    if (!metadata.version || !metadata.deploy_timestamp) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: version, deploy_timestamp' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update metadata in KV
    await writeCounters(env, {
      version: metadata.version,
      deploy_timestamp: metadata.deploy_timestamp,
      commit_summary: metadata.commit_summary || 'No commit message',
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
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

    // POST /analytics/redirect
    if (request.method === 'POST' && path === '/analytics/redirect') {
      return handleAnalyticsRedirect(request, env);
    }

    // GET /speedometer
    if (request.method === 'GET' && path === '/speedometer') {
      return handleSpeedometer(env);
    }

    // PATCH /metadata/deploy
    if (request.method === 'PATCH' && path === '/metadata/deploy') {
      return handleDeployMetadata(request, env);
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  },
};

