# Cloudflare Workers URL Shortener Backend

This backend consists of two Cloudflare Workers optimized for ultra-fast redirects and clean analytics.

## Architecture

### Redirect Worker
- **Primary function**: Handle URL shortening and redirects
- **Routes**:
  - `POST /api/shorten` - Create short URL
  - `GET /:code` - Redirect to long URL (with async analytics)
- **Optimization**: Minimal code path, non-blocking analytics

### Analytics Worker
- **Primary function**: Track redirect events and provide metrics
- **Routes**:
  - `POST /analytics/redirect` - Receive redirect events
  - `GET /speedometer` - Get metrics JSON
  - `PATCH /metadata/deploy` - Update deploy metadata (for GitHub Actions)

## Setup Instructions

### Prerequisites

1. Install Wrangler CLI globally:
```bash
npm install -g wrangler
```

2. Authenticate with Cloudflare:
```bash
wrangler login
```

### Step 1: Create KV Namespaces

From the `backend` directory, create the required KV namespaces:

```bash
# Create KV_URLS namespace for Redirect Worker
cd redirect-worker
wrangler kv:namespace create "KV_URLS"
wrangler kv:namespace create "KV_URLS" --preview

# Create KV_ANALYTICS namespace for Analytics Worker
cd ../analytics-worker
wrangler kv:namespace create "KV_ANALYTICS"
wrangler kv:namespace create "KV_ANALYTICS" --preview
```

**Important**: Copy the `id` values from the output and update the `wrangler.toml` files in both workers.

### Step 2: Update wrangler.toml Files

1. **redirect-worker/wrangler.toml**: Replace `id = "..."` with the actual KV_URLS namespace ID
2. **analytics-worker/wrangler.toml**: Replace `id = "..."` with the actual KV_ANALYTICS namespace ID

### Step 3: Install Dependencies

From each worker directory:

```bash
# Redirect Worker
cd backend/redirect-worker
npm install

# Analytics Worker
cd backend/analytics-worker
npm install
```

### Step 4: Configure Analytics Worker URL

Set the Analytics Worker URL as a secret in the Redirect Worker:

```bash
cd backend/redirect-worker
wrangler secret put ANALYTICS_WORKER_URL
# Enter the Analytics Worker URL when prompted (e.g., https://analytics-worker.your-subdomain.workers.dev)
```

### Step 5: Deploy Workers

Deploy both workers:

```bash
# Deploy Redirect Worker
cd backend/redirect-worker
wrangler deploy

# Deploy Analytics Worker
cd backend/analytics-worker
wrangler deploy
```

**Important**: Deploy the Analytics Worker first, then deploy the Redirect Worker (so you can set the ANALYTICS_WORKER_URL secret).

## Development

### Local Development

Run workers locally for testing:

```bash
# Redirect Worker
cd backend/redirect-worker
npm run dev

# Analytics Worker (in another terminal)
cd backend/analytics-worker
npm run dev
```

## API Endpoints

### Redirect Worker

#### POST /api/shorten
Create a short URL.

**Request:**
```json
{
  "longUrl": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "shortUrl": "https://your-domain.com/abc123",
  "longUrl": "https://example.com/very/long/url"
}
```

#### GET /:code
Redirect to the long URL. Returns HTTP 302 redirect.

### Analytics Worker

#### GET /speedometer
Get current metrics.

**Response:**
```json
{
  "version": "v1.002",
  "deploy_timestamp": "2025-01-01T12:00:00Z",
  "commit_summary": "Optimized KV key length",
  "total_redirects": 2831,
  "average_redirect_ms": 12.313
}
```

#### PATCH /metadata/deploy
Update deploy metadata (typically called by GitHub Actions).

**Request:**
```json
{
  "version": "v1.124",
  "commit_summary": "Optimized KV key length",
  "deploy_timestamp": "2025-12-01T14:22:00Z"
}
```

## Project Structure

```
backend/
  redirect-worker/
    src/
      index.ts          # Main worker handler
    wrangler.toml       # Worker configuration
    package.json        # Dependencies
    tsconfig.json       # TypeScript config
  analytics-worker/
    src/
      index.ts          # Main worker handler
    wrangler.toml       # Worker configuration
    package.json        # Dependencies
    tsconfig.json       # TypeScript config
```

## Deployment Status

✅ **Both workers are deployed and operational:**

- **Redirect Worker**: https://redirect-worker.tony-syv.workers.dev
- **Analytics Worker**: https://analytics-worker.tony-syv.workers.dev

### KV Namespaces Created:
- **KV_URLS**: `3efb8902d43f4765b68efa9e9016e16a` (production), `6616768330f04b4c91b297337d594d1a` (preview)
- **KV_ANALYTICS**: `d0139bad4e1f4f4093a40d74de70240f` (production), `62b17a3ec3f44fe1920298f834a2d96d` (preview)

### Environment Variables:
- **ANALYTICS_WORKER_URL**: Set in Redirect Worker secrets

## Notes

- Both workers use TypeScript and are minified for production
- KV namespaces must be created before deployment
- The Redirect Worker uses `event.waitUntil()` to send analytics events asynchronously (non-blocking)
- All commands must be run from their respective worker directories

