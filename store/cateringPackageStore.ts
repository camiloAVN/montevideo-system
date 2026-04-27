import { create } from 'zustand'
import { CateringPackage } from '@/lib/validations/catering-package'

interface CateringPackageStore {
  packages: CateringPackage[]
  currentPackage: CateringPackage | null
  isLoading: boolean
  error: string | null
  searchQuery: string
  setPackages: (packages: CateringPackage[]) => void
  setCurrentPackage: (pkg: CateringPackage | null) => void
  addPackage: (pkg: CateringPackage) => void
  updatePackage: (id: string, pkg: CateringPackage) => void
  removePackage: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
}

export const useCateringPackageStore = create<CateringPackageStore>((set) => ({
  packages: [],
  currentPackage: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  setPackages: (packages) => set({ packages }),
  setCurrentPackage: (pkg) => set({ currentPackage: pkg }),
  addPackage: (pkg) => set((state) => ({ packages: [...state.packages, pkg] })),
  updatePackage: (id, updatedPkg) =>
    set((state) => ({
      packages: state.packages.map((p) => (p.id === id ? updatedPkg : p)),
    })),
  removePackage: (id) => set((state) => ({ packages: state.packages.filter((p) => p.id !== id) })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
