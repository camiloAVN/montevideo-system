import { create } from 'zustand'
import { CateringStaffFreelance } from '@/lib/validations/catering-staff-freelance'

interface CateringStaffFreelanceStore {
  staff: CateringStaffFreelance[]
  currentStaff: CateringStaffFreelance | null
  isLoading: boolean
  error: string | null
  setStaff: (staff: CateringStaffFreelance[]) => void
  setCurrentStaff: (staff: CateringStaffFreelance | null) => void
  addStaff: (staff: CateringStaffFreelance) => void
  updateStaff: (id: string, staff: CateringStaffFreelance) => void
  removeStaff: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCateringStaffFreelanceStore = create<CateringStaffFreelanceStore>((set) => ({
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
