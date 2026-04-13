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
        "relative rounded-2xl border-2 transition-all group bg-white",
        isSelected ? "border-indigo-500 shadow-lg ring-4 ring-indigo-50" : "border-transparent hover:border-gray-200",
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
  const { form, fields, setFields, customStyles, setActiveFieldId } = useBuilder()

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
    minHeight: '400px'
  }

  return (
    <div className="flex-1 py-12 px-4 sm:px-8 overflow-y-auto custom-scrollbar" onClick={() => setActiveFieldId(null)}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={containerStyle} 
        className="relative overflow-hidden transition-all duration-300"
      >
        {/* Form Header */}
        <div style={{ backgroundColor: customStyles.headerBg, color: customStyles.headerText }} className="px-8 py-10 transition-colors">
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
        <div className="p-8 space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Build your form</h3>
                  <p className="text-gray-500 max-w-sm text-center text-sm">Click any field in the left sidebar to add it to your canvas.</p>
                </div>
              ) : (
                fields.map((field) => (
                  <SortableFieldItem key={field.id} field={field} />
                ))
              )}
            </SortableContext>
          </DndContext>
          
          {fields.length > 0 && (
            <div className="pt-8 mt-8 border-t border-gray-100">
              <button 
                disabled 
                className="w-full py-4 rounded-xl text-white font-bold text-lg opacity-80 cursor-not-allowed transition-colors"
                style={{ backgroundColor: customStyles.accentColor }}
              >
                Submit Form
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
