import { create } from 'zustand'
import { CateringMenuCustom } from '@/lib/validations/catering-menu-custom'

interface CateringMenuCustomStore {
  menus: CateringMenuCustom[]
  currentMenu: CateringMenuCustom | null
  isLoading: boolean
  error: string | null
  setMenus: (menus: CateringMenuCustom[]) => void
  setCurrentMenu: (menu: CateringMenuCustom | null) => void
  addMenu: (menu: CateringMenuCustom) => void
  updateMenu: (id: string, menu: CateringMenuCustom) => void
  removeMenu: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCateringMenuCustomStore = create<CateringMenuCustomStore>((set) => ({
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
