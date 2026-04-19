'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Type, Mail, Hash, AlignLeft, List, CheckSquare, 
  FileUp, Palette, Plus, Settings, Check, 
  MousePointer2, MessageSquare, ExternalLink, RefreshCcw,
  Share2, Globe, Code, Copy, Search, Plug, Database, FileSpreadsheet
} from 'lucide-react'
import { useBuilder } from './BuilderContext'
import { FieldType, PRESET_THEMES, AVAILABLE_FONTS } from './types'
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
  const { 
    sidebarTab, setSidebarTab, addField, 
    form, customStyles, updateFormDetails, 
    updateStyles, applyThemePreset, 
    formSettings, updateFormSettings 
  } = useBuilder()

  return (
    <aside className="w-80 bg-white/80 backdrop-blur-2xl border-r border-gray-200/50 h-[calc(100vh-56px)] sticky top-14 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0 overflow-hidden">
      <div className="flex p-2 gap-1 border-b border-gray-100 bg-gray-50/50">
        <button
          onClick={() => setSidebarTab('add')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 text-[10px] font-bold rounded-lg transition-all relative",
            sidebarTab === 'add' ? "text-indigo-700" : "text-gray-500 hover:bg-white hover:shadow-sm"
          )}
        >
          {sidebarTab === 'add' && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white shadow-sm border border-gray-100 rounded-lg -z-10" />}
          <Plus className="w-4 h-4" />
          Fields
        </button>
        <button
          onClick={() => setSidebarTab('design')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 text-[10px] font-bold rounded-lg transition-all relative",
            sidebarTab === 'design' ? "text-pink-700" : "text-gray-500 hover:bg-white hover:shadow-sm"
          )}
        >
          {sidebarTab === 'design' && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white shadow-sm border border-gray-100 rounded-lg -z-10" />}
          <Palette className="w-4 h-4" />
          Design
        </button>
        <button
          onClick={() => setSidebarTab('settings')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 text-[10px] font-bold rounded-lg transition-all relative",
            sidebarTab === 'settings' ? "text-amber-700" : "text-gray-500 hover:bg-white hover:shadow-sm"
          )}
        >
          {sidebarTab === 'settings' && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white shadow-sm border border-gray-100 rounded-lg -z-10" />}
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button
          onClick={() => setSidebarTab('share')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 text-[10px] font-bold rounded-lg transition-all relative",
            sidebarTab === 'share' ? "text-emerald-700" : "text-gray-500 hover:bg-white hover:shadow-sm"
          )}
        >
          {sidebarTab === 'share' && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white shadow-sm border border-gray-100 rounded-lg -z-10" />}
          <Share2 className="w-4 h-4" />
          Share
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
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-10">
            
            {/* Theme Presets */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Premium Presets</h3>
                <RefreshCcw 
                  className="w-3 h-3 text-gray-300 hover:text-indigo-500 cursor-pointer transition-colors" 
                  onClick={() => applyThemePreset('minimal-light')}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(PRESET_THEMES).map((presetId) => (
                  <button
                    key={presetId}
                    onClick={() => applyThemePreset(presetId)}
                    className={cn(
                      "group relative aspect-[4/3] rounded-xl border-2 overflow-hidden transition-all text-left",
                      "hover:shadow-lg hover:shadow-indigo-500/10",
                      // Highlight if it mostly matches active (simple check)
                      customStyles.fontFamily === PRESET_THEMES[presetId].fontFamily ? "border-indigo-500 ring-4 ring-indigo-50" : "border-gray-100 hover:border-indigo-200"
                    )}
                  >
                    <div className="absolute inset-0 p-3 flex flex-col justify-between" style={{ background: PRESET_THEMES[presetId].pageBgColor }}>
                      <div className="space-y-1">
                        <div className="w-full h-1 rounded-full opacity-20" style={{ background: PRESET_THEMES[presetId].accentColor }}></div>
                        <div className="w-2/3 h-1 rounded-full opacity-10" style={{ background: PRESET_THEMES[presetId].accentColor }}></div>
                      </div>
                      <span className="text-[10px] font-bold capitalize truncate" style={{ color: PRESET_THEMES[presetId].bodyText || '#000' }}>
                        {presetId.split('-').join(' ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Typography</h3>
              <div className="space-y-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                 <label className="block text-xs font-bold text-gray-700 mb-1">Select Font</label>
                 <div className="grid grid-cols-1 gap-1">
                   {AVAILABLE_FONTS.map(font => (
                     <button
                        key={font}
                        onClick={() => updateStyles({ fontFamily: font })}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm border transition-all",
                          customStyles.fontFamily === font 
                            ? "bg-white border-indigo-200 text-indigo-700 shadow-sm shadow-indigo-500/10 font-bold" 
                            : "bg-transparent border-transparent text-gray-600 hover:bg-white hover:border-gray-200"
                        )}
                        style={{ fontFamily: font }}
                     >
                       {font}
                     </button>
                   ))}
                 </div>
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Brand Colors</h3>
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Accent</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={customStyles.accentColor} 
                      onChange={(e) => updateStyles({ accentColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                    />
                    <span className="text-[10px] font-mono uppercase text-gray-400">{customStyles.accentColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Header BG</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={customStyles.headerBg} 
                      onChange={(e) => updateStyles({ headerBg: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                    />
                    <span className="text-[10px] font-mono uppercase text-gray-400">{customStyles.headerBg}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Header Text</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={customStyles.headerText} 
                      onChange={(e) => updateStyles({ headerText: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                    />
                    <span className="text-[10px] font-mono uppercase text-gray-400">{customStyles.headerText}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Surface</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={customStyles.bodyBg} 
                      onChange={(e) => updateStyles({ bodyBg: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                    />
                    <span className="text-[10px] font-mono uppercase text-gray-400">{customStyles.bodyBg}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Structure */}
            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Layout & Structure</h3>
              <div className="grid grid-cols-1 gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Form Layout</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'centered', label: 'Classic' },
                      { id: 'split', label: 'Split' },
                      { id: 'sidebar', label: 'Sidebar' }
                    ].map(layout => (
                      <button
                        key={layout.id}
                        onClick={() => updateStyles({ layout: layout.id as any })}
                        className={cn(
                          "px-2 py-2 text-[10px] font-bold rounded-lg border transition-all text-center",
                          customStyles.layout === layout.id 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" 
                            : "bg-white border-gray-200 text-gray-500 hover:border-indigo-300"
                        )}
                      >
                        {layout.label}
                      </button>
                    ))}
                  </div>
                </div>

                {['split', 'sidebar'].includes(customStyles.layout) && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Branding Side</label>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                      <button
                        onClick={() => updateStyles({ layoutSide: 'left' })}
                        className={cn(
                          "flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all",
                          customStyles.layoutSide === 'left' ? "bg-gray-100 text-indigo-600" : "text-gray-400"
                        )}
                      >
                        Left
                      </button>
                      <button
                        onClick={() => updateStyles({ layoutSide: 'right' })}
                        className={cn(
                          "flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all",
                          customStyles.layoutSide === 'right' ? "bg-gray-100 text-indigo-600" : "text-gray-400"
                        )}
                      >
                        Right
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Brand Assets</h3>
              <div className="space-y-4">
                
                {/* Logo Section */}
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Main Logo URL</label>
                    <input
                      type="url"
                      value={form?.logo_url || ''}
                      onChange={(e) => updateFormDetails({ logo_url: e.target.value })}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                  {form?.logo_url && (
                    <>
                      <div>
                        <label className="flex flex-col text-xs font-bold text-gray-700 mb-1">
                          <div className="flex justify-between mb-1">
                            <span>Image Height</span>
                            <span className="text-indigo-600">{customStyles.logoHeight || 48}px</span>
                          </div>
                          <input
                            type="range" min="16" max="256" step="4"
                            value={customStyles.logoHeight || 48}
                            onChange={(e) => updateStyles({ logoHeight: parseInt(e.target.value) })}
                            className="w-full accent-indigo-500"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="flex flex-col text-xs font-bold text-gray-700 mb-1">
                          <div className="flex justify-between mb-1">
                            <span>Border Radius</span>
                            <span className="text-indigo-600">{customStyles.logoBorderRadius || 0}px</span>
                          </div>
                          <input
                            type="range" min="0" max="128" step="4"
                            value={customStyles.logoBorderRadius !== undefined ? customStyles.logoBorderRadius : 8}
                            onChange={(e) => updateStyles({ logoBorderRadius: parseInt(e.target.value) })}
                            className="w-full accent-indigo-500"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Alignment</label>
                        <select
                          value={customStyles.logoAlignment || 'left'}
                          onChange={(e) => updateStyles({ logoAlignment: e.target.value as any })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        >
                          <option value="left">Left Aligned</option>
                          <option value="center">Centered</option>
                          <option value="right">Right Aligned</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {/* Secondary Image Section */}
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Secondary Asset URL</label>
                    <input
                      type="url"
                      value={customStyles.secondaryImageUrl || ''}
                      onChange={(e) => updateStyles({ secondaryImageUrl: e.target.value })}
                      placeholder="Trust badge or powered-by logo..."
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                  {customStyles.secondaryImageUrl && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Click Link (Optional)</label>
                      <input
                        type="url"
                        value={customStyles.secondaryImageLink || ''}
                        onChange={(e) => updateStyles({ secondaryImageLink: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                  )}
                </div>

                {/* Header Text Alignment */}
                <div className="px-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1 mt-2">Title & Description Alignment</label>
                  <select
                    value={customStyles.headerAlignment || 'left'}
                    onChange={(e) => updateStyles({ headerAlignment: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                {/* Cover Image Section */}
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      value={form?.cover_image_url || ''}
                      onChange={(e) => updateFormDetails({ cover_image_url: e.target.value })}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                  {form?.cover_image_url && (
                    <>
                      <div>
                        <label className="flex flex-col text-xs font-bold text-gray-700 mb-1">
                          <div className="flex justify-between mb-1">
                            <span>Cover Height</span>
                            <span className="text-indigo-600">{customStyles.coverHeight || 240}px</span>
                          </div>
                          <input
                            type="range" min="64" max="600" step="8"
                            value={customStyles.coverHeight || 240}
                            onChange={(e) => updateStyles({ coverHeight: parseInt(e.target.value) })}
                            className="w-full accent-indigo-500"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Image Fit</label>
                        <select
                          value={customStyles.coverImageFit || 'cover'}
                          onChange={(e) => updateStyles({ coverImageFit: e.target.value as any })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        >
                          <option value="cover">Fill & Crop Area (Cover)</option>
                          <option value="contain">Show Entire Image (Contain)</option>
                          <option value="fill">Stretch to Fill</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Page Background</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 px-1">Background Image URL</label>
                  <input
                    type="url"
                    value={customStyles.pageBgImage || ''}
                    onChange={(e) => updateStyles({ pageBgImage: e.target.value })}
                    placeholder="https://example.com/bg.jpg"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                {customStyles.pageBgImage && (
                  <>
                    <div>
                      <label className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2 px-1">
                        <span>Background Blur</span>
                        <span className="text-pink-600">{customStyles.pageBgBlur}px</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        step="1"
                        value={customStyles.pageBgBlur || 0}
                        onChange={(e) => updateStyles({ pageBgBlur: parseInt(e.target.value) })}
                        className="w-full accent-pink-500"
                      />
                    </div>
                    <div>
                      <label className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2 px-1">
                        <span>Background Dimming</span>
                        <span className="text-pink-600">{customStyles.pageBgOverlayOpacity || 10}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={customStyles.pageBgOverlayOpacity || 10}
                        onChange={(e) => updateStyles({ pageBgOverlayOpacity: parseInt(e.target.value) })}
                        className="w-full accent-pink-500"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Advanced Sizing</h3>
              <div className="space-y-4 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <label className="flex flex-col text-xs font-bold text-gray-700 mb-1">
                    <div className="flex justify-between mb-1">
                      <span>Form Width</span>
                      <span className="text-indigo-600">{customStyles.containerWidth}px</span>
                    </div>
                    <input
                      type="range" min="320" max="1200" step="10"
                      value={customStyles.containerWidth}
                      onChange={(e) => updateStyles({ containerWidth: parseInt(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </label>
                </div>
                <div>
                  <label className="flex flex-col text-xs font-bold text-gray-700 mb-1">
                    <div className="flex justify-between mb-1">
                      <span>Border Radius</span>
                      <span className="text-indigo-600">{customStyles.borderRadius}px</span>
                    </div>
                    <input
                      type="range" min="0" max="64" step="1"
                      value={customStyles.borderRadius}
                      onChange={(e) => updateStyles({ borderRadius: parseInt(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </label>
                </div>
                <div>
                  <label className="flex flex-col text-xs font-bold text-gray-700 mb-1">
                    <div className="flex justify-between mb-1">
                      <span>Global Zoom (Scale)</span>
                      <span className="text-indigo-600">{Math.round((customStyles.formScale || 1) * 100)}%</span>
                    </div>
                    <input
                      type="range" min="0.5" max="1.5" step="0.05"
                      value={customStyles.formScale || 1}
                      onChange={(e) => updateStyles({ formScale: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </label>
                  <p className="text-[9px] text-gray-400 mt-1 italic">Scales the entire form container up or down instantly.</p>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {sidebarTab === 'settings' && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pb-10">
            
            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Submission Button</h3>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                  <MousePointer2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Button Text</span>
                </div>
                <input
                  type="text"
                  value={formSettings.submitButtonText}
                  onChange={(e) => updateFormSettings({ submitButtonText: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  placeholder="Submit Form"
                />
                <p className="text-[10px] text-gray-400 mt-1 px-1 italic">
                  Example: "Register Now", "Send Message", "Join Waitlist"
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Completion Experience</h3>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Thank You Screen</span>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Headline</label>
                  <input
                    type="text"
                    value={formSettings.thankYouHeadline}
                    onChange={(e) => updateFormSettings({ thankYouHeadline: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    placeholder="Thank You!"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Sub-message</label>
                  <textarea
                    rows={3}
                    value={formSettings.thankYouMessage}
                    onChange={(e) => updateFormSettings({ thankYouMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                    placeholder="Your response has been successfully submitted."
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Post-Submission</h3>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Redirect URL</span>
                </div>
                <input
                  type="url"
                  value={formSettings.redirectUrl}
                  onChange={(e) => updateFormSettings({ redirectUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  placeholder="https://yourwebsite.com/welcome"
                />
                <p className="text-[10px] text-gray-400 mt-1 px-1">
                  If set, users will be taken to this URL immediately after submission instead of seeing the Thank You screen.
                </p>
              </div>
            </div>

            {/* INTEGRATIONS */}
            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Integrations</h3>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <Database className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Connected Apps</span>
                </div>
                
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search apps (e.g., Google Sheets)"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                  />
                </div>

                <div className="pt-2">
                  <div className={cn(
                    "border rounded-xl bg-white overflow-hidden transition-all duration-300",
                    formSettings.integrations?.googleSheets?.connected ? "border-green-500 shadow-[0_0_0_1px_rgba(34,197,94,0.3)] shadow-green-100" : "border-gray-200 hover:border-green-300"
                  )}>
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-[#0F9D58]/10 text-[#0F9D58]">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">Google Sheets</div>
                          <div className="text-[10px] text-gray-500">
                            {formSettings.integrations?.googleSheets?.connected ? 'Connected to spreadsheet' : 'Export responses automatically'}
                          </div>
                        </div>
                      </div>
                      
                      {!formSettings.integrations?.googleSheets?.connected ? (
                        <button
                          onClick={() => {
                            // Simulate OAuth connect
                            const simulatedConnect = {
                              googleSheets: {
                                connected: true,
                                spreadsheetId: 'simulated_sheet_id_123',
                                spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/simulated',
                                sheetName: 'Sheet1'
                              }
                            }
                            updateFormSettings({ 
                              integrations: { ...formSettings.integrations, ...simulatedConnect } 
                            })
                            alert("Simulated: Successfully authenticated with Google!");
                          }}
                          className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-[10px] font-bold rounded-lg hover:border-green-500 hover:text-green-600 transition-colors shadow-sm whitespace-nowrap"
                        >
                          Connect
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            updateFormSettings({ 
                              integrations: { ...formSettings.integrations, googleSheets: undefined } 
                            })
                          }}
                          className="px-2 py-1 text-red-500 text-[10px] font-bold hover:bg-red-50 rounded transition-colors"
                        >
                          Disconnect
                        </button>
                      )}
                    </div>
                    
                    {/* Active Configuration */}
                    {formSettings.integrations?.googleSheets?.connected && (
                      <div className="bg-green-50/50 p-3 border-t border-green-100 space-y-3">
                        <div className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-green-600" />
                          <span className="text-[10px] font-medium text-green-800">Account verified</span>
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 mb-1">Spreadsheet Actions</label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                alert("Sync simulated! All new submissions will now instantly save to this Google Sheet.");
                              }}
                              className="flex-1 py-1.5 px-2 bg-green-600 text-white text-[10px] font-bold rounded-md hover:bg-green-700 transition-colors text-center"
                            >
                              Sync Results Now
                            </button>
                            <button
                              onClick={() => {
                                if (formSettings.integrations?.googleSheets?.spreadsheetUrl) {
                                  window.open(formSettings.integrations.googleSheets.spreadsheetUrl, '_blank')
                                }
                              }}
                              className="flex-1 py-1.5 px-2 bg-white border border-gray-200 text-gray-700 text-[10px] font-bold rounded-md hover:border-gray-300 transition-colors text-center"
                            >
                              Open Sheet
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}
        
        {sidebarTab === 'share' && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pb-10">
            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Publish & Share</h3>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Public Link</span>
                </div>
                
                <div className="relative group">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/f/${form?.id}`}
                    className="w-full pr-10 pl-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-500 outline-none"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/f/${form?.id}`)
                      alert('Link copied to clipboard!')
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                  Anyone with this link can view and fill out your beautiful form.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">Embed on your site</h3>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <Code className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Iframe Embed</span>
                </div>
                
                <div className="relative">
                  <textarea
                    readOnly
                    rows={4}
                    value={`<iframe \n  src="${typeof window !== 'undefined' ? window.location.origin : ''}/f/${form?.id}" \n  width="100%" \n  height="600px" \n  frameborder="0" \n  style="border:none; border-radius:12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">\n</iframe>`}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-[10px] font-mono text-gray-500 outline-none resize-none leading-relaxed"
                  />
                  <button 
                    onClick={() => {
                      const code = `<iframe src="${window.location.origin}/f/${form?.id}" width="100%" height="600px" frameborder="0" style="border:none; border-radius:12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"></iframe>`;
                      navigator.clipboard.writeText(code)
                      alert('Embed code copied!')
                    }}
                    className="absolute right-3 bottom-3 p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all shadow-sm"
                    title="Copy Code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200/50">
                  <div className="flex items-center gap-2 text-pink-600 mb-2">
                    <Code className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Script Embed</span>
                  </div>
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={4}
                      value={`<div id="form-container"></div>\n<script>\n  (function() {\n    const div = document.getElementById('form-container');\n    const ifr = document.createElement('iframe');\n    ifr.src = "${typeof window !== 'undefined' ? window.location.origin : ''}/f/${form?.id}";\n    ifr.style.width = '100%';\n    ifr.style.height = '600px';\n    ifr.style.border = 'none';\n    div.appendChild(ifr);\n  })();\n</script>`}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl text-[10px] font-mono text-gray-500 outline-none resize-none leading-relaxed"
                    />
                    <button 
                      onClick={() => {
                        const code = `<div id="form-container"></div><script>(function(){const div=document.getElementById('form-container');const ifr=document.createElement('iframe');ifr.src="${window.location.origin}/f/${form?.id}";ifr.style.width='100%';ifr.style.height='600px';ifr.style.border='none';div.appendChild(ifr);})();</script>`;
                        navigator.clipboard.writeText(code)
                        alert('Script code copied!')
                      }}
                      className="absolute right-3 bottom-3 p-2 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white rounded-lg transition-all shadow-sm"
                      title="Copy Code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </aside>
  )
}
