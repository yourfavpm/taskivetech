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
  const [isEditingFin, setIsEditingFin] = useState(false)
  const [finForm, setFinForm] = useState({ agreed_value: 0, amount_paid: 0, payment_model: 'One-time' as any })
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

    if (finRes.data) {
      setFinancials(finRes.data)
      setFinForm({
        agreed_value: finRes.data.agreed_value,
        amount_paid: finRes.data.amount_paid,
        payment_model: finRes.data.payment_model
      })
    }
    if (histRes.data) setHistory(histRes.data)
    setLoading(false)
  }

  const logAuditAction = async (action: string, details: string) => {
    await supabase.from('crm_status_history').insert([{
      lead_id: lead.id,
      old_status: lead.status,
      new_status: lead.status,
      notes: `[${action}] ${details}`
    }])
  }

  const saveFinancials = async () => {
    setIsUpdating(true)
    const payload = {
      lead_id: lead.id,
      ...finForm,
      updated_at: new Date().toISOString()
    }

    let error;
    const isNew = !financials
    if (financials) {
      ({ error } = await supabase.from('crm_financials').update(payload).eq('id', financials.id))
    } else {
      ({ error } = await supabase.from('crm_financials').insert([payload]))
    }

    if (!error) {
      // Audit the financial update
      await logAuditAction(
        isNew ? 'Financials Created' : 'Financials Updated',
        `Value: $${finForm.agreed_value.toLocaleString()}, Paid: $${finForm.amount_paid.toLocaleString()}, Model: ${finForm.payment_model}`
      )
      setIsEditingFin(false)
      fetchLeadData()
    }
    setIsUpdating(false)
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

  const handleDeleteLead = async () => {
    const confirmed = confirm(`Are you sure you want to delete "${lead.company_name}"? This action cannot be undone.`)
    if (!confirmed) return

    setIsUpdating(true)
    const { error } = await supabase.from('crm_leads').delete().eq('id', lead.id)

    if (!error) {
      onClose()
      onUpdate()
    } else {
      alert('Error deleting lead: ' + error.message)
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
                  <div className="info-item">
                    <label>Country</label>
                    <span>{lead.country || 'Not specified'}</span>
                  </div>
                </div>
              </section>

              <section className="info-section">
                <div className="section-header">
                  <h3>Financial Management (USD)</h3>
                  {['Contract Signed', 'Project In Progress', 'Delivered / Handed Over', 'Retainer / Ongoing'].includes(lead.status) && (
                    <button className="edit-btn" onClick={() => setIsEditingFin(!isEditingFin)}>
                      {isEditingFin ? 'Cancel' : (financials ? 'Update' : 'Initialize')}
                    </button>
                  )}
                </div>

                {isEditingFin ? (
                  <div className="financials-form">
                    <div className="form-group">
                      <label>Agreed Project Cost (USD)</label>
                      <input
                        type="number"
                        value={finForm.agreed_value}
                        onChange={e => setFinForm({ ...finForm, agreed_value: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Amount Paid to Date (USD)</label>
                      <input
                        type="number"
                        value={finForm.amount_paid}
                        onChange={e => setFinForm({ ...finForm, amount_paid: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Payment Model</label>
                      <select
                        value={finForm.payment_model}
                        onChange={e => setFinForm({ ...finForm, payment_model: e.target.value as any })}
                      >
                        <option value="One-time">One-time</option>
                        <option value="Milestone-based">Milestone-based</option>
                        <option value="Retainer">Retainer</option>
                      </select>
                    </div>
                    <button className="save-btn" onClick={saveFinancials} disabled={isUpdating}>
                      Update Financials
                    </button>
                  </div>
                ) : financials ? (
                  <div className="financials-grid">
                    <div className="fin-item">
                      <label>Agreed Value</label>
                      <span className="value">$ {Number(financials.agreed_value).toLocaleString()}</span>
                    </div>
                    <div className="fin-item">
                      <label>Amount Paid</label>
                      <span className="value">$ {Number(financials.amount_paid).toLocaleString()}</span>
                    </div>
                    <div className="fin-item destac">
                      <label>Outstanding</label>
                      <span className="value">$ {Number(financials.outstanding_balance).toLocaleString()}</span>
                    </div>
                    <div className="fin-item">
                      <label>Payment Model</label>
                      <span>{financials.payment_model}</span>
                    </div>
                  </div>
                ) : (
                  <p className="no-data">Move lead to "Contract Signed" to manage financials.</p>
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
                <button
                  className="delete-btn"
                  onClick={handleDeleteLead}
                  disabled={isUpdating}
                >
                  Delete Lead
                </button>
              </section>
            </div>

            {/* Right Column: History/Timeline */}
            <div className="side-info">
              <section className="info-section">
                <h3>Lifecycle History</h3>
                <div className="timeline">
                  {history.map((entry, idx) => (
                    <div key={entry.id} className="timeline-item">
                      <div className={`timeline-marker ${entry.notes ? 'action-marker' : ''}`}></div>
                      <div className="timeline-content">
                        <span className="timeline-date">{new Date(entry.changed_at).toLocaleDateString()}</span>
                        {entry.notes ? (
                          <p className="timeline-text audit-note">{entry.notes}</p>
                        ) : (
                          <p className="timeline-text">
                            {entry.old_status ? `Changed from ${entry.old_status} to ` : 'Lead created as '}
                            <strong>{entry.new_status}</strong>
                          </p>
                        )}
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
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .section-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 20px;
        }

        .edit-btn {
           background: #f1f5f9;
           border: 1px solid #e2e8f0;
           padding: 6px 12px;
           border-radius: 6px;
           font-size: 11px;
           font-weight: 600;
           color: #475569;
           cursor: pointer;
           transition: all 0.2s;
        }

        .edit-btn:hover {
           background: #e2e8f0;
           color: #0f172a;
        }

        .financials-form {
           background: #f8fafc;
           padding: 20px;
           border-radius: 12px;
           border: 1px solid #e2e8f0;
        }

        .form-group {
           margin-bottom: 16px;
        }

        .form-group label {
           display: block;
           font-size: 11px;
           color: #64748b;
           margin-bottom: 4px;
           font-weight: 500;
        }

        .form-group input, .form-group select {
           width: 100%;
           padding: 10px;
           border: 1px solid #e2e8f0;
           border-radius: 8px;
           font-size: 14px;
        }

        .save-btn {
           width: 100%;
           background: #0f172a;
           color: #fff;
           border: none;
           padding: 12px;
           border-radius: 8px;
           font-weight: 600;
           cursor: pointer;
           margin-top: 8px;
        }

        .save-btn:hover { background: #1e293b; }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

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

        .delete-btn {
          width: 100%;
          margin-top: 16px;
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          background: #fee2e2;
          border-color: #f87171;
        }

        .delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-marker {
          border-color: #f59e0b !important;
          background: #fef3c7 !important;
        }

        .audit-note {
          background: #fffbeb;
          padding: 6px 10px;
          border-radius: 4px;
          border-left: 3px solid #f59e0b;
          font-size: 12px;
          color: #92400e;
        }
      `}</style>
    </div>
  )
}
