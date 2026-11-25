export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || `project-${Date.now()}`;
}

/**
 * Validates an image URL and automatically converts Google Drive share links
 * into direct embeddable image URLs (`https://lh3.googleusercontent.com/d/<ID>`).
 */
export function normalizeImageUrl(raw: string): { valid: boolean; url: string; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { valid: true, url: '' };
  }

  if (trimmed.startsWith('/')) {
    if (trimmed.startsWith('//')) {
      return { valid: false, url: '', error: 'Protocol-relative URLs are not allowed.' };
    }
    return { valid: true, url: trimmed };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, url: '', error: 'Invalid image URL format.' };
  }

  if (parsed.protocol !== 'https:') {
    return { valid: false, url: '', error: 'Image URL must use HTTPS.' };
  }

  // Google Drive conversion:
  // 1. https://drive.google.com/file/d/<ID>/view...
  // 2. https://drive.google.com/open?id=<ID>
  // 3. https://drive.google.com/uc?id=<ID>&export=view
  if (parsed.hostname === 'drive.google.com') {
    const fileMatch = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const idParam = parsed.searchParams.get('id');
    const fileId = fileMatch?.[1] || idParam;
    if (fileId) {
      return {
        valid: true,
        url: `https://lh3.googleusercontent.com/d/${fileId}`,
      };
    }
  }

  return { valid: true, url: parsed.toString() };
}

export function validateExternalUrl(raw: string, allowMailto = false): { valid: boolean; url: string; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { valid: true, url: '' };
  }
  if (allowMailto && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { valid: true, url: trimmed };
  }
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, url: '', error: 'Invalid URL format.' };
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { valid: false, url: '', error: 'URL must use HTTP or HTTPS.' };
  }
  return { valid: true, url: parsed.toString() };
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get('CF-Connecting-IP') ||
    req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    '127.0.0.1'
  );
}
