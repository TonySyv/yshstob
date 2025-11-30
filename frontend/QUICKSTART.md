# Frontend Quick Start Guide

## Start the Frontend

The frontend is a **React + Vite** application that runs on `http://localhost:5173` by default.

### Start Development Server

From the `frontend` directory:

```powershell
cd frontend
npm install    # Only needed first time or after package.json changes
npm run dev
```

The dev server will start and show you the local URL (typically `http://localhost:5173`).

### Available Routes

- **`/`** - Home page (URL shortener interface)
- **`/speedometer`** - Analytics dashboard showing redirect metrics

## Environment Variables

The frontend uses environment variables from `.env` file:

- `VITE_API_BASE_URL` - Redirect Worker URL
- `VITE_ANALYTICS_URL` - Analytics Worker URL

These are already configured to point to the deployed workers:
- `VITE_API_BASE_URL=https://redirect-worker.tony-syv.workers.dev`
- `VITE_ANALYTICS_URL=https://analytics-worker.tony-syv.workers.dev`

## Build for Production

```powershell
npm run build      # Build production bundle
npm run preview    # Preview production build locally
```

## Features

- **Home Page**: Create short URLs by entering a long URL
- **Speedometer Page**: View real-time analytics (total redirects, average redirect time, version info)

