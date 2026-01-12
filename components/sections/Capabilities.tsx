'use client'

const capabilities = [
  {
    title: 'Landing Pages',
    description: 'High-converting pages designed to capture attention and drive action.',
    icon: '◎',
  },
  {
    title: 'Portfolio Websites',
    description: 'Showcase your work with elegance and clarity.',
    icon: '◐',
  },
  {
    title: 'E-commerce',
    description: 'Online stores built for seamless shopping experiences.',
    icon: '◑',
  },
  {
    title: 'Web Applications',
    description: 'Custom software solutions for complex business needs.',
    icon: '◒',
  },
  {
    title: 'SaaS & MVP',
    description: 'Launch your product with speed and confidence.',
    icon: '◓',
  },
  {
    title: 'AI & Automation',
    description: 'Intelligent systems that work while you sleep.',
    icon: '◔',
  },
  {
    title: 'Product Design',
    description: 'User-centered interfaces that feel effortless.',
    icon: '◕',
  },
]

export default function Capabilities() {
  return (
    <section id="capabilities" className="capabilities section">
      <div className="container">
        <div className="section-header">
          <h2>What We Build</h2>
          <p className="section-subtitle">
            From landing pages to complex platforms, we deliver production-ready solutions.
          </p>
        </div>

        <div className="capabilities-grid">
          {capabilities.map((capability, index) => (
            <div key={index} className="capability-card card">
              <span className="capability-icon">{capability.icon}</span>
              <h3 className="capability-title">{capability.title}</h3>
              <p className="capability-description">{capability.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .capabilities {
          background-color: var(--color-background);
        }

        .section-header {
          margin-bottom: 64px;
        }

        .section-header h2 {
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 18px;
          max-width: 480px;
        }

        .capabilities-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .capability-card {
          padding: 28px;
        }

        .capability-icon {
          display: inline-block;
          font-size: 24px;
          margin-bottom: 16px;
          color: var(--color-accent);
        }

        .capability-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--color-text-primary);
        }

        .capability-description {
          font-size: 15px;
          line-height: 1.5;
          color: var(--color-text-secondary);
        }

        @media (max-width: 1024px) {
          .capabilities-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .capabilities-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
