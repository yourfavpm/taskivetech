'use client'

const differentiators = [
  {
    title: 'Studio-led Execution',
    description: 'Every project is led by experienced engineers and designers, not account managers. Direct communication, no middlemen.',
  },
  {
    title: 'Product-first Thinking',
    description: 'We focus on outcomes, not just deliverables. Every decision is guided by what matters most to your users and business.',
  },
  {
    title: 'Clear Communication',
    description: "No jargon, no surprises. You'll always know what's happening, why, and what's next.",
  },
]

export default function WhyTaskive() {
  return (
    <section id="why" className="why-taskive section bg-white">
      <div className="container">
        <div className="section-header">
          <h2>Why Taskive Tech</h2>
          <p className="section-subtitle">
            What makes working with us different.
          </p>
        </div>

        <div className="differentiators-grid">
          {differentiators.map((item, index) => (
            <div key={index} className="differentiator">
              <h3 className="differentiator-title">{item.title}</h3>
              <p className="differentiator-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .why-taskive {
          background-color: var(--color-background-white);
        }

        .section-header {
          margin-bottom: 64px;
        }

        .section-header h2 {
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 18px;
        }

        .differentiators-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
        }

        .differentiator {
          padding-right: 24px;
        }

        .differentiator-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--color-text-primary);
        }

        .differentiator-description {
          font-size: 16px;
          line-height: 1.7;
          color: var(--color-text-secondary);
        }

        @media (max-width: 1024px) {
          .differentiators-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .differentiator {
            padding-right: 0;
          }
        }
      `}</style>
    </section>
  )
}
