import { createAdminClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import PublicForm from './PublicForm'

export const revalidate = 0

const DEFAULT_STYLES = {
  headerBg: '#4f46e5',
  headerText: '#ffffff',
  bodyBg: '#ffffff',
  bodyText: '#111827',
  accentColor: '#4f46e5',
  buttonText: '#ffffff',
  fontFamily: 'Inter',
  inputBorderColor: '#e5e7eb',
  inputBg: '#f9fafb',
  labelColor: '#111827',
  containerWidth: 640,
  containerPadding: 40,
  borderRadius: 16,
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  fontSizeBase: 16,
  logoHeight: 48,
  logoAlignment: 'left',
  logoBorderRadius: 8,
  coverHeight: 240,
  pageBgColor: '#f3f4f6',
  pageBgImage: '',
  pageBgBlur: 0,
  pageBgOverlayOpacity: 10,
  formScale: 1,
  headerAlignment: 'left',
  coverImageFit: 'cover'
}

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = createAdminClient()

  const { data: form, error } = await supabase
    .from('forms')
    .select(`*, form_fields (*)`)
    .eq('id', resolvedParams.id)
    .single()

  if (error || !form) notFound()

  if (!form.published) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Form Not Available</h2>
          <p className="text-gray-500 text-sm">This form is currently unpublished or no longer accepting responses.</p>
        </div>
      </div>
    )
  }

  // Parse description + styles
  let displayDescription = form.description || ''
  let customStyles = { ...DEFAULT_STYLES }

  if (displayDescription.includes('|||STYLES:')) {
    const parts = displayDescription.split('|||STYLES:')
    displayDescription = parts[0]
    try { customStyles = { ...DEFAULT_STYLES, ...JSON.parse(parts[1]) } } catch { }
  }

  // Sort fields by order
  if (form.form_fields) {
    form.form_fields.sort((a: any, b: any) => a.order - b.order)
  }

  const fontUrl = customStyles.fontFamily !== 'Inter' && customStyles.fontFamily !== 'Georgia'
    ? `https://fonts.googleapis.com/css2?family=${customStyles.fontFamily.replace(' ', '+')}:wght@400;500;600;700;800&display=swap`
    : null

  return (
    <div 
      className="min-h-screen transition-all duration-300 relative" 
      style={{ 
        backgroundColor: customStyles.pageBgColor,
        backgroundImage: customStyles.pageBgImage ? `url(${customStyles.pageBgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div 
        className="min-h-screen py-12 px-4 sm:px-6"
        style={customStyles.pageBgImage ? {
          backdropFilter: `blur(${customStyles.pageBgBlur}px)`,
          WebkitBackdropFilter: `blur(${customStyles.pageBgBlur}px)`,
          backgroundColor: `rgba(0,0,0,${(customStyles.pageBgOverlayOpacity || 0) / 100})`,
        } : {}}
      >
        <div
          className="mx-auto overflow-hidden transition-all duration-300 shadow-2xl"
          style={{
            maxWidth: `${customStyles.containerWidth}px`,
            borderRadius: `${customStyles.borderRadius}px`,
            fontFamily: `"${customStyles.fontFamily}", sans-serif`,
            fontSize: `${customStyles.fontSizeBase}px`,
            background: customStyles.bodyBg,
            transform: `scale(${customStyles.formScale || 1})`,
            transformOrigin: 'top center'
          }}
        >
          {/* COVER IMAGE */}
          {form.cover_image_url && (
            <div 
              className="w-full overflow-hidden bg-gray-200 border-b border-gray-100"
              style={{ height: `${customStyles.coverHeight}px` }}
            >
              <img
                src={form.cover_image_url}
                alt="Cover"
                className="w-full h-full"
                style={{ objectFit: customStyles.coverImageFit as any || 'cover' }}
              />
            </div>
          )}

        {/* FORM HEADER */}
        <div
          style={{
            background: customStyles.headerBg,
            padding: `${customStyles.containerPadding}px`,
            position: 'relative',
            textAlign: (customStyles as any).headerAlignment || 'left'
          }}
        >
          {/* LOGO */}
          {form.logo_url && (
            <div 
              className="mb-6 flex"
              style={{ 
                justifyContent: customStyles.logoAlignment === 'center' ? 'center' : customStyles.logoAlignment === 'right' ? 'flex-end' : 'flex-start' 
              }}
            >
              <img
                src={form.logo_url}
                alt="Logo"
                className="object-contain"
                style={{ 
                  height: `${customStyles.logoHeight}px`,
                  borderRadius: `${customStyles.logoBorderRadius}px`
                }}
              />
            </div>
          )}

          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: customStyles.headerText }}
          >
            {form.title}
          </h1>
          {displayDescription && (
            <p
              className="mt-4 text-lg whitespace-pre-wrap"
              style={{ color: customStyles.headerText, opacity: 0.85 }}
            >
              {displayDescription}
            </p>
          )}
        </div>

        {/* FORM BODY */}
        <PublicForm form={form} customStyles={customStyles} />
      </div>
     </div>
    </div>
  )
}
