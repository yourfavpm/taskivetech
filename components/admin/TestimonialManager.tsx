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
    created_at: string
}

export default function TestimonialManager() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({
        name: '',
        role: '',
        company: '',
        quote: '',
        avatar: '',
        active: true
    })

    const supabase = createClient()

    useEffect(() => {
        fetchTestimonials()
    }, [])

    async function fetchTestimonials() {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching testimonials:', error)
        } else {
            setTestimonials(data || [])
        }
        setIsLoading(false)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const { data, error } = currentTestimonial.id
            ? await supabase
                .from('testimonials')
                .update(currentTestimonial)
                .eq('id', currentTestimonial.id)
            : await supabase
                .from('testimonials')
                .insert([currentTestimonial])

        if (error) {
            alert('Error saving testimonial: ' + error.message)
        } else {
            setIsEditing(false)
            setCurrentTestimonial({ name: '', role: '', company: '', quote: '', avatar: '', active: true })
            fetchTestimonials()
        }
    }

    async function toggleActive(id: string, currentStatus: boolean) {
        const { error } = await supabase
            .from('testimonials')
            .update({ active: !currentStatus })
            .eq('id', id)

        if (error) {
            console.error('Error toggling status:', error)
        } else {
            fetchTestimonials()
        }
    }

    async function deleteTestimonial(id: string) {
        if (!confirm('Are you sure you want to delete this testimonial?')) return

        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting testimonial:', error)
        } else {
            fetchTestimonials()
        }
    }

    return (
        <div className="testimonial-manager">
            <div className="header-actions">
                <h1>Testimonials</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setCurrentTestimonial({ name: '', role: '', company: '', quote: '', avatar: '', active: true })
                        setIsEditing(true)
                    }}
                >
                    Add Testimonial
                </button>
            </div>

            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>{currentTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={currentTestimonial.name}
                                        onChange={e => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Initials (Avatar)</label>
                                    <input
                                        type="text"
                                        maxLength={2}
                                        value={currentTestimonial.avatar}
                                        onChange={e => setCurrentTestimonial({ ...currentTestimonial, avatar: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <input
                                        type="text"
                                        value={currentTestimonial.role}
                                        onChange={e => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company</label>
                                    <input
                                        type="text"
                                        value={currentTestimonial.company}
                                        onChange={e => setCurrentTestimonial({ ...currentTestimonial, company: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Quote</label>
                                <textarea
                                    rows={4}
                                    value={currentTestimonial.quote}
                                    onChange={e => setCurrentTestimonial({ ...currentTestimonial, quote: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Testimonial</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="testimonials-list">
                {isLoading ? (
                    <p>Loading testimonials...</p>
                ) : testimonials.length === 0 ? (
                    <p>No testimonials found.</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Quote</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testimonials.map(t => (
                                    <tr key={t.id}>
                                        <td>
                                            <div className="client-info">
                                                <div className="avatar">{t.avatar}</div>
                                                <div>
                                                    <div className="name">{t.name}</div>
                                                    <div className="meta">{t.role} @ {t.company}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="quote-cell">{t.quote.substring(0, 100)}...</td>
                                        <td>
                                            <span className={`status-badge ${t.active ? 'active' : 'inactive'}`}>
                                                {t.active ? 'Active' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <button onClick={() => toggleActive(t.id, t.active)}>{t.active ? 'Hide' : 'Show'}</button>
                                                <button onClick={() => { setCurrentTestimonial(t); setIsEditing(true); }}>Edit</button>
                                                <button className="delete" onClick={() => deleteTestimonial(t.id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style jsx>{`
                .header-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-card {
                    background: white;
                    padding: 32px;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 600px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 8px;
                }

                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 24px;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .admin-table th, .admin-table td {
                    padding: 16px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }

                .client-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .avatar {
                    width: 36px;
                    height: 36px;
                    background: #eee;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                }

                .name {
                    font-weight: 600;
                    font-size: 14px;
                }

                .meta {
                    font-size: 12px;
                    color: #666;
                }

                .quote-cell {
                    max-width: 300px;
                    font-size: 13px;
                    color: #444;
                }

                .status-badge {
                    font-size: 12px;
                    padding: 4px 8px;
                    border-radius: 4px;
                }

                .status-badge.active { background: #dcfce7; color: #166534; }
                .status-badge.inactive { background: #f3f4f6; color: #374151; }

                .actions {
                    display: flex;
                    gap: 8px;
                }

                .actions button {
                    background: none;
                    border: none;
                    color: #2563EB;
                    cursor: pointer;
                    font-size: 13px;
                }

                .actions button.delete { color: #dc2626; }
            `}</style>
        </div>
    )
}
