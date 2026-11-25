export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ADMIN_SETUP_TOKEN?: string;
  SESSION_SECRET: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CANONICAL_URL?: string;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  thumbnail_url: string;
  live_url: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicSiteSettings {
  contact_email: string;
  social_github: string;
  social_x: string;
  social_linkedin: string;
  social_instagram: string;
  canonical_url: string;
  turnstile_site_key: string;
}
