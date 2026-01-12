-- Fix Footer Display Issue
-- Checks if the table exists, ensures a row exists, and re-applies Public Read Policy

-- 1. Ensure Table Exists (Just in case)
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    social_tiktok VARCHAR(255),
    social_instagram VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_singleton BOOLEAN DEFAULT true UNIQUE CHECK (is_singleton)
);

-- 2. Ensure at least one row exists
INSERT INTO company_settings (contact_email, contact_phone, address, social_tiktok, social_instagram)
VALUES ('taskive.dev@gmail.com', '', '', '', '')
ON CONFLICT (is_singleton) DO NOTHING;

-- 3. FORCE ENABLE RLS
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- 4. Re-Apply Public Read Policy
-- Drop first to avoid errors if it exists but is broken
DROP POLICY IF EXISTS "Anyone can view company settings" ON company_settings;

CREATE POLICY "Anyone can view company settings" ON company_settings
    FOR SELECT USING (true);

-- 5. Re-Apply Admin Update Policy
DROP POLICY IF EXISTS "Only admin can update company settings" ON company_settings;

CREATE POLICY "Only admin can update company settings" ON company_settings
    FOR UPDATE USING (auth.jwt() ->> 'email' = 'taskive.dev@gmail.com');
