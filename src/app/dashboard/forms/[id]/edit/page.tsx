'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'file' | 'multifile'

interface FormField {
  id?: string
  label: string
  type: FieldType
  required: boolean
  options: string[] | null // strictly array for select/multiselect/radio/checkbox
  placeholder: string | null
}

import LiveFieldPreview from './LiveFieldPreview'

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
      label: `New ${type} field`,
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

  // Theme layout definitions inside builder wrapper for visual parity
  const buildLayoutBox = {
    default: 'bg-white rounded-b-2xl shadow-sm border border-gray-200 p-8',
    playful: 'bg-white border-4 border-black border-t-0 rounded-b-2xl p-8',
    elegant: 'bg-white border border-gray-300 border-t-0 p-8',
    dark: 'bg-gray-900 rounded-b-2xl border border-gray-800 p-8'
  }[form?.theme as 'default' | 'playful' | 'elegant' | 'dark' || 'default'] || 'bg-white rounded-b-2xl shadow-sm border border-gray-200 p-8'

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
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider text-xs">Live Form Builder</span>
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
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 shadow-md shadow-indigo-200"
            >
              {saving ? 'Saving...' : 'Save Live Form'}
            </button>
          </div>
        </div>
      </header>

      {/* Builder Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex gap-8 items-start">

        {/* Left Sidebar: Field Palette */}
        <aside className="w-72 shrink-0 space-y-6 sticky top-24">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              Form Theme
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { id: 'default', name: 'Clean Minimal', desc: 'Modern & crisp' },
                { id: 'playful', name: 'Playful & Creative', desc: 'High contrast borders' },
                { id: 'elegant', name: 'Elegant Serif', desc: 'Minimalist & refined' },
                { id: 'dark', name: 'Night Mode', desc: 'Sleek dark interface' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setForm({ ...form, theme: t.id })}
                  className={`flex flex-col items-start px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none text-left ${form?.theme === t.id ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm ring-1 ring-indigo-600' : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
                >
                  <span className="font-bold">{t.name}</span>
                  <span className={`text-xs mt-0.5 ${form?.theme === t.id ? 'text-indigo-500' : 'text-gray-500'}`}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Add Fields
            </h2>
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
          </div>
        </aside>

        {/* Main Canvas - Rendered as a live preview */}
        <div className="flex-1 max-w-3xl pt-0 relative pb-32">

          {/* Form Header (Preview match) */}
          <div className={`${form?.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : form?.theme === 'playful' ? 'bg-indigo-400 border-4 border-black' : form?.theme === 'elegant' ? 'bg-slate-100 border border-gray-300' : 'bg-indigo-600 outline outline-1 outline-indigo-700'} rounded-t-2xl p-8 sm:p-12 transition-colors`}>
            <input
              type="text"
              value={form?.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`text-3xl sm:text-4xl font-bold w-full outline-none border-b-2 border-transparent hover:border-white/30 focus:border-white/50 bg-transparent transition-colors pb-1 ${form?.theme === 'elegant' ? 'text-gray-900 text-center tracking-tight font-serif' : form?.theme === 'playful' ? 'text-black font-black' : 'text-white'}`}
              placeholder="Form Title"
            />
            <textarea
              value={form?.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`mt-4 w-full outline-none border-b border-transparent hover:border-white/30 focus:border-white/50 bg-transparent transition-colors resize-none ${form?.theme === 'elegant' ? 'text-gray-600 text-center text-lg' : form?.theme === 'playful' ? 'text-gray-900 font-bold' : form?.theme === 'dark' ? 'text-gray-400' : 'text-indigo-100 text-lg'} `}
              placeholder="Briefly describe your form here..."
              rows={2}
            />
          </div>

          {/* Form Fields Canvas (Preview match) */}
          <div className={`${buildLayoutBox} space-y-10`}>
            {fields.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
                <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                </svg>
                <h3 className="text-xl font-medium text-gray-600 mb-2">Build your form visually</h3>
                <p className="max-w-xs mx-auto">Click any field type from the left sidebar to add it to your Live Preview canvas.</p>
              </div>
            ) : (
              fields.map((field, index) => (
                <div key={index} className="group relative bg-transparent border-2 border-transparent hover:border-indigo-100 hover:bg-slate-50/50 -mx-4 px-4 py-6 rounded-2xl transition-all">

                  {/* Field Configuration Controls (Hover overlay) */}
                  <div className="absolute top-2 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white shadow-sm p-1 rounded-lg border border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer px-2 text-xs">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3 h-3 cursor-pointer"
                      />
                      <span className="text-gray-600 font-medium font-sans">Required</span>
                    </label>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <button onClick={() => removeField(index)} className="text-gray-400 hover:text-red-500 px-1 font-sans">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>

                  {/* Form Builder specific edits (Label and config) */}
                  <div className="flex flex-col gap-2 relative z-0">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        className={`text-lg font-bold w-full outline-none border-b border-transparent focus:border-indigo-300 bg-transparent transition-colors font-sans placeholder:text-gray-300 ${form?.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        placeholder="Type your question here..."
                      />
                    </div>

                    {/* Quick Config Row (Placeholder / Options) */}
                    <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-lg p-3 space-y-3 mt-2 shadow-sm">
                      {['text', 'textarea', 'email', 'number'].includes(field.type) && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0 w-24 text-right">Placeholder</span>
                          <input
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) => updateField(index, { placeholder: e.target.value })}
                            className="w-full text-sm outline-none border border-gray-200 rounded px-3 py-1.5 focus:border-indigo-500 text-gray-700 bg-white"
                            placeholder="Hint text for users..."
                          />
                        </div>
                      )}

                      {['select', 'multiselect', 'radio', 'checkbox'].includes(field.type) && field.options && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0 w-24 text-right mt-2">Choices</span>
                          <div className="flex-1 space-y-2">
                            {field.options.map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => updateOption(index, optIdx, e.target.value)}
                                  className="flex-1 text-sm outline-none border border-gray-200 focus:border-indigo-500 rounded px-3 py-1.5 bg-white text-gray-700 font-medium shadow-sm transition-colors hover:border-gray-300"
                                />
                                <button onClick={() => removeOption(index, optIdx)} className="text-gray-300 hover:text-red-500 shrink-0">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                              </div>
                            ))}
                            <button onClick={() => addOption(index)} className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs py-1 px-2 hover:bg-indigo-50 rounded transition-colors inline-block mt-1">
                              + Add Choice
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* The Live Render View */}
                    <div className="mt-2">
                      <LiveFieldPreview field={field} theme={form?.theme} />
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Disabled Submit Button for visual completeness */}
            {fields.length > 0 && (
              <div className="pt-8 border-t border-gray-100 opacity-70 pointer-events-none mt-10">
                <button className={{
                  default: 'w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white bg-indigo-600',
                  playful: 'w-full flex justify-center py-4 px-4 border-2 border-black rounded-xl shadow-[4px_4px_0px_black] text-lg font-black text-black bg-pink-400',
                  elegant: 'w-full flex justify-center py-4 px-4 border border-transparent rounded-none text-sm tracking-widest uppercase font-semibold text-white bg-gray-900',
                  dark: 'w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-purple-600'
                }[form?.theme as 'default' | 'playful' | 'elegant' | 'dark' || 'default'] || 'w-full flex justify-center py-4 px-4 bg-indigo-600 text-white rounded-xl font-bold'}>
                  Submit Form
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}