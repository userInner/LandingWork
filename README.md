# LandingWork

The simplest screenshot API for developers. Turn any URL or HTML into a pixel-perfect PNG, JPEG, or PDF with one API call.

## Project Structure

```
landingwork/
├── src/
│   ├── app/
│   │   ├── api/v1/screenshot/route.ts   # Screenshot API endpoint
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Landing page
│   │   └── globals.css                   # Tailwind imports
│   └── lib/
│       ├── auth.ts                       # API key validation
│       ├── browser.ts                    # Playwright browser pool
│       ├── rateLimit.ts                  # In-memory rate limiting
│       └── screenshot.ts                 # Screenshot capture logic
├── Dockerfile                            # Production container
├── next.config.ts                        # Next.js config
├── package.json
└── tsconfig.json
```

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright Chromium
npx playwright-core install chromium

# 3. Set up env
cp .env.example .env
# Edit .env and add your API key(s)

# 4. Run dev server
npm run dev
```

The app runs at `http://localhost:3000`. The API is at `http://localhost:3000/api/v1/screenshot`.

## Usage

```bash
# Screenshot a URL
curl -X POST http://localhost:3000/api/v1/screenshot \
  -H "Authorization: Bearer sk_test_your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com", "format": "png"}' \
  --output screenshot.png

# Render HTML to image
curl -X POST http://localhost:3000/api/v1/screenshot \
  -H "Authorization: Bearer sk_test_your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1 style=\"font-size:60px;padding:40px;\">Hello World</h1>", "width": 1200, "height": 630}' \
  --output og-image.png
```

## API Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| url | string | — | URL to capture |
| html | string | — | Raw HTML to render |
| format | string | png | `png`, `jpeg`, or `pdf` |
| width | number | 1280 | Viewport width (100–3840) |
| height | number | 720 | Viewport height (100–2160) |
| fullPage | boolean | false | Capture full scrollable page |
| quality | number | 80 | JPEG quality (0–100) |
| deviceScaleFactor | number | 1 | Device pixel ratio (1–3) |
| waitAfterLoad | number | 0 | Ms to wait after load (max 10000) |
| waitForSelector | string | — | CSS selector to wait for |
| darkMode | boolean | false | Enable dark color scheme |

## Deploy to Your Server (Docker)

```bash
# Build the image
docker build -t landingwork .

# Run the container
docker run -d \
  --name landingwork \
  -p 3000:3000 \
  -e API_KEYS="sk_live_your_key_1,sk_live_your_key_2" \
  -e RATE_LIMIT_MAX=50 \
  -e MAX_CONCURRENT_BROWSERS=4 \
  --restart unless-stopped \
  landingwork
```

### Deploy with Docker Compose

Create a `docker-compose.yml`:

```yaml
services:
  landingwork:
    build: .
    ports:
      - "3000:3000"
    environment:
      - API_KEYS=sk_live_your_key_1,sk_live_your_key_2
      - RATE_LIMIT_MAX=50
      - MAX_CONCURRENT_BROWSERS=4
      - NAVIGATION_TIMEOUT_MS=30000
    restart: unless-stopped
```

```bash
docker compose up -d
```

## Deploy Landing Page to Vercel (Optional)

If you want to serve the landing page from Vercel and keep only the API on your server:

1. Push the repo to GitHub
2. Import in Vercel
3. Vercel auto-detects Next.js and deploys

For a split setup (landing on Vercel, API on your server), configure a rewrite in `next.config.ts` to proxy `/api/*` to your server.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| API_KEYS | — | Comma-separated valid API keys |
| RATE_LIMIT_MAX | 50 | Max requests per window |
| RATE_LIMIT_WINDOW_MS | 2592000000 | Window duration in ms (30 days) |
| MAX_CONCURRENT_BROWSERS | 4 | Max parallel screenshot jobs |
| NAVIGATION_TIMEOUT_MS | 30000 | Page load timeout in ms |

## Production Checklist

- [ ] Generate strong API keys: `node -e "import('crypto').then(c => console.log('sk_live_' + c.randomBytes(24).toString('hex')))"`
- [ ] Set up a reverse proxy (Nginx/Caddy) with HTTPS in front of port 3000
- [ ] Configure Lemon Squeezy product + checkout link
- [ ] Replace `https://app.lemonsqueezy.com` links in the landing page with your actual checkout URL
- [ ] Set up monitoring (uptime check on `/api/v1/screenshot` with a health check)
- [ ] Consider adding Redis for rate limiting if scaling beyond one server

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Screenshot Engine:** Playwright (Chromium)
- **Payment:** Lemon Squeezy (MoR model)

## License

MIT
