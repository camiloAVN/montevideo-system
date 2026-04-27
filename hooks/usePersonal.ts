import { useCallback } from 'react'
import { usePersonalStore } from '@/store/personalStore'
import { PersonalStaffFormData, PersonalCategoryFormData } from '@/lib/validations/personal'
import toast from 'react-hot-toast'

export function usePersonal() {
  const store = usePersonalStore()

  const fetchStaff = useCallback(async () => {
    store.setIsLoading(true)
    try {
      const res = await fetch('/api/personal/staff')
      if (!res.ok) throw new Error()
      store.setStaff(await res.json())
    } catch {
      store.setError('Error al cargar el personal')
    } finally {
      store.setIsLoading(false)
    }
  }, [store])

  const fetchStaffMember = useCallback(async (id: string) => {
    store.setIsLoading(true)
    try {
      const res = await fetch(`/api/personal/staff/${id}`)
      if (!res.ok) throw new Error()
      store.setCurrentStaff(await res.json())
    } catch {
      store.setError('Error al cargar el personal')
    } finally {
      store.setIsLoading(false)
    }
  }, [store])

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
      store.setStaff(store.staff.filter(s => s.id !== id))
      toast.success('Personal eliminado correctamente')
      return true
    } catch {
      toast.error('Error al eliminar el personal')
      return false
    }
  }, [store])

  // ── Categories ──
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/personal/categories')
      if (!res.ok) throw new Error()
      store.setCategories(await res.json())
    } catch {
      store.setError('Error al cargar las categorías')
    }
  }, [store])

  const createCategory = useCallback(async (data: PersonalCategoryFormData) => {
    try {
      const res = await fetch('/api/personal/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      store.setCategories([...store.categories, created])
      toast.success('Categoría creada correctamente')
      return created
    } catch {
      toast.error('Error al crear la categoría')
      return null
    }
  }, [store])

  const editCategory = useCallback(async (id: string, data: PersonalCategoryFormData) => {
    try {
      const res = await fetch(`/api/personal/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      store.setCategories(store.categories.map(c => c.id === id ? updated : c))
      toast.success('Categoría actualizada correctamente')
      return updated
    } catch {
      toast.error('Error al actualizar la categoría')
      return null
    }
  }, [store])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/personal/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Error al eliminar')
      }
      store.setCategories(store.categories.filter(c => c.id !== id))
      toast.success('Categoría eliminada correctamente')
      return true
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar la categoría')
      return false
    }
  }, [store])

  return {
    ...store,
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
