import { create } from 'zustand'
import { CateringStaffCompany } from '@/lib/validations/catering-staff-company'

interface CateringStaffCompanyStore {
  staff: CateringStaffCompany[]
  currentStaff: CateringStaffCompany | null
  isLoading: boolean
  error: string | null
  setStaff: (staff: CateringStaffCompany[]) => void
  setCurrentStaff: (staff: CateringStaffCompany | null) => void
  addStaff: (staff: CateringStaffCompany) => void
  updateStaff: (id: string, staff: CateringStaffCompany) => void
  removeStaff: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCateringStaffCompanyStore = create<CateringStaffCompanyStore>((set) => ({
  staff: [],
  currentStaff: null,
  isLoading: false,
  error: null,
  setStaff: (staff) => set({ staff }),
  setCurrentStaff: (staff) => set({ currentStaff: staff }),
  addStaff: (staff) => set((state) => ({ staff: [...state.staff, staff] })),
  updateStaff: (id, updatedStaff) =>
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? updatedStaff : s)),
    })),
  removeStaff: (id) => set((state) => ({ staff: state.staff.filter((s) => s.id !== id) })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
