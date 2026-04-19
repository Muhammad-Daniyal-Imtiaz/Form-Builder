'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { FileSpreadsheet, Download, ExternalLink, ArrowLeft, Loader2, Check } from 'lucide-react'

export default function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [form, setForm] = useState<any>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sheetStatus, setSheetStatus] = useState<any>(null)
  const [syncing, setSyncing] = useState(false)

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
      
      // Fetch integration status
      const intRes = await fetch(`/api/forms/${resolvedParams.id}/integrations/google-sheets`)
      if (intRes.ok) {
        const intData = await intRes.json()
        setSheetStatus(intData)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSync = async () => {
    if (!sheetStatus?.sheetId) return
    if (!confirm(`This will push all ${submissions.length} submissions to your Google Sheet. Continue?`)) return

    setSyncing(true)
    try {
      const resp = await fetch(`/api/forms/${resolvedParams.id}/integrations/google-sheets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-existing' })
      })
      
      const data = await resp.json()
      
      if (resp.ok) {
        if (data.count === 0) {
          alert('Sheets already up-to-date. No new data to push!')
        } else {
          alert(data.message || `Successfully synced ${data.count} submissions!`)
        }
      } else {
        alert(data.error || 'Failed to sync. Please check your Google connection.')
      }
    } catch (err) {
      console.error('Sync failed:', err)
      alert('An error occurred during sync.')
    } finally {
      setSyncing(false)
    }
  }

  // Extract all unique headers from form fields
  const headers = form?.form_fields?.map((f: any) => f.label) || []

  const exportToCSV = () => {
    if (!submissions.length || !form) return

    // 1. Prepare Headers
    const csvHeaders = ['Date Submitted', ...headers]
    
    // 2. Prepare Rows
    const rows = submissions.map(sub => {
      const rowData = [new Date(sub.submitted_at).toLocaleString()]
      
      form.form_fields.forEach((field: any) => {
        let val = sub.data[field.id] || sub.data[field.label] || ''
        
        // Flatten arrays (multiselect or files)
        if (Array.isArray(val)) {
          if (['file', 'multifile'].includes(field.type)) {
            val = val.map(f => f.url).join('; ')
          } else {
            val = val.join(', ')
          }
        } else if (typeof val === 'object' && val?.url) {
          // Single file upload
          val = val.url
        }
        
        // Escape quotes and wrap in quotes for CSV safety
        const cleanedVal = String(val).replace(/"/g, '""')
        rowData.push(`"${cleanedVal}"`)
      })
      
      return rowData.join(',')
    })

    const csvContent = [csvHeaders.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    const fileName = `${form.title.replace(/\s+/g, '_')}_Submissions_${new Date().toISOString().split('T')[0]}.csv`
    
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportToCSV}
              disabled={submissions.length === 0}
              className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-indigo-50 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>

            {sheetStatus?.isConnected && sheetStatus?.sheetId && (
              <button
                onClick={handleGoogleSync}
                disabled={syncing || submissions.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-green-700 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
                {syncing ? 'Syncing...' : 'Sync to Google Sheets'}
              </button>
            )}
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
                            {['file', 'multifile'].includes(field.type) && cellValue && (Array.isArray(cellValue) ? cellValue[0]?.url : cellValue.url) ? (
                              <div className="flex flex-col gap-1">
                                {(Array.isArray(cellValue) ? cellValue : [cellValue]).map((fileObj, fIdx) => (
                                  <a key={fIdx} href={fileObj.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900 hover:underline flex items-center gap-1 font-medium text-xs">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                    <span className="truncate max-w-[150px]">{fileObj.fileName || 'Download'}</span>
                                  </a>
                                ))}
                              </div>
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