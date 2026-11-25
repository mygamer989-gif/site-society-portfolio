# SITE SOCIETY — Official Portfolio & Studio Admin

Bespoke luxury digital studio website for **SITE SOCIETY**, engineered for **zero-budget deployment** on **Cloudflare Workers + Workers Static Assets + Cloudflare D1**.

## Architecture

- **Frontend (`/`)**: Luxury editorial design in Obsidian Black, Warm Charcoal, Champagne Gold, and Soft Ivory (`public/index.html`, `public/styles.css`, `public/app.js`).
- **Private Admin Dashboard (`/admin`)**: Owner-only management interface for portfolio projects, confirmed contact details, inquiries, and security logs (`public/admin.html`, `public/admin.js`).
- **Edge Backend (`src/worker/index.ts`)**: Hono-based Cloudflare Worker handling public APIs, technical SEO (`/robots.txt`, `/sitemap.xml`), and authenticated admin endpoints.
- **Database (`migrations/0001_init.sql`)**: Cloudflare D1 (SQLite) — free tier, no credit card required.
- **Media Strategy**: Project thumbnails use HTTPS image URLs or Google Drive share links (automatically normalized to direct embed URLs), avoiding paid storage or credit-card-gated buckets.

## Security Model

- **No public registration**: Initial admin setup requires a one-time `ADMIN_SETUP_TOKEN` secret and is permanently locked once one admin exists.
- **Password Hashing**: PBKDF2-SHA256 (`100,000` iterations via native Web Crypto API, optimized for Cloudflare Workers Free Tier's 10ms CPU limit).
- **Mandatory 2FA**: RFC 6238 TOTP (compatible with Google Authenticator and standard TOTP apps), AES-GCM encrypted at rest using `SESSION_SECRET`.
- **One-Time Recovery Codes**: 8 codes generated on setup, stored as SHA-256 hashes, invalidated upon use.
- **Session & CSRF Protection**: `HttpOnly`, `Secure`, `SameSite=Lax` session cookies, session rotation after 2FA, `X-CSRF-Token` + `Origin` verification on mutations, D1-backed rate limiting, and security event logging.
- **Zero Secrets in Git**: `.dev.vars` and `.env*` are gitignored. Never commit secrets, tokens, or private client files.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.dev.vars` from `.env.example` with strong random secrets:
   ```bash
   cp .env.example .dev.vars
   ```
3. Apply local D1 migrations:
   ```bash
   npm run db:migrate:local
   ```
4. Start the local Worker + Static Assets server:
   ```bash
   npm run dev
   ```
5. Run automated verification tests:
   ```bash
   npm test
   ```

## Zero-Budget Cloudflare Deployment

1. Create a free D1 database in your Cloudflare account and update `database_id` in `wrangler.jsonc`:
   ```bash
   npx wrangler d1 create site-society-db
   ```
2. Apply remote migrations:
   ```bash
   npm run db:migrate:remote
   ```
3. Set production secrets (never stored in Git):
   ```bash
   npx wrangler secret put ADMIN_SETUP_TOKEN
   npx wrangler secret put SESSION_SECRET
   ```
   *(Optional)* For Cloudflare Turnstile on the contact form:
   ```bash
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```
5. Visit `https://<your-worker>.workers.dev/admin` once to complete initial owner setup and save your TOTP secret & recovery codes.
