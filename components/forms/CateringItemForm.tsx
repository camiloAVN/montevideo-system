'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cateringItemSchema, CateringItemFormData, CateringItem, CATERING_ITEM_CATEGORIES } from '@/lib/validations/catering-item'
import { CateringSupplier } from '@/lib/validations/catering-supplier'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-200 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600'

const LABEL_CLASS = 'block text-sm font-medium text-gray-300 mb-1.5'

interface CateringItemFormProps {
  item?: CateringItem | null
  suppliers: CateringSupplier[]
  onSubmit: (data: CateringItemFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function CateringItemForm({
  item,
  suppliers,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CateringItemFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CateringItemFormData>({
    resolver: zodResolver(cateringItemSchema),
    defaultValues: item
      ? {
          name: item.name,
          description: item.description || '',
          category: item.category || '',
          supplierId: item.supplierId || '',
          unitCost: item.unitCost ?? undefined,
          markupPercent: item.markupPercent ?? undefined,
          markupAmount: item.markupAmount ?? undefined,
          total: item.total ?? undefined,
          notes: item.notes || '',
          isActive: item.isActive,
        }
      : { isActive: true },
  })

  const unitCost = watch('unitCost')
  const markupPercent = watch('markupPercent')
  const markupAmount = watch('markupAmount')

  // Computed total (display only, also saved to DB)
  const computedTotal =
    (Number(unitCost) || 0) + (Number(markupAmount) || 0)

  // Keep total field synced
  useEffect(() => {
    setValue('total', computedTotal || undefined)
  }, [computedTotal, setValue])

  const formatCOP = (val: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val)

  // When unitCost changes: keep markupAmount consistent with existing percent
  const unitCostReg = register('unitCost', { valueAsNumber: true })
  const markupPercentReg = register('markupPercent', { valueAsNumber: true })
  const markupAmountReg = register('markupAmount', { valueAsNumber: true })

  const handleUnitCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    unitCostReg.onChange(e)
    const cost = parseFloat(e.target.value) || 0
    const pct = Number(markupPercent) || 0
    if (pct > 0) {
      setValue('markupAmount', parseFloat(((cost * pct) / 100).toFixed(2)))
    }
  }

  // When % changes: recompute amount
  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markupPercentReg.onChange(e)
    const pct = parseFloat(e.target.value) || 0
    const cost = Number(unitCost) || 0
    setValue('markupAmount', parseFloat(((cost * pct) / 100).toFixed(2)))
  }

  // When amount changes: recompute percent
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markupAmountReg.onChange(e)
    const amount = parseFloat(e.target.value) || 0
    const cost = Number(unitCost) || 0
    if (cost > 0) {
      setValue('markupPercent', parseFloat(((amount / cost) * 100).toFixed(4)))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={LABEL_CLASS}>Nombre *</label>
          <input
            {...register('name')}
            placeholder="Agua mineral 500ml"
            className={cn(INPUT_CLASS, errors.name && 'border-red-500')}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className={LABEL_CLASS}>Categoría</label>
          <select
            {...register('category')}
            className={cn(INPUT_CLASS, 'cursor-pointer')}
          >
            <option value="">Seleccionar categoría...</option>
            {CATERING_ITEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Descripción</label>
          <input
            {...register('description')}
            placeholder="Descripción del item..."
            className={INPUT_CLASS}
          />
        </div>

        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Proveedor</label>
          <select
            {...register('supplierId')}
            className={cn(INPUT_CLASS, 'cursor-pointer')}
          >
            <option value="">Sin proveedor asignado</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing section */}
      <div className="rounded-xl border border-gray-700/60 p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-300">Precios y márgenes</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Costo por unidad */}
          <div>
            <label className={LABEL_CLASS}>Costo por unidad</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                min={0}
                step="any"
                placeholder="0"
                {...unitCostReg}
                onChange={handleUnitCostChange}
                className={cn(INPUT_CLASS, 'pl-6')}
              />
            </div>
            {errors.unitCost && <p className="text-red-400 text-xs mt-1">{errors.unitCost.message}</p>}
          </div>

          {/* % Ganancia */}
          <div>
            <label className={LABEL_CLASS}>% Ganancia</label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step="any"
                placeholder="0"
                {...markupPercentReg}
                onChange={handlePercentChange}
                className={cn(INPUT_CLASS, 'pr-8')}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
            {errors.markupPercent && <p className="text-red-400 text-xs mt-1">{errors.markupPercent.message}</p>}
          </div>

          {/* Ganancia en $  */}
          <div>
            <label className={LABEL_CLASS}>Ganancia</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                min={0}
                step="any"
                placeholder="0"
                {...markupAmountReg}
                onChange={handleAmountChange}
                className={cn(INPUT_CLASS, 'pl-6')}
              />
            </div>
            {/* Show percent equivalent when amount is entered */}
            {Number(markupAmount) > 0 && Number(unitCost) > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                ≈ {Number(markupPercent).toFixed(2)}% del costo
              </p>
            )}
            {errors.markupAmount && <p className="text-red-400 text-xs mt-1">{errors.markupAmount.message}</p>}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between rounded-lg bg-orange-500/5 border border-orange-500/20 px-4 py-3">
          <span className="text-sm font-medium text-gray-300">Total (Costo + Ganancia)</span>
          <span className="text-lg font-bold text-orange-400">
            {computedTotal > 0 ? formatCOP(computedTotal) : '—'}
          </span>
        </div>
      </div>

      {/* Notes */}
      <Textarea
        label="Notas"
        placeholder="Información adicional sobre el item..."
        rows={3}
        error={errors.notes?.message}
        {...register('notes')}
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {item ? 'Actualizar Item' : 'Crear Item'}
        </Button>
      </div>
    </form>
  )
}
