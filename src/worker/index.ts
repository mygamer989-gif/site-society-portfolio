import { Hono, type Context } from 'hono';
import type { Env, ProjectRecord } from '../shared/types';
import {
  checkRateLimit,
  decryptSecret,
  encryptSecret,
  generateRecoveryCodes,
  hashPassword,
  logSecurityEvent,
  randomBase32,
  randomHex,
  resetRateLimit,
  sha256Hex,
  timingSafeEqual,
  verifyPassword,
} from './security';
import { buildOtpAuthUri, verifyTotp } from './totp';
import { getClientIp, normalizeImageUrl, slugify, validateExternalUrl } from './utils';

type AppVariables = {
  adminId: string;
  adminUsername: string;
  sessionId: string;
  csrfToken: string;
};

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

const SESSION_COOKIE = 'ss_session';
const PENDING_2FA_COOKIE = 'ss_pending_2fa';

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const out: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    out[key] = decodeURIComponent(val);
  }
  return out;
}

function buildCookie(name: string, value: string, maxAgeSeconds: number, isHttps: boolean): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isHttps) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

function isHttpsRequest(req: Request): boolean {
  const url = new URL(req.url);
  return url.protocol === 'https:' || req.headers.get('X-Forwarded-Proto') === 'https';
}

function mapProjectRow(row: Record<string, unknown>): ProjectRecord {
  let technologies: string[] = [];
  try {
    const parsed = JSON.parse(String(row.technologies || '[]'));
    if (Array.isArray(parsed)) {
      technologies = parsed.map(String).filter(Boolean);
    }
  } catch {
    technologies = [];
  }
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    category: String(row.category),
    description: String(row.description),
    technologies,
    thumbnail_url: String(row.thumbnail_url || ''),
    live_url: String(row.live_url || ''),
    display_order: Number(row.display_order || 0),
    is_published: Number(row.is_published) === 1,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

async function getSettingsMap(db: D1Database): Promise<Record<string, string>> {
  const rows = await db.prepare('SELECT key, value FROM site_settings').all<{ key: string; value: string }>();
  const map: Record<string, string> = {};
  for (const r of rows.results) {
    map[r.key] = r.value;
  }
  return map;
}

// Security headers on all Worker responses
app.use('*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (isHttpsRequest(c.req.raw)) {
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  if (c.req.path.startsWith('/admin') || c.req.path.startsWith('/api')) {
    c.header('X-Robots-Tag', 'noindex, nofollow');
    c.header('Cache-Control', 'no-store');
  }
});

// Require authenticated admin session + CSRF for protected admin routes
async function requireAdmin(
  c: Context<{ Bindings: Env; Variables: AppVariables }>,
  next: () => Promise<void>
) {
  const cookies = parseCookies(c.req.header('Cookie'));
  const rawToken = cookies[SESSION_COOKIE];
  if (!rawToken) {
    return c.json({ error: 'Authentication required.' }, 401);
  }
  const tokenHash = await sha256Hex(rawToken);
  const nowIso = new Date().toISOString();

  const session = await c.env.DB.prepare(
    `SELECT s.id, s.admin_id, s.csrf_token, s.expires_at, a.username
     FROM sessions s
     JOIN admin_users a ON a.id = s.admin_id
     WHERE s.id = ? AND s.expires_at > ?`
  )
    .bind(tokenHash, nowIso)
    .first<{ id: string; admin_id: string; csrf_token: string; expires_at: string; username: string }>();

  if (!session) {
    return c.json({ error: 'Session expired or invalid.' }, 401);
  }

  const method = c.req.method.toUpperCase();
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    const csrfHeader = c.req.header('X-CSRF-Token') || '';
    if (!csrfHeader || !timingSafeEqual(csrfHeader, session.csrf_token)) {
      return c.json({ error: 'Invalid CSRF token.' }, 403);
    }
    const origin = c.req.header('Origin');
    if (origin) {
      const reqOrigin = new URL(c.req.url).origin;
      if (origin !== reqOrigin) {
        return c.json({ error: 'Cross-origin mutation blocked.' }, 403);
      }
    }
  }

  c.set('adminId', session.admin_id);
  c.set('adminUsername', session.username);
  c.set('sessionId', session.id);
  c.set('csrfToken', session.csrf_token);
  await next();
}

// ---------------- SEO ROUTES ----------------

app.get('/robots.txt', async (c) => {
  const settings = await getSettingsMap(c.env.DB);
  const canonical = (settings.canonical_url || c.env.CANONICAL_URL || new URL(c.req.url).origin).replace(/\/$/, '');
  const body = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${canonical}/sitemap.xml\n`;
  return c.text(body, 200, { 'Content-Type': 'text/plain; charset=utf-8' });
});

app.get('/sitemap.xml', async (c) => {
  const settings = await getSettingsMap(c.env.DB);
  const canonical = (settings.canonical_url || c.env.CANONICAL_URL || new URL(c.req.url).origin).replace(/\/$/, '');
  const lastmod = new Date().toISOString().split('T')[0];

  const published = await c.env.DB.prepare(
    'SELECT live_url, updated_at FROM projects WHERE is_published = 1 AND live_url LIKE "/%"'
  ).all<{ live_url: string; updated_at: string }>();

  const projectUrls = published.results
    .map(
      (p) => `  <url>
    <loc>${canonical}${p.live_url}</loc>
    <lastmod>${p.updated_at.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${canonical}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${projectUrls}
</urlset>`;
  return c.text(xml, 200, { 'Content-Type': 'application/xml; charset=utf-8' });
});

// ---------------- PUBLIC API ----------------

app.get('/api/health', (c) => c.json({ ok: true, service: 'site-society' }));

app.get('/api/projects', async (c) => {
  const rows = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE is_published = 1 ORDER BY display_order ASC, created_at DESC'
  ).all<Record<string, unknown>>();
  return c.json({ projects: rows.results.map(mapProjectRow) });
});

app.get('/api/settings', async (c) => {
  const settings = await getSettingsMap(c.env.DB);
  const canonical = settings.canonical_url || c.env.CANONICAL_URL || new URL(c.req.url).origin;
  return c.json({
    settings: {
      contact_email: settings.contact_email || '',
      contact_phone: settings.contact_phone || '',
      social_telegram: settings.social_telegram || '',
      social_github: settings.social_github || '',
      social_x: settings.social_x || '',
      social_linkedin: settings.social_linkedin || '',
      social_instagram: settings.social_instagram || '',
      canonical_url: canonical,
      turnstile_site_key: c.env.TURNSTILE_SITE_KEY || '',
    },
  });
});

app.post('/api/contact', async (c) => {
  const ip = getClientIp(c.req.raw);
  const limit = await checkRateLimit(c.env.DB, `contact:${ip}`, 5, 3600, 3600);
  if (!limit.allowed) {
    return c.json({ error: 'Too many requests. Please try again later.' }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload.' }, 400);
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const company = String(body.company || '').trim().slice(0, 120);
  const service = String(body.service || '').trim().slice(0, 120);
  const message = String(body.message || '').trim();
  const turnstileToken = String(body.turnstileToken || '').trim();

  if (name.length < 2 || name.length > 100) {
    return c.json({ error: 'Please provide a valid name (2-100 characters).' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
    return c.json({ error: 'Please provide a valid email address.' }, 400);
  }
  if (message.length < 10 || message.length > 3000) {
    return c.json({ error: 'Message must be between 10 and 3000 characters.' }, 400);
  }

  if (c.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return c.json({ error: 'Verification challenge is required.' }, 400);
    }
    const verifyResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: c.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip: ip,
      }),
    });
    const verifyData = (await verifyResp.json()) as { success?: boolean };
    if (!verifyData.success) {
      return c.json({ error: 'Verification challenge failed.' }, 400);
    }
  }

  await c.env.DB.prepare(
    'INSERT INTO contact_inquiries (id, name, email, company, service, message, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(crypto.randomUUID(), name, email, company, service, message, ip, new Date().toISOString())
    .run();

  return c.json({ ok: true, message: 'Inquiry received.' }, 201);
});

// ---------------- ADMIN AUTH & SETUP ----------------

app.get('/api/admin/status', async (c) => {
  const adminCountRow = await c.env.DB.prepare('SELECT COUNT(*) as cnt FROM admin_users').first<{ cnt: number }>();
  const needsSetup = !adminCountRow || adminCountRow.cnt === 0;

  const cookies = parseCookies(c.req.header('Cookie'));
  const rawToken = cookies[SESSION_COOKIE];
  if (!rawToken) {
    return c.json({ needsSetup, authenticated: false });
  }
  const tokenHash = await sha256Hex(rawToken);
  const session = await c.env.DB.prepare(
    `SELECT s.csrf_token, a.username
     FROM sessions s
     JOIN admin_users a ON a.id = s.admin_id
     WHERE s.id = ? AND s.expires_at > ?`
  )
    .bind(tokenHash, new Date().toISOString())
    .first<{ csrf_token: string; username: string }>();

  if (!session) {
    return c.json({ needsSetup, authenticated: false });
  }

  return c.json({
    needsSetup,
    authenticated: true,
    username: session.username,
    csrfToken: session.csrf_token,
  });
});

app.post('/api/admin/setup', async (c) => {
  const ip = getClientIp(c.req.raw);
  const ua = c.req.header('User-Agent') || '';

  const adminCountRow = await c.env.DB.prepare('SELECT COUNT(*) as cnt FROM admin_users').first<{ cnt: number }>();
  if (adminCountRow && adminCountRow.cnt > 0) {
    return c.json({ error: 'Administrator is already configured.' }, 403);
  }

  if (!c.env.ADMIN_SETUP_TOKEN || !c.env.SESSION_SECRET) {
    return c.json({ error: 'Server setup secrets are not configured.' }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload.' }, 400);
  }

  const setupToken = String(body.setupToken || '');
  const username = String(body.username || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!setupToken || !timingSafeEqual(setupToken, c.env.ADMIN_SETUP_TOKEN)) {
    await logSecurityEvent(c.env.DB, 'ADMIN_SETUP_INVALID_TOKEN', ip, ua);
    return c.json({ error: 'Invalid setup token.' }, 403);
  }
  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    return c.json({ error: 'Username must be 3-32 characters (a-z, 0-9, ., _, -).' }, 400);
  }
  if (password.length < 12 || password.length > 128) {
    return c.json({ error: 'Password must be between 12 and 128 characters.' }, 400);
  }

  const adminId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  const totpSecret = randomBase32(20);
  const totpSecretEnc = await encryptSecret(totpSecret, c.env.SESSION_SECRET);
  const recoveryCodes = generateRecoveryCodes(8);
  const nowIso = new Date().toISOString();

  await c.env.DB.prepare(
    'INSERT INTO admin_users (id, username, password_hash, totp_secret_enc, created_at) VALUES (?, ?, ?, ?, ?)'
  )
    .bind(adminId, username, passwordHash, totpSecretEnc, nowIso)
    .run();

  for (const code of recoveryCodes) {
    const codeHash = await sha256Hex(code);
    await c.env.DB.prepare('INSERT INTO recovery_codes (id, admin_id, code_hash) VALUES (?, ?, ?)')
      .bind(crypto.randomUUID(), adminId, codeHash)
      .run();
  }

  await logSecurityEvent(c.env.DB, 'ADMIN_INITIAL_SETUP', ip, ua, `username=${username}`);

  return c.json(
    {
      ok: true,
      totpSecret,
      otpauthUri: buildOtpAuthUri(username, totpSecret, 'SITE SOCIETY'),
      recoveryCodes,
    },
    201
  );
});

app.post('/api/admin/login', async (c) => {
  const ip = getClientIp(c.req.raw);
  const ua = c.req.header('User-Agent') || '';

  const limit = await checkRateLimit(c.env.DB, `login:${ip}`, 5, 900, 900);
  if (!limit.allowed) {
    await logSecurityEvent(c.env.DB, 'LOGIN_RATE_LIMITED', ip, ua);
    return c.json({ error: `Too many login attempts. Try again in ${limit.retryAfterSeconds}s.` }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload.' }, 400);
  }

  const username = String(body.username || '').trim().toLowerCase();
  const password = String(body.password || '');

  const user = await c.env.DB.prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ?')
    .bind(username)
    .first<{ id: string; username: string; password_hash: string }>();

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    await logSecurityEvent(c.env.DB, 'LOGIN_FAILED', ip, ua, `username=${username}`);
    return c.json({ error: 'Invalid credentials.' }, 401);
  }

  await resetRateLimit(c.env.DB, `login:${ip}`);

  const rawPendingToken = randomHex(32);
  const pendingHash = await sha256Hex(rawPendingToken);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  await c.env.DB.prepare('DELETE FROM pending_2fa WHERE expires_at <= ?').bind(new Date().toISOString()).run();
  await c.env.DB.prepare('INSERT INTO pending_2fa (id, admin_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .bind(pendingHash, user.id, expiresAt, new Date().toISOString())
    .run();

  await logSecurityEvent(c.env.DB, 'LOGIN_PASSWORD_OK', ip, ua, `username=${username}`);

  c.header('Set-Cookie', buildCookie(PENDING_2FA_COOKIE, rawPendingToken, 300, isHttpsRequest(c.req.raw)));
  return c.json({ ok: true, requires2fa: true });
});

app.post('/api/admin/verify-2fa', async (c) => {
  const ip = getClientIp(c.req.raw);
  const ua = c.req.header('User-Agent') || '';

  const limit = await checkRateLimit(c.env.DB, `otp:${ip}`, 5, 900, 900);
  if (!limit.allowed) {
    await logSecurityEvent(c.env.DB, 'OTP_RATE_LIMITED', ip, ua);
    return c.json({ error: `Too many verification attempts. Try again in ${limit.retryAfterSeconds}s.` }, 429);
  }

  const cookies = parseCookies(c.req.header('Cookie'));
  const rawPendingToken = cookies[PENDING_2FA_COOKIE];
  if (!rawPendingToken) {
    return c.json({ error: '2FA session expired. Please sign in again.' }, 401);
  }

  const pendingHash = await sha256Hex(rawPendingToken);
  const pending = await c.env.DB.prepare(
    `SELECT p.id, p.admin_id, a.username, a.totp_secret_enc
     FROM pending_2fa p
     JOIN admin_users a ON a.id = p.admin_id
     WHERE p.id = ? AND p.expires_at > ?`
  )
    .bind(pendingHash, new Date().toISOString())
    .first<{ id: string; admin_id: string; username: string; totp_secret_enc: string }>();

  if (!pending) {
    return c.json({ error: '2FA session expired. Please sign in again.' }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload.' }, 400);
  }

  const totpCode = String(body.totpCode || '').trim();
  const recoveryCode = String(body.recoveryCode || '').trim().toUpperCase();

  let verified = false;
  let methodUsed = 'totp';

  if (totpCode) {
    const secret = await decryptSecret(pending.totp_secret_enc, c.env.SESSION_SECRET);
    verified = await verifyTotp(secret, totpCode, 1);
  } else if (recoveryCode) {
    methodUsed = 'recovery_code';
    const codeHash = await sha256Hex(recoveryCode);
    const rec = await c.env.DB.prepare(
      'SELECT id FROM recovery_codes WHERE admin_id = ? AND code_hash = ? AND used_at IS NULL'
    )
      .bind(pending.admin_id, codeHash)
      .first<{ id: string }>();

    if (rec) {
      verified = true;
      await c.env.DB.prepare('UPDATE recovery_codes SET used_at = ? WHERE id = ?')
        .bind(new Date().toISOString(), rec.id)
        .run();
    }
  }

  if (!verified) {
    await logSecurityEvent(c.env.DB, '2FA_FAILED', ip, ua, `method=${methodUsed}`);
    return c.json({ error: 'Invalid verification code.' }, 401);
  }

  await resetRateLimit(c.env.DB, `otp:${ip}`);
  await c.env.DB.prepare('DELETE FROM pending_2fa WHERE id = ?').bind(pending.id).run();

  // Session rotation: create fresh session token
  const rawSession = randomHex(32);
  const sessionHash = await sha256Hex(rawSession);
  const csrfToken = randomHex(24);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await c.env.DB.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(new Date().toISOString()).run();
  await c.env.DB.prepare(
    'INSERT INTO sessions (id, admin_id, csrf_token, ip_address, user_agent, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(sessionHash, pending.admin_id, csrfToken, ip, ua.slice(0, 256), expiresAt, new Date().toISOString())
    .run();

  await logSecurityEvent(c.env.DB, 'LOGIN_SUCCESS', ip, ua, `method=${methodUsed}`);

  const https = isHttpsRequest(c.req.raw);
  c.header('Set-Cookie', buildCookie(PENDING_2FA_COOKIE, '', 0, https));
  c.res.headers.append('Set-Cookie', buildCookie(SESSION_COOKIE, rawSession, 86400, https));

  return c.json({ ok: true, username: pending.username, csrfToken });
});

app.post('/api/admin/logout', requireAdmin, async (c) => {
  const sessionId = c.get('sessionId');
  await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
  await logSecurityEvent(c.env.DB, 'LOGOUT', getClientIp(c.req.raw), c.req.header('User-Agent') || '');
  c.header('Set-Cookie', buildCookie(SESSION_COOKIE, '', 0, isHttpsRequest(c.req.raw)));
  return c.json({ ok: true });
});

// ---------------- ADMIN PROTECTED CRUD ----------------

app.get('/api/admin/projects', requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare(
    'SELECT * FROM projects ORDER BY display_order ASC, created_at DESC'
  ).all<Record<string, unknown>>();
  return c.json({ projects: rows.results.map(mapProjectRow) });
});

app.post('/api/admin/projects', requireAdmin, async (c) => {
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload.' }, 400);
  }

  const title = String(body.title || '').trim();
  const category = String(body.category || '').trim();
  const description = String(body.description || '').trim();
  const rawImageUrl = String(body.thumbnail_url || '');
  const rawLiveUrl = String(body.live_url || '');
  const displayOrder = Number(body.display_order || 0);
  const isPublished = body.is_published === true || body.is_published === 1 ? 1 : 0;

  if (title.length < 2 || title.length > 120) {
    return c.json({ error: 'Project title must be 2-120 characters.' }, 400);
  }
  if (category.length < 2 || category.length > 80) {
    return c.json({ error: 'Project category must be 2-80 characters.' }, 400);
  }
  if (description.length < 10 || description.length > 1000) {
    return c.json({ error: 'Description must be 10-1000 characters.' }, 400);
  }

  const imgCheck = normalizeImageUrl(rawImageUrl);
  if (!imgCheck.valid) {
    return c.json({ error: imgCheck.error || 'Invalid thumbnail URL.' }, 400);
  }

  const liveCheck = validateExternalUrl(rawLiveUrl);
  if (!liveCheck.valid) {
    return c.json({ error: liveCheck.error || 'Invalid live demo URL.' }, 400);
  }

  const techs = Array.isArray(body.technologies)
    ? body.technologies.map((t) => String(t).trim()).filter(Boolean).slice(0, 15)
    : String(body.technologies || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 15);

  const id = crypto.randomUUID();
  const baseSlug = slugify(title);
  const slug = `${baseSlug}-${id.slice(0, 6)}`;
  const nowIso = new Date().toISOString();

  await c.env.DB.prepare(
    `INSERT INTO projects (id, slug, title, category, description, technologies, thumbnail_url, live_url, display_order, is_published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      slug,
      title,
      category,
      description,
      JSON.stringify(techs),
      imgCheck.url,
      liveCheck.url,
      Number.isFinite(displayOrder) ? displayOrder : 0,
      isPublished,
      nowIso,
      nowIso
    )
    .run();

  const created = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first<Record<string, unknown>>();
  return c.json({ project: created ? mapProjectRow(created) : null }, 201);
});

app.put('/api/admin/projects/:id', requireAdmin, async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!existing) {
    return c.json({ error: 'Project not found.' }, 404);
  }

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload.' }, 400);
  }

  const title = String(body.title ?? existing.title).trim();
  const category = String(body.category ?? existing.category).trim();
  const description = String(body.description ?? existing.description).trim();
  const rawImageUrl = String(body.thumbnail_url ?? existing.thumbnail_url);
  const rawLiveUrl = String(body.live_url ?? existing.live_url);
  const displayOrder = Number(body.display_order ?? existing.display_order);
  const isPublished =
    body.is_published !== undefined ? (body.is_published === true || body.is_published === 1 ? 1 : 0) : Number(existing.is_published);

  if (title.length < 2 || title.length > 120) {
    return c.json({ error: 'Project title must be 2-120 characters.' }, 400);
  }
  if (category.length < 2 || category.length > 80) {
    return c.json({ error: 'Project category must be 2-80 characters.' }, 400);
  }
  if (description.length < 10 || description.length > 1000) {
    return c.json({ error: 'Description must be 10-1000 characters.' }, 400);
  }

  const imgCheck = normalizeImageUrl(rawImageUrl);
  if (!imgCheck.valid) {
    return c.json({ error: imgCheck.error || 'Invalid thumbnail URL.' }, 400);
  }
  const liveCheck = validateExternalUrl(rawLiveUrl);
  if (!liveCheck.valid) {
    return c.json({ error: liveCheck.error || 'Invalid live demo URL.' }, 400);
  }

  const techs =
    body.technologies !== undefined
      ? Array.isArray(body.technologies)
        ? body.technologies.map((t) => String(t).trim()).filter(Boolean).slice(0, 15)
        : String(body.technologies || '')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 15)
      : JSON.parse(String(existing.technologies || '[]'));

  await c.env.DB.prepare(
    `UPDATE projects
     SET title = ?, category = ?, description = ?, technologies = ?, thumbnail_url = ?, live_url = ?, display_order = ?, is_published = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(
      title,
      category,
      description,
      JSON.stringify(techs),
      imgCheck.url,
      liveCheck.url,
      Number.isFinite(displayOrder) ? displayOrder : 0,
      isPublished,
      new Date().toISOString(),
      id
    )
    .run();

  const updated = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first<Record<string, unknown>>();
  return c.json({ project: updated ? mapProjectRow(updated) : null });
});

app.patch('/api/admin/projects/:id/publish', requireAdmin, async (c) => {
  const id = c.req.param('id');
  let body: { is_published?: boolean };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload.' }, 400);
  }
  const nextVal = body.is_published ? 1 : 0;
  const res = await c.env.DB.prepare('UPDATE projects SET is_published = ?, updated_at = ? WHERE id = ?')
    .bind(nextVal, new Date().toISOString(), id)
    .run();
  if (!res.meta.changes) {
    return c.json({ error: 'Project not found.' }, 404);
  }
  return c.json({ ok: true, is_published: Boolean(nextVal) });
});

app.delete('/api/admin/projects/:id', requireAdmin, async (c) => {
  const id = c.req.param('id');
  const res = await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
  if (!res.meta.changes) {
    return c.json({ error: 'Project not found.' }, 404);
  }
  return c.json({ ok: true });
});

app.get('/api/admin/settings', requireAdmin, async (c) => {
  const settings = await getSettingsMap(c.env.DB);
  return c.json({ settings });
});

app.put('/api/admin/settings', requireAdmin, async (c) => {
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload.' }, 400);
  }

  const allowedKeys = [
    'contact_email',
    'contact_phone',
    'social_telegram',
    'social_github',
    'social_x',
    'social_linkedin',
    'social_instagram',
    'canonical_url',
  ];

  const nowIso = new Date().toISOString();
  for (const key of allowedKeys) {
    if (body[key] === undefined) continue;
    const raw = String(body[key]).trim();
    const check =
      key === 'contact_phone'
        ? { valid: raw.length <= 40, url: raw, error: 'Phone too long.' }
        : validateExternalUrl(raw, key === 'contact_email');
    if (!check.valid) {
      return c.json({ error: `Invalid value for ${key}: ${check.error}` }, 400);
    }
    await c.env.DB.prepare(
      `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
      .bind(key, check.url, nowIso)
      .run();
  }

  return c.json({ ok: true, settings: await getSettingsMap(c.env.DB) });
});

app.get('/api/admin/inquiries', requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM contact_inquiries ORDER BY created_at DESC LIMIT 100').all();
  return c.json({ inquiries: rows.results });
});

app.delete('/api/admin/inquiries/:id', requireAdmin, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM contact_inquiries WHERE id = ?').bind(id).run();
  return c.json({ ok: true });
});

app.get('/api/admin/security-logs', requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM security_logs ORDER BY created_at DESC LIMIT 50').all();
  return c.json({ logs: rows.results });
});

// Block direct access to internal panel folder
app.all('/_studio_panel*', (c) => c.notFound());

// Serve Admin Dashboard HTML cleanly at /admin without redirect loops
app.get('/admin', async (c) => {
  const url = new URL(c.req.url);
  url.pathname = '/_studio_panel/';
  return c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw));
});

app.get('/admin/', async (c) => {
  const url = new URL(c.req.url);
  url.pathname = '/_studio_panel/';
  return c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw));
});

// Fallback to Static Assets
app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
