-- Standardize CRM to use USD
ALTER TABLE crm_financials ALTER COLUMN currency SET DEFAULT 'USD';
UPDATE crm_financials SET currency = 'USD' WHERE currency = 'CAD';

-- Ensure country is mapped from consultations to crm_leads
-- 1. Add country column to crm_leads if not already explicitly mapped
ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- 2. Update the trigger function to capture country
CREATE OR REPLACE FUNCTION create_lead_from_consultation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO crm_leads (consultation_id, company_name, contact_name, email, industry, source, notes, country)
    VALUES (NEW.id, COALESCE(NEW.company, 'N/A'), NEW.name, NEW.email, NEW.project_type, 'website', NEW.description, NEW.country);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update existing leads with country from their consultations
UPDATE crm_leads l
SET country = c.country
FROM consultations c
WHERE l.consultation_id = c.id AND l.country IS NULL;

-- 4. Ensure RLS allows admins to update financials
DROP POLICY IF EXISTS "Admins can manage CRM financials" ON crm_financials;
CREATE POLICY "Admins can manage CRM financials" ON crm_financials
    FOR ALL USING (auth.role() = 'authenticated');
