import { create } from 'zustand'
import { CateringMenuFromItems } from '@/lib/validations/catering-menu-items'

interface CateringMenuItemsStore {
  menus: CateringMenuFromItems[]
  currentMenu: CateringMenuFromItems | null
  isLoading: boolean
  error: string | null
  setMenus: (menus: CateringMenuFromItems[]) => void
  setCurrentMenu: (menu: CateringMenuFromItems | null) => void
  addMenu: (menu: CateringMenuFromItems) => void
  updateMenu: (id: string, menu: CateringMenuFromItems) => void
  removeMenu: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCateringMenuItemsStore = create<CateringMenuItemsStore>((set) => ({
  menus: [],
  currentMenu: null,
  isLoading: false,
  error: null,
  setMenus: (menus) => set({ menus }),
  setCurrentMenu: (menu) => set({ currentMenu: menu }),
  addMenu: (menu) => set((state) => ({ menus: [...state.menus, menu] })),
  updateMenu: (id, updatedMenu) =>
    set((state) => ({
      menus: state.menus.map((m) => (m.id === id ? updatedMenu : m)),
    })),
  removeMenu: (id) => set((state) => ({ menus: state.menus.filter((m) => m.id !== id) })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
