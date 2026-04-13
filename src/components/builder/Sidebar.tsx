'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Type, Mail, Hash, AlignLeft, List, CheckSquare, Image as ImageIcon, FileUp, Palette, Layers, Plus } from 'lucide-react'
import { useBuilder } from './BuilderContext'
import { FieldType } from './types'
import { cn } from '@/utils/cn'

const FIELD_TOOLS: { type: FieldType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: 'text', label: 'Short Text', icon: <Type className="w-4 h-4" />, desc: 'Simple text input' },
  { type: 'email', label: 'Email Address', icon: <Mail className="w-4 h-4" />, desc: 'Validates email formats' },
  { type: 'number', label: 'Number', icon: <Hash className="w-4 h-4" />, desc: 'Numeric integers or decimals' },
  { type: 'textarea', label: 'Long Text', icon: <AlignLeft className="w-4 h-4" />, desc: 'Multi-line paragraph text' },
  { type: 'select', label: 'Dropdown', icon: <List className="w-4 h-4" />, desc: 'Select from a list' },
  { type: 'checkbox', label: 'Multiple Choice', icon: <CheckSquare className="w-4 h-4" />, desc: 'Select multiple options' },
  { type: 'radio', label: 'Single Choice', icon: <CheckSquare className="w-4 h-4" />, desc: 'Select exactly one option' },
  { type: 'file', label: 'File Upload', icon: <FileUp className="w-4 h-4" />, desc: 'Allow users to upload files' },
]

export function Sidebar() {
  const { sidebarTab, setSidebarTab, addField } = useBuilder()

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 h-[calc(100vh-56px)] sticky top-14 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0">
      <div className="flex p-3 gap-1 border-b border-gray-100">
        <button
          onClick={() => setSidebarTab('add')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all relative",
            sidebarTab === 'add' ? "text-indigo-700" : "text-gray-500 hover:bg-gray-100"
          )}
        >
          {sidebarTab === 'add' && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-indigo-50 rounded-lg -z-10" />}
          <Plus className="w-4 h-4" />
          Add Fields
        </button>
        <button
          onClick={() => setSidebarTab('design')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all relative",
            sidebarTab === 'design' ? "text-pink-700" : "text-gray-500 hover:bg-gray-100"
          )}
        >
          {sidebarTab === 'design' && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-pink-50 rounded-lg -z-10" />}
          <Palette className="w-4 h-4" />
          Theme
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {sidebarTab === 'add' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Basic Fields</h3>
              <div className="grid grid-cols-1 gap-2">
                {FIELD_TOOLS.slice(0, 4).map((tool) => (
                  <button
                    key={tool.type}
                    onClick={() => addField(tool.type)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md transition-all text-left group"
                  >
                    <div className="bg-gray-50 p-2 rounded-lg text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {tool.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{tool.label}</div>
                      <div className="text-xs text-gray-400">{tool.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Choices & Media</h3>
              <div className="grid grid-cols-1 gap-2">
                {FIELD_TOOLS.slice(4).map((tool) => (
                  <button
                    key={tool.type}
                    onClick={() => addField(tool.type)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md transition-all text-left group"
                  >
                    <div className="bg-gray-50 p-2 rounded-lg text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {tool.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{tool.label}</div>
                      <div className="text-xs text-gray-400">{tool.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {sidebarTab === 'design' && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="p-4 bg-pink-50 rounded-xl text-pink-800 text-sm font-medium border border-pink-100 text-center">
              Theme customizer coming soon. For now this uses the default preset to maintain visual integrity during drag-and-drop.
            </div>
          </motion.div>
        )}
      </div>
    </aside>
  )
}
