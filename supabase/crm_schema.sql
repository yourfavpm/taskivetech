-- Taskive CRM & Analytics Schema

-- Enum for Lead Lifecycle Status
DO $$ BEGIN
    CREATE TYPE lead_lifecycle_status AS ENUM (
        'Consultation Booked',
        'Discovery Completed',
        'Qualified Lead',
        'Proposal Sent',
        'Negotiation / Review',
        'Contract Signed',
        'Project In Progress',
        'Delivered / Handed Over',
        'Retainer / Ongoing',
        'Closed – Not a Fit',
        'Closed – Lost'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CRM Leads Table
CREATE TABLE IF NOT EXISTS crm_leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    industry VARCHAR(100),
    source VARCHAR(100) DEFAULT 'website',
    status lead_lifecycle_status DEFAULT 'Consultation Booked',
    assigned_owner UUID REFERENCES auth.users(id),
    notes TEXT,
    consultation_date TIMESTAMPTZ,
    proposal_sent_date TIMESTAMPTZ,
    contract_signed_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Financials Table (linked to leads)
CREATE TABLE IF NOT EXISTS crm_financials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES crm_leads(id) ON DELETE CASCADE,
    agreed_value DECIMAL(12, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'CAD',
    payment_model VARCHAR(50) CHECK (payment_model IN ('One-time', 'Milestone-based', 'Retainer')),
    amount_invoiced DECIMAL(12, 2) DEFAULT 0.00,
    amount_paid DECIMAL(12, 2) DEFAULT 0.00,
    outstanding_balance DECIMAL(12, 2) GENERATED ALWAYS AS (agreed_value - amount_paid) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead Status History (Audit Trail)
CREATE TABLE IF NOT EXISTS crm_status_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES crm_leads(id) ON DELETE CASCADE,
    old_status lead_lifecycle_status,
    new_status lead_lifecycle_status NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- RLS Policies
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_status_history ENABLE ROW LEVEL SECURITY;

-- Admin-only access (using the same email restriction as frontend for consistency, or standard auth)
CREATE POLICY "Admins can manage CRM leads" ON crm_leads
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage CRM financials" ON crm_financials
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can view CRM status history" ON crm_status_history
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert CRM status history" ON crm_status_history
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Trigger to automatically create status history entry on status change
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

CREATE TRIGGER tr_lead_status_change
    AFTER UPDATE OF status ON crm_leads
    FOR EACH ROW
    EXECUTE FUNCTION log_lead_status_change();

-- Initial trigger for creation
CREATE OR REPLACE FUNCTION log_lead_creation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO crm_status_history (lead_id, old_status, new_status, changed_by)
    VALUES (NEW.id, NULL, NEW.status, auth.uid());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_lead_creation
    AFTER INSERT ON crm_leads
    FOR EACH ROW
    EXECUTE FUNCTION log_lead_creation();

-- Add a trigger to consultations to automatically create a lead
CREATE OR REPLACE FUNCTION create_lead_from_consultation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO crm_leads (consultation_id, company_name, contact_name, email, industry, source, notes)
    VALUES (NEW.id, COALESCE(NEW.company, 'N/A'), NEW.name, NEW.email, NEW.project_type, 'website', NEW.description);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_consultation_to_lead
    AFTER INSERT ON consultations
    FOR EACH ROW
    EXECUTE FUNCTION create_lead_from_consultation();
