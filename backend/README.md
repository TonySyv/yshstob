# Cloudflare Workers URL Shortener Backend

## ⚠️ Architecture Update

**The redirect-worker has been migrated to Cloudflare Pages Functions** for a simpler single-domain deployment. The code in `redirect-worker/` is kept for reference but is no longer deployed as a standalone worker.

### Current Architecture

| Component | Location | Status |
|-----------|----------|--------|
| **URL Shortening & Redirects** | `frontend/functions/` | ✅ Pages Functions |
| **Analytics & Metrics** | `backend/analytics-worker/` | ✅ Standalone Worker |

### Analytics Worker
- **Primary function**: Track redirect events and provide metrics
- **Routes**:
  - `POST /analytics/redirect` - Receive redirect events
  - `GET /speedometer` - Get metrics JSON
  - `PATCH /metadata/deploy` - Update deploy metadata (for GitHub Actions)

### Redirect Logic (Now in Pages Functions)
- **Location**: `frontend/functions/`
- **Routes**:
  - `POST /api/shorten` - Create short URL
  - `GET /:code` - Redirect to long URL (with async analytics)
- **Deployment**: Automatic via Cloudflare Pages

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

### Analytics Worker Setup

The Analytics Worker is the only standalone worker that needs to be deployed.

#### Step 1: Create KV Namespace (if not exists)

```bash
cd analytics-worker
wrangler kv:namespace create "KV_ANALYTICS"
wrangler kv:namespace create "KV_ANALYTICS" --preview
```

#### Step 2: Update wrangler.toml

Update `analytics-worker/wrangler.toml` with the KV namespace ID from step 1.

#### Step 3: Deploy

```bash
cd analytics-worker
npm install
wrangler deploy
```

### Pages Functions Setup (URL Shortening)

The URL shortening logic runs as **Cloudflare Pages Functions** and deploys automatically with the frontend.

1. **KV Binding**: Add `KV_URLS` binding in Cloudflare Pages → Settings → Bindings
2. **Environment Variable**: Add `ANALYTICS_WORKER_URL` in Pages → Settings → Environment variables
3. **Deploy**: Push to `main` branch — auto-deploys via GitHub integration

See the main [README](../README.md) for full deployment instructions.

## Development

### Local Development

```bash
# Analytics Worker
cd backend/analytics-worker
npm run dev

# Frontend + Pages Functions (from frontend directory)
cd frontend
npx wrangler pages dev dist --kv=KV_URLS
```

## API Endpoints

### Pages Functions (URL Shortening)

These endpoints run as Pages Functions on the main domain.

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
  "shortUrl": "https://you-should-have-seen-the-original-bro.com/abc123",
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
  analytics-worker/           # ✅ Active - Standalone Worker
    src/
      index.ts                # Main worker handler
    wrangler.toml             # Worker configuration
    package.json              # Dependencies
    tsconfig.json             # TypeScript config

  redirect-worker/            # ⚠️ Deprecated - Kept for reference
    src/
      index.ts                # (migrated to frontend/functions/)
    wrangler.toml
    ...

frontend/
  functions/                  # ✅ Active - Pages Functions
    api/
      shorten.ts              # POST /api/shorten
    [code].ts                 # GET /:code redirect
    tsconfig.json
  wrangler.toml               # KV bindings for Pages
```

## Deployment Status

### Current Production Setup:

| Service | URL | Notes |
|---------|-----|-------|
| **Frontend + API** | `you-should-have-seen-the-original-bro.com` | Cloudflare Pages (includes Functions) |
| **Analytics Worker** | `https://analytics-worker.tony-syv.workers.dev` | Standalone Worker |
| **Redirect Worker** | ~~`redirect-worker.tony-syv.workers.dev`~~ | ⚠️ Deprecated — use Pages Functions |

### KV Namespaces:
- **KV_URLS**: `3efb8902d43f4765b68efa9e9016e16a` (bound to Pages Functions)
- **KV_ANALYTICS**: `d0139bad4e1f4f4093a40d74de70240f` (bound to Analytics Worker)

### Environment Variables:
- **ANALYTICS_WORKER_URL**: Set in Pages environment variables

## Notes

- URL shortening and redirects now run as **Pages Functions** (same domain as frontend)
- Analytics Worker remains a standalone Cloudflare Worker
- Pages Functions use `waitUntil()` for non-blocking analytics calls
- The `redirect-worker/` directory is kept for reference but is no longer deployed

