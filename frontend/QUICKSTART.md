# Frontend Quick Start Guide

## Start the Frontend

The frontend is a **React + Vite** application with **Cloudflare Pages Functions** for the API endpoints.

### Development Modes

#### Option 1: Frontend Only (No API Functions)

For frontend-only development (UI work, no API calls):

```powershell
cd frontend
npm install    # Only needed first time or after package.json changes
npm run dev
```

The dev server will start and show you the local URL (typically `http://localhost:5173`).

**Note**: This mode won't have access to Pages Functions (API endpoints won't work). Use this for UI-only development.

#### Option 2: Full Stack (Frontend + Pages Functions)

For full local development including API endpoints (URL shortening, redirects):

**Terminal 1 - Analytics Worker** (if testing analytics):
```powershell
cd backend/analytics-worker
npm run dev
```

**Terminal 2 - Frontend + Pages Functions**:
```powershell
cd frontend
npm run build    # Build frontend first
npx wrangler pages dev dist --kv=KV_URLS --env ANALYTICS_WORKER_URL=http://localhost:8787
```

This will start the frontend with Pages Functions on `http://localhost:8788` (or similar, Wrangler will show the exact URL).

**Important**: 
- Pages Functions (URL shortening/redirect logic) are now part of the frontend
- You must build the frontend first (`npm run build`) before running `wrangler pages dev`
- KV bindings are configured in `wrangler.toml`
- Set `ANALYTICS_WORKER_URL` to point to your local analytics worker (or production URL)

### Available Routes

- **`/`** - Home page (URL shortener interface)
- **`/speedometer`** - Analytics dashboard showing redirect metrics
- **`/info`** - Info page with behavior documentation

### API Endpoints (Pages Functions)

These run as Pages Functions when using `wrangler pages dev`:

- **`POST /api/shorten`** - Create a short URL
- **`GET /:code`** - Redirect to the long URL
- **`GET /api/url-count`** - Get total URL count

## Environment Variables

### For Frontend-Only Development (`npm run dev`)

The frontend uses environment variables from `.env` file:

- `VITE_API_BASE_URL` - Base URL for API (not needed in Pages Functions mode)
- `VITE_ANALYTICS_URL` - Analytics Worker URL

These are already configured to point to the deployed services:
- `VITE_ANALYTICS_URL=https://analytics-worker.tony-syv.workers.dev`

**Note**: `VITE_API_BASE_URL` is no longer needed since API endpoints are now Pages Functions on the same domain.

### For Pages Functions Development (`wrangler pages dev`)

Set environment variables via command line:
```powershell
npx wrangler pages dev dist --kv=KV_URLS --env ANALYTICS_WORKER_URL=http://localhost:8787
```

Or set in your shell:
```powershell
$env:ANALYTICS_WORKER_URL="http://localhost:8787"
npx wrangler pages dev dist --kv=KV_URLS
```

## Build for Production

```powershell
npm run build      # Build production bundle
npm run preview    # Preview production build locally (frontend only, no Functions)
```

**For production**: Pages Functions deploy automatically with the frontend via Cloudflare Pages.

## Features

- **Home Page**: Create short URLs by entering a long URL
- **Speedometer Page**: View real-time analytics (total redirects, average redirect time, version info)
- **Info Page**: Complete documentation of URL gremlin behaviors

## Architecture Notes

- **URL Shortening & Redirects**: Now run as **Pages Functions** in `frontend/functions/` (not a separate worker)
- **Analytics**: Still runs as a standalone Cloudflare Worker
- **Local Development**: Requires building frontend and running `wrangler pages dev` to test Pages Functions

