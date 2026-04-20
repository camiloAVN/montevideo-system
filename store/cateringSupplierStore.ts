import { create } from 'zustand'
import { CateringSupplier } from '@/lib/validations/catering-supplier'

interface CateringSupplierStore {
  suppliers: CateringSupplier[]
  currentSupplier: CateringSupplier | null
  isLoading: boolean
  error: string | null
  searchQuery: string
  setSuppliers: (suppliers: CateringSupplier[]) => void
  setCurrentSupplier: (supplier: CateringSupplier | null) => void
  addSupplier: (supplier: CateringSupplier) => void
  updateSupplier: (id: string, supplier: CateringSupplier) => void
  removeSupplier: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
}

export const useCateringSupplierStore = create<CateringSupplierStore>((set) => ({
  suppliers: [],
  currentSupplier: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  setSuppliers: (suppliers) => set({ suppliers }),
  setCurrentSupplier: (supplier) => set({ currentSupplier: supplier }),
  addSupplier: (supplier) =>
    set((state) => ({ suppliers: [...state.suppliers, supplier] })),
  updateSupplier: (id, updatedSupplier) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) => (s.id === id ? updatedSupplier : s)),
    })),
  removeSupplier: (id) =>
    set((state) => ({
      suppliers: state.suppliers.filter((s) => s.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
