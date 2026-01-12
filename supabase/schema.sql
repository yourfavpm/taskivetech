-- Taskive Tech Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Consultations table for booking requests
CREATE TABLE IF NOT EXISTS consultations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    project_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'scheduled', 'completed', 'cancelled')),
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case studies table for portfolio
CREATE TABLE IF NOT EXISTS case_studies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    industry VARCHAR(100),
    challenge TEXT,
    solution TEXT,
    process JSONB, -- Array of process steps
    outcome TEXT,
    images JSONB, -- Array of image URLs
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin notes for consultations
CREATE TABLE IF NOT EXISTS admin_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON case_studies(featured);
CREATE INDEX IF NOT EXISTS idx_admin_notes_consultation ON admin_notes(consultation_id);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- Consultations: Anyone can insert (submit a booking)
CREATE POLICY "Anyone can submit consultation" ON consultations
    FOR INSERT WITH CHECK (true);

-- Consultations: Only authenticated users can view/update (admin)
CREATE POLICY "Authenticated users can view consultations" ON consultations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update consultations" ON consultations
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Case Studies: Anyone can view published case studies
CREATE POLICY "Anyone can view published case studies" ON case_studies
    FOR SELECT USING (published = true);

-- Case Studies: Authenticated users can manage all
CREATE POLICY "Authenticated users can manage case studies" ON case_studies
    FOR ALL USING (auth.role() = 'authenticated');

-- Admin Notes: Only authenticated users
CREATE POLICY "Authenticated users can manage admin notes" ON admin_notes
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample case studies for the portfolio
INSERT INTO case_studies (slug, title, summary, industry, challenge, solution, process, outcome, images, featured, published) VALUES
(
    'atelier-ai',
    'Atelier AI',
    'A SaaS platform that helps fashion designers go from idea to visualization to production in minutes.',
    'Fashion Tech',
    'Fashion design is typically a slow, fragmented process involving manual sketching, expensive sampling, and complex supply chains. Designers needed a way to accelerate the idea-to-product lifecycle.',
    'We built a comprehensive AI-powered platform that generates photorealistic visualizations from rough sketches, automatically creates production-ready tech packs, and connects directly with manufacturers.',
    '["Designer workflow analysis", "Generative AI model integration", "3D visualization engine", "Tech pack automation", "Supply chain API integration", "Beta launch"]',
    'Reduced design-to-sample time by 80%. Adopted by 150+ independent fashion labels in the first 6 months.',
    '[]',
    true,
    true
),
(
    'glarrie-herbal',
    'Glarrie Herbal',
    'A premium e-commerce store for herbal skincare products made with African botanicals.',
    'Beauty & Skincare',
    'Glarrie Herbal needed an online store that could effectively communicate the natural, botanical origins of their skincare products while building trust with customers seeking visible results.',
    'We designed and developed a warm, inviting e-commerce experience that puts product efficacy front and center, featuring ingredient transparency and before/after results galleries.',
    '["Brand & audience research", "E-commerce UX design", "Visual identity refinement", "Next.js development", "Payment & shipping integration", "Launch & optimization"]',
    'Achieved 2,000+ happy customers with a 4.9/5 average rating. Consultation bookings increased by 150%.',
    '[]',
    true,
    true
),
(
    'fintech-dashboard',
    'FinFlow Dashboard',
    'Real-time financial analytics dashboard for institutional investors.',
    'Finance',
    'FinFlow required a high-performance dashboard capable of processing and visualizing millions of data points in real-time.',
    'We engineered a responsive dashboard with WebSocket connections, advanced charting, and customizable data views.',
    '["Technical requirements", "Architecture design", "Frontend development", "API integration", "Performance optimization", "Security audit"]',
    'Handles 10M+ data points with sub-second render times.',
    '[]',
    true,
    true
);
