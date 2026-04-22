'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  cateringMenuFromItemsSchema,
  CateringMenuFromItemsFormData,
  CateringMenuFromItems,
  CATERING_MENU_TYPES,
} from '@/lib/validations/catering-menu-items'
import { CateringItem } from '@/lib/validations/catering-item'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { Search, Plus, Minus, X } from 'lucide-react'

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-200 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600'
const LABEL_CLASS = 'block text-sm font-medium text-gray-300 mb-1.5'

const formatCOP = (val: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)

interface SelectedItem {
  itemId: string
  quantity: number
  name: string
  category: string | null
  unitTotal: number
}

interface CateringMenuFromItemsFormProps {
  menu?: CateringMenuFromItems | null
  allCateringItems: CateringItem[]
  onSubmit: (data: CateringMenuFromItemsFormData, items: { itemId: string; quantity: number }[]) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function CateringMenuFromItemsForm({
  menu,
  allCateringItems,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CateringMenuFromItemsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CateringMenuFromItemsFormData>({
    resolver: zodResolver(cateringMenuFromItemsSchema),
    defaultValues: menu
      ? {
          name: menu.name,
          menuType: menu.menuType || '',
          description: menu.description || '',
          useCustomTotal: menu.useCustomTotal,
          customTotal: menu.customTotal != null ? Number(menu.customTotal) : undefined,
        }
      : { useCustomTotal: false },
  })

  const useCustomTotal = watch('useCustomTotal')

  // Selected items state
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(() => {
    if (!menu?.menuItems?.length) return []
    return menu.menuItems.map((rel) => ({
      itemId: rel.itemId,
      quantity: rel.quantity,
      name: rel.item.name,
      category: rel.item.category,
      unitTotal: Number(rel.item.total) || 0,
    }))
  })

  const [itemSearch, setItemSearch] = useState('')

  // Computed total from selected items
  const computedTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.unitTotal * item.quantity, 0),
    [selectedItems]
  )

  useEffect(() => {
    if (!useCustomTotal) {
      setValue('customTotal', computedTotal > 0 ? computedTotal : undefined)
    }
  }, [computedTotal, useCustomTotal, setValue])

  const availableItems = useMemo(() => {
    const selectedIds = new Set(selectedItems.map((s) => s.itemId))
    return allCateringItems.filter(
      (item) =>
        !selectedIds.has(item.id) &&
        (itemSearch === '' ||
          item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
          (item.category || '').toLowerCase().includes(itemSearch.toLowerCase()))
    )
  }, [allCateringItems, selectedItems, itemSearch])

  const addItem = (item: CateringItem) => {
    setSelectedItems((prev) => [
      ...prev,
      {
        itemId: item.id,
        quantity: 1,
        name: item.name,
        category: item.category,
        unitTotal: Number(item.total) || 0,
      },
    ])
  }

  const removeItem = (itemId: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.itemId !== itemId))
  }

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty < 1) return
    setSelectedItems((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, quantity: qty } : i))
    )
  }

  const handleFormSubmit = async (data: CateringMenuFromItemsFormData) => {
    await onSubmit(data, selectedItems.map((i) => ({ itemId: i.itemId, quantity: i.quantity })))
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Nombre del menú *</label>
          <input
            {...register('name')}
            placeholder="Menú ejecutivo, Menú gourmet..."
            className={cn(INPUT_CLASS, errors.name && 'border-red-500')}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className={LABEL_CLASS}>Tipo de menú</label>
          <select {...register('menuType')} className={cn(INPUT_CLASS, 'cursor-pointer')}>
            <option value="">Seleccionar tipo...</option>
            {CATERING_MENU_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Descripción</label>
          <input
            {...register('description')}
            placeholder="Descripción del menú..."
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* Item selector */}
      <div className="rounded-xl border border-gray-700/60 p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-300">Seleccionar items de menaje</p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={itemSearch}
            onChange={(e) => setItemSearch(e.target.value)}
            className={cn(INPUT_CLASS, 'pl-9')}
          />
        </div>

        {/* Available items */}
        {availableItems.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
            {availableItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => addItem(item)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/40 border border-gray-700/40 hover:border-orange-500/40 hover:bg-orange-500/5 transition-colors text-left group"
              >
                <div>
                  <span className="text-sm text-gray-200 font-medium">{item.name}</span>
                  {item.category && (
                    <span className="ml-2 text-xs text-gray-500">{item.category}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">
                    {item.total != null ? formatCOP(Number(item.total)) : '-'}
                  </span>
                  <Plus className="w-4 h-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        )}

        {availableItems.length === 0 && itemSearch && (
          <p className="text-xs text-gray-500 text-center py-2">
            No hay items que coincidan con la búsqueda
          </p>
        )}
      </div>

      {/* Selected items */}
      {selectedItems.length > 0 && (
        <div className="rounded-xl border border-gray-700/60 p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-300">
            Items seleccionados ({selectedItems.length})
          </p>

          <div className="space-y-2">
            {selectedItems.map((item) => (
              <div
                key={item.itemId}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800/40 border border-gray-700/30"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-200 font-medium truncate block">
                    {item.name}
                  </span>
                  {item.category && (
                    <span className="text-xs text-gray-500">{item.category}</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.itemId, parseInt(e.target.value) || 1)}
                    className="w-12 text-center px-1 py-0.5 rounded bg-gray-900/50 border border-gray-700 text-gray-200 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-sm font-mono text-orange-400 w-28 text-right">
                  {formatCOP(item.unitTotal * item.quantity)}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(item.itemId)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-gray-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total calculado</span>
              <span className="text-base font-bold text-orange-400">
                {computedTotal > 0 ? formatCOP(computedTotal) : '—'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('useCustomTotal')}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-300">Modificar total manualmente</span>
              </label>
            </div>

            {useCustomTotal && (
              <div>
                <label className={LABEL_CLASS}>Total personalizado</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    {...register('customTotal', { valueAsNumber: true })}
                    className={cn(INPUT_CLASS, 'pl-6')}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedItems.length === 0 && (
        <p className="text-xs text-amber-400/70 text-center py-2">
          Agrega al menos un item de menaje al menú
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {menu ? 'Actualizar Menú' : 'Crear Menú'}
        </Button>
      </div>
    </form>
  )
}
