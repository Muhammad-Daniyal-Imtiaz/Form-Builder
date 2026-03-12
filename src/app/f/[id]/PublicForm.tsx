'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CustomStyles {
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
  containerWidth: number
  containerPadding: number
  borderRadius: number
  boxShadow: string
  fontSizeBase: number
  fieldSpacing: number
  labelWeight: string
  buttonStyle: 'rounded' | 'pill' | 'square'
  inputVariant: 'outline' | 'filled' | 'underline'
  logoHeight: number
  logoAlignment: 'left' | 'center' | 'right'
  logoBorderRadius: number
  coverHeight: number
  pageBgColor: string
  pageBgImage: string
  headerAlignment: 'left' | 'center' | 'right'
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
  logoHeight: 48,
  logoAlignment: 'left',
  logoBorderRadius: 8,
  coverHeight: 240,
  pageBgColor: '#f3f4f6',
  pageBgImage: '',
  headerAlignment: 'left',
}

export default function PublicForm({ form, customStyles: rawStyles }: { form: any; customStyles?: Partial<CustomStyles> }) {
  const router = useRouter()
  const [data, setData] = useState<Record<string, any>>({})
  const [files, setFiles] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cs: CustomStyles = { ...DEFAULT_STYLES, ...rawStyles }

  const fontUrl = cs.fontFamily !== 'Inter' && cs.fontFamily !== 'Georgia'
    ? `https://fonts.googleapis.com/css2?family=${cs.fontFamily.replace(' ', '+')}:wght@400;500;600;700;800&display=swap`
    : null

  const handleInputChange = (fieldId: string, value: any) => {
    setData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    setData(prev => {
      const currentVal = prev[fieldId] || []
      if (checked) return { ...prev, [fieldId]: [...currentVal, option] }
      else return { ...prev, [fieldId]: currentVal.filter((v: string) => v !== option) }
    })
  }

  const handleFileChange = async (fieldId: string, fileList: FileList, isMultiple: boolean) => {
    setLoading(true)
    setError('')
    try {
      const uploadedFiles: any[] = []
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) throw new Error('File upload failed. Please try again.')
        uploadedFiles.push(await res.json())
      }
      if (isMultiple) {
        const currentFiles = files[fieldId] || []
        const newFiles = [...currentFiles, ...uploadedFiles]
        setFiles(prev => ({ ...prev, [fieldId]: newFiles }))
        handleInputChange(fieldId, newFiles)
      } else {
        setFiles(prev => ({ ...prev, [fieldId]: uploadedFiles[0] }))
        handleInputChange(fieldId, uploadedFiles[0])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let uploadedFilesArray: any[] = []
      Object.keys(files).forEach(key => {
        const fileData = files[key]
        if (Array.isArray(fileData)) uploadedFilesArray = [...uploadedFilesArray, ...fileData]
        else uploadedFilesArray.push(fileData)
      })
      const res = await fetch(`/api/forms/${form.id}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, files: uploadedFilesArray }),
      })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || 'Failed to submit form')
      router.push(`/f/${form.id}/success`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const baseInputStyle: React.CSSProperties = {
    border: `1.5px solid ${cs.inputBorderColor}`,
    background: cs.inputBg,
    color: cs.bodyText,
    fontFamily: 'inherit',
    outline: 'none',
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    fontSize: '1em',
    transition: 'all 0.15s',
  }

  const getInternalInputStyle = (): React.CSSProperties => {
    const base = { ...baseInputStyle }
    if (cs.inputVariant === 'filled') {
      base.border = 'none'
      base.backgroundColor = `${cs.inputBorderColor}22`
    } else if (cs.inputVariant === 'underline') {
      base.border = 'none'
      base.borderRadius = '0'
      base.borderBottom = `2px solid ${cs.inputBorderColor}`
      base.paddingLeft = '4px'
      base.paddingRight = '4px'
      base.backgroundColor = 'transparent'
    }
    return base
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontWeight: cs.labelWeight === 'bold' ? 700 : cs.labelWeight === 'semibold' ? 600 : 400,
    fontSize: '0.95em',
    marginBottom: '0.5rem',
    color: cs.labelColor,
    fontFamily: 'inherit',
  }

  const btnRadius = cs.buttonStyle === 'pill' ? '9999px' : cs.buttonStyle === 'square' ? '0px' : '0.75rem'

  return (
    <div style={{ background: cs.bodyBg, fontFamily: `"${cs.fontFamily}", sans-serif`, padding: `${cs.containerPadding}px`, fontSize: `${cs.fontSizeBase}px` }} className="pb-16 border-t font-inherit">
      {fontUrl && <link rel="stylesheet" href={fontUrl} />}

      {error && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-[0.9em]">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-sm font-bold text-red-800">Submission Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: `${cs.fieldSpacing}px` }}>
        {form.form_fields?.map((field: any, index: number) => {
          const fieldKey = field.id || field.label
          return (
            <div key={index} className="space-y-2">
              <label style={labelStyle}>
                {field.label}
                {field.required && <span style={{ color: cs.accentColor }} className="ml-1.5">*</span>}
              </label>

              {field.type === 'text' && (
                <input type="text" required={field.required} placeholder={field.placeholder || ''}
                  onChange={e => handleInputChange(fieldKey, e.target.value)}
                  style={getInternalInputStyle()}
                  onFocus={e => { e.target.style.borderColor = cs.accentColor }}
                  onBlur={e => { e.target.style.borderColor = cs.inputBorderColor }}
                />
              )}

              {field.type === 'email' && (
                <input type="email" required={field.required} placeholder={field.placeholder || 'name@example.com'}
                  onChange={e => handleInputChange(fieldKey, e.target.value)}
                  style={getInternalInputStyle()}
                  onFocus={e => { e.target.style.borderColor = cs.accentColor }}
                  onBlur={e => { e.target.style.borderColor = cs.inputBorderColor }}
                />
              )}

              {field.type === 'number' && (
                <input type="number" required={field.required} placeholder={field.placeholder || ''}
                  onChange={e => handleInputChange(fieldKey, Number(e.target.value))}
                  style={getInternalInputStyle()}
                  onFocus={e => { e.target.style.borderColor = cs.accentColor }}
                  onBlur={e => { e.target.style.borderColor = cs.inputBorderColor }}
                />
              )}

              {field.type === 'textarea' && (
                <textarea required={field.required} rows={4} placeholder={field.placeholder || ''}
                  onChange={e => handleInputChange(fieldKey, e.target.value)}
                  style={{ ...getInternalInputStyle(), resize: 'vertical' }}
                  onFocus={e => { e.target.style.borderColor = cs.accentColor }}
                  onBlur={e => { e.target.style.borderColor = cs.inputBorderColor }}
                />
              )}

              {field.type === 'select' && (
                <div className="relative">
                  <select required={field.required}
                    onChange={e => handleInputChange(fieldKey, e.target.value)}
                    style={{ ...getInternalInputStyle(), appearance: 'none' }}
                    defaultValue=""
                    onFocus={e => { e.target.style.borderColor = cs.accentColor }}
                    onBlur={e => { e.target.style.borderColor = cs.inputBorderColor }}
                  >
                    <option value="" disabled>Select an option...</option>
                    {field.options?.map((opt: string, i: number) => <option key={i} value={opt}>{opt}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4" style={{ color: cs.accentColor }}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              )}

              {field.type === 'multiselect' && (
                <div>
                  <select multiple required={field.required}
                    onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, o => o.value)
                      handleInputChange(fieldKey, selected)
                    }}
                    style={{ ...getInternalInputStyle(), minHeight: '130px' }}
                    onFocus={e => { e.target.style.borderColor = cs.accentColor }}
                    onBlur={e => { e.target.style.borderColor = cs.inputBorderColor }}
                  >
                    {field.options?.map((opt: string, i: number) => <option key={i} value={opt}>{opt}</option>)}
                  </select>
                  <p className="text-xs mt-1.5 opacity-60" style={{ color: cs.bodyText }}>Hold Ctrl / Cmd to select multiple</p>
                </div>
              )}

              {field.type === 'radio' && (
                <div className="space-y-2.5 mt-1">
                  {field.options?.map((opt: string, i: number) => (
                    <label key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all" style={{ border: `1.5px solid ${cs.inputBorderColor}`, background: cs.inputBg }}>
                      <input type="radio" name={fieldKey} value={opt} required={field.required}
                        onChange={e => handleInputChange(fieldKey, e.target.value)}
                        className="w-4 h-4" style={{ accentColor: cs.accentColor }}
                      />
                      <span style={{ color: cs.bodyText, fontFamily: 'inherit' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div className="space-y-2.5 mt-1">
                  {field.options?.map((opt: string, i: number) => (
                    <label key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all" style={{ border: `1.5px solid ${cs.inputBorderColor}`, background: cs.inputBg }}>
                      <input type="checkbox" value={opt}
                        onChange={e => handleCheckboxChange(fieldKey, opt, e.target.checked)}
                        className="w-4 h-4 rounded" style={{ accentColor: cs.accentColor }}
                      />
                      <span style={{ color: cs.bodyText, fontFamily: 'inherit' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {['file', 'multifile'].includes(field.type) && (
                <label className="flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed cursor-pointer transition-colors"
                  style={{ borderColor: files[fieldKey] ? cs.accentColor : cs.inputBorderColor, background: files[fieldKey] ? cs.accentColor + '0d' : cs.inputBg }}>
                  <div className="flex flex-col items-center justify-center text-center px-6">
                    {files[fieldKey] ? (
                      <>
                        <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: cs.accentColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-semibold" style={{ color: cs.accentColor }}>
                          {Array.isArray(files[fieldKey]) ? `${files[fieldKey].length} files attached` : files[fieldKey].fileName}
                        </p>
                        {field.type === 'multifile' && <p className="text-xs mt-1 opacity-60" style={{ color: cs.bodyText }}>Click to add more</p>}
                      </>
                    ) : (
                      <>
                        <svg className="w-10 h-10 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: cs.bodyText }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm" style={{ color: cs.bodyText }}>
                          <span className="font-bold" style={{ color: cs.accentColor }}>Click to upload</span> {field.type === 'multifile' ? 'multiple files' : 'a file'}
                        </p>
                        <p className="text-xs mt-1 opacity-50" style={{ color: cs.bodyText }}>PNG, JPG, PDF up to 50MB</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" multiple={field.type === 'multifile'} required={field.required && !files[fieldKey]}
                    onChange={e => { if (e.target.files?.length) handleFileChange(fieldKey, e.target.files, field.type === 'multifile') }}
                  />
                </label>
              )}
            </div>
          )
        })}

        {/* Submit */}
        <div className="pt-6 mt-4" style={{ borderTop: `1.5px solid ${cs.inputBorderColor}` }}>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 text-lg font-bold transition-all disabled:opacity-60 hover:opacity-95 active:scale-[0.99] shadow-md hover:shadow-lg"
            style={{ background: cs.accentColor, color: cs.buttonText, fontFamily: 'inherit', borderRadius: btnRadius }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  )
}