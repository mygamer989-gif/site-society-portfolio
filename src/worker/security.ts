const PBKDF2_ITERATIONS = 100_000;
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function toHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const clean = hex.trim();
  if (clean.length % 2 !== 0) {
    throw new Error('Invalid hex length');
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function randomBytes(length = 32): Uint8Array {
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  return buf;
}

export function randomHex(bytes = 32): string {
  return toHex(randomBytes(bytes));
}

export function randomBase32(bytes = 20): string {
  const buf = randomBytes(bytes);
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

export function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  const maxLen = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < maxLen; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return `pbkdf2_sha256$${PBKDF2_ITERATIONS}$${toHex(salt)}$${toHex(derived)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') {
    return false;
  }
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations < 10_000) {
    return false;
  }
  const salt = fromHex(parts[2]);
  const expectedHex = parts[3];

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return timingSafeEqual(toHex(derived), expectedHex);
}

async function deriveAesKey(masterSecret: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(masterSecret));
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function encryptSecret(plaintext: string, masterSecret: string): Promise<string> {
  const iv = randomBytes(12);
  const key = await deriveAesKey(masterSecret);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  return `${toHex(iv)}.${toHex(encrypted)}`;
}

export async function decryptSecret(payload: string, masterSecret: string): Promise<string> {
  const [ivHex, cipherHex] = payload.split('.');
  if (!ivHex || !cipherHex) {
    throw new Error('Malformed encrypted payload');
  }
  const key = await deriveAesKey(masterSecret);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromHex(ivHex) },
    key,
    fromHex(cipherHex)
  );
  return new TextDecoder().decode(decrypted);
}

export function generateRecoveryCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const raw = randomHex(5).toUpperCase();
    codes.push(`${raw.slice(0, 5)}-${raw.slice(5, 10)}`);
  }
  return codes;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export async function checkRateLimit(
  db: D1Database,
  key: string,
  maxAttempts: number,
  windowSeconds: number,
  lockSeconds: number
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const existing = await db
    .prepare('SELECT attempts, window_start, locked_until FROM rate_limits WHERE key = ?')
    .bind(key)
    .first<{ attempts: number; window_start: number; locked_until: number }>();

  if (!existing) {
    await db
      .prepare('INSERT INTO rate_limits (key, attempts, window_start, locked_until) VALUES (?, 1, ?, 0)')
      .bind(key, now)
      .run();
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.locked_until > now) {
    return { allowed: false, retryAfterSeconds: existing.locked_until - now };
  }

  if (now - existing.window_start > windowSeconds) {
    await db
      .prepare('UPDATE rate_limits SET attempts = 1, window_start = ?, locked_until = 0 WHERE key = ?')
      .bind(now, key)
      .run();
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const nextAttempts = existing.attempts + 1;
  if (nextAttempts > maxAttempts) {
    const lockedUntil = now + lockSeconds;
    await db
      .prepare('UPDATE rate_limits SET attempts = ?, locked_until = ? WHERE key = ?')
      .bind(nextAttempts, lockedUntil, key)
      .run();
    return { allowed: false, retryAfterSeconds: lockSeconds };
  }

  await db
    .prepare('UPDATE rate_limits SET attempts = ? WHERE key = ?')
    .bind(nextAttempts, key)
    .run();
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function resetRateLimit(db: D1Database, key: string): Promise<void> {
  await db.prepare('DELETE FROM rate_limits WHERE key = ?').bind(key).run();
}

export async function logSecurityEvent(
  db: D1Database,
  event: string,
  ipAddress: string,
  userAgent: string,
  details = ''
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO security_logs (id, event, ip_address, user_agent, details, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(crypto.randomUUID(), event, ipAddress.slice(0, 64), userAgent.slice(0, 256), details.slice(0, 512), new Date().toISOString())
    .run();
}
