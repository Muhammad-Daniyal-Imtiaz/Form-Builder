'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, X, GripVertical, Plus, Trash2 } from 'lucide-react'
import { useBuilder } from './BuilderContext'
import { cn } from '@/utils/cn'

export function FieldSettingsPanel() {
  const { activeFieldId, setActiveFieldId, fields, updateField, addOption, updateOption, removeOption } = useBuilder()

  const activeField = fields.find(f => f.id === activeFieldId)

  return (
    <AnimatePresence>
      {activeField && (
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="w-80 bg-white/90 backdrop-blur-xl border-l border-gray-200/50 h-[calc(100vh-56px)] sticky top-14 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-20 flex flex-col shrink-0"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-indigo-700 font-bold">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Field Settings</span>
            </div>
            <button
              onClick={() => setActiveFieldId(null)}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                  Field Label
                </label>
                <input
                  type="text"
                  value={activeField.label}
                  onChange={(e) => updateField(activeField.id, { label: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {['text', 'email', 'number', 'textarea'].includes(activeField.type) && (
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={activeField.placeholder || ''}
                    onChange={(e) => updateField(activeField.id, { placeholder: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Enter placeholder..."
                  />
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={activeField.required}
                    onChange={(e) => updateField(activeField.id, { required: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-800">Required Field</div>
                    <div className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">User must fill this out</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Options Manager */}
            {['select', 'multiselect', 'radio', 'checkbox'].includes(activeField.type) && (
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                  Choices
                </label>
                <div className="space-y-2">
                  {activeField.options?.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <div className="p-1.5 text-gray-300 cursor-grab">
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(activeField.id, idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                      <button
                        onClick={() => removeOption(activeField.id, idx)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addOption(activeField.id)}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-2 border-2 border-dashed border-indigo-100 rounded-lg text-indigo-500 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Option
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
