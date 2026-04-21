'use client'

import { useCallback } from 'react'
import { useCateringMenajeStore } from '@/store/cateringMenajeStore'
import { CateringMenajeFormData } from '@/lib/validations/catering-menaje'
import toast from 'react-hot-toast'

export function useCateringMenaje() {
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
  } = useCateringMenajeStore()

  const fetchItems = useCallback(
    async (search?: string) => {
      setLoading(true)
      setError(null)
      try {
        const url = new URL('/api/catering/menaje', window.location.origin)
        if (search) url.searchParams.set('search', search)
        const response = await fetch(url.toString())
        if (response.status === 401 || response.status === 403) {
          setItems([])
          return
        }
        if (!response.ok) throw new Error('Error al obtener items de menaje')
        setItems(await response.json())
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [setItems, setLoading, setError]
  )

  const fetchItem = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/catering/menaje/${id}`)
        if (!response.ok) throw new Error('Error al obtener item de menaje')
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
    },
    [setCurrentItem, setLoading, setError]
  )

  const createItem = useCallback(
    async (data: CateringMenajeFormData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/catering/menaje', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al crear item de menaje')
        }
        const newItem = await response.json()
        addItem(newItem)
        toast.success('Item de menaje creado exitosamente')
        return newItem
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
        toast.error(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [addItem, setLoading, setError]
  )

  const editItem = useCallback(
    async (id: string, data: CateringMenajeFormData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/catering/menaje/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al actualizar item de menaje')
        }
        const updatedItem = await response.json()
        updateItem(id, updatedItem)
        toast.success('Item de menaje actualizado exitosamente')
        return updatedItem
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
        toast.error(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [updateItem, setLoading, setError]
  )

  const deleteItem = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/catering/menaje/${id}`, { method: 'DELETE' })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al eliminar item de menaje')
        }
        removeItem(id)
        toast.success('Item de menaje eliminado exitosamente')
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
        toast.error(message)
        return false
      } finally {
        setLoading(false)
      }
    },
    [removeItem, setLoading, setError]
  )

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
