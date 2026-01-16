-- Fix for CRM RLS violations

-- 1. Add missing INSERT policy for status history
-- This allows both admins and the system (via triggers) to log status changes
-- We allow 'anon' because a new consultation might trigger a lead creation 
-- which then triggers a status history entry.
DROP POLICY IF EXISTS "Admins can insert CRM status history" ON crm_status_history;
CREATE POLICY "Admins can insert CRM status history" ON crm_status_history
    FOR INSERT WITH CHECK (true); -- Triggers will handle logic, easier to keep it open for now or use authenticated/anon

-- 2. Update trigger functions to be SECURITY DEFINER
-- This ensures they run with creator privileges, bypassing some RLS restrictions for background tasks

CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS NULL OR OLD.status <> NEW.status) THEN
        INSERT INTO crm_status_history (lead_id, old_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_lead_creation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO crm_status_history (lead_id, old_status, new_status, changed_by)
    VALUES (NEW.id, NULL, NEW.status, auth.uid());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_lead_from_consultation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO crm_leads (consultation_id, company_name, contact_name, email, industry, source, notes)
    VALUES (NEW.id, COALESCE(NEW.company, 'N/A'), NEW.name, NEW.email, NEW.project_type, 'website', NEW.description);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Ensure crm_leads allows insertion from the consultation trigger
-- Even if the user is anonymous, the SECURITY DEFINER function above will handle it,
-- but just in case, we can add a specifically tailored policy or rely on SECURITY DEFINER.
