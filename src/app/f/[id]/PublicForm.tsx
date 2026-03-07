'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PublicForm({ form }: { form: any }) {
  const router = useRouter()
  const [data, setData] = useState<Record<string, any>>({})
  const [files, setFiles] = useState<Record<string, File | { url: string; path: string; fileName: string; size: number; mimeType: string }>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (fieldId: string, value: any) => {
    setData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    setData((prev) => {
      const currentVal = prev[fieldId] || []
      if (checked) {
        return { ...prev, [fieldId]: [...currentVal, option] }
      } else {
        return { ...prev, [fieldId]: currentVal.filter((val: string) => val !== option) }
      }
    })
  }

  const handleFileChange = async (fieldId: string, file: File) => {
    setLoading(true)
    setError('')
    try {
      // Create FormData to upload
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('File upload failed. Please try again or use a smaller file.')

      const uploadedFileData = await res.json()

      // Store the metadata for submission and URL for viewing
      setFiles((prev) => ({ ...prev, [fieldId]: uploadedFileData }))
      handleInputChange(fieldId, uploadedFileData)
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
      // Gather files for the separate table tracking (optional)
      const uploadedFilesArray = Object.values(files).filter(f => !(f instanceof File))

      const res = await fetch(`/api/forms/${form.id}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data,
          files: uploadedFilesArray
        }),
      })

      const resData = await res.json()

      if (!res.ok) {
        throw new Error(resData.error || 'Failed to submit form')
      }

      router.push(`/f/${form.id}/success`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 border-t-0 p-8 sm:p-10 pb-12">
      {error && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {form.form_fields?.map((field: any, index: number) => {
          // Use field.label as fallback key if label is unique, but field.id is safer
          // Assuming label for display in data for easier reading by user, but mapping by ID is technically safer
          // We will map data keys to field labels to make viewing submissions nicer, 
          // or use ID and map on the render side. Let's use ID for data structure safety, but fallback to label.
          const fieldKey = field.id || field.label

          return (
            <div key={index} className="space-y-3">
              <label className="block text-base font-semibold text-gray-900">
                {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  required={field.required}
                  placeholder={field.placeholder || ''}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-900"
                />
              )}

              {field.type === 'email' && (
                <input
                  type="email"
                  required={field.required}
                  placeholder={field.placeholder || 'name@example.com'}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-900"
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  required={field.required}
                  placeholder={field.placeholder || ''}
                  onChange={(e) => handleInputChange(fieldKey, Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-900"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  required={field.required}
                  rows={4}
                  placeholder={field.placeholder || ''}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-900 resize-y"
                />
              )}

              {field.type === 'select' && (
                <div className="relative">
                  <select
                    required={field.required}
                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all text-gray-900 appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled className="text-gray-400">Select an option...</option>
                    {field.options?.map((opt: string, i: number) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              )}

              {field.type === 'radio' && (
                <div className="space-y-3 mt-3">
                  {field.options?.map((opt: string, i: number) => (
                    <label key={i} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                      <input
                        type="radio"
                        name={fieldKey}
                        value={opt}
                        required={field.required}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-gray-900">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div className="space-y-3 mt-3">
                  {field.options?.map((opt: string, i: number) => (
                    <label key={i} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                      <input
                        type="checkbox"
                        name={`${fieldKey}-${i}`}
                        value={opt}
                        // Technically required logic for checkbox arrays means at least one must be checked, 
                        // but simple HTML required makes ALL required. For custom forms, usually omitted or custom validated.
                        onChange={(e) => handleCheckboxChange(fieldKey, opt, e.target.checked)}
                        className="w-5 h-5 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-gray-900">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'file' && (
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${files[fieldKey] ? 'bg-indigo-50 border-indigo-300' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {files[fieldKey] ? (
                          <>
                            <svg className="w-10 h-10 mb-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p className="mb-2 text-sm text-indigo-600 font-medium">{(files[fieldKey] as any).fileName}</p>
                            <p className="text-xs text-indigo-500">File uploaded and attached securely.</p>
                          </>
                        ) : (
                          <>
                            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG, PDF (MAX. 50MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        required={field.required && !files[fieldKey]}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileChange(fieldKey, file)
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        <div className="pt-8 mt-10 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-200 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing securely...
              </span>
            ) : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  )
}