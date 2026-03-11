'use client'

import { useState, useEffect, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'file' | 'multifile'

export interface FormField {
  id?: string
  label: string
  type: FieldType
  required: boolean
  options: string[] | null
  placeholder: string | null
}

export interface CustomStyles {
  headerBg: string
  headerText: string
  bodyBg: string
  bodyText: string
  accentColor: string
  buttonText: string
  fontFamily: string
  inputBorderColor: string
  inputBg: string
  labelColor: string
  // Layout & Shaping
  containerWidth: number // max-width in px
  containerPadding: number // padding in px
  borderRadius: number // border-radius in px
  boxShadow: string // shadow preset
  fontSizeBase: number // base font size in px
  fieldSpacing: number // space between fields in px
  labelWeight: string // 'normal' | 'semibold' | 'bold'
  buttonStyle: 'rounded' | 'pill' | 'square'
  inputVariant: 'outline' | 'filled' | 'underline'
}

const DEFAULT_STYLES: CustomStyles = {
  headerBg: '#4f46e5',
  headerText: '#ffffff',
  bodyBg: '#ffffff',
  bodyText: '#111827',
  accentColor: '#4f46e5',
  buttonText: '#ffffff',
  fontFamily: 'Inter',
  inputBorderColor: '#e5e7eb',
  inputBg: '#f9fafb',
  labelColor: '#111827',
  containerWidth: 640,
  containerPadding: 40,
  borderRadius: 16,
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  fontSizeBase: 16,
  fieldSpacing: 32,
  labelWeight: 'bold',
  buttonStyle: 'rounded',
  inputVariant: 'outline',
}

const THEME_PRESETS: Record<string, { name: string; desc: string; emoji: string; styles: CustomStyles }> = {
  default: {
    name: 'Clean Minimal', desc: 'Professional & crisp', emoji: '✦',
    styles: { ...DEFAULT_STYLES }
  },
  modern: {
    name: 'Modern Soft', desc: 'Large padding & round', emoji: '☁️',
    styles: { ...DEFAULT_STYLES, borderRadius: 32, containerPadding: 56, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
  },
  ocean: {
    name: 'Ocean Breeze', desc: 'Cool teal gradients', emoji: '🌊',
    styles: { ...DEFAULT_STYLES, headerBg: '#0f766e', headerText: '#fff', bodyBg: '#f0fdfa', bodyText: '#134e4a', accentColor: '#0d9488', buttonText: '#fff', inputBorderColor: '#99f6e4', inputBg: '#f0fdfa', labelColor: '#0f766e' }
  },
  dark: {
    name: 'Night Mode', desc: 'Sleek dark interface', emoji: '🌙',
    styles: { ...DEFAULT_STYLES, headerBg: '#1e1b4b', headerText: '#c4b5fd', bodyBg: '#111827', bodyText: '#e5e7eb', accentColor: '#7c3aed', buttonText: '#fff', inputBorderColor: '#374151', inputBg: '#1f2937', labelColor: '#d1d5db', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }
  },
  elegant: {
    name: 'Noble Serif', desc: 'Refined & classic', emoji: '✒️',
    styles: { ...DEFAULT_STYLES, headerBg: '#f5f5f0', headerText: '#1c1917', bodyBg: '#fafaf9', bodyText: '#292524', accentColor: '#292524', buttonText: '#fff', fontFamily: 'Merriweather', inputBorderColor: '#d6d3d1', inputBg: '#fafaf9', labelColor: '#44403c', borderRadius: 0 }
  },
  glass: {
    name: 'Glassmorphism', desc: 'Frosted & modern', emoji: '💎',
    styles: { ...DEFAULT_STYLES, headerBg: 'rgba(255,255,255,0.8)', headerText: '#1e1b4b', bodyBg: 'rgba(255,255,255,0.4)', bodyText: '#1e1b4b', accentColor: '#6366f1', buttonText: '#fff', inputBg: 'rgba(255,255,255,0.5)', inputBorderColor: 'rgba(255,255,255,0.2)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }
  },
  brutal: {
    name: 'Brutalism', desc: 'High contrast & bold', emoji: '🔳',
    styles: { ...DEFAULT_STYLES, headerBg: '#000', headerText: '#fff', bodyBg: '#fff', bodyText: '#000', accentColor: '#fbbf24', buttonText: '#000', inputBorderColor: '#000', borderRadius: 0, boxShadow: '8px 8px 0px 0px #000', labelWeight: 'bold' }
  },
  eco: {
    name: 'Eco Green', desc: 'Organic & earthy', emoji: '🌿',
    styles: { ...DEFAULT_STYLES, headerBg: '#064e3b', headerText: '#ecfdf5', bodyBg: '#f0fdf4', bodyText: '#064e3b', accentColor: '#10b981', buttonText: '#fff', inputBorderColor: '#a7f3d0', inputBg: '#fff', borderRadius: 24 }
  },
}

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Default)' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Georgia', label: 'Georgia (Serif)' },
]

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-gray-600 flex-1">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white shadow-sm"
        />
        <input
          type="text"
          value={value}
          onChange={e => {
            if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) onChange(e.target.value)
          }}
          className="w-20 text-xs border border-gray-200 rounded px-2 py-1.5 font-mono focus:border-indigo-400 focus:outline-none"
        />
      </div>
    </div>
  )
}

// Inline form renderer for the builder canvas — identical to PublicForm
function FormCanvas({
  form, fields, customStyles, onUpdateField, onRemoveField, onAddOption, onRemoveOption, onUpdateOption, onUpdateForm, selectedFieldIndex, onSelectField
}: {
  form: any
  fields: FormField[]
  customStyles: CustomStyles
  onUpdateField: (idx: number, u: Partial<FormField>) => void
  onRemoveField: (idx: number) => void
  onAddOption: (idx: number) => void
  onRemoveOption: (idx: number, oi: number) => void
  onUpdateOption: (idx: number, oi: number, v: string) => void
  onUpdateForm: (u: any) => void
  selectedFieldIndex: number | null
  onSelectField: (idx: number | null) => void
}) {
  const fontUrl = customStyles.fontFamily !== 'Inter' && customStyles.fontFamily !== 'Georgia'
    ? `https://fonts.googleapis.com/css2?family=${customStyles.fontFamily.replace(' ', '+')}:wght@400;500;600;700;800&display=swap`
    : null

  const vars: React.CSSProperties = {
    '--form-header-bg': customStyles.headerBg,
    '--form-header-text': customStyles.headerText,
    '--form-body-bg': customStyles.bodyBg,
    '--form-body-text': customStyles.bodyText,
    '--form-accent': customStyles.accentColor,
    '--form-btn-text': customStyles.buttonText,
    '--form-input-border': customStyles.inputBorderColor,
    '--form-input-bg': customStyles.inputBg,
    '--form-label': customStyles.labelColor,
    '--form-font': customStyles.fontFamily,
    '--form-radius': `${customStyles.borderRadius}px`,
    '--form-padding': `${customStyles.containerPadding}px`,
    '--form-base-size': `${customStyles.fontSizeBase}px`,
    '--form-spacing': `${customStyles.fieldSpacing}px`,
    '--form-label-weight': customStyles.labelWeight === 'bold' ? '700' : customStyles.labelWeight === 'semibold' ? '600' : '400',
    '--form-btn-radius': customStyles.buttonStyle === 'pill' ? '9999px' : customStyles.buttonStyle === 'square' ? '0px' : '0.75rem',
    fontFamily: `"${customStyles.fontFamily}", sans-serif`,
    fontSize: `${customStyles.fontSizeBase}px`,
  } as React.CSSProperties

  const inputCls = 'w-full px-4 py-3 rounded-xl outline-none transition-all'
  const inputStyle: React.CSSProperties = {
    border: `1.5px solid var(--form-input-border)`,
    background: `var(--form-input-bg)`,
    color: `var(--form-body-text)`,
    fontFamily: 'inherit',
  }
  const labelStyle: React.CSSProperties = {
    color: `var(--form-label)`,
    fontFamily: 'inherit',
    display: 'block',
    fontWeight: 'var(--form-label-weight)' as any,
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
  }

  const getInternalInputStyle = (): React.CSSProperties => {
    const base = { ...inputStyle }
    if (customStyles.inputVariant === 'filled') {
      base.border = 'none'
      base.backgroundColor = `${customStyles.inputBorderColor}22`
    } else if (customStyles.inputVariant === 'underline') {
      base.border = 'none'
      base.borderRadius = '0'
      base.borderBottom = `2px solid ${customStyles.inputBorderColor}`
      base.paddingLeft = '4px'
      base.paddingRight = '4px'
      base.backgroundColor = 'transparent'
    }
    return base
  }

  return (
    <div style={{ ...vars, maxWidth: `${customStyles.containerWidth}px`, margin: '0 auto', boxShadow: customStyles.boxShadow, borderRadius: `${customStyles.borderRadius}px`, overflow: 'hidden' }} className="w-full transition-all duration-300">
      {fontUrl && <link rel="stylesheet" href={fontUrl} />}

      <div
        className="relative"
        style={{ background: `var(--form-header-bg)`, padding: `var(--form-padding)` }}
      >
        <input
          type="text"
          value={form.title || ''}
          onChange={e => onUpdateForm({ title: e.target.value })}
          className="text-3xl sm:text-4xl font-extrabold w-full outline-none border-b-2 border-transparent hover:border-white/20 focus:border-white/40 bg-transparent transition-colors pb-1 tracking-tight"
          style={{ color: `var(--form-header-text)`, fontFamily: 'inherit' }}
          placeholder="Your Form Title"
        />
        <textarea
          value={form.description || ''}
          onChange={e => onUpdateForm({ description: e.target.value })}
          rows={2}
          className="mt-4 w-full outline-none border-b border-transparent hover:border-white/20 focus:border-white/30 bg-transparent transition-colors resize-none text-lg"
          style={{ color: `var(--form-header-text)`, opacity: 0.85, fontFamily: 'inherit' }}
          placeholder="Add a short description (optional)..."
        />
      </div>

      <div
        className="pb-12"
        style={{ background: `var(--form-body-bg)`, padding: `var(--form-padding)`, borderTop: 'none', display: 'flex', flexDirection: 'column', gap: `var(--form-spacing)` }}
      >
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center py-12 border-2 border-dashed rounded-2xl"
            style={{ borderColor: customStyles.inputBorderColor, color: customStyles.bodyText, opacity: 0.4 }}>
            <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
            </svg>
            <h3 className="text-xl font-bold mb-2">Your form is empty</h3>
            <p className="text-sm max-w-xs">Click any field type from the left panel to add it here. This is your live preview!</p>
          </div>
        ) : (
          fields.map((field, index) => {
            const isSelected = selectedFieldIndex === index
            return (
              <div
                key={index}
                onClick={() => onSelectField(isSelected ? null : index)}
                className={`group relative rounded-2xl transition-all duration-150 cursor-pointer ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50/30' : 'hover:ring-1 hover:ring-gray-300 hover:bg-gray-50/50'}`}
                style={{ padding: '1rem', margin: '-1rem' }}
              >
                {/* Field Controls */}
                <div
                  className={`absolute -top-3 right-2 flex items-center gap-1 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  style={{ zIndex: 20 }}
                  onClick={e => e.stopPropagation()}
                >
                  <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-medium pointer-events-none">
                    {field.type}
                  </span>
                  <label className="flex items-center gap-1 bg-white text-xs px-2 py-1 rounded-full border border-gray-200 shadow-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={e => onUpdateField(index, { required: e.target.checked })}
                      className="w-3 h-3 text-indigo-600"
                    />
                    <span className="text-gray-600 font-medium">Required</span>
                  </label>
                  <button
                    onClick={() => onRemoveField(index)}
                    className="bg-white border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full shadow-sm transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Label — editable */}
                <div className="mb-3">
                  <div style={labelStyle} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={field.label}
                      onChange={e => { e.stopPropagation(); onUpdateField(index, { label: e.target.value }) }}
                      onClick={e => e.stopPropagation()}
                      className="w-full outline-none bg-transparent font-bold border-b border-transparent focus:border-current transition-colors"
                      style={{ color: `var(--form-label)`, fontFamily: 'inherit', fontSize: 'inherit' }}
                      placeholder="Question label..."
                    />
                    {field.required && <span style={{ color: `var(--form-accent)` }}>*</span>}
                  </div>
                </div>

                {/* Placeholder input for text-like fields */}
                {isSelected && ['text', 'email', 'number', 'textarea'].includes(field.type) && (
                  <div className="mb-3 flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-2 text-xs" onClick={e => e.stopPropagation()}>
                    <span className="text-indigo-400 font-semibold uppercase tracking-wider shrink-0">Placeholder</span>
                    <input
                      type="text"
                      value={field.placeholder || ''}
                      onChange={e => onUpdateField(index, { placeholder: e.target.value })}
                      className="flex-1 outline-none bg-transparent text-indigo-700 font-medium"
                      placeholder="Enter hint text..."
                    />
                  </div>
                )}

                {/* Field Renders */}
                {field.type === 'text' && (
                  <input type="text" placeholder={field.placeholder || 'Your answer...'} className={inputCls} style={getInternalInputStyle()} readOnly />
                )}
                {field.type === 'email' && (
                  <input type="email" placeholder={field.placeholder || 'name@example.com'} className={inputCls} style={getInternalInputStyle()} readOnly />
                )}
                {field.type === 'number' && (
                  <input type="number" placeholder={field.placeholder || '0'} className={inputCls} style={getInternalInputStyle()} readOnly />
                )}
                {field.type === 'textarea' && (
                  <textarea rows={4} placeholder={field.placeholder || 'Your answer...'} className={`${inputCls} resize-y`} style={getInternalInputStyle()} readOnly />
                )}
                {field.type === 'select' && (
                  <div className="relative">
                    <select className={`${inputCls} appearance-none`} style={getInternalInputStyle()} disabled>
                      <option value="">Select an option...</option>
                      {field.options?.map((o, i) => <option key={i}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center" style={{ color: customStyles.accentColor }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                )}
                {field.type === 'multiselect' && (
                  <select multiple className={`${inputCls} min-h-[130px]`} style={getInternalInputStyle()} disabled>
                    {field.options?.map((o, i) => <option key={i}>{o}</option>)}
                  </select>
                )}

                {/* Inline option editing for choice fields */}
                {['select', 'multiselect', 'radio', 'checkbox'].includes(field.type) && (
                  <div className="mt-3 space-y-2" onClick={e => e.stopPropagation()}>
                    {field.options?.map((opt, oi) => (
                      <div key={oi} className={`flex items-center gap-3 px-3 py-2 rounded-xl`} style={{ background: customStyles.inputBg, border: `1.5px solid ${customStyles.inputBorderColor}` }}>
                        {field.type === 'radio' && (
                          <div className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center" style={{ borderColor: customStyles.accentColor }}>
                            <div className="w-2 h-2 rounded-full opacity-0" style={{ background: customStyles.accentColor }} />
                          </div>
                        )}
                        {field.type === 'checkbox' && (
                          <div className="w-4 h-4 rounded border-2 shrink-0" style={{ borderColor: customStyles.accentColor }} />
                        )}
                        {['select', 'multiselect'].includes(field.type) && (
                          <span className="text-xs font-bold opacity-40" style={{ color: customStyles.bodyText }}>{oi + 1}.</span>
                        )}
                        <input
                          type="text"
                          value={opt}
                          onChange={e => onUpdateOption(index, oi, e.target.value)}
                          className="flex-1 outline-none bg-transparent font-medium text-sm border-b border-transparent focus:border-current transition-colors"
                          style={{ color: customStyles.bodyText, fontFamily: 'inherit' }}
                          placeholder={`Option ${oi + 1}`}
                        />
                        <button onClick={() => onRemoveOption(index, oi)} className="text-gray-300 hover:text-red-400 shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    <button onClick={() => onAddOption(index)} className="flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                      style={{ background: customStyles.accentColor + '18', color: customStyles.accentColor }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                      Add Choice
                    </button>
                  </div>
                )}

                {['file', 'multifile'].includes(field.type) && (
                  <div className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed transition-colors"
                    style={{ borderColor: customStyles.accentColor + '55', background: customStyles.accentColor + '08' }}>
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: customStyles.accentColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-semibold" style={{ color: customStyles.accentColor }}>
                      Click to upload {field.type === 'multifile' ? 'files' : 'a file'}
                    </p>
                    <p className="text-xs mt-1 opacity-60" style={{ color: customStyles.bodyText }}>PNG, JPG, PDF up to 50MB</p>
                  </div>
                )}
              </div>
            )
          })
        )}

        {/* Submit Button Preview */}
        {fields.length > 0 && (
          <div className="pt-8 mt-6 border-t" style={{ borderColor: customStyles.inputBorderColor }}>
            <button
              disabled
              className="w-full py-4 px-6 text-lg font-bold transition-all cursor-not-allowed opacity-90"
              style={{ background: customStyles.accentColor, color: customStyles.buttonText, fontFamily: 'inherit', borderRadius: 'var(--form-btn-radius)' }}
            >
              Submit Form
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [form, setForm] = useState<any>(null)
  const [fields, setFields] = useState<FormField[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [customStyles, setCustomStyles] = useState<CustomStyles>({ ...DEFAULT_STYLES })
  const [sidebarTab, setSidebarTab] = useState<'fields' | 'design' | 'themes'>('fields')
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null)

  useEffect(() => { fetchForm() }, [])

  const fetchForm = async () => {
    try {
      const res = await fetch(`/api/forms/${resolvedParams.id}`)
      if (!res.ok) throw new Error('Failed to fetch form')
      const data = await res.json()

      let desc = data.description || ''
      let styles = { ...DEFAULT_STYLES }

      if (desc.includes('|||STYLES:')) {
        const parts = desc.split('|||STYLES:')
        desc = parts[0]
        try { styles = { ...DEFAULT_STYLES, ...JSON.parse(parts[1]) } } catch { }
      }

      setForm({ ...data, description: desc })
      setCustomStyles(styles)
      setFields(data.form_fields || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addField = (type: FieldType) => {
    const newField: FormField = {
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      type,
      required: false,
      options: ['select', 'multiselect', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2', 'Option 3'] : null,
      placeholder: null,
    }
    setFields(prev => [...prev, newField])
    setSelectedFieldIndex(fields.length)
    setSidebarTab('fields')
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    setFields(prev => { const n = [...prev]; n[index] = { ...n[index], ...updates }; return n })
  }

  const removeField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index))
    setSelectedFieldIndex(null)
  }

  const updateOption = (fi: number, oi: number, value: string) => {
    setFields(prev => {
      const n = [...prev]
      const opts = [...(n[fi].options || [])]
      opts[oi] = value
      n[fi] = { ...n[fi], options: opts }
      return n
    })
  }

  const addOption = (fi: number) => {
    setFields(prev => {
      const n = [...prev]
      const opts = [...(n[fi].options || [])]
      opts.push(`Option ${opts.length + 1}`)
      n[fi] = { ...n[fi], options: opts }
      return n
    })
  }

  const removeOption = (fi: number, oi: number) => {
    setFields(prev => {
      const n = [...prev]
      n[fi] = { ...n[fi], options: (n[fi].options || []).filter((_, i) => i !== oi) }
      return n
    })
  }

  const updateStyles = (updates: Partial<CustomStyles>) => {
    setCustomStyles(prev => ({ ...prev, ...updates }))
  }

  const applyThemePreset = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey]
    if (preset) setCustomStyles({ ...preset.styles })
  }

  const saveForm = async () => {
    setSaving(true)
    setError('')
    try {
      const descWithStyles = (form.description || '') + '|||STYLES:' + JSON.stringify(customStyles)

      await fetch(`/api/forms/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, description: descWithStyles, published: form.published })
      })

      const res = await fetch(`/api/forms/${resolvedParams.id}/fields`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      })

      if (!res.ok) throw new Error('Failed to save fields')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading your form builder...</p>
      </div>
    </div>
  )

  if (error && !form) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-red-600 bg-red-50 border border-red-200 rounded-2xl p-8 max-w-sm text-center">
        <p className="font-bold text-lg mb-2">Error loading form</p>
        <p className="text-sm">{error}</p>
        <Link href="/dashboard" className="mt-4 inline-block text-indigo-600 hover:underline text-sm font-medium">← Back to Dashboard</Link>
      </div>
    </div>
  )

  const formPublicUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/f/${resolvedParams.id}`

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-4 h-14 flex items-center justify-between max-w-full">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <div className="w-px h-5 bg-gray-200" />
            <div>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none">Live Builder</p>
              <p className="text-sm font-bold text-gray-900 truncate max-w-xs">{form?.title || 'Untitled Form'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={formPublicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-3 py-1.5 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Preview
            </a>

            {/* Prominent Publish Status */}
            <button
              type="button"
              onClick={() => setForm({ ...form, published: !form?.published })}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border shadow-sm ${form?.published
                ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
                : 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100'
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${form?.published ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {form?.published ? 'Form is Live' : 'Form is Draft'}
            </button>

            <button
              onClick={saveForm}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${saved ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 shadow-md'} disabled:opacity-60`}
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : saved ? (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>Saved!</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Save</>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">

        {/* LEFT SIDEBAR */}
        <aside className="w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-200 shrink-0">
            {[
              { id: 'fields', label: 'Fields', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
              { id: 'design', label: 'Design', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
              { id: 'themes', label: 'Templates', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSidebarTab(tab.id as any)}
                className={`flex-1 flex flex-col items-center py-3 text-xs font-semibold transition-all gap-1 ${sidebarTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {/* FIELDS TAB */}
          {sidebarTab === 'fields' && (
            <div className="p-4 flex flex-col gap-4">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Text Fields</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { type: 'text', label: 'Short Text', icon: 'M4 6h16M4 12h16M4 18h7' },
                    { type: 'textarea', label: 'Long Text', icon: 'M4 6h16M4 12h16M4 18h16' },
                    { type: 'email', label: 'Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                    { type: 'number', label: 'Number', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
                  ].map(btn => (
                    <button key={btn.type} onClick={() => addField(btn.type as FieldType)}
                      className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 text-gray-600 transition-all text-left">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={btn.icon} /></svg>
                      <span className="text-xs font-semibold truncate">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Choice Fields</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { type: 'select', label: 'Dropdown', icon: 'M19 9l-7 7-7-7' },
                    { type: 'multiselect', label: 'Multi-Select', icon: 'M4 6h16M4 12h16m-7 6h7' },
                    { type: 'radio', label: 'Radio', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { type: 'checkbox', label: 'Checkboxes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
                  ].map(btn => (
                    <button key={btn.type} onClick={() => addField(btn.type as FieldType)}
                      className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 text-gray-600 transition-all text-left">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={btn.icon} /></svg>
                      <span className="text-xs font-semibold truncate">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Upload Fields</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { type: 'file', label: 'File Upload', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
                    { type: 'multifile', label: 'Multi-File', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
                  ].map(btn => (
                    <button key={btn.type} onClick={() => addField(btn.type as FieldType)}
                      className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 text-gray-600 transition-all text-left">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={btn.icon} /></svg>
                      <span className="text-xs font-semibold truncate">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fields List */}
              {fields.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Form Fields ({fields.length})</p>
                  <div className="space-y-1">
                    {fields.map((f, i) => (
                      <div key={i}
                        role="button" tabIndex={0}
                        onClick={() => setSelectedFieldIndex(selectedFieldIndex === i ? null : i)}
                        onKeyDown={e => e.key === 'Enter' && setSelectedFieldIndex(selectedFieldIndex === i ? null : i)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer select-none ${selectedFieldIndex === i ? 'bg-indigo-50 border border-indigo-200 text-indigo-700' : 'hover:bg-gray-50 text-gray-700 border border-transparent'}`}>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${selectedFieldIndex === i ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>{f.type}</span>
                        <span className="text-xs font-medium truncate flex-1">{f.label}</span>
                        {f.required && <span className="text-red-400 text-xs">*</span>}
                        <button onClick={e => { e.stopPropagation(); removeField(i) }} className="text-gray-300 hover:text-red-500 p-0.5 shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DESIGN TAB */}
          {sidebarTab === 'design' && (
            <div className="p-4 flex flex-col gap-5">
              {/* Font */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Typography</p>
                <select
                  value={customStyles.fontFamily}
                  onChange={e => updateStyles({ fontFamily: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none bg-white text-gray-700 font-medium"
                >
                  {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Label Weight</p>
                <div className="grid grid-cols-3 gap-1.5 bg-gray-50 rounded-xl p-2 border border-gray-100">
                  {['normal', 'semibold', 'bold'].map(w => (
                    <button
                      key={w}
                      onClick={() => updateStyles({ labelWeight: w })}
                      className={`text-[10px] font-bold py-1.5 px-1 rounded-lg border transition-all ${customStyles.labelWeight === w ? 'bg-white border-indigo-400 text-indigo-700 shadow-sm' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                      {w.charAt(0).toUpperCase() + w.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Header Colors */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Header</p>
                <div className="space-y-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <ColorPicker label="Background" value={customStyles.headerBg} onChange={v => updateStyles({ headerBg: v })} />
                  <ColorPicker label="Text Color" value={customStyles.headerText} onChange={v => updateStyles({ headerText: v })} />
                </div>
              </div>

              {/* Body Colors */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Form Body</p>
                <div className="space-y-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <ColorPicker label="Background" value={customStyles.bodyBg} onChange={v => updateStyles({ bodyBg: v })} />
                  <ColorPicker label="Text Color" value={customStyles.bodyText} onChange={v => updateStyles({ bodyText: v })} />
                  <ColorPicker label="Label Color" value={customStyles.labelColor} onChange={v => updateStyles({ labelColor: v })} />
                </div>
              </div>

              {/* Input Colors */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Input Fields</p>
                <div className="space-y-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <ColorPicker label="Background" value={customStyles.inputBg} onChange={v => updateStyles({ inputBg: v })} />
                  <ColorPicker label="Border Color" value={customStyles.inputBorderColor} onChange={v => updateStyles({ inputBorderColor: v })} />
                </div>
              </div>

              {/* Button Colors */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Button & Accent</p>
                <div className="space-y-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <ColorPicker label="Accent / Button Bg" value={customStyles.accentColor} onChange={v => updateStyles({ accentColor: v })} />
                  <ColorPicker label="Button Text" value={customStyles.buttonText} onChange={v => updateStyles({ buttonText: v })} />
                </div>
              </div>

              {/* Preview of button */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Button Preview</p>
                <button className="w-full py-3 rounded-xl font-bold text-sm" style={{ background: customStyles.accentColor, color: customStyles.buttonText, fontFamily: customStyles.fontFamily }}>
                  Submit Form
                </button>
              </div>

              {/* Shape & Layout */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Shape & Layout</p>
                <div className="space-y-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Container Width ({customStyles.containerWidth}px)</label>
                    <input
                      type="range" min="400" max="1200" step="10"
                      value={customStyles.containerWidth}
                      onChange={e => updateStyles({ containerWidth: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Padding ({customStyles.containerPadding}px)</label>
                    <input
                      type="range" min="16" max="100" step="4"
                      value={customStyles.containerPadding}
                      onChange={e => updateStyles({ containerPadding: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Corner Radius ({customStyles.borderRadius}px)</label>
                    <input
                      type="range" min="0" max="40" step="2"
                      value={customStyles.borderRadius}
                      onChange={e => updateStyles({ borderRadius: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Field Spacing ({customStyles.fieldSpacing}px)</label>
                    <input
                      type="range" min="8" max="80" step="4"
                      value={customStyles.fieldSpacing}
                      onChange={e => updateStyles({ fieldSpacing: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Text Scale ({customStyles.fontSizeBase}px)</label>
                    <input
                      type="range" min="12" max="22" step="1"
                      value={customStyles.fontSizeBase}
                      onChange={e => updateStyles({ fontSizeBase: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced UI toggles */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Field Style</p>
                <div className="grid grid-cols-3 gap-1.5 bg-gray-50 rounded-xl p-2 border border-gray-100">
                  {['outline', 'filled', 'underline'].map(v => (
                    <button
                      key={v}
                      onClick={() => updateStyles({ inputVariant: v as any })}
                      className={`text-[10px] font-bold py-1.5 px-1 rounded-lg border transition-all ${customStyles.inputVariant === v ? 'bg-white border-indigo-400 text-indigo-700 shadow-sm' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Button Shape</p>
                <div className="grid grid-cols-3 gap-1.5 bg-gray-50 rounded-xl p-2 border border-gray-100">
                  {['square', 'rounded', 'pill'].map(v => (
                    <button
                      key={v}
                      onClick={() => updateStyles({ buttonStyle: v as any })}
                      className={`text-[10px] font-bold py-1.5 px-1 rounded-lg border transition-all ${customStyles.buttonStyle === v ? 'bg-white border-indigo-400 text-indigo-700 shadow-sm' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Background */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Shadow Intensity</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Flat', value: 'none' },
                    { label: 'Soft', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
                    { label: 'Heavy', value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
                  ].map(s => (
                    <button
                      key={s.label}
                      onClick={() => updateStyles({ boxShadow: s.value })}
                      className={`text-[10px] font-bold py-2 rounded-lg border transition-all ${customStyles.boxShadow === s.value ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCustomStyles({ ...DEFAULT_STYLES })}
                className="text-xs text-red-400 hover:text-red-600 underline text-center py-1 transition-colors"
              >
                Reset to defaults
              </button>
            </div>
          )}

          {/* TEMPLATES TAB */}
          {sidebarTab === 'themes' && (
            <div className="p-4 flex flex-col gap-3">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Start from a Template</p>
              <p className="text-xs text-gray-500 -mt-2 mb-2">Apply a preset design. You can further customize colors in the Design tab.</p>
              {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                const isActive = JSON.stringify(customStyles) === JSON.stringify(preset.styles)
                return (
                  <button
                    key={key}
                    onClick={() => applyThemePreset(key)}
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${isActive ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                    {/* Swatch */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100 flex flex-col">
                      <div className="flex-1" style={{ background: preset.styles.headerBg }} />
                      <div className="flex-1" style={{ background: preset.styles.bodyBg }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{preset.emoji}</span>
                        <span className={`text-sm font-bold truncate ${isActive ? 'text-indigo-700' : 'text-gray-900'}`}>{preset.name}</span>
                        {isActive && <span className="ml-auto text-indigo-500"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></span>}
                      </div>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-indigo-500' : 'text-gray-500'}`}>{preset.desc}</p>
                      {/* Mini color swatches */}
                      <div className="flex gap-1 mt-2">
                        {[preset.styles.headerBg, preset.styles.accentColor, preset.styles.bodyBg, preset.styles.bodyText].map((c, i) => (
                          <div key={i} className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ background: c }} />
                        ))}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </aside>

        {/* MAIN CANVAS — The live preview */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6 lg:p-10">
          <div className="mx-auto w-full transition-all duration-500" style={{ maxWidth: `${Math.max(672, customStyles.containerWidth)}px` }}>
            {/* Visibility Banner */}
            {!form?.published && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-800">Your form is in Draft mode</h4>
                    <p className="text-xs text-amber-600 mt-0.5">Public users cannot access this form until you publish it.</p>
                  </div>
                </div>
                <button
                  onClick={() => { setForm({ ...form, published: true }); saveForm(); }}
                  className="bg-amber-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors shadow-sm"
                >
                  Publish Now
                </button>
              </div>
            )}

            {/* Builder hint */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                Live Preview — click any field to edit it
              </p>
              <a href={formPublicUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Open real form ↗
              </a>
            </div>

            {/* The actual rendered form */}
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/40 ring-1 ring-gray-200">
              <FormCanvas
                form={form}
                fields={fields}
                customStyles={customStyles}
                onUpdateField={updateField}
                onRemoveField={removeField}
                onAddOption={addOption}
                onRemoveOption={removeOption}
                onUpdateOption={updateOption}
                onUpdateForm={(u) => setForm({ ...form, ...u })}
                selectedFieldIndex={selectedFieldIndex}
                onSelectField={setSelectedFieldIndex}
              />
            </div>

            {/* Add field CTA */}
            <button
              onClick={() => setSidebarTab('fields')}
              className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 text-gray-400 hover:text-indigo-600 text-sm font-semibold transition-all hover:bg-indigo-50/50 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              Add a field from the Fields panel
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}