'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            We design and build digital products that work.
          </h1>
          <p className="hero-subtitle">
            Taskive Tech is a studio-led product and engineering team building websites, platforms, and scalable systems.
          </p>
          <div className="hero-actions">
            <Link href="/book-consultation" className="btn btn-primary">
              Start a Project
            </Link>
            <Link href="/#work" className="btn btn-secondary">
              View Our Work
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          padding: 180px 0 120px;
          background-color: var(--color-background-white);
        }

        .hero-content {
          max-width: 720px;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--color-text-primary);
          margin-bottom: 24px;
        }

        .hero-subtitle {
          font-size: 20px;
          line-height: 1.6;
          color: var(--color-text-secondary);
          margin-bottom: 40px;
          max-width: 560px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 140px 0 80px;
          }

          .hero-title {
            font-size: 38px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .hero-actions :global(.btn) {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
