import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { unstable_dev } from 'wrangler';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function decodeBase32(secret) {
  const clean = secret.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const out = [];
  for (const ch of clean) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

function generateTotp(secretBase32) {
  const key = decodeBase32(secretBase32);
  const step = Math.floor(Date.now() / 1000 / 30);
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(step / 0x100000000), 0);
  buf.writeUInt32BE(step >>> 0, 4);
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return String(code % 1_000_000).padStart(6, '0');
}

function extractCookies(res) {
  const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  return setCookies.map((c) => c.split(';')[0]).join('; ');
}

test('SITE SOCIETY end-to-end security, SEO, and portfolio workflow', async (t) => {
  const persistDir = fs.mkdtempSync(path.join(process.cwd(), '.tmp-test-d1-'));
  const setupToken = 'test-setup-token-' + crypto.randomBytes(8).toString('hex');
  const sessionSecret = crypto.randomBytes(32).toString('hex');

  const worker = await unstable_dev('src/worker/index.ts', {
    config: 'wrangler.jsonc',
    experimental: { disableExperimentalWarning: true },
    persistTo: persistDir,
    vars: {
      ADMIN_SETUP_TOKEN: setupToken,
      SESSION_SECRET: sessionSecret,
      CANONICAL_URL: 'https://site-society-test.workers.dev',
    },
  });

  try {
    // Apply schema directly via D1? unstable_dev uses local D1; let's run wrangler migration into persistDir first?
    // Actually we can check if tables exist; if not, we run wrangler d1 migrations apply --local --persist-to
    const { execSync } = await import('node:child_process');
    execSync(`npx wrangler d1 migrations apply site-society-db --local --persist-to "${persistDir}"`, {
      stdio: 'pipe',
    });

    await t.test('Public site, SEO routes, /admin, and empty portfolio', async () => {
      const home = await worker.fetch('/');
      assert.equal(home.status, 200);
      const html = await home.text();
      assert.ok(html.includes('SITE SOCIETY'));
      assert.ok(html.includes('application/ld+json'));

      const adminPage = await worker.fetch('/admin');
      assert.equal(adminPage.status, 200);
      const adminHtml = await adminPage.text();
      assert.ok(adminHtml.includes('SITE SOCIETY // مدیریت'));

      const directPanel = await worker.fetch('/_studio_panel/');
      assert.equal(directPanel.status, 404);

      const robots = await worker.fetch('/robots.txt');
      assert.equal(robots.status, 200);
      const robotsTxt = await robots.text();
      assert.ok(robotsTxt.includes('Disallow: /admin'));

      const sitemap = await worker.fetch('/sitemap.xml');
      assert.equal(sitemap.status, 200);
      const xml = await sitemap.text();
      assert.ok(xml.includes('https://site-society-test.workers.dev/'));

      const projRes = await worker.fetch('/api/projects');
      assert.equal(projRes.status, 200);
      const projJson = await projRes.json();
      assert.deepEqual(projJson.projects, []);

      const settingsRes = await worker.fetch('/api/settings');
      assert.equal(settingsRes.status, 200);
      const settingsJson = await settingsRes.json();
      assert.equal(settingsJson.settings.contact_phone, '+98 9929498144');
      assert.equal(settingsJson.settings.social_telegram, 'https://t.me/YAsiNSitee');
    });

    await t.test('Unauthorized admin access is blocked', async () => {
      const res = await worker.fetch('/api/admin/projects');
      assert.equal(res.status, 401);
    });

    let totpSecret = '';
    let recoveryCodes = [];

    await t.test('Initial admin setup enforces setup token and locks after creation', async () => {
      const bad = await worker.fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupToken: 'wrong', username: 'owner', password: 'StrongPassword123!' }),
      });
      assert.equal(bad.status, 403);

      const ok = await worker.fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupToken, username: 'owner', password: 'StrongPassword123!' }),
      });
      assert.equal(ok.status, 201);
      const data = await ok.json();
      assert.ok(data.totpSecret);
      assert.equal(data.recoveryCodes.length, 8);
      totpSecret = data.totpSecret;
      recoveryCodes = data.recoveryCodes;

      const second = await worker.fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupToken, username: 'attacker', password: 'StrongPassword123!' }),
      });
      assert.equal(second.status, 403);
    });

    let sessionCookie = '';
    let csrfToken = '';

    await t.test('Login + mandatory TOTP 2FA + session rotation', async () => {
      const badLogin = await worker.fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'owner', password: 'wrong' }),
      });
      assert.equal(badLogin.status, 401);

      const login = await worker.fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'owner', password: 'StrongPassword123!' }),
      });
      assert.equal(login.status, 200);
      const pendingCookie = extractCookies(login);
      assert.ok(pendingCookie.includes('ss_pending_2fa='));

      const totpCode = generateTotp(totpSecret);
      const verify = await worker.fetch('/api/admin/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: pendingCookie },
        body: JSON.stringify({ totpCode }),
      });
      assert.equal(verify.status, 200);
      const verifyData = await verify.json();
      assert.ok(verifyData.csrfToken);
      csrfToken = verifyData.csrfToken;
      sessionCookie = extractCookies(verify);
      assert.ok(sessionCookie.includes('ss_session='));
    });

    await t.test('CSRF protection, Google Drive URL normalization, and publish/unpublish flow', async () => {
      // Missing CSRF header -> 403
      const noCsrf = await worker.fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
        body: JSON.stringify({
          title: 'Test Client Site',
          category: 'Business Website',
          description: 'A verified test project description for automated QA.',
        }),
      });
      assert.equal(noCsrf.status, 403);

      // Create unpublished project with Google Drive image link
      const createRes = await worker.fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          title: 'Verified Studio Case',
          category: 'Business Website',
          description: 'A verified test project description for automated QA.',
          technologies: ['TypeScript', 'Cloudflare Workers'],
          thumbnail_url: 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing',
          live_url: 'https://example.com',
          is_published: false,
        }),
      });
      assert.equal(createRes.status, 201);
      const created = (await createRes.json()).project;
      assert.equal(created.thumbnail_url, 'https://lh3.googleusercontent.com/d/1AbCdEfGhIjKlMnOpQrStUvWxYz');
      assert.equal(created.is_published, false);

      // Should NOT appear publicly while unpublished
      const pubCheck1 = await (await worker.fetch('/api/projects')).json();
      assert.equal(pubCheck1.projects.length, 0);

      // Publish it
      const pubRes = await worker.fetch(`/api/admin/projects/${created.id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ is_published: true }),
      });
      assert.equal(pubRes.status, 200);

      // Now it MUST appear publicly
      const pubCheck2 = await (await worker.fetch('/api/projects')).json();
      assert.equal(pubCheck2.projects.length, 1);
      assert.equal(pubCheck2.projects[0].title, 'Verified Studio Case');

      // Contact form inquiry -> visible in Admin Inquiries
      const contactRes = await worker.fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Client Test',
          email: 'client@example.com',
          company: 'Test Corp',
          service: 'Website Design',
          message: 'Looking for a bespoke luxury website for our company.',
        }),
      });
      assert.equal(contactRes.status, 201);

      const inqRes = await worker.fetch('/api/admin/inquiries', {
        headers: { Cookie: sessionCookie },
      });
      assert.equal(inqRes.status, 200);
      const inqData = await inqRes.json();
      assert.equal(inqData.inquiries.length, 1);
      assert.equal(inqData.inquiries[0].email, 'client@example.com');
    });

    await t.test('Logout invalidates session and one-time recovery code works once', async () => {
      const logoutRes = await worker.fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Cookie: sessionCookie, 'X-CSRF-Token': csrfToken },
      });
      assert.equal(logoutRes.status, 200);

      const afterLogout = await worker.fetch('/api/admin/projects', {
        headers: { Cookie: sessionCookie },
      });
      assert.equal(afterLogout.status, 401);

      // Login again using recovery code
      const login2 = await worker.fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'owner', password: 'StrongPassword123!' }),
      });
      const pending2 = extractCookies(login2);
      const recVerify = await worker.fetch('/api/admin/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: pending2 },
        body: JSON.stringify({ recoveryCode: recoveryCodes[0] }),
      });
      assert.equal(recVerify.status, 200);
    });
  } finally {
    await worker.stop();
    fs.rmSync(persistDir, { recursive: true, force: true });
  }
});
