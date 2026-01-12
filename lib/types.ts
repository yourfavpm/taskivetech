// Database types for Taskive Tech

export interface Consultation {
    id: string
    name: string
    email: string
    company?: string
    project_type: string
    description: string
    status: 'new' | 'scheduled' | 'completed' | 'cancelled'
    scheduled_at?: string
    preferred_date?: string
    preferred_time?: string
    created_at: string
    updated_at: string
}

export interface CompanySettings {
    id: string
    contact_email: string
    contact_phone: string
    address: string
    social_tiktok: string
    social_instagram: string
}

export interface CaseStudy {
    id: string
    slug: string
    title: string
    summary: string
    industry?: string
    challenge?: string
    solution?: string
    process?: string
    outcome?: string
    images?: string[]
    featured: boolean
    published: boolean
    created_at: string
    updated_at: string
}

export interface AdminNote {
    id: string
    consultation_id: string
    note: string
    created_at: string
}

export type ProjectType =
    | 'landing-page'
    | 'portfolio-website'
    | 'ecommerce'
    | 'web-application'
    | 'saas-mvp'
    | 'ai-automation'
    | 'product-design'
    | 'other'

export const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
    { value: 'landing-page', label: 'Landing Page' },
    { value: 'portfolio-website', label: 'Portfolio Website' },
    { value: 'ecommerce', label: 'E-commerce Website' },
    { value: 'web-application', label: 'Web Application' },
    { value: 'saas-mvp', label: 'SaaS & MVP Development' },
    { value: 'ai-automation', label: 'AI & Automation' },
    { value: 'product-design', label: 'Product Design (UI/UX)' },
    { value: 'other', label: 'Other' },
]
