'use client'

import { useState, useEffect } from 'react'
import {
  Moon,
  Sun,
  Palette,
  FileText,
  RotateCcw,
  ImageIcon,
  Type,
  Building2,
  Check,
  Save,
} from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { usePDFTemplateStore } from '@/store/pdfTemplateStore'
import { DEFAULT_PDF_CONFIG, PDFTemplateConfig } from '@/lib/pdf/types'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-200 text-sm focus:outline-none focus:border-pink-600 transition-colors'

const AVAILABLE_LOGOS = [
  { url: '/images/logos/logo_motevideo.png', label: 'Logo Original' },
  { url: '/images/logos/Logo_Montevideo_CC_2026_Blanco.png', label: 'Blanco' },
  { url: '/images/logos/Logo_Montevideo_CC_2026_Color_&_Blanco.png', label: 'Color y Blanco' },
  { url: '/images/logos/Logo_Montevideo_CC_2026_Color_&_Negro.png', label: 'Color y Negro' },
  { url: '/images/logos/Logo_Montevideo_CC_2026_Negro.png', label: 'Negro' },
]

export default function ConfiguracionPage() {
  const { theme, setTheme } = useThemeStore()
  const { config, setConfig, resetConfig } = usePDFTemplateStore()

  const [draft, setDraft] = useState<PDFTemplateConfig>(config)

  // Sync draft when store loads from localStorage on first render
  useEffect(() => {
    setDraft(config)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isDirty = JSON.stringify(draft) !== JSON.stringify(config)

  const updateDraft = (partial: Partial<PDFTemplateConfig>) =>
    setDraft((prev) => ({ ...prev, ...partial }))

  const handleSave = () => {
    setConfig(draft)
    toast.success('Configuración guardada')
  }

  const handleReset = () => {
    resetConfig()
    setDraft(DEFAULT_PDF_CONFIG)
    toast.success('Configuración restablecida')
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 mb-1">Configuración</h1>
          <p className="text-gray-400 text-sm">Personaliza la experiencia del sistema.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shrink-0',
            isDirty
              ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/20'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
          )}
        >
          <Save className="w-4 h-4" />
          {isDirty ? 'Guardar cambios' : 'Sin cambios'}
        </button>
      </div>

      {/* ── Apariencia ─────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-pink-400" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Apariencia</h2>
        </div>

        <div className="glass rounded-xl p-6">
          <p className="text-sm font-medium text-gray-200 mb-1">Tema del sistema</p>
          <p className="text-sm text-gray-400 mb-6">
            Elige entre el modo oscuro y el modo claro. La preferencia se guarda automáticamente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark */}
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                'relative flex flex-col items-start gap-4 rounded-xl p-5 border-2 transition-all duration-200 text-left',
                theme === 'dark'
                  ? 'border-pink-600 bg-pink-600/5'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'
              )}
            >
              <div className="w-full h-20 rounded-lg overflow-hidden border border-white/10 bg-[#0F0F0F] flex">
                <div className="w-8 h-full bg-[#0F0F0F] border-r border-white/10 flex flex-col gap-1 p-1 pt-2">
                  <div className="w-full h-1.5 rounded-sm bg-white/10" />
                  <div className="w-full h-1.5 rounded-sm bg-pink-600/40" />
                  <div className="w-full h-1.5 rounded-sm bg-white/10" />
                  <div className="w-full h-1.5 rounded-sm bg-white/10" />
                </div>
                <div className="flex-1 p-2 flex flex-col gap-1.5">
                  <div className="flex gap-1">
                    <div className="flex-1 h-4 rounded bg-white/5 border border-white/10" />
                    <div className="flex-1 h-4 rounded bg-white/5 border border-white/10" />
                  </div>
                  <div className="h-8 rounded bg-white/5 border border-white/10" />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="font-semibold text-gray-100 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-pink-400" />
                    Modo Oscuro
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Fondo negro, ideal para ambientes con poca luz</p>
                </div>
                {theme === 'dark' && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-pink-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}
              </div>
            </button>

            {/* Light */}
            <button
              onClick={() => setTheme('light')}
              className={cn(
                'relative flex flex-col items-start gap-4 rounded-xl p-5 border-2 transition-all duration-200 text-left',
                theme === 'light'
                  ? 'border-pink-600 bg-pink-600/5'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'
              )}
            >
              <div className="w-full h-20 rounded-lg overflow-hidden border border-black/10 bg-[#F2F2F4] flex">
                <div className="w-8 h-full bg-white border-r border-black/10 flex flex-col gap-1 p-1 pt-2">
                  <div className="w-full h-1.5 rounded-sm bg-black/10" />
                  <div className="w-full h-1.5 rounded-sm bg-pink-500/40" />
                  <div className="w-full h-1.5 rounded-sm bg-black/10" />
                  <div className="w-full h-1.5 rounded-sm bg-black/10" />
                </div>
                <div className="flex-1 p-2 flex flex-col gap-1.5">
                  <div className="flex gap-1">
                    <div className="flex-1 h-4 rounded bg-white border border-black/10" />
                    <div className="flex-1 h-4 rounded bg-white border border-black/10" />
                  </div>
                  <div className="h-8 rounded bg-white border border-black/10" />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="font-semibold text-gray-100 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-pink-400" />
                    Modo Claro
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Fondo blanco, ideal para ambientes iluminados</p>
                </div>
                {theme === 'light' && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-pink-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── Plantillas PDF ─────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-pink-400" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Plantillas PDF</h2>
        </div>

        {/* Template Picker */}
        <div className="glass rounded-xl p-6 mb-4">
          <p className="text-sm font-medium text-gray-200 mb-1">Diseño de cotización</p>
          <p className="text-sm text-gray-400 mb-5">Elige la plantilla para los PDFs generados.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Classic */}
            <button
              onClick={() => updateDraft({ template: 'classic' })}
              className={cn(
                'flex flex-col items-start gap-3 rounded-xl p-4 border-2 transition-all duration-200 text-left',
                draft.template === 'classic'
                  ? 'border-pink-600 bg-pink-600/5'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'
              )}
            >
              <div className="w-full h-28 rounded-lg overflow-hidden bg-white border border-black/10 flex flex-col">
                <div className="flex justify-between items-start px-2.5 pt-2.5 pb-2 border-b-2 border-pink-500">
                  <div className="flex flex-col gap-1">
                    <div className="w-10 h-2 rounded-sm bg-pink-500/70" />
                    <div className="w-16 h-1 rounded-sm bg-gray-200" />
                    <div className="w-12 h-1 rounded-sm bg-gray-200" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="w-14 h-2 rounded-sm bg-gray-300" />
                    <div className="w-10 h-1 rounded-sm bg-gray-200" />
                    <div className="w-10 h-1 rounded-sm bg-gray-200" />
                  </div>
                </div>
                <div className="flex-1 px-2 pt-1.5 flex flex-col gap-0.5">
                  <div className="w-full h-2.5 rounded-sm bg-gray-100 border-b border-pink-400/40" />
                  <div className="w-full h-2 bg-white border-b border-gray-100" />
                  <div className="w-full h-2 bg-white border-b border-gray-100" />
                  <div className="flex justify-end pt-1">
                    <div className="w-16 h-2.5 rounded-sm bg-pink-500" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="font-semibold text-gray-100 text-sm">Clásico</p>
                  <p className="text-xs text-gray-500 mt-0.5">Diseño limpio con encabezado empresarial</p>
                </div>
                {draft.template === 'classic' && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-pink-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}
              </div>
            </button>

            {/* Modern */}
            <button
              onClick={() => updateDraft({ template: 'modern' })}
              className={cn(
                'flex flex-col items-start gap-3 rounded-xl p-4 border-2 transition-all duration-200 text-left',
                draft.template === 'modern'
                  ? 'border-pink-600 bg-pink-600/5'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'
              )}
            >
              <div className="w-full h-28 rounded-lg overflow-hidden bg-white border border-black/10 flex flex-col">
                <div className="h-8 w-full bg-pink-600 flex items-center justify-between px-2.5">
                  <div className="flex flex-col gap-0.5">
                    <div className="w-10 h-1.5 rounded-sm bg-white/60" />
                    <div className="w-6 h-1 rounded-sm bg-white/40" />
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="w-5 h-1 rounded-sm bg-white/50" />
                    <div className="w-10 h-2 rounded-sm bg-white/80" />
                  </div>
                </div>
                <div className="flex-1 px-2 pt-1.5 flex flex-col gap-0.5">
                  <div className="flex gap-3 mb-1 pb-1 border-b border-gray-100">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-6 h-0.5 rounded bg-gray-200" />
                      <div className="w-10 h-1 rounded-sm bg-gray-300" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="w-6 h-0.5 rounded bg-gray-200" />
                      <div className="w-10 h-1 rounded-sm bg-gray-300" />
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-sm bg-gray-800" />
                  <div className="w-full h-1.5 bg-white border-b border-gray-100" />
                  <div className="w-full h-1.5 bg-gray-50 border-b border-gray-100" />
                  <div className="flex justify-end pt-0.5">
                    <div className="w-16 h-2 rounded-sm bg-pink-600" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="font-semibold text-gray-100 text-sm">Moderno</p>
                  <p className="text-xs text-gray-500 mt-0.5">Encabezado sólido con color de marca</p>
                </div>
                {draft.template === 'modern' && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-pink-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Logo */}
        <div className="glass rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-200">Logo del PDF</p>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Selecciona el logo que aparecerá en el encabezado de las cotizaciones.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AVAILABLE_LOGOS.map((logo) => {
              const isSelected = draft.logoUrl === logo.url
              return (
                <button
                  key={logo.url}
                  onClick={() => updateDraft({ logoUrl: logo.url })}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl p-3 border-2 transition-all duration-200',
                    isSelected
                      ? 'border-pink-600 bg-pink-600/5'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'
                  )}
                >
                  <div className="w-full h-14 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.url}
                      alt={logo.label}
                      className="max-h-10 max-w-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-gray-400 truncate">{logo.label}</span>
                    {isSelected && (
                      <span className="shrink-0 w-4 h-4 rounded-full bg-pink-600 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Colors */}
        <div className="glass rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-200">Colores</p>
          </div>
          <p className="text-sm text-gray-400 mb-4">Colores utilizados en el PDF.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Color principal</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draft.primaryColor}
                  onChange={(e) => updateDraft({ primaryColor: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={draft.primaryColor}
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) updateDraft({ primaryColor: val })
                  }}
                  maxLength={7}
                  className={cn(INPUT_CLASS, 'font-mono uppercase')}
                  placeholder="#E91E63"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">Color de acento</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draft.accentColor}
                  onChange={(e) => updateDraft({ accentColor: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={draft.accentColor}
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) updateDraft({ accentColor: val })
                  }}
                  maxLength={7}
                  className={cn(INPUT_CLASS, 'font-mono uppercase')}
                  placeholder="#FF4FA3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="glass rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Type className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-200">Tipografía</p>
          </div>
          <p className="text-sm text-gray-400 mb-4">Fuente y tamaño del texto en el PDF.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Fuente</label>
              <select
                value={draft.fontFamily}
                onChange={(e) =>
                  updateDraft({ fontFamily: e.target.value as PDFTemplateConfig['fontFamily'] })
                }
                className={INPUT_CLASS}
              >
                <option value="Helvetica">Helvetica (sin serifa)</option>
                <option value="Times-Roman">Times Roman (con serifa)</option>
                <option value="Courier">Courier (monoespaciada)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Tamaño base — <span className="text-gray-300 font-medium">{draft.baseFontSize}pt</span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">8</span>
                <input
                  type="range"
                  min={8}
                  max={14}
                  step={1}
                  value={draft.baseFontSize}
                  onChange={(e) => updateDraft({ baseFontSize: Number(e.target.value) })}
                  className="flex-1 accent-pink-600"
                />
                <span className="text-xs text-gray-500">14</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="glass rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-200">Información de la empresa</p>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Datos que aparecen en el encabezado y pie de las cotizaciones.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Nombre de la empresa</label>
              <input
                type="text"
                value={draft.companyName}
                onChange={(e) => updateDraft({ companyName: e.target.value })}
                className={INPUT_CLASS}
                placeholder="Montevideo Convention Center"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Eslogan / descripción</label>
              <input
                type="text"
                value={draft.companyTagline}
                onChange={(e) => updateDraft({ companyTagline: e.target.value })}
                className={INPUT_CLASS}
                placeholder="Centro de Eventos y Convenciones"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">NIT</label>
                <input
                  type="text"
                  value={draft.companyNit ?? ''}
                  onChange={(e) => updateDraft({ companyNit: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="900.123.456-7"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Teléfono</label>
                <input
                  type="text"
                  value={draft.companyPhone ?? ''}
                  onChange={(e) => updateDraft({ companyPhone: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="+57 300 000 0000"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={draft.companyEmail}
                  onChange={(e) => updateDraft({ companyEmail: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="info@empresa.com"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Sitio web</label>
                <input
                  type="text"
                  value={draft.companyWebsite}
                  onChange={(e) => updateDraft({ companyWebsite: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="www.empresa.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer valores por defecto
          </button>

          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              isDirty
                ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/20'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            )}
          >
            <Save className="w-4 h-4" />
            Guardar cambios
          </button>
        </div>
      </section>
    </div>
  )
}
