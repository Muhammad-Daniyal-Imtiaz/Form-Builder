'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'

export default function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [form, setForm] = useState<any>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [formRes, subsRes] = await Promise.all([
        fetch(`/api/forms/${resolvedParams.id}`),
        fetch(`/api/forms/${resolvedParams.id}/submissions`)
      ])

      if (!formRes.ok) throw new Error('Failed to fetch form details')
      if (!subsRes.ok) throw new Error('Failed to fetch submissions')

      const formData = await formRes.json()
      const subsData = await subsRes.json()

      setForm(formData)
      setSubmissions(subsData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Extract all unique headers from form fields
  const headers = form?.form_fields?.map((f: any) => f.label) || []

  if (loading) return <div className="p-8 text-center text-gray-500">Loading submissions...</div>
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/dashboard" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{form?.title}</h1>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">Results</span>
            </div>
            <p className="text-sm text-gray-500 ml-8">{submissions.length} Total Submissions</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/dashboard/forms/${resolvedParams.id}/edit`}
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-colors text-sm"
            >
              Edit Form
            </Link>
            <Link
              href={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/f/${resolvedParams.id}`}
              target="_blank"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2"
            >
              View Public Form
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </Link>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {submissions.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              <h3 className="mt-4 text-sm font-medium text-gray-900">No submissions yet</h3>
              <p className="mt-1 text-sm text-gray-500">Share your form link to start collecting responses.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Date Submitted
                    </th>
                    {headers.map((header: string, i: number) => (
                      <th key={i} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((sub: any) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sub.submitted_at).toLocaleString()}
                      </td>
                      {form?.form_fields?.map((field: any, i: number) => {
                        const cellValue = sub.data[field.id] || sub.data[field.label] || '-'
                        return (
                          <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {field.type === 'file' && typeof cellValue === 'object' && cellValue !== null && cellValue.url ? (
                              <a href={cellValue.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900 hover:underline flex items-center gap-1 font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                {cellValue.fileName || 'Download'}
                              </a>
                            ) : Array.isArray(cellValue) ? (
                              cellValue.join(', ')
                            ) : (
                              String(cellValue)
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}