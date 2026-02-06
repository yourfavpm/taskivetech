'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

// Fallback case study data if database is not available
const fallbackCaseStudiesData: Record<string, {
  title: string
  summary: string
  industry: string
  challenge: string
  solution: string
  process: string[]
  outcome: string
  stats: { value: string; label: string }[]
  images: string[]
}> = {
  'atelier-ai': {
    title: 'Atelier AI',
    summary: 'A SaaS platform that helps fashion designers go from idea to visualization to production in minutes.',
    industry: 'Fashion Tech',
    challenge: 'Fashion design is typically a slow, fragmented process involving manual sketching, expensive sampling, and complex supply chains. Designers needed a way to accelerate the "idea-to-product" lifecycle without sacrificing creative control or quality.',
    solution: 'We built a comprehensive AI-powered platform that generates photorealistic visualizations from rough sketches, automatically creates production-ready tech packs, and connects directly with a vetted network of manufacturers. The system uses generative AI to visualize fabrics and drapes in real-time.',
    process: ['Designer workflow analysis', 'Generative AI model integration', '3D visualization engine', 'Tech pack automation', 'Supply chain API integration', 'Beta launch'],
    outcome: 'Reduced design-to-sample time by 80%. Adopted by 150+ independent fashion labels in the first 6 months.',
    stats: [
      { value: '80%', label: 'Faster Time-to-Market' },
      { value: '150+', label: 'Design Labels' },
      { value: '$100k+', label: 'Production Volume' },
    ],
    images: [],
  },
  'glarrie-herbal': {
    title: 'Glarrie Herbal',
    summary: 'A premium e-commerce store for herbal skincare products made with African botanicals.',
    industry: 'Beauty & Skincare',
    challenge: "Glarrie Herbal needed an online store that could effectively communicate the natural, botanical origins of their skincare products while building trust with customers seeking visible results. They required a platform that could handle consultations, product education, and seamless purchasing for their stretch marks and skincare range.",
    solution: "We designed and developed a warm, inviting e-commerce experience that puts product efficacy front and center. The platform features detailed product pages with ingredient transparency, before/after results galleries, integrated consultation booking, real-time order tracking, and a mobile-first checkout optimized for their Nigerian customer base.",
    process: ['Brand & audience research', 'E-commerce UX design', 'Visual identity refinement', 'Next.js development', 'Payment & shipping integration', 'Launch & optimization'],
    outcome: 'Achieved 2,000+ happy customers with a 4.9/5 average rating. Consultation bookings increased by 150%. Mobile conversion rate improved by 65% compared to their previous platform.',
    stats: [
      { value: '2,000+', label: 'Happy Customers' },
      { value: '4.9/5', label: 'Customer Rating' },
      { value: '150%', label: 'More Consultations' },
    ],
    images: [],
  },
  'internal-dashboard': {
    title: 'Internal Admin Dashboard',
    summary: 'A robust internal tool for managing complex business operations and real-time data analytics.',
    industry: 'Business Operations',
    challenge: "The team needed a centralized hub to monitor operational metrics, manage user permissions, and automate repetitive administrative tasks that were previously handled manually across multiple spreadsheets.",
    solution: 'We built a high-performance admin dashboard with a modular architecture, real-time data synchronization using WebSockets, and a comprehensive role-based access control (RBAC) system.',
    process: ['Requirement gathering', 'System architecture', 'UI/UX internal design', 'Backend API development', 'Integration & testing', 'Deployment'],
    outcome: 'Streamlined administrative workflows by 70%, reduced data entry errors by 45%, and provided real-time visibility into key performance indicators for the management team.',
    stats: [
      { value: '70%', label: 'Workflow Efficiency' },
      { value: '45%', label: 'Error Reduction' },
      { value: 'Real-time', label: 'Data Sync' },
    ],
    images: [],
  },
}

export default function CaseStudyPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [caseStudy, setCaseStudy] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Debug log to help identify what slug Next.js is seeing
    console.log('Fetching case study for slug:', slug)

    async function fetchCaseStudy() {
      if (!slug) return

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('case_studies')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single()

        if (data) {
          console.log('Found data in database for:', slug)
          // Parse JSONB fields
          const images = Array.isArray(data.images) ? data.images : []
          const process = Array.isArray(data.process) ? data.process : JSON.parse(data.process || '[]')

          setCaseStudy({
            title: data.title,
            summary: data.summary,
            industry: data.industry,
            challenge: data.challenge,
            solution: data.solution,
            process: process,
            outcome: data.outcome,
            images: images,
            stats: fallbackCaseStudiesData[slug]?.stats || []
          })
        } else {
          console.log('No data in database, checking fallbacks for:', slug)
          if (fallbackCaseStudiesData[slug]) {
            setCaseStudy(fallbackCaseStudiesData[slug])
          } else {
            setCaseStudy(null)
          }
        }
      } catch (error) {
        console.error('Error fetching case study:', error)
        // Ensure we at least check fallbacks if DB call fails
        if (fallbackCaseStudiesData[slug]) {
          setCaseStudy(fallbackCaseStudiesData[slug])
        } else {
          setCaseStudy(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCaseStudy()
  }, [slug])

  // If we have fallback data for this slug, we can show it immediately
  // otherwise show loading until the DB fetch completes
  const currentCaseStudy = caseStudy || fallbackCaseStudiesData[slug]

  if (isLoading && !currentCaseStudy) {
    return (
      <div className="case-study-page flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-[var(--color-text-secondary)] text-xl font-medium">
          Loading case study...
        </div>
      </div>
    )
  }

  if (!currentCaseStudy && !isLoading) {
    return notFound()
  }

  // Use the one we have (DB version prioritized over fallback)
  const displayData = currentCaseStudy

  // Get the first image or null
  const coverImage = displayData.images && displayData.images.length > 0 ? displayData.images[0] : null

  return (
    <div className="case-study-page">
      {/* Debug Info (Visible only during dev) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px', borderRadius: '8px', fontSize: '12px', zIndex: 9999 }}>
          Slug: {slug} | Found DB: {caseStudy ? 'Yes' : 'No'} | Found Fallback: {fallbackCaseStudiesData[slug] ? 'Yes' : 'No'}
        </div>
      )}

      {/* Hero Section */}
      <section className="case-hero">
        <div className="container">
          <Link href="/#work" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Work
          </Link>

          <div className="hero-content">
            <span className="industry-tag">{displayData.industry}</span>
            <h1>{displayData.title}</h1>
            <p className="hero-summary">{displayData.summary}</p>
          </div>
        </div>
      </section>

      {/* Project Image Showcase */}
      <section className="project-showcase">
        <div className="container">
          <div className="showcase-image">
            {coverImage ? (
              <div
                className="showcase-bg-image"
                style={{ backgroundImage: `url(${coverImage})` }}
              />
            ) : (
              <div className="image-placeholder">
                <span>{displayData.title.charAt(0)}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {displayData.stats.map((stat: any, index: number) => (
              <div key={index} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-section">
        <div className="container">
          <div className="content-grid">
            {/* Challenge */}
            <div className="content-block">
              <div className="block-header">
                <span className="block-number">01</span>
                <h2>The Challenge</h2>
              </div>
              <p>{displayData.challenge}</p>
            </div>

            {/* Solution */}
            <div className="content-block">
              <div className="block-header">
                <span className="block-number">02</span>
                <h2>The Solution</h2>
              </div>
              <p>{displayData.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="process-header">
            <span className="block-number">03</span>
            <h2>The Process</h2>
          </div>
          <div className="process-timeline">
            {displayData.process.map((step: string, index: number) => (
              <div key={index} className="process-step">
                <div className="step-indicator">
                  <span className="step-dot"></span>
                  {index < displayData.process.length - 1 && <span className="step-line"></span>}
                </div>
                <div className="step-content">
                  <span className="step-number">Step {index + 1}</span>
                  <p>{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcome Section */}
      <section className="outcome-section">
        <div className="container">
          <div className="outcome-content">
            <div className="outcome-header">
              <span className="block-number">04</span>
              <h2>The Outcome</h2>
            </div>
            <p className="outcome-text">{displayData.outcome}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Have a similar project in mind?</h2>
            <p>Let's discuss how we can help you achieve similar results.</p>
            <Link href="/book-consultation" className="btn btn-primary">
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .case-study-page {
          padding-top: 72px;
        }

        /* Hero Section */
        .case-hero {
          padding: 64px 0 80px;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
          margin-bottom: 48px;
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: var(--color-text-primary);
        }

        .hero-content {
          max-width: 800px;
        }

        .industry-tag {
          display: inline-block;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-accent);
          background-color: rgba(37, 99, 235, 0.08);
          border-radius: 100px;
          margin-bottom: 24px;
        }

        .case-hero h1 {
          font-size: 56px;
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--color-text-primary);
          margin-bottom: 24px;
        }

        .hero-summary {
          font-size: 22px;
          line-height: 1.5;
          color: var(--color-text-secondary);
          max-width: 640px;
        }

        /* Project Showcase */
        .project-showcase {
          padding: 0 0 80px;
          background: linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%);
        }

        .showcase-image {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.08);
        }

        .showcase-bg-image {
          aspect-ratio: 16 / 9;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .image-placeholder {
          aspect-ratio: 16 / 9;
          background: linear-gradient(135deg, #E8ECEF 0%, #D1D9E0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-placeholder span {
          font-size: 120px;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.08);
        }

        /* Stats Section */
        .stats-section {
          padding: 64px 0;
          background-color: var(--color-text-primary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          text-align: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-value {
          font-size: 48px;
          font-weight: 600;
          color: #FFFFFF;
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Content Sections */
        .content-section {
          padding: 96px 0;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 64px;
        }

        .content-block {
          padding: 40px;
          background-color: #FFFFFF;
          border: 1px solid var(--color-border-light);
          border-radius: 16px;
        }

        .block-header {
          margin-bottom: 24px;
        }

        .block-number {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-accent);
          margin-bottom: 12px;
          letter-spacing: 0.05em;
        }

        .block-header h2 {
          font-size: 28px;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .content-block p {
          font-size: 17px;
          line-height: 1.8;
          color: var(--color-text-secondary);
        }

        /* Process Section */
        .process-section {
          padding: 96px 0;
          background-color: #FFFFFF;
        }

        .process-header {
          margin-bottom: 48px;
        }

        .process-header h2 {
          font-size: 32px;
          font-weight: 600;
        }

        .process-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 600px;
        }

        .process-step {
          display: flex;
          gap: 24px;
        }

        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 6px;
        }

        .step-dot {
          width: 12px;
          height: 12px;
          background-color: var(--color-accent);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .step-line {
          width: 2px;
          flex-grow: 1;
          background-color: var(--color-border);
          min-height: 40px;
        }

        .step-content {
          padding-bottom: 32px;
        }

        .step-number {
          display: block;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
          margin-bottom: 4px;
        }

        .step-content p {
          font-size: 18px;
          font-weight: 500;
          color: var(--color-text-primary);
          margin: 0;
        }

        /* Outcome Section */
        .outcome-section {
          padding: 96px 0;
          background: linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%);
        }

        .outcome-content {
          max-width: 720px;
        }

        .outcome-header {
          margin-bottom: 32px;
        }

        .outcome-header h2 {
          font-size: 32px;
          font-weight: 600;
        }

        .outcome-text {
          font-size: 20px;
          line-height: 1.8;
          color: var(--color-text-secondary);
        }

        /* CTA Section */
        .cta-section {
          padding: 120px 0;
          background-color: var(--color-text-primary);
          text-align: center;
        }

        .cta-content {
          max-width: 560px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-size: 40px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .cta-content p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 40px;
        }

        .cta-section :global(.btn-primary) {
          background-color: #FFFFFF;
          color: var(--color-text-primary);
          padding: 16px 32px;
          font-size: 16px;
        }

        .cta-section :global(.btn-primary:hover) {
          background-color: rgba(255, 255, 255, 0.9);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .stats-grid {
            gap: 32px;
          }

          .stat-value {
            font-size: 36px;
          }
        }

        @media (max-width: 768px) {
          .case-hero {
            padding: 48px 0 64px;
          }

          .case-hero h1 {
            font-size: 36px;
          }

          .hero-summary {
            font-size: 18px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .stat-value {
            font-size: 40px;
          }

          .content-section,
          .process-section,
          .outcome-section {
            padding: 64px 0;
          }

          .content-block {
            padding: 28px;
          }

          .cta-section {
            padding: 80px 0;
          }

          .cta-content h2 {
            font-size: 28px;
          }

          .image-placeholder span {
            font-size: 72px;
          }
        }
      `}</style>
    </div>
  )
}
