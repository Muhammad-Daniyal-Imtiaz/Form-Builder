import { useState } from 'react'
import type { FieldType } from './page'

interface FormField {
    id?: string
    label: string
    type: FieldType
    required: boolean
    options: string[] | null // strictly array for select/multiselect/radio/checkbox
    placeholder: string | null
}

export default function LiveFieldPreview({ field, theme = 'default' }: { field: FormField, theme?: string }) {
    // Theme configurations - matched exactly with PublicForm.tsx
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

    return (
        <div className="space-y-3 pointer-events-none mt-4 border-t border-gray-100 pt-6">
            <label className={labelClass}>
                {field.label || 'Question Label'} {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'text' && (
                <input type="text" placeholder={field.placeholder || ''} className={inputClass} readOnly />
            )}

            {field.type === 'email' && (
                <input type="email" placeholder={field.placeholder || 'name@example.com'} className={inputClass} readOnly />
            )}

            {field.type === 'number' && (
                <input type="number" placeholder={field.placeholder || ''} className={inputClass} readOnly />
            )}

            {field.type === 'textarea' && (
                <textarea rows={4} placeholder={field.placeholder || ''} className={`${inputClass} resize-y`} readOnly />
            )}

            {field.type === 'select' && (
                <div className="relative">
                    <select className={`${inputClass} appearance-none`} defaultValue="" disabled>
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
                    <select multiple className={`${inputClass} min-h-[120px]`} disabled>
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
                        <label key={i} className={`flex items-center gap-3 p-3 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : theme === 'playful' ? 'bg-white border-2 border-black rounded-lg' : theme === 'elegant' ? '' : 'bg-gray-50 border border-gray-200 rounded-xl'}`}>
                            <input type="radio" checked={false} readOnly className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-600 focus:ring-purple-500' : 'text-indigo-600 focus:ring-indigo-500'}`} />
                            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>{opt || `Option ${i + 1}`}</span>
                        </label>
                    ))}
                </div>
            )}

            {field.type === 'checkbox' && (
                <div className="space-y-3 mt-3">
                    {field.options?.map((opt: string, i: number) => (
                        <label key={i} className={`flex items-center gap-3 p-3 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : theme === 'playful' ? 'bg-white border-2 border-black rounded-lg' : theme === 'elegant' ? '' : 'bg-gray-50 border border-gray-200 rounded-xl'}`}>
                            <input type="checkbox" checked={false} readOnly className={`w-5 h-5 rounded ${theme === 'dark' ? 'text-purple-600 focus:ring-purple-500' : 'text-indigo-600 focus:ring-indigo-500'}`} />
                            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>{opt || `Option ${i + 1}`}</span>
                        </label>
                    ))}
                </div>
            )}

            {['file', 'multifile'].includes(field.type) && (
                <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                        <label className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                <svg className={`w-10 h-10 mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className={`mb-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}><span className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-indigo-600'}`}>Click to upload</span> {field.type === 'multifile' ? 'multiple files' : 'a file'}</p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>SVG, PNG, JPG, PDF (MAX. 50MB)</p>
                            </div>
                        </label>
                    </div>
                </div>
            )}
        </div>
    )
}
