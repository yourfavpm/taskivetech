'use client'

const steps = [
  {
    number: '01',
    title: 'Understand',
    description: 'We learn your business, users, and goals. No assumptions.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'We create clear, purposeful solutions before writing code.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'We develop in iterations, with regular check-ins and transparency.',
  },
  {
    number: '04',
    title: 'Launch',
    description: 'We deploy, monitor, and support your product in production.',
  },
]

export default function HowWeWork() {
  return (
    <section id="how-we-work" className="how-we-work section bg-white">
      <div className="container">
        <div className="section-header">
          <h2>How We Work</h2>
          <p className="section-subtitle">
            A structured approach to building products that deliver results.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step">
              <span className="step-number">{step.number}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .how-we-work {
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
          max-width: 480px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 48px;
        }

        .step {
          position: relative;
        }

        .step-number {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-accent);
          margin-bottom: 16px;
          letter-spacing: 0.05em;
        }

        .step-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--color-text-primary);
        }

        .step-description {
          font-size: 15px;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        @media (max-width: 1024px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 640px) {
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </section>
  )
}
