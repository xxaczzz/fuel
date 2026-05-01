# FUEL — Smart Nutrition Journal

A personal nutrition tracker. Photo-based food recognition, smart meal plans, and self-adjusting calorie targets.

Companion app to [FORGE](https://github.com/your-forge-repo) (workout tracker). Same architecture: pure frontend + localStorage, no backend.

## Features

- **Photo → Food**: Snap a picture of any meal — Claude Vision identifies the dish, estimates portion, and asks 1-3 clarifying questions about preparation that meaningfully affect calories.
- **Smart targets**: Daily calorie/macro targets auto-calculated from your stats and goal. Every week, FUEL compares your actual weight trend against the intended trajectory and nudges your target by ±100 kcal if you're off course.
- **Training-aware**: Mark a training day → automatic +150 (cut) or +250 (bulk/maintain) kcal bonus.
- **Meal plan generator**: Filter by cuisine (Russian / Caucasian / Asian / Universal), max time, difficulty, and budget. Get a full day of recipes within 10% of your target.
- **150+ foods database**: Curated catalog with macros, including Russian (borscht, pelmeni, syrniki...), Caucasian (khachapuri, khinkali, satsivi...), Asian (sushi, pad thai, ramen...), plus universal staples.
- **30+ recipes**: Step-by-step instructions, scaled per serving.
- **Offline-first PWA**: Works without internet (except photo recognition). Install to home screen on iOS/Android.
- **Privacy**: All data lives in your browser. No accounts, no servers. Photos are sent directly from your device to api.anthropic.com — never via any third party.

## Photo recognition setup

Photo-based food recognition uses Claude Vision via the Anthropic API. You bring your own key:

1. Get an API key at [console.anthropic.com](https://console.anthropic.com)
2. Open FUEL → Settings (gear icon) → paste your key under "Photo recognition"
3. Tap the camera button when adding food

Without an API key, photo capture still works as a quick "log this with manual entry" shortcut, but you fill in calories yourself.

**Cost**: A Claude Sonnet vision call is ~$0.005-0.015 per food photo. Three meals a day with photos ≈ $0.01-0.05/day.

## Local development

```bash
# Serve locally with Wrangler (Cloudflare Pages dev server)
npm install
npm run dev

# Or just open with any static server
npx serve .
python3 -m http.server 8000
```

Then open `http://localhost:8788` (or whatever port).

## Deploy to Cloudflare Pages

```bash
# One-time: install Wrangler and log in
npm install
npx wrangler login

# Deploy
npm run deploy
```

Or via the Cloudflare dashboard: connect your Git repo, set the build output directory to `/`, no build command needed.

## Tech stack

- Vanilla JavaScript (no framework, no build step)
- localStorage for persistence
- Service Worker for offline-first PWA
- Claude Sonnet 4.5 Vision API (user-supplied key) for photo recognition
- Cloudflare Pages for hosting

## File structure

```
/
├── index.html              # Entry point + SW registration
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (cache-first for assets)
├── _headers                # Cloudflare Pages headers (security + cache)
├── _redirects              # SPA fallback
├── css/styles.css          # Full design system (~900 lines)
├── js/
│   ├── foods.js            # 150+ food catalog with macros
│   ├── recipes.js          # 30+ recipes for meal plan generator
│   └── app.js              # All app logic — state, screens, AI, math
└── assets/
    ├── icons/              # PWA icons (192, 512, maskable, favicon)
    └── og-image.png        # Open Graph preview
```

## How auto-calibration works

Every Sunday (or 7 days after the last calibration):

1. Linear regression on your last 14 days of weight entries → kg/week trend
2. Compare against expected: cut = -0.5 kg/wk, maintain = 0, bulk = +0.3 kg/wk
3. If deviation > 0.15 kg/wk: adjust daily target by ±100 kcal (capped between BMR×1.05 and TDEE×1.3)

Manual target overrides disable auto-calibration. Reset via Settings → "Reset to auto".

## License

MIT
