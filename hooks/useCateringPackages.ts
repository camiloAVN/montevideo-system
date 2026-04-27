'use client'

import { useCallback } from 'react'
import { useCateringPackageStore } from '@/store/cateringPackageStore'
import { CateringPackageFormData } from '@/lib/validations/catering-package'
import toast from 'react-hot-toast'

export function useCateringPackages() {
  const {
    packages,
    currentPackage,
    isLoading,
    error,
    searchQuery,
    setPackages,
    setCurrentPackage,
    addPackage,
    updatePackage,
    removePackage,
    setLoading,
    setError,
    setSearchQuery,
  } = useCateringPackageStore()

  const fetchPackages = useCallback(
    async (search?: string) => {
      setLoading(true)
      setError(null)
      try {
        const url = new URL('/api/catering/packages', window.location.origin)
        if (search) url.searchParams.set('search', search)
        const response = await fetch(url.toString())
        if (response.status === 401 || response.status === 403) {
          setPackages([])
          return
        }
        if (!response.ok) throw new Error('Error al obtener paquetes')
        setPackages(await response.json())
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [setPackages, setLoading, setError]
  )

  const fetchPackage = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/catering/packages/${id}`)
        if (!response.ok) throw new Error('Error al obtener paquete')
        const data = await response.json()
        setCurrentPackage(data)
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
    [setCurrentPackage, setLoading, setError]
  )

  const createPackage = useCallback(
    async (data: CateringPackageFormData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/catering/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al crear paquete')
        }
        const newPkg = await response.json()
        addPackage(newPkg)
        toast.success('Paquete creado exitosamente')
        return newPkg
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
        toast.error(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [addPackage, setLoading, setError]
  )

  const editPackage = useCallback(
    async (id: string, data: CateringPackageFormData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/catering/packages/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al actualizar paquete')
        }
        const updatedPkg = await response.json()
        updatePackage(id, updatedPkg)
        toast.success('Paquete actualizado exitosamente')
        return updatedPkg
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
        toast.error(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [updatePackage, setLoading, setError]
  )

  const deletePackage = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/catering/packages/${id}`, { method: 'DELETE' })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al eliminar paquete')
        }
        removePackage(id)
        toast.success('Paquete eliminado exitosamente')
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
    [removePackage, setLoading, setError]
  )

  return {
    packages,
    currentPackage,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    fetchPackages,
    fetchPackage,
    createPackage,
    editPackage,
    deletePackage,
  }
}
