'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CRMLead, CRMFinancials, CRMStatusHistory, LeadLifecycleStatus } from '@/lib/types'

interface LeadDetailViewProps {
    lead: CRMLead
    onClose: () => void
    onUpdate: () => void
}

export default function LeadDetailView({ lead, onClose, onUpdate }: LeadDetailViewProps) {
    const [financials, setFinancials] = useState<CRMFinancials | null>(null)
    const [history, setHistory] = useState<CRMStatusHistory[]>([])
    const [loading, setLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchLeadData()
    }, [lead.id])

    const fetchLeadData = async () => {
        setLoading(true)
        const [finRes, histRes] = await Promise.all([
            supabase.from('crm_financials').select('*').eq('lead_id', lead.id).single(),
            supabase.from('crm_status_history').select('*').eq('lead_id', lead.id).order('changed_at', { ascending: false })
        ])

        if (finRes.data) setFinancials(finRes.data)
        if (histRes.data) setHistory(histRes.data)
        setLoading(false)
    }

    const handleStatusChange = async (newStatus: LeadLifecycleStatus) => {
        setIsUpdating(true)
        const { error } = await supabase
            .from('crm_leads')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', lead.id)

        if (!error) {
            onUpdate()
            fetchLeadData()
        }
        setIsUpdating(false)
    }

    if (loading) return <div className="detail-modal">Loading details...</div>

    return (
        <div className="detail-overlay" onClick={onClose}>
            <div className="detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-info">
                        <h2>{lead.company_name}</h2>
                        <span className={`status-badge ${lead.status.replace(/\s+/g, '-').toLowerCase()}`}>
                            {lead.status}
                        </span>
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-content">
                    <div className="grid-layout">
                        {/* Left Column: Basic Info & Financials */}
                        <div className="main-info">
                            <section className="info-section">
                                <h3>Contact Information</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Contact Name</label>
                                        <span>{lead.contact_name}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Email</label>
                                        <span>{lead.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Phone</label>
                                        <span>{lead.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Industry</label>
                                        <span>{lead.industry || 'Not specified'}</span>
                                    </div>
                                </div>
                            </section>

                            <section className="info-section">
                                <h3>Financial Summary</h3>
                                {financials ? (
                                    <div className="financials-grid">
                                        <div className="fin-item">
                                            <label>Agreed Value</label>
                                            <span className="value">{financials.currency} {financials.agreed_value.toLocaleString()}</span>
                                        </div>
                                        <div className="fin-item">
                                            <label>Amount Paid</label>
                                            <span className="value">{financials.currency} {financials.amount_paid.toLocaleString()}</span>
                                        </div>
                                        <div className="fin-item destac">
                                            <label>Outstanding</label>
                                            <span className="value">{financials.currency} {financials.outstanding_balance.toLocaleString()}</span>
                                        </div>
                                        <div className="fin-item">
                                            <label>Payment Model</label>
                                            <span>{financials.payment_model}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="no-data">No financial data entry yet for this lead.</p>
                                )}
                            </section>

                            <section className="info-section">
                                <h3>Actions</h3>
                                <div className="status-updater">
                                    <label>Update Status</label>
                                    <select
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(e.target.value as LeadLifecycleStatus)}
                                        disabled={isUpdating}
                                    >
                                        {[
                                            'Consultation Booked', 'Discovery Completed', 'Qualified Lead',
                                            'Proposal Sent', 'Negotiation / Review', 'Contract Signed',
                                            'Project In Progress', 'Delivered / Handed Over', 'Retainer / Ongoing',
                                            'Closed – Not a Fit', 'Closed – Lost'
                                        ].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: History/Timeline */}
                        <div className="side-info">
                            <section className="info-section">
                                <h3>Lifecycle History</h3>
                                <div className="timeline">
                                    {history.map((entry, idx) => (
                                        <div key={entry.id} className="timeline-item">
                                            <div className="timeline-marker"></div>
                                            <div className="timeline-content">
                                                <span className="timeline-date">{new Date(entry.changed_at).toLocaleDateString()}</span>
                                                <p className="timeline-text">
                                                    {entry.old_status ? `Changed from ${entry.old_status} to ` : 'Lead created as '}
                                                    <strong>{entry.new_status}</strong>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="info-section">
                                <h3>Internal Notes</h3>
                                <div className="notes-box">
                                    {lead.notes || 'No internal notes yet.'}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .detail-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 40px;
        }

        .detail-modal {
          background: #fff;
          width: 100%;
          max-width: 1000px;
          max-height: 90vh;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e4e4e7;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          color: #111;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 32px;
          color: #a1a1aa;
          cursor: pointer;
        }

        .modal-content {
          padding: 24px;
          overflow-y: auto;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 32px;
        }

        .info-section {
          margin-bottom: 32px;
        }

        .info-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .info-item label, .fin-item label {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 4px;
        }

        .info-item span, .fin-item span {
          color: #334155;
          font-weight: 500;
        }

        .financials-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          gap: 20px;
        }

        .value {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
        }

        .destac .value {
          color: #ef4444;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          background: #f1f5f9;
        }

        .timeline {
          border-left: 2px solid #e2e8f0;
          padding-left: 24px;
          position: relative;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 24px;
        }

        .timeline-marker {
          position: absolute;
          left: -33px;
          top: 4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #3b82f6;
        }

        .timeline-date {
          font-size: 11px;
          color: #94a3b8;
        }

        .timeline-text {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #475569;
        }

        .notes-box {
          background: #fffbeb;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #fef3c7;
          font-size: 13px;
          color: #92400e;
          line-height: 1.6;
        }

        .status-updater select {
          width: 100%;
          padding: 10px;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          background: #fff;
        }
      `}</style>
        </div>
    )
}
