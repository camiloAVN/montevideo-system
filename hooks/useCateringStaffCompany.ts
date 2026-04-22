'use client'

import { useCallback } from 'react'
import { useCateringStaffCompanyStore } from '@/store/cateringStaffCompanyStore'
import { CateringStaffCompanyFormData } from '@/lib/validations/catering-staff-company'
import toast from 'react-hot-toast'

export function useCateringStaffCompany() {
  const {
    staff,
    currentStaff,
    isLoading,
    error,
    setStaff,
    setCurrentStaff,
    addStaff,
    updateStaff,
    removeStaff,
    setLoading,
    setError,
  } = useCateringStaffCompanyStore()

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/catering/staff/company')
      if (response.status === 401 || response.status === 403) { setStaff([]); return }
      if (!response.ok) throw new Error('Error al obtener personal por empresa')
      setStaff(await response.json())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [setStaff, setLoading, setError])

  const fetchStaffMember = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/catering/staff/company/${id}`)
      if (!response.ok) throw new Error('Error al obtener personal')
      const data = await response.json()
      setCurrentStaff(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [setCurrentStaff, setLoading, setError])

  const createStaff = useCallback(async (data: CateringStaffCompanyFormData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/catering/staff/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear personal')
      }
      const newStaff = await response.json()
      addStaff(newStaff)
      toast.success('Personal creado exitosamente')
      return newStaff
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [addStaff, setLoading, setError])

  const editStaff = useCallback(async (id: string, data: CateringStaffCompanyFormData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/catering/staff/company/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar personal')
      }
      const updatedStaff = await response.json()
      updateStaff(id, updatedStaff)
      toast.success('Personal actualizado exitosamente')
      return updatedStaff
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [updateStaff, setLoading, setError])

  const deleteStaff = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/catering/staff/company/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar personal')
      }
      removeStaff(id)
      toast.success('Personal eliminado exitosamente')
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [removeStaff, setLoading, setError])

  return { staff, currentStaff, isLoading, error, fetchStaff, fetchStaffMember, createStaff, editStaff, deleteStaff }
}
