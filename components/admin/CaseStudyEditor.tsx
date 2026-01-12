'use client'

import { useState, useEffect } from 'react'
import { CaseStudy } from '@/lib/types'

interface CaseStudyEditorProps {
    initialData?: CaseStudy | null
    onSave: (data: Partial<CaseStudy>) => Promise<void>
    onCancel: () => void
}

export default function CaseStudyEditor({ initialData, onSave, onCancel }: CaseStudyEditorProps) {
    const [formData, setFormData] = useState<Partial<CaseStudy>>({
        title: '',
        slug: '',
        industry: '',
        summary: '',
        challenge: '',
        solution: '',
        outcome: '',
        process: '',
        featured: false,
        published: false,
        images: []
    })

    // To support multiple images input simply as comma-separated string for now
    const [imagesString, setImagesString] = useState('')

    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
            setImagesString(initialData.images?.join(', ') || '')
        }
    }, [initialData])

    const handleChange = (field: keyof CaseStudy, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        // Process images
        const processedImages = imagesString.split(',').map(s => s.trim()).filter(Boolean)
        const finalData = { ...formData, images: processedImages }

        await onSave(finalData)
    }

    return (
        <div className="editor-overlay">
            <div className="editor-modal">
                <div className="editor-header">
                    <h2>{initialData ? 'Edit Case Study' : 'New Case Study'}</h2>
                    <button onClick={onCancel} className="close-btn">×</button>
                </div>

                <form onSubmit={handleSave} className="editor-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                value={formData.title || ''}
                                onChange={e => handleChange('title', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Slug (URL)</label>
                            <input
                                value={formData.slug || ''}
                                onChange={e => handleChange('slug', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Industry</label>
                            <input
                                value={formData.industry || ''}
                                onChange={e => handleChange('industry', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group full">
                        <label>Summary (Homepage Card)</label>
                        <textarea
                            value={formData.summary || ''}
                            onChange={e => handleChange('summary', e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div className="form-group full">
                        <label>The Challenge</label>
                        <textarea
                            value={formData.challenge || ''}
                            onChange={e => handleChange('challenge', e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="form-group full">
                        <label>The Solution</label>
                        <textarea
                            value={formData.solution || ''}
                            onChange={e => handleChange('solution', e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="form-group full">
                        <label>Process (Steps)</label>
                        <textarea
                            value={formData.process || ''}
                            onChange={e => handleChange('process', e.target.value)}
                            rows={3}
                            placeholder="Step 1... Step 2..."
                        />
                    </div>

                    <div className="form-group full">
                        <label>Outcome & Results</label>
                        <textarea
                            value={formData.outcome || ''}
                            onChange={e => handleChange('outcome', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-group full">
                        <label>Showcase Images (Comma separated URLs)</label>
                        <input
                            value={imagesString}
                            onChange={e => setImagesString(e.target.value)}
                            placeholder="https://..., https://..."
                        />
                    </div>

                    <div className="toggle-row">
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={formData.featured || false}
                                onChange={e => handleChange('featured', e.target.checked)}
                            />
                            Featured Project
                        </label>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={formData.published || false}
                                onChange={e => handleChange('published', e.target.checked)}
                            />
                            Published
                        </label>
                    </div>

                    <div className="editor-actions">
                        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
                        <button type="submit" className="save-btn">Save Project</button>
                    </div>
                </form>
            </div>

            <style jsx>{`
        .editor-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .editor-modal {
          background: #fff;
          width: 90%; max-width: 800px;
          height: 90vh;
          border-radius: 12px;
          display: flex; flex-direction: column;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }

        .editor-header {
          padding: 24px;
          border-bottom: 1px solid #eee;
          display: flex; justify-content: space-between; align-items: center;
        }
        .editor-header h2 { font-size: 20px; font-weight: 700; margin: 0; }
        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #666; }

        .editor-form { padding: 32px; overflow-y: auto; flex: 1; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-group.full { width: 100%; }
        
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 8px; }
        .form-group input, .form-group textarea {
          width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px;
          font-size: 15px;
        }
        .form-group input:focus, .form-group textarea:focus { border-color: #2563EB; outline: none; }

        .toggle-row { display: flex; gap: 24px; margin: 24px 0; padding: 20px; background: #f9f9f9; border-radius: 8px; }
        .toggle { display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer; }

        .editor-actions {
          padding-top: 24px; border-top: 1px solid #eee;
          display: flex; justify-content: flex-end; gap: 12px;
        }

        .cancel-btn {
          padding: 10px 20px; background: transparent; border: 1px solid #ddd;
          border-radius: 6px; font-weight: 600; cursor: pointer;
        }
        .save-btn {
          padding: 10px 24px; background: #111; color: #fff; border: none;
          border-radius: 6px; font-weight: 600; cursor: pointer;
        }
      `}</style>
        </div>
    )
}
