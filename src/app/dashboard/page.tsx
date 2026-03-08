import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/SignOutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile info
  const { data: dbUser } = await supabase
    .from('users')
    .select('name, role')
    .eq('id', user.id)
    .single()

  // Fetch forms with submission count
  const { data: forms } = await supabase
    .from('forms')
    .select('*, submissions(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-indigo-600 tracking-tight">FormFlow SaaS</h1>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-900">{dbUser?.name || user.user_metadata?.name || 'User'}</span>
            <span className="text-xs text-gray-500">{dbUser?.role || 'user'}</span>
          </div>
          <SignOutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Forms</h2>
            <p className="mt-2 text-sm text-gray-500">Manage, edit, and view submissions for all your active forms.</p>
          </div>
          <Link
            href="/dashboard/forms/new"
            className="inline-flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create New Form
          </Link>
        </div>

        {forms?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No forms created yet</h3>
            <p className="mt-2 text-sm text-gray-500">Get started by creating your first form to collect data.</p>
            <div className="mt-6">
              <Link
                href="/dashboard/forms/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create your first form
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {forms?.map((form) => {
              const submissionCount = form.submissions?.[0]?.count || 0;
              return (
                <div key={form.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${form.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {form.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                        {submissionCount} {submissionCount === 1 ? 'Response' : 'Responses'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{form.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6">{form.description || 'No description provided.'}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/forms/${form.id}/edit`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Edit Builder
                      </Link>
                      <span className="text-gray-300">•</span>
                      <Link
                        href={`/dashboard/forms/${form.id}/submissions`}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Results
                      </Link>
                    </div>

                    {form.published && (
                      <Link
                        href={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/f/${form.id}`}
                        target="_blank"
                        title="View Public Form"
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
