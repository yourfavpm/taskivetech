'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CRMLead, LeadLifecycleStatus } from '@/lib/types'
import LeadTableView from './LeadTableView'
import LeadDetailView from './LeadDetailView'

const LIFECYCLE_STATUSES: LeadLifecycleStatus[] = [
    'Consultation Booked',
    'Discovery Completed',
    'Qualified Lead',
    'Proposal Sent',
    'Negotiation / Review',
    'Contract Signed',
    'Project In Progress',
    'Delivered / Handed Over',
    'Retainer / Ongoing',
    'Closed – Not a Fit',
    'Closed – Lost'
]

export default function PipelineView() {
    const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
    const [leads, setLeads] = useState<CRMLead[]>([])
    const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchLeads()
    }, [])

    const fetchLeads = async () => {
        const { data } = await supabase
            .from('crm_leads')
            .select('*')
            .order('updated_at', { ascending: false })

        if (data) setLeads(data)
        setLoading(false)
    }

    if (loading) return <div className="loading-state">Loading CRM pipeline...</div>

    return (
        <div className="crm-container">
            <div className="crm-header">
                <h1 className="page-title">Lead Management</h1>
                <div className="view-switcher">
                    <button
                        className={`switch-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                        onClick={() => setViewMode('kanban')}
                    >
                        Pipeline View
                    </button>
                    <button
                        className={`switch-btn ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                    >
                        Table View
                    </button>
                </div>
            </div>

            {viewMode === 'kanban' ? (
                <div className="pipeline-board">
                    {LIFECYCLE_STATUSES.map(status => (
                        <div key={status} className="pipeline-column">
                            <div className="column-header">
                                <h3>{status}</h3>
                                <span className="count">
                                    {leads.filter(l => l.status === status).length}
                                </span>
                            </div>

                            <div className="column-content">
                                {leads
                                    .filter(l => l.status === status)
                                    .map(lead => (
                                        <div
                                            key={lead.id}
                                            className="lead-card"
                                            onClick={() => setSelectedLead(lead)}
                                        >
                                            <div className="lead-company">{lead.company_name}</div>
                                            <div className="lead-contact">{lead.contact_name}</div>
                                            <div className="lead-footer">
                                                <span className="lead-source">{lead.source}</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <LeadTableView
                    leads={leads}
                    onSelectLead={setSelectedLead}
                />
            )}

            {selectedLead && (
                <LeadDetailView
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                    onUpdate={fetchLeads}
                />
            )}

            <style jsx>{`
        .crm-container {
          height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
        }
        
        .crm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #111;
          margin: 0;
        }

        .view-switcher {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 8px;
          gap: 4px;
        }

        .switch-btn {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          color: #64748b;
          transition: all 0.2s;
        }

        .switch-btn.active {
          background: #fff;
          color: #0f172a;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .pipeline-board {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding-bottom: 24px;
          flex: 1;
        }

        .pipeline-column {
          min-width: 280px;
          max-width: 280px;
          background: #f4f4f5;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          border: 1px solid #e4e4e7;
        }

        .column-header {
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e4e4e7;
          background: #fff;
          border-radius: 12px 12px 0 0;
        }

        .column-header h3 {
          font-size: 11px;
          font-weight: 600;
          color: #3f3f46;
          margin: 0;
        }

        .count {
          font-size: 11px;
          background: #e4e4e7;
          color: #71717a;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: 600;
        }

        .column-content {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          flex: 1;
        }

        .lead-card {
          background: #fff;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e4e4e7;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.1s;
        }

        .lead-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          border-color: #2563eb;
        }

        .lead-company {
          font-size: 14px;
          font-weight: 600;
          color: #18181b;
          margin-bottom: 4px;
        }

        .lead-contact {
          font-size: 12px;
          color: #71717a;
          margin-bottom: 12px;
        }

        .lead-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 8px;
          border-top: 1px solid #f4f4f5;
        }

        .lead-source {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #a1a1aa;
        }
        
        .loading-state {
          padding: 40px;
          text-align: center;
          color: #64748b;
        }
      `}</style>
        </div>
    )
}
