# Backend Quick Start Guide

## Production (Already Deployed)

The analytics worker is **already deployed and running** on Cloudflare:

- **Analytics Worker**: https://analytics-worker.tony-syv.workers.dev

**Note**: The redirect logic has been migrated to **Cloudflare Pages Functions** (located in `frontend/functions/`). It's no longer a standalone worker and deploys automatically with the frontend.

No need to start anything - it's live and ready to use!

---

## Local Development

### Architecture Overview

- **Analytics Worker**: Standalone Cloudflare Worker (runs separately)
- **URL Shortening & Redirects**: Now runs as **Pages Functions** in `frontend/functions/` (not a separate worker)

### Running Locally

For full local development, you need to run:

1. **Analytics Worker** (if you need to test analytics):
```powershell
cd backend/analytics-worker
npm run dev
```
This will start the analytics worker on `http://localhost:8787` (or similar)

2. **Frontend with Pages Functions** (includes URL shortening/redirect logic):
```powershell
cd frontend
npm run build          # Build the frontend first
npx wrangler pages dev dist --kv=KV_URLS --env ANALYTICS_WORKER_URL=http://localhost:8787
```

**Important**: 
- The Pages Functions (redirect logic) are now part of the frontend deployment
- You need to build the frontend first (`npm run build`) before running `wrangler pages dev`
- Set `ANALYTICS_WORKER_URL` environment variable when running Pages Functions locally
- KV bindings are configured in `frontend/wrangler.toml`

### Local Development URLs

When running locally:
- Analytics Worker: `http://localhost:8787` (if running)
- Frontend + Pages Functions: `http://localhost:8788` (or similar, Wrangler will show the exact URL)

### Environment Variables for Local Development

When running `wrangler pages dev`, you can pass environment variables:
```powershell
npx wrangler pages dev dist --kv=KV_URLS --env ANALYTICS_WORKER_URL=http://localhost:8787
```

Or set them in your shell before running:
```powershell
$env:ANALYTICS_WORKER_URL="http://localhost:8787"
npx wrangler pages dev dist --kv=KV_URLS
```

---

## Commands Reference

### Development
```powershell
# Analytics Worker (standalone)
cd backend/analytics-worker
npm run dev          # Start local development server

# Frontend + Pages Functions
cd frontend
npm run build        # Build frontend first
npx wrangler pages dev dist --kv=KV_URLS --env ANALYTICS_WORKER_URL=http://localhost:8787
```

### Deployment
```powershell
# Analytics Worker (standalone)
cd backend/analytics-worker
npm run deploy       # Deploy to Cloudflare (wrangler deploy)

# Frontend + Pages Functions deploy automatically via Cloudflare Pages
# (when you push to main branch, if connected to GitHub)
```

---

## Notes

- **Production**: Analytics worker is always running, Pages Functions deploy automatically with frontend
- **Local dev mode**: Uses Wrangler's local runtime (not the actual Cloudflare edge)
- **KV namespaces**: Work in local dev mode (Wrangler connects to your Cloudflare KV)
- **Pages Functions**: The redirect logic is now in `frontend/functions/`, not a separate worker
- **Environment variables**: Need to be set separately for local dev (use `--env` flag or shell variables)

