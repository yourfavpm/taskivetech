'use client'

import { useState } from 'react'
import { CaseStudy } from '@/lib/types'

interface CaseStudyManagerProps {
    caseStudies: CaseStudy[]
    onToggleFeatured: (id: string, current: boolean) => Promise<void>
    onEdit: (caseStudy: CaseStudy) => void
    onAdd: () => void
}

export default function CaseStudyManager({
    caseStudies,
    onToggleFeatured,
    onEdit,
    onAdd
}: CaseStudyManagerProps) {
    return (
        <div className="cs-manager">
            <div className="header">
                <div>
                    <h1>Case Studies</h1>
                    <p>Manage your portfolio projects. Toggling 'Featured' displays them on the homepage.</p>
                </div>
                <button onClick={onAdd} className="add-btn">
                    + New Case Study
                </button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Industry</th>
                            <th>Status</th>
                            <th>Published</th>
                            <th className="right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {caseStudies.length === 0 && (
                            <tr>
                                <td colSpan={5} className="empty">No case studies found. Create one to get started.</td>
                            </tr>
                        )}
                        {caseStudies.map(cs => (
                            <tr key={cs.id}>
                                <td>
                                    <span className="title">{cs.title}</span>
                                    <span className="slug">/{cs.slug}</span>
                                </td>
                                <td>{cs.industry}</td>
                                <td>
                                    <button
                                        onClick={() => onToggleFeatured(cs.id, cs.featured || false)}
                                        className={`toggle-btn ${cs.featured ? 'on' : 'off'}`}
                                    >
                                        {cs.featured ? 'Featured' : 'Standard'}
                                    </button>
                                </td>
                                <td>
                                    <span className={`status-pill ${cs.published ? 'pub' : 'draft'}`}>
                                        {cs.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="right">
                                    <button onClick={() => onEdit(cs)} className="edit-btn">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .cs-manager { max-width: 1000px; margin: 0 auto; }
        
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 32px; 
        }
        .header h1 { font-size: 28px; font-weight: 700; color: #111; margin-bottom: 8px; }
        .header p { color: #666; font-size: 15px; }

        .add-btn {
          padding: 12px 24px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s;
        }
        .add-btn:hover { background: #333; }

        .table-container {
          background: #fff;
          border: 1px solid #eaeaea;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { 
          text-align: left; 
          padding: 16px 24px; 
          border-bottom: 1px solid #eaeaea; 
          background: #fafafa;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #666;
        }
        
        .data-table td { 
          padding: 16px 24px; 
          border-bottom: 1px solid #f5f5f5; 
          font-size: 14px;
          color: #111;
          vertical-align: middle;
        }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: #fafafa; }

        .right { text-align: right; }

        .title { display: block; font-weight: 600; font-size: 15px; margin-bottom: 2px; }
        .slug { font-size: 12px; color: #888; font-family: monospace; }
        
        .empty { text-align: center; color: #888; padding: 40px; }

        /* Buttons */
        .toggle-btn { 
          padding: 6px 12px; 
          border-radius: 20px; 
          border: none; 
          font-size: 12px; 
          font-weight: 600; 
          cursor: pointer; 
          transition: 0.2s;
        }
        .toggle-btn.on { background: #ECFDF5; color: #059669; }
        .toggle-btn.off { background: #f3f4f6; color: #666; }
        .toggle-btn:hover { opacity: 0.8; }

        .status-pill {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        .status-pill.pub { color: #2563EB; background: #eff6ff; }
        .status-pill.draft { color: #666; background: #f3f4f6; }

        .edit-btn {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid #ddd;
          color: #444;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
        }
        .edit-btn:hover { border-color: #999; color: #111; }
      `}</style>
        </div>
    )
}
