-- Update contact email to info@taskivetech.tech
UPDATE company_settings
SET contact_email = 'info@taskivetech.tech'
WHERE is_singleton = true;

-- If no record exists, insert one
INSERT INTO company_settings (contact_email, is_singleton)
VALUES ('info@taskivetech.tech', true)
ON CONFLICT (is_singleton) DO UPDATE
SET contact_email = 'info@taskivetech.tech';
