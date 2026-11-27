-- Add 7th verified portfolio project: Soroush Digital Academy
INSERT OR REPLACE INTO projects (
  id, slug, title, category, description, technologies, thumbnail_url, live_url, display_order, is_published, created_at, updated_at
) VALUES (
  'proj-soroush-07',
  'soroush-online-academy',
  'Soroush Digital Academy',
  'Online Education Platform',
  'Bilingual (FA/EN) online digital academy platform featuring course catalog, student experience, and Cloudflare Workers + D1 backend.',
  '["React","TypeScript","Cloudflare Workers","D1"]',
  '/previews/soroush.png',
  'https://soroush-online-academy.mygamer989.workers.dev',
  7,
  1,
  '2026-11-27T20:56:00.000Z',
  '2026-11-27T20:56:00.000Z'
);
