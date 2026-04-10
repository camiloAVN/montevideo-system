'use client'

import { Moon, Sun, Layout, X } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib/utils/cn'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { theme, setTheme } = useThemeStore()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop invisible para cerrar al click fuera */}
      <div className="fixed inset-0 z-[60]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed bottom-36 left-3 z-[70] w-60 rounded-xl shadow-2xl overflow-hidden"
        style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header del panel */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-sm font-semibold" style={{ color: '#E5E5E5' }}>Configuración</span>
          <button
            onClick={onClose}
            className="transition-colors rounded-md p-0.5"
            style={{ color: '#71717A' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E5E5E5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#71717A')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-2">
          {/* Sección Apariencia */}
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 py-2" style={{ color: '#52525B' }}>
            Apariencia
          </p>

          <button
            onClick={() => setTheme('dark')}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              theme === 'dark'
                ? 'bg-pink-600/15 border border-pink-600/25'
                : 'hover:bg-white/5'
            )}
            style={{
              color: theme === 'dark' ? '#F472B6' : '#A1A1AA',
            }}
          >
            <Moon className="w-4 h-4 shrink-0" />
            Modo Oscuro
            {theme === 'dark' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500" />
            )}
          </button>

          <button
            onClick={() => setTheme('light')}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              theme === 'light'
                ? 'bg-pink-600/15 border border-pink-600/25'
                : 'hover:bg-white/5'
            )}
            style={{
              color: theme === 'light' ? '#F472B6' : '#A1A1AA',
            }}
          >
            <Sun className="w-4 h-4 shrink-0" />
            Modo Claro
            {theme === 'light' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500" />
            )}
          </button>

          {/* Divider */}
          <div className="my-2 mx-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

          {/* Sección Herramientas */}
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 py-2" style={{ color: '#52525B' }}>
            Herramientas
          </p>

          <button
            disabled
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed"
            style={{ color: '#3F3F46' }}
          >
            <Layout className="w-4 h-4 shrink-0" />
            Plantillas
            <span
              className="ml-auto text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: '#27272A', color: '#52525B' }}
            >
              Pronto
            </span>
          </button>
        </div>
      </div>
    </>
  )
}
