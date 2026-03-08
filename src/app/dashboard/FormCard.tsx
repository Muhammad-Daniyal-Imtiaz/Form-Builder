'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function FormCard({ form, siteUrl }: { form: any; siteUrl: string }) {
    const router = useRouter()
    const [publishing, setPublishing] = useState(false)
    const submissionCount = form.submissions?.[0]?.count || 0

    const handlePublish = async () => {
        setPublishing(true)
        try {
            const res = await fetch(`/api/forms/${form.id}/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: true })
            })
            if (res.ok) router.refresh()
        } catch (err) {
            console.error(err)
        } finally {
            setPublishing(false)
        }
    }

    return (
        <div key={form.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full">
            <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm ${form.published ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                        {form.published ? 'Live' : 'Draft'}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        {submissionCount} {submissionCount === 1 ? 'Response' : 'Responses'}
                    </span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{form.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">{form.description || 'Build your amazing form from here.'}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                    <Link
                        href={`/dashboard/forms/${form.id}/edit`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100"
                    >
                        EDIT
                    </Link>
                    <Link
                        href={`/dashboard/forms/${form.id}/submissions`}
                        className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors px-1"
                    >
                        RESULTS
                    </Link>
                    {!form.published && (
                        <button
                            onClick={handlePublish}
                            disabled={publishing}
                            className="text-xs font-bold text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                        >
                            • {publishing ? '...' : 'PUBLISH NOW'}
                        </button>
                    )}
                </div>

                {form.published && (
                    <Link
                        href={`${siteUrl}/f/${form.id}`}
                        target="_blank"
                        title="View Public Form"
                        className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-full transition-all border border-transparent hover:border-indigo-100"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </Link>
                )}
            </div>
        </div>
    )
}
