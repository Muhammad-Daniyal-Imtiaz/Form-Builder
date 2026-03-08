import { createAdminClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import PublicForm from './PublicForm'

export const revalidate = 0 // Opt out of caching for forms

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = createAdminClient()

  // Fetch form and fields
  const { data: form, error } = await supabase
    .from('forms')
    .select(`
      *,
      form_fields (*)
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (error || !form) {
    notFound()
  }

  if (!form.published) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Form Not Available</h2>
          <p className="text-gray-500">This form is currently unpublished or no longer accepting responses.</p>
        </div>
      </div>
    )
  }

  // Extract theme from description
  let displayDescription = form.description || ''
  let theme = 'default'
  if (displayDescription.includes('|||THEME:')) {
    const parts = displayDescription.split('|||THEME:')
    displayDescription = parts[0]
    theme = parts[1]
  }

  // Sort fields by order
  if (form.form_fields) {
    form.form_fields.sort((a: any, b: any) => a.order - b.order)
  }

  // Theme styles
  const themeContainer: Record<string, string> = {
    default: 'min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans',
    playful: 'min-h-screen bg-pink-50 py-12 px-4 sm:px-6 lg:px-8 font-sans border-t-8 border-t-yellow-400',
    elegant: 'min-h-screen bg-[#F5F5F0] py-12 px-4 sm:px-6 lg:px-8 font-serif',
    dark: 'min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-100'
  }

  const themeHeader: Record<string, string> = {
    default: 'bg-white rounded-t-2xl shadow-sm border border-gray-200 border-b-0 p-8 sm:p-10 border-t-8 border-t-indigo-600',
    playful: 'bg-white border-4 border-black border-b-0 p-8 sm:p-10 rounded-t-2xl shadow-[8px_0px_0px_rgba(0,0,0,1)]',
    elegant: 'bg-white border text-center border-gray-300 border-b-0 p-8 sm:p-12',
    dark: 'bg-gray-900 rounded-t-2xl border border-gray-800 border-b-0 p-8 sm:p-10 border-t-4 border-t-purple-500'
  }

  return (
    <div className={themeContainer[theme] || themeContainer.default}>
      <div className="max-w-3xl mx-auto">
        {/* Form Header */}
        <div className={themeHeader[theme] || themeHeader.default}>
          <h1 className={`text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : theme === 'elegant' ? 'text-gray-800' : 'text-gray-900'}`}>{form.title}</h1>
          {displayDescription && (
            <p className={`mt-4 text-base whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{displayDescription}</p>
          )}
        </div>

        {/* Form Body (Client Component) */}
        <PublicForm form={form} theme={theme} />
      </div>
    </div>
  )
}