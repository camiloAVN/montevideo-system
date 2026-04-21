import { create } from 'zustand'
import { CateringMenaje } from '@/lib/validations/catering-menaje'

interface CateringMenajeStore {
  items: CateringMenaje[]
  currentItem: CateringMenaje | null
  isLoading: boolean
  error: string | null
  searchQuery: string
  setItems: (items: CateringMenaje[]) => void
  setCurrentItem: (item: CateringMenaje | null) => void
  addItem: (item: CateringMenaje) => void
  updateItem: (id: string, item: CateringMenaje) => void
  removeItem: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
}

export const useCateringMenajeStore = create<CateringMenajeStore>((set) => ({
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  setItems: (items) => set({ items }),
  setCurrentItem: (item) => set({ currentItem: item }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updatedItem) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? updatedItem : i)),
    })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
