import { create } from 'zustand'
import { PersonalStaff, PersonalCategory } from '@/lib/validations/personal'

interface PersonalState {
  staff: PersonalStaff[]
  categories: PersonalCategory[]
  currentStaff: PersonalStaff | null
  isLoading: boolean
  error: string | null

  setStaff: (staff: PersonalStaff[]) => void
  setCategories: (categories: PersonalCategory[]) => void
  setCurrentStaff: (staff: PersonalStaff | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const usePersonalStore = create<PersonalState>((set) => ({
  staff: [],
  categories: [],
  currentStaff: null,
  isLoading: false,
  error: null,

  setStaff: (staff) => set({ staff }),
  setCategories: (categories) => set({ categories }),
  setCurrentStaff: (currentStaff) => set({ currentStaff }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
