-- Seed the 6 verified, deployed portfolio projects from D:\سایت
INSERT OR REPLACE INTO projects (
  id, slug, title, category, description, technologies, thumbnail_url, live_url, display_order, is_published, created_at, updated_at
) VALUES
  (
    'proj-corebench-01',
    'corebench-pc-hardware',
    'CoreBench Hardware Lab',
    'E-commerce & Admin Platform',
    'Bilingual (FA/EN) PC hardware storefront and benchmark platform powered by Cloudflare Workers, D1, and an integrated admin dashboard.',
    '["React","TypeScript","Cloudflare Workers","D1"]',
    '/previews/corebench.svg',
    'https://corebench-pc-hardware.mygamer989.workers.dev',
    1,
    1,
    '2026-11-25T23:15:00.000Z',
    '2026-11-25T23:15:00.000Z'
  ),
  (
    'proj-ravagh-02',
    'ravagh-architecture-studio',
    'Ravagh Spatial Studio',
    'Architecture Practice',
    'Bilingual (FA/EN) spatial architecture studio website featuring editorial project curation, inquiry workflows, and edge deployment.',
    '["React","TypeScript","Cloudflare Workers","D1"]',
    '/previews/ravagh.svg',
    'https://ravagh-architecture-studio.mygamer989.workers.dev',
    2,
    1,
    '2026-11-25T23:15:00.000Z',
    '2026-11-25T23:15:00.000Z'
  ),
  (
    'proj-kohan-03',
    'kohan-roastery-bakery',
    'Kohan Roastery & Bakehouse',
    'Brand & E-commerce',
    'Bilingual (FA/EN) specialty coffee roastery and sourdough bakehouse website with product catalog and management panel.',
    '["React","TypeScript","Cloudflare Workers","D1"]',
    '/previews/kohan.svg',
    'https://kohan-roastery-bakery.mygamer989.workers.dev',
    3,
    1,
    '2026-11-25T23:15:00.000Z',
    '2026-11-25T23:15:00.000Z'
  ),
  (
    'proj-mina-04',
    'mina-dental-clinic',
    'Mina Dental & Implant Center',
    'Medical & Booking',
    'Bilingual (FA/EN) dental and implant center website with treatment showcase, appointment requests, and admin management.',
    '["React","TypeScript","Cloudflare Workers","D1"]',
    '/previews/mina.svg',
    'https://mina-dental-clinic.mygamer989.workers.dev',
    4,
    1,
    '2026-11-25T23:15:00.000Z',
    '2026-11-25T23:15:00.000Z'
  ),
  (
    'proj-tracedock-05',
    'tracedock-edge-telemetry',
    'TraceDock Edge Telemetry',
    'Developer SaaS',
    'Bilingual (FA/EN) developer SaaS platform for edge observability and telemetry built on Cloudflare Workers and D1.',
    '["React","TypeScript","Cloudflare Workers","D1"]',
    '/previews/tracedock.svg',
    'https://tracedock-edge-telemetry.mygamer989.workers.dev',
    5,
    1,
    '2026-11-25T23:15:00.000Z',
    '2026-11-25T23:15:00.000Z'
  ),
  (
    'proj-sareng-06',
    'sareng-horology-leather-atelier',
    'Sareng Horology & Leather Atelier',
    'Luxury Atelier',
    'Bilingual (FA/EN) luxury horology and handcrafted leather atelier website built with Hono SSR, React Admin, and Cloudflare D1.',
    '["Hono SSR","React","Cloudflare Workers","D1"]',
    '/previews/sareng.svg',
    'https://sareng-horology-leather-atelier.mygamer989.workers.dev',
    6,
    1,
    '2026-11-25T23:15:00.000Z',
    '2026-11-25T23:15:00.000Z'
  );
