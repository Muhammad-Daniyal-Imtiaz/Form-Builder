'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PublicForm({ form, theme = 'default' }: { form: any, theme?: string }) {
  const router = useRouter()
  const [data, setData] = useState<Record<string, any>>({})
  const [files, setFiles] = useState<Record<string, any>>({})
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

  const handleFileChange = async (fieldId: string, fileList: FileList, isMultiple: boolean) => {
    setLoading(true)
    setError('')
    try {
      const uploadedFiles = []

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) throw new Error('File upload failed. Please try again or use a smaller file.')

        uploadedFiles.push(await res.json())
      }

      if (isMultiple) {
        const currentFiles = files[fieldId] || []
        const newFiles = [...currentFiles, ...uploadedFiles]
        setFiles((prev) => ({ ...prev, [fieldId]: newFiles }))
        handleInputChange(fieldId, newFiles)
      } else {
        setFiles((prev) => ({ ...prev, [fieldId]: uploadedFiles[0] }))
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
      // Gather files for the separate table tracking (optional)
      let uploadedFilesArray: any[] = []
      Object.keys(files).forEach(key => {
        const fileData = files[key]
        if (Array.isArray(fileData)) {
          uploadedFilesArray = [...uploadedFilesArray, ...fileData]
        } else {
          uploadedFilesArray.push(fileData)
        }
      })

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

  // Theme configurations
  const layoutBox = {
    default: 'bg-white rounded-b-2xl shadow-sm border border-gray-200 border-t-0 p-8 sm:p-10 pb-12',
    playful: 'bg-white border-4 border-black border-t-0 rounded-b-2xl p-8 sm:p-10 pb-12',
    elegant: 'bg-white border border-gray-300 border-t-0 p-8 sm:p-12 pb-16',
    dark: 'bg-gray-900 rounded-b-2xl border border-gray-800 border-t-0 p-8 sm:p-10 pb-12'
  }[theme] || 'bg-white rounded-b-2xl shadow-sm border border-gray-200 border-t-0 p-8 sm:p-10 pb-12'

  const inputClass = {
    default: 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-900',
    playful: 'w-full px-4 py-3 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_black] focus:shadow-[2px_2px_0px_black] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all placeholder:text-gray-500 text-black font-medium',
    elegant: 'w-full px-0 py-3 bg-transparent border-b-2 border-gray-200 rounded-none focus:border-gray-800 outline-none transition-all placeholder:text-gray-400 text-gray-800',
    dark: 'w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-500 text-white'
  }[theme] || 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl'

  const labelClass = {
    default: 'block text-base font-semibold text-gray-900',
    playful: 'block text-base font-black text-black',
    elegant: 'block text-sm font-semibold text-gray-800 uppercase tracking-widest',
    dark: 'block text-base font-semibold text-gray-100'
  }[theme] || 'block text-base font-semibold text-gray-900'

  const buttonClass = {
    default: 'w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-200 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95',
    playful: 'w-full flex justify-center py-4 px-4 border-2 border-black rounded-xl shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] text-lg font-black text-black bg-pink-400 focus:outline-none disabled:opacity-50 transition-all active:scale-95',
    elegant: 'w-full flex justify-center py-4 px-4 border border-transparent rounded-none text-sm tracking-widest uppercase font-semibold text-white bg-gray-900 hover:bg-black focus:outline-none disabled:opacity-50 transition-all',
    dark: 'w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-purple-900/20 text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95'
  }[theme] || 'w-full flex justify-center py-4 px-4 bg-indigo-600 text-white rounded-xl font-bold'

  return (
    <div className={layoutBox}>
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
          const fieldKey = field.id || field.label

          return (
            <div key={index} className="space-y-3">
              <label className={labelClass}>
                {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  required={field.required}
                  placeholder={field.placeholder || ''}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  className={inputClass}
                />
              )}

              {field.type === 'email' && (
                <input
                  type="email"
                  required={field.required}
                  placeholder={field.placeholder || 'name@example.com'}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  className={inputClass}
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  required={field.required}
                  placeholder={field.placeholder || ''}
                  onChange={(e) => handleInputChange(fieldKey, Number(e.target.value))}
                  className={inputClass}
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  required={field.required}
                  rows={4}
                  placeholder={field.placeholder || ''}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  className={`${inputClass} resize-y`}
                />
              )}

              {field.type === 'select' && (
                <div className="relative">
                  <select
                    required={field.required}
                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                    className={`${inputClass} appearance-none`}
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

              {field.type === 'multiselect' && (
                <div className="relative">
                  <select
                    multiple
                    required={field.required}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value)
                      handleInputChange(fieldKey, selected)
                    }}
                    className={`${inputClass} min-h-[120px]`}
                  >
                    {field.options?.map((opt: string, i: number) => (
                      <option key={i} value={opt} className="p-2 border-b border-gray-100 last:border-0">{opt}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">Hold Ctrl (Windows) or Cmd (Mac) to select multiple items.</p>
                </div>
              )}

              {field.type === 'radio' && (
                <div className="space-y-3 mt-3">
                  {field.options?.map((opt: string, i: number) => (
                    <label key={i} className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : theme === 'playful' ? 'bg-white border-2 border-black rounded-lg hover:bg-yellow-50' : theme === 'elegant' ? 'hover:bg-gray-50' : 'bg-gray-50 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200'}`}>
                      <input
                        type="radio"
                        name={fieldKey}
                        value={opt}
                        required={field.required}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-600 focus:ring-purple-500' : 'text-indigo-600 focus:ring-indigo-500'}`}
                      />
                      <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div className="space-y-3 mt-3">
                  {field.options?.map((opt: string, i: number) => (
                    <label key={i} className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : theme === 'playful' ? 'bg-white border-2 border-black rounded-lg hover:bg-yellow-50' : theme === 'elegant' ? 'hover:bg-gray-50' : 'bg-gray-50 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200'}`}>
                      <input
                        type="checkbox"
                        name={`${fieldKey}-${i}`}
                        value={opt}
                        onChange={(e) => handleCheckboxChange(fieldKey, opt, e.target.checked)}
                        className={`w-5 h-5 rounded ${theme === 'dark' ? 'text-purple-600 focus:ring-purple-500' : 'text-indigo-600 focus:ring-indigo-500'}`}
                      />
                      <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {['file', 'multifile'].includes(field.type) && (
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${files[fieldKey] ? (theme === 'dark' ? 'bg-purple-900/20 border-purple-500' : 'bg-indigo-50 border-indigo-300') : (theme === 'dark' ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-gray-50 border-gray-300 hover:bg-gray-100')}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        {files[fieldKey] ? (
                          <>
                            <svg className={`w-10 h-10 mb-3 ${theme === 'dark' ? 'text-purple-400' : 'text-indigo-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {Array.isArray(files[fieldKey]) ? (
                              <p className={`mb-2 text-sm font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-indigo-600'}`}>{files[fieldKey].length} files attached securely.</p>
                            ) : (
                              <p className={`mb-2 text-sm font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-indigo-600'}`}>{files[fieldKey].fileName}</p>
                            )}
                            {field.type === 'multifile' && <p className="text-xs text-gray-500 mt-2">Click to select more files</p>}
                          </>
                        ) : (
                          <>
                            <svg className={`w-10 h-10 mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            <p className={`mb-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}><span className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-indigo-600'}`}>Click to upload</span> {field.type === 'multifile' ? 'multiple files' : 'a file'}</p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>SVG, PNG, JPG, PDF (MAX. 50MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple={field.type === 'multifile'}
                        required={field.required && !files[fieldKey]}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleFileChange(fieldKey, e.target.files, field.type === 'multifile')
                          }
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
            className={buttonClass}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
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