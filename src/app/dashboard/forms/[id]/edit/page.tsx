'use client'

import { use } from 'react'
import { BuilderProvider } from '@/components/builder/BuilderContext'
import { Sidebar } from '@/components/builder/Sidebar'
import { Canvas } from '@/components/builder/Canvas'
import { FieldSettingsPanel } from '@/components/builder/FieldSettingsPanel'
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useBuilder } from '@/components/builder/BuilderContext'

function BuilderHeader() {
  const { form, saving, saved, save, loading, formId, updateFormDetails } = useBuilder()

  if (loading) return null

  const formPublicUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/f/${formId}`

  return (
    <header className="h-14 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        <div className="w-px h-5 bg-gray-200" />
        <div>
          <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest leading-none">Form Builder</p>
          <p className="text-sm font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs mt-0.5">
            {form?.title || 'Untitled Form'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => updateFormDetails({ published: !form?.published })}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border shadow-sm ${
            form?.published
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
              : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${form?.published ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {form?.published ? 'Published' : 'Draft'}
        </button>

        <a
          href={formPublicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
        >
          <Eye className="w-4 h-4" />
          Preview
        </a>

        <button
          onClick={save}
          disabled={saving || saved}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm disabled:opacity-80 disabled:cursor-not-allowed
            bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/20"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            'Saved!'
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          )}
        </button>
      </div>
    </header>
  )
}

function BuilderLayout() {
  const { loading, error } = useBuilder()

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 rounded-2xl p-8 max-w-md text-center border border-red-100 shadow-xl shadow-red-500/5">
          <h2 className="text-xl font-bold mb-2">Error Loading Builder</h2>
          <p className="text-sm font-medium mb-6 opacity-80">{error}</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-red-700 font-bold text-sm bg-white px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <div className="text-sm font-bold tracking-widest uppercase text-gray-400">Loading Workspace...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafb] flex flex-col overflow-hidden font-sans text-gray-900">
      <BuilderHeader />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <Canvas />
        <FieldSettingsPanel />
      </div>
    </div>
  )
}

export default function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  return (
    <BuilderProvider formId={resolvedParams.id}>
      <BuilderLayout />
    </BuilderProvider>
  )
}