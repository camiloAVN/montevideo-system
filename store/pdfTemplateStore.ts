import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PDFTemplateConfig, DEFAULT_PDF_CONFIG } from '@/lib/pdf/types'

interface PDFTemplateState {
  config: PDFTemplateConfig
  setConfig: (partial: Partial<PDFTemplateConfig>) => void
  resetConfig: () => void
}

export const usePDFTemplateStore = create<PDFTemplateState>()(
  persist(
    (set) => ({
      config: DEFAULT_PDF_CONFIG,
      setConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),
      resetConfig: () => set({ config: DEFAULT_PDF_CONFIG }),
    }),
    { name: 'mcc-pdf-template' }
  )
)
