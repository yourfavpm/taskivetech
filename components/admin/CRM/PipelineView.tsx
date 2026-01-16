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
  const [showAddModal, setShowAddModal] = useState(false)
  const [newLead, setNewLead] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    industry: '',
    country: '',
    notes: ''
  })
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

  const handleAddLead = async () => {
    if (!newLead.company_name || !newLead.contact_name || !newLead.email) {
      alert('Please fill in Company, Contact Name, and Email')
      return
    }

    const { error } = await supabase.from('crm_leads').insert([{
      ...newLead,
      source: 'Manual Entry',
      status: 'Consultation Booked'
    }])

    if (!error) {
      setShowAddModal(false)
      setNewLead({ company_name: '', contact_name: '', email: '', phone: '', industry: '', country: '', notes: '' })
      fetchLeads()
    } else {
      alert('Error adding lead: ' + error.message)
    }
  }

  if (loading) return <div className="loading-state">Loading CRM pipeline...</div>

  return (
    <div className="crm-container">
      <div className="crm-header">
        <h1 className="page-title">Lead Management</h1>
        <div className="header-actions">
          <button className="add-lead-btn" onClick={() => setShowAddModal(true)}>
            + Add Lead
          </button>
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
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-modal" onClick={e => e.stopPropagation()}>
            <h2>Add New Lead</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  value={newLead.company_name}
                  onChange={e => setNewLead({ ...newLead, company_name: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="form-group">
                <label>Contact Name *</label>
                <input
                  type="text"
                  value={newLead.contact_name}
                  onChange={e => setNewLead({ ...newLead, contact_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="john@acme.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={newLead.phone}
                  onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                  placeholder="+1 555 123 4567"
                />
              </div>
              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  value={newLead.industry}
                  onChange={e => setNewLead({ ...newLead, industry: e.target.value })}
                  placeholder="Technology"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={newLead.country}
                  onChange={e => setNewLead({ ...newLead, country: e.target.value })}
                  placeholder="Canada"
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                value={newLead.notes}
                onChange={e => setNewLead({ ...newLead, notes: e.target.value })}
                placeholder="Additional notes about this lead..."
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="submit-btn" onClick={handleAddLead}>Add Lead</button>
            </div>
          </div>
        </div>
      )}

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

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .add-lead-btn {
          background: #0f172a;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-lead-btn:hover {
          background: #1e293b;
        }

        .modal-overlay {
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
        }

        .add-modal {
          background: #fff;
          width: 100%;
          max-width: 600px;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }

        .add-modal h2 {
          margin: 0 0 24px 0;
          font-size: 20px;
          font-weight: 700;
          color: #111;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-group input, .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .cancel-btn {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
        }

        .submit-btn {
          background: #0f172a;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .submit-btn:hover {
          background: #1e293b;
        }
      `}</style>
    </div>
  )
}
