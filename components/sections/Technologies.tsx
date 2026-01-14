'use client'

import { useState } from 'react'

const techCategories = [
    {
        id: 'frontend',
        name: 'Frontend',
        items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5 / CSS3'],
    },
    {
        id: 'backend',
        name: 'Backend',
        items: ['Node.js', 'Python', 'REST APIs', 'GraphQL'],
    },
    {
        id: 'databases',
        name: 'Databases',
        items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase'],
    },
    {
        id: 'cloud',
        name: 'Cloud & DevOps',
        items: ['AWS', 'Vercel', 'Docker', 'CI/CD Pipelines'],
    },
    {
        id: 'ecommerce',
        name: 'E-commerce',
        items: ['Shopify', 'WooCommerce', 'Stripe', 'Paystack'],
    },
    {
        id: 'frameworks',
        name: 'Frameworks',
        items: ['Next.js', 'Express', 'Django', 'Laravel'],
    },
    {
        id: 'cms',
        name: 'CMS',
        items: ['Sanity', 'Strapi', 'WordPress', 'Headless CMS'],
    },
]

export default function Technologies() {
    const [activeTab, setActiveTab] = useState('frontend')

    return (
        <section id="technologies" className="technologies section bg-light">
            <div className="container">
                <div className="section-header text-center">
                    <h2>Technologies We Use</h2>
                    <p className="section-subtitle mx-auto">
                        We leverage modern, industry-leading technologies to build high-performance products.
                    </p>
                </div>

                <div className="tabs-container">
                    <div className="tabs-list">
                        {techCategories.map((category) => (
                            <button
                                key={category.id}
                                className={`tab-button ${activeTab === category.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="tab-content">
                        <div className="tech-grid">
                            {techCategories
                                .find((cat) => cat.id === activeTab)
                                ?.items.map((item, index) => (
                                    <div key={index} className="tech-item badge animate-fade-in">
                                        {item}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .technologies {
          background-color: var(--color-background);
        }

        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }

        .tabs-container {
          margin-top: 48px;
        }

        .tabs-list {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 40px;
        }

        .tab-button {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 100px;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .tab-button:hover {
          border-color: var(--color-text-primary);
          color: var(--color-text-primary);
        }

        .tab-button.active {
          background-color: var(--color-text-primary);
          border-color: var(--color-text-primary);
          color: var(--color-background-white);
        }

        .tech-grid {
          display: flex;
          justify-content: center;
          align-content: center;
          flex-wrap: wrap;
          gap: 16px;
          max-width: 800px;
          margin: 0 auto;
        }

        .tech-item {
          padding: 12px 24px;
          background-color: var(--color-background-white);
          border: 1px solid var(--color-border-light);
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          color: var(--color-text-primary);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
          animation: stagger-fade 0.4s ease forwards;
        }

        @keyframes stagger-fade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .tabs-list {
            gap: 8px;
          }
          
          .tab-button {
            padding: 8px 16px;
            font-size: 13px;
          }
          
          .tech-item {
            font-size: 14px;
            padding: 10px 20px;
          }
        }
      `}</style>
        </section>
    )
}
