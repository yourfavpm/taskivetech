import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

// Fallback case studies if database is empty
const fallbackCaseStudies = [
  {
    slug: 'atelier-ai',
    title: 'Atelier AI',
    summary: 'A SaaS platform that helps fashion designers go from idea to visualization to production.',
    industry: 'Fashion Tech',
    images: [],
  },
  {
    slug: 'glarrie-herbal',
    title: 'Glarrie Herbal',
    summary: 'A premium e-commerce store for herbal skincare products made with African botanicals.',
    industry: 'Beauty & Skincare',
    images: [],
  },
  {
    slug: 'fintech-dashboard',
    title: 'FinFlow Dashboard',
    summary: 'Real-time financial analytics dashboard for institutional investors.',
    industry: 'Finance',
    images: [],
  },
]

export default async function SelectedWork() {
  let caseStudies = fallbackCaseStudies

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('case_studies')
      .select('slug, title, summary, industry, images')
      .eq('published', true)
      .eq('featured', true)
      .limit(6)

    if (data && data.length > 0) {
      caseStudies = data
    }
  } catch {
    // Use fallback data if database not set up
  }

  return (
    <section id="work" className="section bg-[var(--color-background)]">
      <div className="container">
        <div className="mb-16">
          <h2 className="mb-4">Selected Work</h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Real projects, real outcomes. See what we've built.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((project, index) => {
            // Use the first image from the array if available
            const coverImage = project.images && project.images.length > 0 ? project.images[0] : null

            return (
              <Link
                key={index}
                href={`/case-studies/${project.slug}`}
                className="card block p-0 overflow-hidden no-underline hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[16/10] bg-[var(--color-background)] overflow-hidden relative group">
                  {coverImage ? (
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${coverImage})` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-5xl font-semibold text-[var(--color-text-muted)]">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="inline-block text-xs font-medium uppercase tracking-wide text-[var(--color-accent)] mb-2">
                    {project.industry}
                  </span>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                    {project.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                    {project.summary}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
