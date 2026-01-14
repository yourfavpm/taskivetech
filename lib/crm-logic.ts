import type { CRMLead, CRMFinancials, CRMStatusHistory, AnalyticsMetrics, LeadLifecycleStatus } from './types'

export function calculateAnalytics(
    leads: CRMLead[],
    financials: CRMFinancials[],
    history: CRMStatusHistory[]
): AnalyticsMetrics {
    const totalConsultations = leads.length

    // Status counts for funnel
    const statusCounts = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1
        return acc
    }, {} as Record<LeadLifecycleStatus, number>)

    const lifecycleStages: LeadLifecycleStatus[] = [
        'Consultation Booked',
        'Discovery Completed',
        'Qualified Lead',
        'Proposal Sent',
        'Negotiation / Review',
        'Contract Signed'
    ]

    const conversionFunnel = lifecycleStages.map(status => {
        const count = leads.filter(l => {
            // Logic: if a lead is further in the funnel, they count for previous steps
            // For simplicity here, we'll just count current status or look at history if available
            // But better: count all leads that have EVER been in this status or beyond
            return true // Placeholder condition
        }).length

        // Improved logic: find leads that reached this stage or beyond
        const reachedStage = leads.filter(lead => {
            const stageIndex = lifecycleStages.indexOf(status);
            const currentStageIndex = lifecycleStages.indexOf(lead.status as LeadLifecycleStatus);
            return currentStageIndex >= stageIndex || currentStageIndex === -1; // -1 means it's beyond Contract Signed
        }).length

        return {
            status,
            count: reachedStage,
            percentage: totalConsultations > 0 ? Math.round((reachedStage / totalConsultations) * 100) : 0
        }
    })

    // Revenue Metrics
    const totalSigned = financials.reduce((sum, f) => sum + Number(f.agreed_value), 0)

    // Group by industry
    const byIndustryMap = leads.reduce((acc, lead) => {
        const leadFin = financials.find(f => f.lead_id === lead.id)
        if (leadFin && lead.industry) {
            acc[lead.industry] = (acc[lead.industry] || 0) + Number(leadFin.agreed_value)
        }
        return acc
    }, {} as Record<string, number>)

    const byIndustry = Object.entries(byIndustryMap).map(([industry, value]) => ({ industry, value }))

    // Win rate: Signed vs Proposals Sent
    const proposalsSent = leads.filter(l =>
        ['Proposal Sent', 'Negotiation / Review', 'Contract Signed', 'Project In Progress', 'Delivered / Handed Over', 'Retainer / Ongoing'].includes(l.status)
    ).length
    const contractsSigned = leads.filter(l =>
        ['Contract Signed', 'Project In Progress', 'Delivered / Handed Over', 'Retainer / Ongoing'].includes(l.status)
    ).length
    const winRate = proposalsSent > 0 ? Math.round((contractsSigned / proposalsSent) * 100) : 0

    return {
        totalConsultations,
        conversionFunnel,
        revenueData: {
            totalSigned,
            byMonth: [], // Would require grouping by contract_signed_date
            byIndustry,
            averageDealSize: contractsSigned > 0 ? Math.round(totalSigned / contractsSigned) : 0,
            winRate
        }
    }
}
