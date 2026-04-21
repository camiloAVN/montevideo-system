'use client'

import { useCallback } from 'react'
import { useCateringMenuCustomStore } from '@/store/cateringMenuCustomStore'
import { CateringMenuCustomFormData } from '@/lib/validations/catering-menu-custom'
import toast from 'react-hot-toast'

export function useCateringMenuCustom() {
  const {
    menus,
    currentMenu,
    isLoading,
    error,
    setMenus,
    setCurrentMenu,
    addMenu,
    updateMenu,
    removeMenu,
    setLoading,
    setError,
  } = useCateringMenuCustomStore()

  const fetchMenus = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/catering/menus/custom')
      if (response.status === 401 || response.status === 403) { setMenus([]); return }
      if (!response.ok) throw new Error('Error al obtener menús personalizados')
      setMenus(await response.json())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [setMenus, setLoading, setError])

  const fetchMenu = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/catering/menus/custom/${id}`)
      if (!response.ok) throw new Error('Error al obtener menú')
      const data = await response.json()
      setCurrentMenu(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [setCurrentMenu, setLoading, setError])

  const createMenu = useCallback(async (data: CateringMenuCustomFormData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/catering/menus/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear menú')
      }
      const newMenu = await response.json()
      addMenu(newMenu)
      toast.success('Menú creado exitosamente')
      return newMenu
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [addMenu, setLoading, setError])

  const editMenu = useCallback(async (id: string, data: CateringMenuCustomFormData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/catering/menus/custom/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar menú')
      }
      const updatedMenu = await response.json()
      updateMenu(id, updatedMenu)
      toast.success('Menú actualizado exitosamente')
      return updatedMenu
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [updateMenu, setLoading, setError])

  const deleteMenu = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/catering/menus/custom/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar menú')
      }
      removeMenu(id)
      toast.success('Menú eliminado exitosamente')
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [removeMenu, setLoading, setError])

  return { menus, currentMenu, isLoading, error, fetchMenus, fetchMenu, createMenu, editMenu, deleteMenu }
}
