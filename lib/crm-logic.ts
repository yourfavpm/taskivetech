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

    // Group by country
    const byCountryMap = leads.reduce((acc, lead) => {
        const leadFin = financials.find(f => f.lead_id === lead.id)
        const country = lead.country || 'Unknown'
        if (!acc[country]) {
            acc[country] = { value: 0, count: 0 }
        }
        acc[country].count += 1
        if (leadFin) {
            acc[country].value += Number(leadFin.agreed_value)
        }
        return acc
    }, {} as Record<string, { value: number, count: number }>)

    const byCountry = Object.entries(byCountryMap).map(([country, data]) => ({
        country,
        value: data.value,
        count: data.count
    }))

    // Win rate: Signed vs Proposals Sent
    const proposalsSent = leads.filter(l =>
        ['Proposal Sent', 'Negotiation / Review', 'Contract Signed', 'Project In Progress', 'Delivered / Handed Over', 'Retainer / Ongoing'].includes(l.status)
    ).length
    const contractsSigned = leads.filter(l =>
        ['Contract Signed', 'Project In Progress', 'Delivered / Handed Over', 'Retainer / Ongoing'].includes(l.status)
    ).length
    const winRate = proposalsSent > 0 ? Math.round((contractsSigned / proposalsSent) * 100) : 0

    // Payment metrics
    const totalPaid = financials.reduce((sum, f) => sum + Number(f.amount_paid || 0), 0)
    const totalOutstanding = totalSigned - totalPaid

    // Revenue by month (based on contract_signed_date if available, else lead created_at)
    const revenueByMonthMap: Record<string, { signed: number; paid: number }> = {}
    leads.forEach(lead => {
        const leadFin = financials.find(f => f.lead_id === lead.id)
        if (leadFin && Number(leadFin.agreed_value) > 0) {
            const dateStr = lead.contract_signed_date || lead.created_at
            if (dateStr) {
                const date = new Date(dateStr)
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                if (!revenueByMonthMap[monthKey]) {
                    revenueByMonthMap[monthKey] = { signed: 0, paid: 0 }
                }
                revenueByMonthMap[monthKey].signed += Number(leadFin.agreed_value)
                revenueByMonthMap[monthKey].paid += Number(leadFin.amount_paid || 0)
            }
        }
    })

    const byMonth = Object.entries(revenueByMonthMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6) // Last 6 months
        .map(([month, data]) => ({ month, signed: data.signed, paid: data.paid }))

    // Leads trend by month
    const leadsTrendMap: Record<string, { newLeads: number; converted: number }> = {}
    leads.forEach(lead => {
        const createdDate = new Date(lead.created_at)
        const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`
        if (!leadsTrendMap[monthKey]) {
            leadsTrendMap[monthKey] = { newLeads: 0, converted: 0 }
        }
        leadsTrendMap[monthKey].newLeads += 1

        // Count as converted if reached Contract Signed or beyond
        const convertedStatuses = ['Contract Signed', 'Project In Progress', 'Delivered / Handed Over', 'Retainer / Ongoing']
        if (convertedStatuses.includes(lead.status)) {
            leadsTrendMap[monthKey].converted += 1
        }
    })

    const leadsTrend = Object.entries(leadsTrendMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6) // Last 6 months
        .map(([month, data]) => ({ month, newLeads: data.newLeads, converted: data.converted }))

    return {
        totalConsultations,
        conversionFunnel,
        revenueData: {
            totalSigned,
            totalPaid,
            totalOutstanding,
            byMonth,
            byIndustry,
            byCountry,
            averageDealSize: contractsSigned > 0 ? Math.round(totalSigned / contractsSigned) : 0,
            winRate
        },
        leadsTrend
    }
}
