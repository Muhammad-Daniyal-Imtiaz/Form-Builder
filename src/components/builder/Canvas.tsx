'use client'

import React, { useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { GripVertical, Trash2, Copy, Plus } from 'lucide-react'
import { useBuilder } from './BuilderContext'
import { FormField } from './types'
import { cn } from '@/utils/cn'

function SortableFieldItem({ field }: { field: FormField }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id })

  const { activeFieldId, setActiveFieldId, removeField, duplicateField, customStyles } = useBuilder()
  const isSelected = activeFieldId === field.id

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  }

  // Helper to render internal inputs for display only
  const inputStyle: React.CSSProperties = {
    border: `1.5px solid ${customStyles.inputBorderColor}`,
    background: customStyles.inputBg,
    color: customStyles.bodyText,
  }
  const inputCls = "w-full px-4 py-3 rounded-xl outline-none transition-all pointer-events-none"

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative rounded-2xl border-2 transition-all group bg-transparent",
        isSelected ? "border-indigo-500 shadow-lg ring-4 ring-indigo-500/20" : "border-transparent hover:border-gray-500/20",
        isDragging && "opacity-50 scale-105 shadow-2xl"
      )}
      onClick={(e) => {
        e.stopPropagation()
        setActiveFieldId(field.id)
      }}
    >
      <div className="p-6">
        {/* DRAG HANDLE */}
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-indigo-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* TOP ACTIONS */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute -top-12 right-0 bg-white rounded-xl shadow-xl border border-gray-100 p-1 flex items-center gap-1 z-20"
            >
              <button
                onClick={(e) => { e.stopPropagation(); duplicateField(field.id) }}
                className="p-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors tooltip-trigger"
                title="Duplicate"
              >
                <Copy className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-gray-200" />
              <button
                onClick={(e) => { e.stopPropagation(); removeField(field.id) }}
                className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors tooltip-trigger"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LABEL */}
        <div className="mb-3 flex items-center gap-2">
          <label className="text-sm font-bold text-gray-800" style={{ color: customStyles.labelColor }}>
            {field.label}
          </label>
          {field.required && <span className="text-red-500 font-bold">*</span>}
        </div>

        {/* FAKE INPUTS for Visuals */}
        <div className="relative">
          {field.type === 'text' && <input type="text" placeholder={field.placeholder || "Short answer text"} className={inputCls} style={inputStyle} readOnly />}
          {field.type === 'email' && <input type="email" placeholder={field.placeholder || "Email address"} className={inputCls} style={inputStyle} readOnly />}
          {field.type === 'number' && <input type="number" placeholder={field.placeholder || "Number"} className={inputCls} style={inputStyle} readOnly />}
          {field.type === 'textarea' && <textarea rows={3} placeholder={field.placeholder || "Long answer text"} className={cn(inputCls, "resize-none")} style={inputStyle} readOnly />}
          
          {['select', 'radio', 'checkbox', 'multiselect'].includes(field.type) && (
            <div className="space-y-3">
              {field.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 border-2 border-gray-300 flex items-center justify-center pointer-events-none",
                    (field.type === 'radio' || field.type === 'select') ? "rounded-full" : "rounded-md"
                  )} />
                  <span className="text-sm text-gray-600 font-medium">{opt}</span>
                </div>
              ))}
            </div>
          )}

          {['file', 'multifile'].includes(field.type) && (
            <div className="w-full py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
              <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <span className="text-xs font-bold uppercase tracking-widest">File Upload Area</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Canvas() {
  const { 
    form, fields, setFields, customStyles, 
    setActiveFieldId, formSettings, addPage, 
    removePage, pageCount 
  } = useBuilder()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const containerStyle = {
    maxWidth: customStyles.containerWidth,
    margin: '0 auto',
    backgroundColor: customStyles.bodyBg,
    borderRadius: customStyles.borderRadius,
    boxShadow: customStyles.boxShadow,
    minHeight: '400px',
    transform: `scale(${customStyles.formScale || 1})`,
    transformOrigin: 'top center',
    fontFamily: `"${customStyles.fontFamily}", sans-serif`,
  }

  const bgStyle: React.CSSProperties = {
    backgroundColor: customStyles.pageBgColor,
    ...(customStyles.pageBgImage ? {
      backgroundImage: `url(${customStyles.pageBgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    } : {}),
  }

  const bgOverlayStyle: React.CSSProperties = customStyles.pageBgImage ? {
    backdropFilter: `blur(${customStyles.pageBgBlur}px)`,
    WebkitBackdropFilter: `blur(${customStyles.pageBgBlur}px)`,
    backgroundColor: `rgba(0,0,0,${(customStyles.pageBgOverlayOpacity || 0) / 100})`,
  } : {}

  const fontUrl = customStyles.fontFamily && !['Inter'].includes(customStyles.fontFamily)
    ? `https://fonts.googleapis.com/css2?family=${customStyles.fontFamily.replace(' ', '+')}:wght@400;700;800&display=swap`
    : null;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative" onClick={() => setActiveFieldId(null)} style={bgStyle}>
      {fontUrl && <style dangerouslySetInnerHTML={{ __html: `@import url('${fontUrl}');` }} />}
      <style>{`
        ::placeholder {
          color: ${customStyles.bodyText} !important;
          opacity: 0.5 !important;
        }
      `}</style>
      <div className="min-h-full py-12 px-4 sm:px-8" style={bgOverlayStyle}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        style={containerStyle} 
        className="relative overflow-hidden transition-all duration-300 shadow-2xl"
      >
        {/* Cover Image */}
        {form?.cover_image_url && (
          <div className="w-full bg-gray-200 border-b border-gray-100" style={{ height: customStyles.coverHeight || 240 }}>
            <img 
              src={form.cover_image_url} 
              alt="Cover" 
              className="w-full h-full" 
              style={{ objectFit: customStyles.coverImageFit || 'cover' }}
            />
          </div>
        )}

        {/* Form Header */}
        <div style={{ backgroundColor: customStyles.headerBg, color: customStyles.headerText, textAlign: customStyles.headerAlignment }} className="px-8 py-10 transition-colors">
          {form?.logo_url && (
            <div className="mb-6 flex" style={{ 
              justifyContent: customStyles.logoAlignment === 'center' ? 'center' : customStyles.logoAlignment === 'right' ? 'flex-end' : 'flex-start' 
            }}>
              <img 
                src={form.logo_url} 
                alt="Logo" 
                className="object-contain transition-all" 
                style={{ 
                  height: customStyles.logoHeight || 48, 
                  borderRadius: customStyles.logoBorderRadius 
                }}
              />
            </div>
          )}

          <input 
            type="text" 
            value={form?.title || ''} 
            readOnly
            className="text-4xl font-extrabold w-full bg-transparent outline-none pointer-events-none mb-4" 
            placeholder="Form Title"
          />
          <textarea 
            value={form?.description || ''} 
            readOnly
            rows={2} 
            className="w-full bg-transparent outline-none pointer-events-none resize-none text-lg opacity-80" 
            placeholder="Description..."
          />
        </div>

        {/* Fields Area */}
        <div className="p-8 space-y-12">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {Array.from({ length: pageCount }).map((_, pIdx) => {
              const pageFields = fields.filter(f => f.pageIndex === pIdx)
              
              return (
                <div key={pIdx} className="space-y-4 relative">
                  {/* Page Divider / Header */}
                  <div className="flex items-center justify-between mb-6 group/page">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        {pIdx + 1}
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Page {pIdx + 1}</h4>
                    </div>
                    {pageCount > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removePage(pIdx) }}
                        className="opacity-0 group-hover/page:opacity-100 px-3 py-1 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        Delete Page
                      </button>
                    )}
                  </div>

                  <SortableContext
                    items={pageFields.map(f => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {pageFields.length === 0 ? (
                      <div className="py-10 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-300">
                        <p className="text-[10px] font-bold uppercase tracking-widest">Empty Page</p>
                      </div>
                    ) : (
                      pageFields.map((field) => (
                        <SortableFieldItem key={field.id} field={field} />
                      ))
                    )}
                  </SortableContext>
                  
                  {/* Connection Line */}
                  {pIdx < pageCount - 1 && (
                    <div className="absolute -bottom-10 left-4 w-px h-8 bg-gray-100" />
                  )}
                </div>
              )
            })}
          </DndContext>

          {/* Add Page Control */}
          <div className="flex justify-center pt-4">
            <button
              onClick={(e) => { e.stopPropagation(); addPage() }}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-dashed border-gray-300 rounded-2xl text-xs font-bold text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Page Break
            </button>
          </div>
          
          {fields.length > 0 && (
            <div className="pt-8 mt-4 border-t border-gray-100">
              <button 
                disabled 
                className="w-full py-4 rounded-xl text-white font-bold text-lg opacity-80 cursor-not-allowed transition-colors"
                style={{ backgroundColor: customStyles.accentColor }}
              >
                {formSettings.submitButtonText || 'Submit Form'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
      </div>
    </div>
  )
}
