-- Add optional phone number column to contact_inquiries
ALTER TABLE contact_inquiries ADD COLUMN phone TEXT NOT NULL DEFAULT '';
