'use client'

import { useState, useEffect } from 'react'
import { PersonalStaffFormData, PersonalCategory } from '@/lib/validations/personal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CheckCircle2 } from 'lucide-react'

interface Props {
  initialData?: {
    name?: string | null
    shiftRate?: number | null
    categoryId?: string | null
    notes?: string | null
    isActive?: boolean
  }
  onSubmit: (data: PersonalStaffFormData) => void
  onCancel: () => void
  isSubmitting: boolean
}

export function PersonalStaffForm({ initialData, onSubmit, onCancel, isSubmitting }: Props) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [shiftRate, setShiftRate] = useState(initialData?.shiftRate != null ? String(Math.round(Number(initialData.shiftRate))) : '')
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? '')
  const [notes, setNotes] = useState(initialData?.notes ?? '')
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
  const [categories, setCategories] = useState<PersonalCategory[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/personal/categories')
      .then(r => r.ok ? r.json() : [])
      .then(setCategories)
      .catch(() => {})
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) newErrors.name = 'El nombre debe tener al menos 2 caracteres'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})

    const rate = shiftRate.trim() ? Number(shiftRate.replace(/[^0-9.]/g, '')) || null : null

    onSubmit({
      name: name.trim(),
      shiftRate: rate,
      categoryId: categoryId || null,
      notes: notes.trim() || null,
      isActive,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Nombre <span className="text-red-400">*</span>
        </label>
        <Input
          value={name}
          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
          placeholder="Nombre completo"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Valor del turno */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Valor del turno</label>
        <Input
          type="number"
          min={0}
          step={1000}
          value={shiftRate}
          onChange={e => setShiftRate(e.target.value)}
          placeholder="0"
        />
        <p className="text-xs text-gray-500 mt-1">Valor en COP por turno de trabajo</p>
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Categoría</label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-300 text-sm focus:outline-none focus:border-teal-500 transition-colors"
        >
          <option value="">Sin categoría</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Notas</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Información adicional..."
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 transition-colors resize-none"
        />
      </div>

      {/* Activo */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500"
          />
          <span className="text-sm text-gray-300">Persona activa</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : (
            <><CheckCircle2 className="w-4 h-4 mr-2" />Guardar</>
          )}
        </Button>
      </div>
    </form>
  )
}
