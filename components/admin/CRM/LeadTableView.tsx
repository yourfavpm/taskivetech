'use client'

import { useState } from 'react'
import type { CRMLead, LeadLifecycleStatus } from '@/lib/types'

interface LeadTableViewProps {
    leads: CRMLead[]
    onSelectLead: (lead: CRMLead) => void
}

export default function LeadTableView({ leads, onSelectLead }: LeadTableViewProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

        return matchesSearch && matchesStatus
    })

    return (
        <div className="table-view">
            <div className="table-controls">
                <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Statuses</option>
                    <option value="Consultation Booked">Consultation Booked</option>
                    <option value="Discovery Completed">Discovery Completed</option>
                    <option value="Qualified Lead">Qualified Lead</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation / Review">Negotiation / Review</option>
                    <option value="Contract Signed">Contract Signed</option>
                    <option value="Project In Progress">Project In Progress</option>
                    <option value="Delivered / Handed Over">Delivered / Handed Over</option>
                    <option value="Retainer / Ongoing">Retainer / Ongoing</option>
                    <option value="Closed – Not a Fit">Closed – Not a Fit</option>
                    <option value="Closed – Lost">Closed – Lost</option>
                </select>
            </div>

            <div className="table-container">
                <table className="leads-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Industry</th>
                            <th>Source</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} onClick={() => onSelectLead(lead)}>
                                <td>
                                    <div className="company-info">
                                        <span className="company-name">{lead.company_name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-info">
                                        <span className="contact-name">{lead.contact_name}</span>
                                        <span className="contact-email">{lead.email}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${lead.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td>{lead.industry || '—'}</td>
                                <td><span className="source-tag">{lead.source}</span></td>
                                <td>{new Date(lead.updated_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .table-view {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e4e4e7;
          display: flex;
          flex-direction: column;
        }

        .table-controls {
          padding: 16px;
          display: flex;
          gap: 12px;
          border-bottom: 1px solid #e4e4e7;
        }

        .search-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #e4e4e7;
          border-radius: 6px;
          font-size: 14px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #e4e4e7;
          border-radius: 6px;
          font-size: 14px;
          background: #fff;
        }

        .table-container {
          overflow-x: auto;
        }

        .leads-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .leads-table th {
          padding: 12px 16px;
          background: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          border-bottom: 1px solid #e4e4e7;
        }

        .leads-table td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          cursor: pointer;
        }

        .leads-table tr:hover td {
          background: #f8fafc;
        }

        .company-name {
          font-weight: 500;
          color: #1e293b;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
        }

        .contact-name {
          font-weight: 500;
          color: #334155;
        }

        .contact-email {
          font-size: 12px;
          color: #64748b;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          background: #f1f5f9;
          color: #475569;
        }

        .status-badge.consultation-booked { background: #dcfce7; color: #166534; }
        .status-badge.contract-signed { background: #dbeafe; color: #1e40af; }
        .status-badge.project-in-progress { background: #fef9c3; color: #854d0e; }
        .status-badge.closed-lost { background: #fee2e2; color: #991b1b; }

        .source-tag {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
        }
      `}</style>
        </div>
    )
}
