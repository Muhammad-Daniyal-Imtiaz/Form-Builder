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

  // Sort fields by order
  if (form.form_fields) {
    form.form_fields.sort((a: any, b: any) => a.order - b.order)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Form Header */}
        <div className="bg-white rounded-t-2xl shadow-sm border border-gray-200 border-b-0 p-8 sm:p-10 border-t-8 border-t-indigo-600">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{form.title}</h1>
          {form.description && (
            <p className="mt-4 text-base text-gray-600 whitespace-pre-wrap">{form.description}</p>
          )}
        </div>

        {/* Form Body (Client Component) */}
        <PublicForm form={form} />
      </div>
    </div>
  )
}