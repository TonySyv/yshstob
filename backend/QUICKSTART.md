# Backend Quick Start Guide

## Production (Already Deployed)

The backend workers are **already deployed and running** on Cloudflare:

- **Redirect Worker**: https://redirect-worker.tony-syv.workers.dev
- **Analytics Worker**: https://analytics-worker.tony-syv.workers.dev

No need to start anything - they're live and ready to use!

---

## Local Development

To run the workers locally for testing and development:

### Option 1: Run Both Workers (Recommended)

**Terminal 1 - Analytics Worker:**
```powershell
cd backend/analytics-worker
npm run dev
```
This will start the analytics worker on `http://localhost:8787` (or similar)

**Terminal 2 - Redirect Worker:**
```powershell
cd backend/redirect-worker
npm run dev
```
This will start the redirect worker on `http://localhost:8788` (or similar)

**Important**: When running locally, you need to set the `ANALYTICS_WORKER_URL` environment variable. You can either:
- Set it in your shell: `$env:ANALYTICS_WORKER_URL="http://localhost:8787"`
- Or update the frontend `.env` to point to local URLs for local development

### Option 2: Run Individual Workers

**Start Analytics Worker only:**
```powershell
cd backend/analytics-worker
npm run dev
```

**Start Redirect Worker only:**
```powershell
cd backend/redirect-worker
npm run dev
```

### Local Development URLs

When running locally, Wrangler will show you the local URLs, typically:
- Analytics Worker: `http://localhost:8787`
- Redirect Worker: `http://localhost:8788`

Update your frontend `.env` file to use these local URLs for local development:
```
VITE_API_BASE_URL=http://localhost:8788
VITE_ANALYTICS_URL=http://localhost:8787
```

---

## Commands Reference

### Development
```powershell
# From backend/redirect-worker or backend/analytics-worker
npm run dev          # Start local development server
```

### Deployment
```powershell
# From backend/redirect-worker or backend/analytics-worker
npm run deploy       # Deploy to Cloudflare (wrangler deploy)
```

---

## Notes

- **Production workers are always running** - no server to start
- **Local dev mode** uses Wrangler's local runtime (not the actual Cloudflare edge)
- **KV namespaces** work in local dev mode (Wrangler connects to your Cloudflare KV)
- **Secrets** (like `ANALYTICS_WORKER_URL`) need to be set separately for local dev

