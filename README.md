<div align="center">

# 🔗 yshstob

### *The URL shortener with attitude*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Transform long URLs into shorter links — and get roasted while doing it.**

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

---

</div>

## ✨ What is yshstob?

yshstob isn't just another URL shortener. It's a URL shortener with **personality**. While it dutifully shortens your links, it also:

- 🎭 **Changes mood daily** — Sassy on Monday, Wholesome on Sunday
- 🔍 **Watches you type** — And comments on your mistakes in real-time
- 🎯 **Detects patterns** — From HTTP in 2025 to suspiciously long UTM parameters
- ⚡ **Blazingly fast** — Sub-15ms redirects powered by Cloudflare's edge network

> *"Short links. Sharp humor."*

---

## 🎭 Meet the URL Gremlin

Our URL personality system has different moods depending on the day:

| Day | Mood | Vibe |
|-----|------|------|
| Monday | 💅 **Sassy** | Sharp, sarcastic, and not afraid to call you out |
| Tuesday | 😑 **Bored** | Unimpressed, tired, and barely paying attention |
| Wednesday | 😎 **Bruh** | Every message contains "bruh". That's it. |
| Thursday | 💪 **Bro** | Gym-bro energy, encouraging and motivational |
| Friday | 🎉 **Party** | ALL CAPS! EMOJIS! HYPED ENERGY! |
| Saturday | 😌 **Chill** | Relaxed, smooth, bartender vibes |
| Sunday | 💖 **Wholesome** | Gentle, supportive, your biggest cheerleader |

---

## 🚀 Features

### Core Features

- **🔗 URL Shortening** — Turn monster URLs into clean, shareable links
- **📊 Real-time Metrics** — Track redirect speeds and total redirects via the Speedometer
- **🎨 Dark Mode** — Easy on the eyes, day or night
- **📱 Responsive** — Works beautifully on desktop and mobile

### Smart Detection

The gremlin notices everything:

| What It Catches | Example |
|-----------------|---------|
| 🚫 Missing TLD | `google` instead of `google.com` |
| 🔓 HTTP in 2025 | Using `http://` like it's 1999 |
| 📊 UTM Tracking | Those pesky `?utm_source=` parameters |
| 🖥️ Custom Ports | Developer detected! (`:8080`, `:3000`) |
| 🔢 IP Addresses | Using `192.168.1.1` instead of a domain |
| 📏 Size Issues | Too long (>500 chars) or hilariously short (<30 chars) |
| 👀 Invisible Characters | Zero-width Unicode shenanigans |
| 🔐 Login/Admin Pages | Sensitive URLs detected |

### Behavior Tracking

It also watches *how* you type:

- ✏️ Started typing
- 🗑️ Cleared everything
- 🔄 Can't make up your mind (oscillating)
- ✅ Fixed an error
- 💔 Broke a valid URL

---

## 🏗️ Architecture

```
yshstob/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages (Home, Speedometer, Info)
│   │   ├── lib/             # Core logic (API, detection, mood system)
│   │   └── hooks/           # Custom React hooks
│   └── ...
│
└── backend/                  # Cloudflare Workers
    ├── redirect-worker/     # URL shortening & redirects
    │   └── src/index.ts     # POST /api/shorten, GET /:code
    │
    └── analytics-worker/    # Metrics & tracking
        └── src/index.ts     # GET /speedometer, POST /analytics
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **Backend** | Cloudflare Workers |
| **Storage** | Cloudflare KV |
| **Routing** | React Router v6 |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (for backend)
- Cloudflare account (for deployment)

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

See the detailed [Backend README](backend/README.md) for full setup, including:
- Creating KV namespaces
- Configuring worker URLs
- Deploying to Cloudflare

Quick start:

```bash
# Install Wrangler globally
npm install -g wrangler

# Authenticate
wrangler login

# Deploy redirect worker
cd backend/redirect-worker
npm install
wrangler deploy

# Deploy analytics worker
cd ../analytics-worker
npm install
wrangler deploy
```

---

## 📖 API Reference

### Create Short URL

```http
POST /api/shorten
Content-Type: application/json

{
  "longUrl": "https://example.com/very/long/url/that/needs/shortening"
}
```

**Response:**
```json
{
  "shortUrl": "https://your-domain.com/abc123",
  "longUrl": "https://example.com/very/long/url/that/needs/shortening"
}
```

### Redirect

```http
GET /:code
```

Returns `302 Redirect` to the original URL.

### Get Metrics

```http
GET /speedometer
```

**Response:**
```json
{
  "version": "v1.0.0",
  "deploy_timestamp": "2025-01-01T12:00:00Z",
  "commit_summary": "Initial release",
  "total_redirects": 12345,
  "average_redirect_ms": 12.5
}
```

---

## 🎨 Screenshots

### Home Page
The main URL shortening interface with real-time personality feedback.

### Speedometer
Live metrics showing redirect performance and deployment info.

### Info Page
Complete guide to all the URL gremlin's behaviors and reactions.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ and a healthy dose of sarcasm**

*yshstob — because your URLs deserve to be judged*

</div>
