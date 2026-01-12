'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CompanySettings } from '@/lib/types'

export default function FinalCTA() {
  const [email, setEmail] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('company_settings').select('contact_email').single()
      if (data) setEmail(data.contact_email)
    }
    fetchSettings()
  }, [])

  return (
    <section className="final-cta section bg-white">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">
            Have something serious to build?
          </h2>
          <p className="cta-subtitle">
            Let's talk about your project and see if we're a good fit.
          </p>
          <div className="cta-actions">
            <Link href="/book-consultation" className="btn btn-primary">
              Book a Free Call
            </Link>
          </div>

          {email && (
            <p className="email-link">
              Or email us at <a href={`mailto:${email}`}>{email}</a>
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        .final-cta {
          background-color: var(--color-background-white);
          text-align: center;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 42px;
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          color: var(--color-text-primary);
        }

        .cta-subtitle {
          font-size: 18px;
          color: var(--color-text-secondary);
          margin-bottom: 40px;
        }

        .cta-actions {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .email-link {
          font-size: 14px;
          color: #666;
        }
        .email-link a {
          color: #2563EB;
          text-decoration: none;
          font-weight: 500;
        }
        .email-link a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .cta-title {
            font-size: 32px;
          }
        }
      `}</style>
    </section>
  )
}
