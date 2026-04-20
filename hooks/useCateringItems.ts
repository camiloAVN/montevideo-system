'use client'

import { useCallback } from 'react'
import { useCateringItemStore } from '@/store/cateringItemStore'
import { CateringItemFormData } from '@/lib/validations/catering-item'
import toast from 'react-hot-toast'

export function useCateringItems() {
  const {
    items,
    currentItem,
    isLoading,
    error,
    searchQuery,
    setItems,
    setCurrentItem,
    addItem,
    updateItem,
    removeItem,
    setLoading,
    setError,
    setSearchQuery,
  } = useCateringItemStore()

  const fetchItems = useCallback(async (search?: string) => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL('/api/catering/items', window.location.origin)
      if (search) url.searchParams.set('search', search)
      const response = await fetch(url.toString())
      if (response.status === 401 || response.status === 403) { setItems([]); return }
      if (!response.ok) throw new Error('Error al obtener items')
      setItems(await response.json())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [setItems, setLoading, setError])

  const fetchItem = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/catering/items/${id}`)
      if (!response.ok) throw new Error('Error al obtener item')
      const data = await response.json()
      setCurrentItem(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [setCurrentItem, setLoading, setError])

  const createItem = useCallback(async (data: CateringItemFormData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/catering/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear item')
      }
      const newItem = await response.json()
      addItem(newItem)
      toast.success('Item creado exitosamente')
      return newItem
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [addItem, setLoading, setError])

  const editItem = useCallback(async (id: string, data: CateringItemFormData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/catering/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar item')
      }
      const updatedItem = await response.json()
      updateItem(id, updatedItem)
      toast.success('Item actualizado exitosamente')
      return updatedItem
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [updateItem, setLoading, setError])

  const deleteItem = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/catering/items/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar item')
      }
      removeItem(id)
      toast.success('Item eliminado exitosamente')
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [removeItem, setLoading, setError])

  return {
    items,
    currentItem,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    fetchItems,
    fetchItem,
    createItem,
    editItem,
    deleteItem,
  }
}
