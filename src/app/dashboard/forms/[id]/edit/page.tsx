'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'file' | 'multifile'

interface FormField {
  id?: string
  label: string
  type: FieldType
  required: boolean
  options: string[] | null // strictly array for select/multiselect/radio/checkbox
  placeholder: string | null
}

export default function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [form, setForm] = useState<any>(null)
  const [fields, setFields] = useState<FormField[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchForm()
  }, [])

  const fetchForm = async () => {
    try {
      const res = await fetch(`/api/forms/${resolvedParams.id}`)
      if (!res.ok) throw new Error('Failed to fetch form')
      const data = await res.json()

      let desc = data.description || ''
      let theme = 'default'
      if (desc.includes('|||THEME:')) {
        const parts = desc.split('|||THEME:')
        desc = parts[0]
        theme = parts[1]
      }

      setForm({ ...data, description: desc, theme })
      setFields(data.form_fields || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addField = (type: FieldType) => {
    setFields([...fields, {
      label: `New field`,
      type,
      required: false,
      options: ['select', 'multiselect', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : null,
      placeholder: null
    }])
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...updates }
    setFields(newFields)
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const newFields = [...fields]
    const options = [...(newFields[fieldIndex].options || [])]
    options[optionIndex] = value
    newFields[fieldIndex].options = options
    setFields(newFields)
  }

  const addOption = (fieldIndex: number) => {
    const newFields = [...fields]
    const options = [...(newFields[fieldIndex].options || [])]
    options.push(`Option ${options.length + 1}`)
    newFields[fieldIndex].options = options
    setFields(newFields)
  }

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...fields]
    const options = [...(newFields[fieldIndex].options || [])]
    newFields[fieldIndex].options = options.filter((_, i) => i !== optionIndex)
    setFields(newFields)
  }

  const saveForm = async () => {
    setSaving(true)
    setError('')
    try {
      // 1. Save form settings (title, description, published)
      const saveDescription = form.description + (form.theme && form.theme !== 'default' ? `|||THEME:${form.theme}` : '')

      await fetch(`/api/forms/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: saveDescription,
          published: form.published
        })
      })

      // 2. Save fields
      const res = await fetch(`/api/forms/${resolvedParams.id}/fields`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      })

      if (!res.ok) throw new Error('Failed to save fields')

      alert('Form saved successfully!')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading builder...</div>
  if (error && !form) return <div className="p-8 text-red-500 text-center">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Builder Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider text-xs">Form Builder</span>
              <h1 className="text-lg font-bold text-gray-900 truncate max-w-sm">{form?.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 rounded-full py-1 px-3">
              <span className="text-sm font-medium text-gray-700">Published</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form?.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${form?.published ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${form?.published ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
            <button
              onClick={saveForm}
              disabled={saving}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Form'}
            </button>
          </div>
        </div>
      </header>

      {/* Builder Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex gap-8 items-start">

        {/* Left Sidebar: Field Palette */}
        <aside className="w-64 shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Add Fields</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: 'text', label: 'Short Text', icon: 'M4 6h16M4 12h16M4 18h7' },
              { type: 'textarea', label: 'Long Text', icon: 'M4 6h16M4 12h16M4 18h16' },
              { type: 'email', label: 'Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              { type: 'number', label: 'Number', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
              { type: 'select', label: 'Dropdown', icon: 'M19 9l-7 7-7-7' },
              { type: 'multiselect', label: 'Multi-Select', icon: 'M4 6h16M4 12h16m-7 6h7' },
              { type: 'radio', label: 'Radio', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { type: 'checkbox', label: 'Checkbox', icon: 'M5 13l4 4L19 7' },
              { type: 'file', label: 'File', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
              { type: 'multifile', label: 'Multi-File', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
            ].map((btn) => (
              <button
                key={btn.type}
                onClick={() => addField(btn.type as FieldType)}
                className="flex flex-col items-center justify-center p-3 text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-100 rounded-lg transition-all"
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={btn.icon}></path>
                </svg>
                <span className="text-[10px] font-medium text-center leading-tight">{btn.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Canvas */}
        <div className="flex-1 space-y-6">
          {/* Form Settings Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <input
              type="text"
              value={form?.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="text-3xl font-bold text-gray-900 w-full outline-none border-b-2 border-transparent focus:border-indigo-100 placeholder:text-gray-300 transition-colors pb-1"
              placeholder="Form Title"
            />
            <textarea
              value={form?.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-2 text-gray-600 w-full outline-none border-b border-transparent focus:border-gray-200 placeholder:text-gray-300 transition-colors resize-none"
              placeholder="Form description (optional)"
              rows={2}
            />

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Form Template Theme:</span>
              <div className="flex-1 flex gap-3 flex-wrap">
                {[
                  { id: 'default', name: 'Clean Minimal' },
                  { id: 'playful', name: 'Playful & Creative' },
                  { id: 'elegant', name: 'Elegant Serif' },
                  { id: 'dark', name: 'Dark Mode' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setForm({ ...form, theme: t.id })}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all focus:outline-none ${form?.theme === t.id ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fields List */}
          {fields.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center flex flex-col items-center justify-center text-gray-500">
              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Your form is empty</h3>
              <p className="text-sm">Click the buttons on the left to add fields to your form.</p>
            </div>
          ) : (
            <div className="space-y-4 pb-20">
              {fields.map((field, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 group relative animate-in fade-in slide-in-from-bottom-2">
                  {/* Delete Button */}
                  <button
                    onClick={() => removeField(index)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-red-50 p-1.5 rounded-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>

                  <div className="flex gap-4">
                    <div className="text-gray-300 mt-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                    </div>

                    <div className="flex-1 space-y-4">
                      {/* Field Label & Required */}
                      <div className="flex items-start justify-between mr-10">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                          className="text-lg font-semibold text-gray-900 w-full max-w-md outline-none border-b border-transparent focus:border-indigo-200 bg-transparent"
                          placeholder="Question Label"
                        />
                        <div className="flex items-center gap-4 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{field.type}</span>
                          <div className="h-4 w-px bg-gray-300"></div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(index, { required: e.target.checked })}
                              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-sm text-gray-600">Required</span>
                          </label>
                        </div>
                      </div>

                      {/* Field Options Configuration (Select/Radio/Checkbox) */}
                      {['select', 'multiselect', 'radio', 'checkbox'].includes(field.type) && field.options && (
                        <div className="pl-4 border-l-2 border-indigo-100 space-y-2 mt-4 text-sm">
                          {field.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              {field.type === 'radio' && <div className="w-3 h-3 rounded-full border border-gray-300"></div>}
                              {field.type === 'checkbox' && <div className="w-3 h-3 rounded border border-gray-300"></div>}
                              {['select', 'multiselect'].includes(field.type) && <span className="text-gray-400">{optIdx + 1}.</span>}

                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(index, optIdx, e.target.value)}
                                className="flex-1 max-w-sm outline-none border-b border-dashed border-gray-300 focus:border-indigo-400 bg-transparent text-gray-700 pb-0.5"
                              />
                              <button
                                onClick={() => removeOption(index, optIdx)}
                                className="text-gray-300 hover:text-red-500"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addOption(index)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 flex items-center text-xs"
                          >
                            + Add Option
                          </button>
                        </div>
                      )}

                      {/* Field Placeholder Configuration (Text/Number) */}
                      {['text', 'textarea', 'email', 'number'].includes(field.type) && (
                        <div className="mt-4">
                          <input
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) => updateField(index, { placeholder: e.target.value })}
                            className="w-full max-w-md outline-none border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-300 text-gray-600"
                            placeholder="Placeholder text (e.g. John Doe)..."
                          />
                        </div>
                      )}

                      {/* File Upload Visual Cue */}
                      {['file', 'multifile'].includes(field.type) && (
                        <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center text-gray-400 text-sm">
                          {field.type === 'multifile' ? 'Multi-file upload area will appear here' : 'Single file upload area will appear here'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}