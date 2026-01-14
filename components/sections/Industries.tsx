'use client'

import { useState } from 'react'

const industries = [
  {
    title: 'SaaS & Tech Startups',
    description: 'We understand the technical and business nuances of fast-growing SaaS products, from MVP to scale.',
    icon: '🚀',
    slug: 'saas'
  },
  {
    title: 'Fintech & Financial Services',
    description: 'Building secure, scalable, and compliant financial technology solutions for the modern era.',
    icon: '💳',
    slug: 'fintech'
  },
  {
    title: 'E-commerce & Marketplaces',
    description: 'Creating seamless shopping experiences and robust marketplace infrastructures that drive conversion.',
    icon: '🛒',
    slug: 'ecommerce'
  },
  {
    title: 'Professional Services',
    description: 'Elevating service-based businesses with premium digital platforms and streamlined workflows.',
    icon: '💼',
    slug: 'services'
  },
  {
    title: 'Education & EdTech',
    description: 'Empowering learning through innovative, accessible, and engaging educational tools.',
    icon: '🎓',
    slug: 'edtech'
  },
  {
    title: 'Nonprofits & Impact',
    description: 'Helping mission-driven organizations scale their global impact through effective digital storytelling.',
    icon: '🌍',
    slug: 'nonprofit'
  },
  {
    title: 'Media & Content',
    description: 'Powering high-traffic digital media and modern content delivery platforms for global audiences.',
    icon: '📱',
    slug: 'media'
  },
]

export default function Industries() {
  const [activeIndustry, setActiveIndustry] = useState(industries[0])

  return (
    <section id="industries" className="industries section bg-white">
      <div className="container">
        <div className="section-header">
          <small className="section-eyebrow">Industry Expertise</small>
          <h2>Industries We Specialise In</h2>
        </div>

        <div className="industries-interactive-wrapper">
          <div className="industries-list">
            {industries.map((industry) => (
              <div
                key={industry.slug}
                className={`industry-item ${activeIndustry.slug === industry.slug ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndustry(industry)}
              >
                <span className="industry-number">0{industries.indexOf(industry) + 1}</span>
                <h3 className="industry-title-large">{industry.title}</h3>
                <div className="industry-content-mobile">
                  <p>{industry.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="industry-display">
            <div className="display-card">
              <div className="display-icon">{activeIndustry.icon}</div>
              <div className="display-text">
                <h4>{activeIndustry.title}</h4>
                <p>{activeIndustry.description}</p>
              </div>
              <div className="display-background-blob"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .industries {
          border-top: 1px solid var(--color-border-light);
          padding: 120px 0;
        }

        .section-eyebrow {
          display: block;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-accent);
          margin-bottom: 12px;
        }

        .section-header {
          margin-bottom: 80px;
        }

        .industries-interactive-wrapper {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 80px;
          align-items: start;
        }

        .industries-list {
          display: flex;
          flex-direction: column;
        }

        .industry-item {
          padding: 32px 0;
          border-bottom: 1px solid var(--color-border-light);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 24px;
          transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
          position: relative;
        }

        .industry-item:first-child {
          border-top: 1px solid var(--color-border-light);
        }

        .industry-number {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-muted);
          font-family: monospace;
        }

        .industry-title-large {
          font-size: 32px;
          font-weight: 500;
          color: var(--color-text-primary);
          transition: transform 0.4s ease, color 0.4s ease;
          margin: 0;
        }

        .industry-item:hover .industry-title-large,
        .industry-item.active .industry-title-large {
          color: var(--color-accent);
          transform: translateX(10px);
        }

        .industry-content-mobile {
          display: none;
        }

        .industry-display {
          position: sticky;
          top: 120px;
          perspective: 1000px;
        }

        .display-card {
          background-color: var(--color-background);
          padding: 48px;
          border-radius: 24px;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 32px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .display-icon {
          font-size: 64px;
          z-index: 2;
        }

        .display-text {
          z-index: 2;
        }

        .display-text h4 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--color-text-primary);
        }

        .display-text p {
          font-size: 18px;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .display-background-blob {
          position: absolute;
          top: -20%;
          right: -20%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 1;
        }

        @media (max-width: 1024px) {
          .industry-title-large {
            font-size: 26px;
          }
          
          .industries-interactive-wrapper {
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .industries-interactive-wrapper {
            grid-template-columns: 1fr;
          }

          .industry-display {
            display: none;
          }

          .industry-content-mobile {
            display: block;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease, margin 0.4s ease;
            opacity: 0;
          }

          .industry-item.active .industry-content-mobile {
            max-height: 200px;
            margin-top: 16px;
            opacity: 1;
          }

          .industry-title-large {
            font-size: 22px;
          }

          .industry-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            padding: 24px 0;
          }
          
          .industry-item:hover .industry-title-large,
          .industry-item.active .industry-title-large {
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
