# Deriv Bot — Automated Trading Platform

> A web-based, no-code trading bot builder powered by Blockly and the Deriv WebSocket API.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Scripts Reference](#scripts-reference)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Pages & Routes](#pages--routes)
- [Trading Bots](#trading-bots)
- [Deployment](#deployment)
- [CI/CD Workflows](#cicd-workflows)
- [Known Issues](#known-issues)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Deriv Bot is a full-featured automated trading platform that lets users build, test, and run trading bots **without writing a single line of code**. It uses a drag-and-drop visual programming interface powered by [Blockly](https://developers.google.com/blockly), connects to the Deriv trading API via WebSocket, and supports both demo and real trading accounts.

---

## Features

- **Visual Bot Builder** — Drag-and-drop blocks to build trading strategies
- **Quick Strategies** — Pre-built strategies: Martingale, D'Alembert, Oscar's Grind, 1-3-2-6, and more
- **50+ Free Bots** — Ready-to-use XML bot files covering Even/Odd, Over/Under, Rise/Fall, and AI strategies
- **Copy Trading** — Mirror trades from other traders in real time
- **Analysis Tools** — Tick analyser, digit frequency analysis, signal dashboard
- **Live Charts** — Integrated TradingView-style charts via `@deriv/deriv-charts`
- **HyperBot** — Advanced iframe-embedded bot runner with auth integration
- **PWA Support** — Installable app with offline fallback and service worker
- **Multi-language** — i18n via `@deriv-com/translations` with Crowdin CDN
- **Analytics** — RudderStack event tracking, Datadog RUM, TrackJS error monitoring
- **Multi-site Deployment** — One codebase, unlimited branded deployments via Appwrite

---

## Project Structure

```
deriv-site/
├── public/
│   ├── Bots/                   # 50+ trading bot XML files
│   ├── assets/
│   │   ├── icon/               # SVG icons
│   │   ├── images/             # Strategy diagrams and onboarding images
│   │   ├── media/              # Sounds, cursors, and Blockly media
│   │   └── videos/             # Onboarding tour videos
│   ├── circles/                # Standalone circles mini-app
│   ├── pro tools/              # Pro tools standalone page
│   ├── signals/                # Signals dashboard (standalone)
│   ├── risk-calculator.html    # Standalone risk calculator
│   ├── service-worker.js       # PWA service worker
│   ├── manifest.json           # PWA manifest
│   └── sitemap*.xml            # SEO sitemaps
├── src/
│   ├── App/                    # Root app, routing, auth wrapper
│   ├── components/             # Shared UI components
│   │   ├── layout/             # Header, footer, main body
│   │   ├── shared_ui/          # Design system components
│   │   └── ...                 # Feature-specific components
│   ├── external/
│   │   ├── bot-skeleton/       # Blockly bot engine, trade engine, API services
│   │   └── indicators/         # Technical indicators (SMA, EMA, MACD, RSI, BB)
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Route-level page components
│   ├── stores/                 # MobX state management
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions and helpers
│   └── xml/                    # Built-in quick strategy XML templates
├── .github/workflows/          # CI/CD pipeline definitions
├── index.html                  # App entry point
├── rsbuild.config.ts           # Primary build config (RSBuild)
├── webpack.config.js           # Fallback build config (Webpack)
├── jest.config.ts              # Test configuration
├── tsconfig.json               # TypeScript configuration
└── vercel.json                 # Vercel deployment config
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | `>= 20.x` |
| npm | `>= 9.x` |
| Git | Any recent version |

---

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/tr3yk0/deriv-site-.git
cd deriv-site-
```

**2. Install dependencies**

```bash
npm ci
```

**3. Set up environment variables**

Copy and fill in the required variables (see [Environment Variables](#environment-variables)):

```bash
cp .env.example .env   # if available, or create .env manually
```

**4. Start the development server**

```bash
npm run start
```

The app will be available at `http://localhost:5000`.

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run start` | Start dev server with RSBuild (hot reload) |
| `npm run start:webpack` | Start dev server with Webpack (fallback) |
| `npm run build` | Production build (RSBuild) |
| `npm run build:webpack` | Production build (Webpack) |
| `npm run preview` | Build then serve locally on port 8443 |
| `npm run analyze` | Build with bundle size analysis |
| `npm run test` | Run all Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ci` | Lint + format check + tests (CI mode) |
| `npm run coverage` | Generate test coverage report |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier format all files |
| `npm run format:check` | Check formatting without modifying |
| `npm run stylelint` | Stylelint check for CSS/SCSS |
| `npm run stylelint:fix` | Stylelint auto-fix |
| `npm run validate` | Full check: format + lint + tests |
| `npm run clean` | Remove dist, cache, and jest-cache directories |

---

## Environment Variables

These must be set in your `.env` file locally, or in GitHub Actions / Vercel secrets for deployment:

| Variable | Description |
|----------|-------------|
| `TRANSLATIONS_CDN_URL` | CDN base URL for translation files |
| `R2_PROJECT_NAME` | Cloudflare R2 project name for translations |
| `CROWDIN_BRANCH_NAME` | Crowdin branch for translation sync |
| `TRACKJS_TOKEN` | TrackJS error monitoring token |
| `APP_ENV` | Environment name (`development`, `staging`, `production`) |
| `REF_NAME` | Git ref name (injected by CI) |
| `REMOTE_CONFIG_URL` | URL for remote feature flags config |
| `GD_CLIENT_ID` | Google Drive OAuth client ID |
| `GD_APP_ID` | Google Drive app ID |
| `GD_API_KEY` | Google Drive API key |
| `DATADOG_APPLICATION_ID` | Datadog RUM application ID |
| `DATADOG_CLIENT_TOKEN` | Datadog client token |
| `DATADOG_SESSION_SAMPLE_RATE` | Datadog session sample rate |
| `DATADOG_SESSION_REPLAY_SAMPLE_RATE` | Datadog replay sample rate |
| `RUDDERSTACK_KEY` | RudderStack analytics write key |
| `GROWTHBOOK_CLIENT_KEY` | GrowthBook feature flag client key |
| `GROWTHBOOK_DECRYPTION_KEY` | GrowthBook decryption key |

For multi-site deployments (via Appwrite):

| Variable | Description |
|----------|-------------|
| `APPWRITE_PROJECT_ID` | Appwrite project ID |
| `APPWRITE_DATABASE_ID` | Appwrite database ID |
| `APPWRITE_API_KEY` | Appwrite API key |

For Cloudflare Pages deployment:

| Variable | Description |
|----------|-------------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare Pages API token |
| `CLOUDFLARE_PROJECT_NAME` | Cloudflare project name |
| `SLACK_WEBHOOK` | Slack webhook URL for build notifications |

> **Never commit secrets to the repository.** Use GitHub Actions secrets or a `.env` file that is listed in `.gitignore`.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Browser                    │
│                                             │
│  React 18 + TypeScript (RSBuild/Webpack)    │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  MobX    │  │ Blockly  │  │ Router   │  │
│  │  Stores  │  │  Engine  │  │  (v6)    │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │        Deriv WebSocket API           │   │
│  │   wss://ws.derivws.com/websockets/v3 │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
         │                      │
         ▼                      ▼
  Cloudflare Pages        Appwrite (configs)
```

**Key technologies:**

- **Framework:** React 18 + TypeScript
- **State:** MobX with a root store pattern (`src/stores/`)
- **Bot Engine:** Blockly with custom Deriv trading blocks (`src/external/bot-skeleton/`)
- **API:** `@deriv/deriv-api` WebSocket client
- **Charts:** `@deriv/deriv-charts`
- **Build:** RSBuild (primary), Webpack (fallback)
- **Testing:** Jest + Testing Library + ts-jest
- **Linting:** ESLint, Prettier, Stylelint
- **Git hooks:** Husky + lint-staged (pre-commit)
- **i18n:** `@deriv-com/translations` + Crowdin
- **Analytics:** RudderStack, Datadog, TrackJS
- **PWA:** Service worker + Web App Manifest

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Main hub: run strategies, view bots |
| `/bot-builder` | Bot Builder | Blockly visual editor |
| `/chart` | Chart | Live market chart viewer |
| `/analysis-tool` | Analysis Tool | Tick and digit frequency analysis |
| `/free-bots` | Free Bots | Browse and load 50+ pre-built bots |
| `/copy-trading` | Copy Trading | Mirror trades from other traders |
| `/tutorials` | Tutorials | Guides, FAQs, onboarding tours |
| `/speedbot` | SpeedBot | Fast-execution bot interface |
| `/hyperbot` | HyperBot | Advanced iframe-embedded bot runner |
| `/smart-trader` | Smart Trader | Legacy smart trader iframe |
| `/dtrader` | DTrader | DTrader interface integration |
| `/diffbot` | DiffBot | Differ contract type bot |
| `/matches` | Matches | Matches/differs analysis |
| `/signals` | Signals | AI-powered trading signals |
| `/tradingview` | TradingView | TradingView chart integration |
| `/pro-tool` | Pro Tool | Advanced professional tools |
| `/dp-tools` | DP Tools | Additional trading tools |
| `/hybrid-bots` | Hybrid Bots | Combined strategy bots |
| `/endpoint` | Endpoint | Dev tool: switch API endpoint |
| `/callback` | Callback | OAuth callback handler |

---

## Trading Bots

The `public/Bots/` directory contains 50+ ready-to-use XML bot files, organised by strategy type:

**Even/Odd strategies**
- Even ODD Bot, Double Even/Odd, Even Odd Master Bot, BINARYTOOL Even/Odd series

**Over/Under strategies**
- Over2, Over4, Over Tech, Under8, OU Bot Upgraded, Master Over, QUANTUM Over/Under AI

**Rise/Fall strategies**
- Alpha Rise & Fall, Premium Rise Fall, One Min Time

**AI/Advanced strategies**
- AI with Entry Point, Alpha AI Two Predictions, Thee Neural Network v3, Advanced Neural Bot, Quantum Over/Under AI v1

**Money Management**
- Money Printer, MoneyBank, Expert Seed, Mode Pro

All bots can be loaded directly into the Bot Builder via the **Free Bots** page or by uploading an XML file manually.

---

## Deployment

### Vercel (Quick Deploy)

The `vercel.json` at the root configures SPA routing rewrites and long-term caching headers. Simply connect your GitHub repo to Vercel and set the environment variables listed above.

- **Build command:** `npm run build`
- **Output directory:** `dist`

### Cloudflare Pages (Production)

Deployments are triggered automatically by GitHub Actions:

- **Production:** Push a tag matching `production_v*`
- **Staging:** Push to the `staging` branch
- **Test links:** Push to any other branch for ephemeral preview URLs

### Multi-site Deployment (Appwrite)

The multi-site workflow reads site configurations (App ID, colors, domain) from an Appwrite database and builds each site in parallel with its own branding. See `DEPLOYMENT_GUIDE.md` for full setup.

---

## CI/CD Workflows

| Workflow file | Trigger | Description |
|---------------|---------|-------------|
| `build-and-deploy-production.yml` | Tag `production_v*` | Build and deploy to Cloudflare Pages (production) |
| `build-and-deploy-staging.yml` | Push to `staging` | Build and deploy to Cloudflare Pages (staging) |
| `build-and-deploy-test.yml` | Push to any branch | Generate test preview link |
| `multi-site-deploy.yml` | Push or manual trigger | Build all branded sites from Appwrite config |
| `sync-translations.yml` | Scheduled / manual | Sync translation strings with Crowdin |
| `codeql.yml` | Push / PR | GitHub CodeQL security scanning |

---

## Known Issues

| Issue | Severity | Details |
|-------|----------|---------|
| Case-sensitive import in `src/main.tsx` | 🔴 Critical | `'./app/AuthWrapper'` should be `'./App/AuthWrapper'` — will break builds on Linux/Vercel |
| Missing PWA icons | 🟡 Moderate | `public/assets/icons/pwa/` folder does not exist; `index.html` references icons there |
| Trailing spaces in folder names | 🟡 Moderate | Many folders under `src/` have trailing spaces (e.g. `src/components/layout `) — can cause issues on Linux |
| Duplicate file | 🟢 Low | `src/utils/help-content/help-strings/index (1).ts` should be removed |
| Missing env vars fallback | 🟢 Low | Build proceeds without env vars but some features (translations, analytics) will silently fail |

---

## Security

- **Secrets:** Always use environment variables or GitHub Actions secrets. Never commit API keys or tokens.
- **Dependencies:** Run `npm audit fix` and `npm dedupe` regularly.
- **Content Security Policy:** A CSP is set in `index.html`. Review and tighten the `script-src` directive before going to production (remove `'unsafe-eval'` if possible).
- **Service Worker:** Only registers on HTTPS contexts. Firefox and Safari are skipped to avoid chunk-loading issues.
- **Lockfile:** Always use `npm ci` in CI to install exactly from `package-lock.json`.

---

## Contributing

1. Fork the repository and create a feature branch
2. Install dependencies: `npm ci`
3. Make your changes
4. Run the full validation suite: `npm run validate`
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/) format
6. Open a Pull Request against `master`

Pre-commit hooks (via Husky) will automatically run lint and format checks before each commit.

---

## License

This project is **UNLICENSED** and private. Do not publish to npm or redistribute without permission.
