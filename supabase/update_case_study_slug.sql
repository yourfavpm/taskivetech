-- Run this in your Supabase SQL Editor
-- This updates the project slug and content in the database to match your new "Internal Admin Dashboard"

UPDATE case_studies
SET 
  slug = 'internal-dashboard',
  title = 'Internal Admin Dashboard',
  summary = 'A robust internal tool for managing complex business operations and real-time data analytics.',
  industry = 'Business Operations',
  challenge = 'The team needed a centralized hub to monitor operational metrics, manage user permissions, and automate repetitive administrative tasks that were previously handled manually across multiple spreadsheets.',
  solution = 'We built a high-performance admin dashboard with a modular architecture, real-time data synchronization using WebSockets, and a comprehensive role-based access control (RBAC) system.',
  process = '["Requirement gathering", "System architecture", "UI/UX internal design", "Backend API development", "Integration & testing", "Deployment"]',
  outcome = 'Streamlined administrative workflows by 70%, reduced data entry errors by 45%, and provided real-time visibility into key performance indicators for the management team.'
WHERE slug = 'fintech-dashboard';
