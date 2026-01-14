'use client'

const industries = [
    "SaaS Platforms",
    "Fintech Products",
    "Online Stores",
    "Consulting Firms",
    "Education Platforms",
    "Nonprofits",
    "Media Brands",
    "B2B Services",
]

export default function IndustryScroll() {
    // Duplicate the list to create a seamless loop
    const scrollItems = [...industries, ...industries]

    return (
        <section className="industry-scroll-section">
            <div className="section-header container text-center">
                <p className="section-eyebrow">Expertise Across Sectors</p>
                <div className="spacer"></div>
            </div>

            <div className="marquee-container">
                <div className="marquee-content">
                    {scrollItems.map((item, index) => (
                        <div key={index} className="marquee-item">
                            <span className="dot">•</span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .industry-scroll-section {
          padding: 80px 0;
          background-color: var(--color-background);
          overflow: hidden;
          border-bottom: 1px solid var(--color-border-light);
        }

        .section-eyebrow {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 40px;
        }

        .marquee-container {
          position: relative;
          display: flex;
          overflow: hidden;
          user-select: none;
          gap: 40px;
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }

        .marquee-content {
          flex-shrink: 0;
          display: flex;
          justify-content: space-around;
          min-width: 100%;
          gap: 40px;
          animation: scroll 30s linear infinite;
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }

        .marquee-item {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 24px;
          font-weight: 500;
          color: var(--color-text-primary);
          white-space: nowrap;
          padding: 10px 20px;
          border-radius: 100px;
          transition: all 0.3s ease;
        }

        .marquee-item:hover {
          color: var(--color-accent);
          background: var(--color-background-white);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .dot {
          color: var(--color-accent);
          font-size: 20px;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .marquee-item {
            font-size: 18px;
          }
          
          .industry-scroll-section {
            padding: 60px 0;
          }
        }
      `}</style>
        </section>
    )
}
