-- Seed confirmed contact details and first verified portfolio showcase (VECTRA // PC HARDWARE)

INSERT INTO site_settings (key, value, updated_at)
VALUES
  ('contact_phone', '+98 9929498144', '2026-11-25T16:45:00.000Z'),
  ('social_telegram', 'https://t.me/YAsiNSitee', '2026-11-25T16:45:00.000Z')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = excluded.updated_at;

INSERT OR IGNORE INTO projects (
  id,
  slug,
  title,
  category,
  description,
  technologies,
  thumbnail_url,
  live_url,
  display_order,
  is_published,
  created_at,
  updated_at
) VALUES (
  'vectra-pc-hardware-001',
  'vectra-pc-hardware',
  'VECTRA // PC HARDWARE',
  'E-commerce Showcase',
  'Flagship bilingual PC components and custom workstation hardware e-commerce showcase with interactive filtering, dual theme, and scroll-driven animations.',
  '["HTML5","Tailwind CSS","JavaScript","Bilingual FA/EN"]',
  '/showcase/vectra-pc/preview.svg',
  '/showcase/vectra-pc/',
  1,
  1,
  '2026-11-25T16:45:00.000Z',
  '2026-11-25T16:45:00.000Z'
);
