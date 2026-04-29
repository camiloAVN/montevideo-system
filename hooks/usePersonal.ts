import { useCallback } from 'react'
import { usePersonalStore } from '@/store/personalStore'
import { PersonalStaffFormData, PersonalCategoryFormData } from '@/lib/validations/personal'
import toast from 'react-hot-toast'

export function usePersonal() {
  const {
    staff,
    categories,
    currentStaff,
    isLoading,
    error,
    setStaff,
    setCategories,
    setCurrentStaff,
    setIsLoading,
    setError,
  } = usePersonalStore()

  const fetchStaff = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/personal/staff')
      if (!res.ok) throw new Error()
      setStaff(await res.json())
    } catch {
      setError('Error al cargar el personal')
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading, setStaff, setError])

  const fetchStaffMember = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/personal/staff/${id}`)
      if (!res.ok) throw new Error()
      setCurrentStaff(await res.json())
    } catch {
      setError('Error al cargar el personal')
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading, setCurrentStaff, setError])

  const createStaff = useCallback(async (data: PersonalStaffFormData) => {
    try {
      const res = await fetch('/api/personal/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      toast.success('Personal creado correctamente')
      return created
    } catch {
      toast.error('Error al crear el personal')
      return null
    }
  }, [])

  const editStaff = useCallback(async (id: string, data: PersonalStaffFormData) => {
    try {
      const res = await fetch(`/api/personal/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      toast.success('Personal actualizado correctamente')
      return updated
    } catch {
      toast.error('Error al actualizar el personal')
      return null
    }
  }, [])

  const deleteStaff = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/personal/staff/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setStaff(usePersonalStore.getState().staff.filter(s => s.id !== id))
      toast.success('Personal eliminado correctamente')
      return true
    } catch {
      toast.error('Error al eliminar el personal')
      return false
    }
  }, [setStaff])

  // ── Categories ──
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/personal/categories')
      if (!res.ok) throw new Error()
      setCategories(await res.json())
    } catch {
      setError('Error al cargar las categorías')
    }
  }, [setCategories, setError])

  const createCategory = useCallback(async (data: PersonalCategoryFormData) => {
    try {
      const res = await fetch('/api/personal/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      setCategories([...usePersonalStore.getState().categories, created])
      toast.success('Categoría creada correctamente')
      return created
    } catch {
      toast.error('Error al crear la categoría')
      return null
    }
  }, [setCategories])

  const editCategory = useCallback(async (id: string, data: PersonalCategoryFormData) => {
    try {
      const res = await fetch(`/api/personal/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setCategories(usePersonalStore.getState().categories.map(c => c.id === id ? updated : c))
      toast.success('Categoría actualizada correctamente')
      return updated
    } catch {
      toast.error('Error al actualizar la categoría')
      return null
    }
  }, [setCategories])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/personal/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Error al eliminar')
      }
      setCategories(usePersonalStore.getState().categories.filter(c => c.id !== id))
      toast.success('Categoría eliminada correctamente')
      return true
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar la categoría')
      return false
    }
  }, [setCategories])

  return {
    staff,
    categories,
    currentStaff,
    isLoading,
    error,
    fetchStaff,
    fetchStaffMember,
    createStaff,
    editStaff,
    deleteStaff,
    fetchCategories,
    createCategory,
    editCategory,
    deleteCategory,
  }
}
