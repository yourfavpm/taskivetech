'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  quote: string
  avatar: string
  active: boolean
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setTestimonials(data || [])
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  return (
    <section id="testimonials" className="testimonials section">
      <div className="container">
        <div className="section-header text-center">
          <small className="section-eyebrow">Social Proof</small>
          <h2>Voices from our Clients</h2>
          <p className="section-subtitle mx-auto">
            We've partnered with forward-thinking brands to build products that matter.
          </p>
        </div>

        <div className="testimonials-grid">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-[var(--color-text-secondary)] animate-pulse">Loading testimonials...</p>
            </div>
          ) : testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="quote-icon">"</div>
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[var(--color-text-muted)]">New testimonials launching soon.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .testimonials {
          background-color: var(--color-background);
          padding: 120px 0;
          position: relative;
          overflow: hidden;
        }

        .testimonials::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.03) 0%, transparent 70%);
          border-radius: 50%;
        }

        .section-eyebrow {
          display: block;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-accent);
          margin-bottom: 12px;
        }

        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 64px;
        }

        .testimonial-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
          position: relative;
          z-index: 1;
        }

        .testimonial-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.8);
          border-color: var(--color-accent);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }

        .quote-icon {
          font-size: 80px;
          line-height: 1;
          font-family: serif;
          color: var(--color-accent);
          opacity: 0.1;
          position: absolute;
          top: 10px;
          left: 20px;
          z-index: -1;
        }

        .testimonial-quote {
          font-size: 17px;
          line-height: 1.6;
          color: var(--color-text-primary);
          font-style: italic;
          position: relative;
        }

        .testimonial-footer {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: auto;
        }

        .testimonial-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent), #60A5FA);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .testimonial-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
        }

        .testimonial-role {
          font-size: 13px;
          color: var(--color-text-muted);
          margin: 0;
        }

        @media (max-width: 1024px) {
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
          
          .testimonial-card {
            padding: 32px;
          }
          
          .testimonials {
            padding: 80px 0;
          }
        }
      `}</style>
    </section>
  )
}
